import { NextRequest, NextResponse } from "next/server";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingStatus,
  UserRole,
} from "@/lib/enums";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { generateOrderNumber, generateTrackingNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface CheckoutItem {
  productId: string;
  quantity: number;
}

function parsePaymentMethod(method: unknown) {
  const normalized = String(method ?? "transfer").toUpperCase();

  if (normalized === "CARD") return PaymentMethod.CARD;
  if (normalized === "EWALLET") return PaymentMethod.EWALLET;
  if (normalized === "COD") return PaymentMethod.COD;

  return PaymentMethod.TRANSFER;
}

async function findProductByPublicId(id: string) {
  const byId = await prisma.product.findUnique({
    where: { id },
  });

  if (byId) return byId;

  const legacyIndex = Number(id);
  if (Number.isInteger(legacyIndex) && legacyIndex > 0) {
    const [legacyProduct] = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
      skip: legacyIndex - 1,
      take: 1,
    });

    return legacyProduct ?? null;
  }

  return null;
}

function serializeOrder(order: Awaited<ReturnType<typeof getOrderById>>) {
  if (!order) return null;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status.toLowerCase(),
    paymentStatus: order.paymentStatus.toLowerCase(),
    shippingStatus: order.shippingStatus.toLowerCase(),
    total: order.finalAmount,
    subtotal: order.totalAmount,
    shippingCost: order.shippingCost,
    discountAmount: order.discountAmount,
    date: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    })),
  };
}

async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")?.trim();
    const storeId = searchParams.get("storeId")?.trim();
    const status = searchParams.get("status")?.trim().toUpperCase();

    const orders = await prisma.order.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(storeId
          ? {
              items: {
                some: {
                  product: {
                    storeId,
                  },
                },
              },
            }
          : {}),
        ...(status && status !== "ALL"
          ? {
              status: status as OrderStatus,
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                storeId: true,
              },
            },
          },
        },
        payment: true,
        shipment: true,
      },
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status.toLowerCase(),
        paymentStatus: order.paymentStatus.toLowerCase(),
        shippingStatus: order.shippingStatus.toLowerCase(),
        total: order.finalAmount,
        date: order.createdAt.toISOString(),
        customer: order.user,
        itemCount: order.items.length,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          storeId: item.product.storeId,
          quantity: item.quantity,
          price: item.price,
        })),
        payment: order.payment
          ? {
              method: order.payment.method.toLowerCase(),
              status: order.payment.status.toLowerCase(),
            }
          : null,
        shipment: order.shipment
          ? {
              carrier: order.shipment.carrier,
              status: order.shipment.status.toLowerCase(),
              trackingNumber: order.shipment.trackingNumber,
            }
          : null,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil pesanan" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items = (body.items ?? []) as CheckoutItem[];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang masih kosong" },
        { status: 400 }
      );
    }

    const products = await Promise.all(
      items.map(async (item) => ({
        requested: item,
        product: await findProductByPublicId(String(item.productId)),
      }))
    );

    const missingProduct = products.find(({ product }) => !product);
    if (missingProduct) {
      return NextResponse.json(
        { error: "Salah satu produk tidak ditemukan" },
        { status: 404 }
      );
    }

    for (const { requested, product } of products) {
      const quantity = Number(requested.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json(
          { error: "Jumlah produk tidak valid" },
          { status: 400 }
        );
      }

      if (product && product.stock < quantity) {
        return NextResponse.json(
          { error: `Stok ${product.name} tidak mencukupi` },
          { status: 400 }
        );
      }
    }

    let user =
      (body.userId &&
        (await prisma.user.findUnique({
          where: { id: String(body.userId) },
        }))) ||
      (body.email &&
        (await prisma.user.findUnique({
          where: { email: String(body.email).toLowerCase() },
        }))) ||
      (await prisma.user.findFirst({
        where: { role: UserRole.BUYER },
        orderBy: { createdAt: "asc" },
      }));

    if (!user) {
      const guestPassword = await bcrypt.hash(`guest-${Date.now()}`, 10);
      user = await prisma.user.create({
        data: {
          email: `guest-${Date.now()}@pasarkita.local`,
          password: guestPassword,
          name: "Pembeli Tamu",
          role: UserRole.BUYER,
        },
      });
    }
    const checkoutUser = user;
    const savedUserAddress = await prisma.address.findFirst({
      where: {
        userId: checkoutUser.id,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    const shippingAddress = {
      name:
        String(body.recipientName ?? "").trim() ||
        savedUserAddress?.name ||
        checkoutUser.name ||
        "Pembeli Pasar Kita",
      phone:
        String(body.phone ?? "").trim() ||
        savedUserAddress?.phone ||
        checkoutUser.phone ||
        "081234567890",
      street:
        String(body.address ?? "").trim() ||
        savedUserAddress?.street ||
        "Alamat otomatis Pasar Kita",
      city:
        String(body.city ?? "").trim() ||
        savedUserAddress?.city ||
        "Jakarta",
      province:
        String(body.province ?? "").trim() ||
        savedUserAddress?.province ||
        "DKI Jakarta",
      postalCode:
        String(body.postalCode ?? "").trim() ||
        savedUserAddress?.postalCode ||
        "10110",
    };

    const totalAmount = products.reduce((sum, { requested, product }) => {
      return sum + (product?.price ?? 0) * Number(requested.quantity);
    }, 0);
    const requestedShippingCost = Number(body.shippingCost ?? 25000);
    const shippingCost =
      Number.isFinite(requestedShippingCost) && requestedShippingCost >= 0
        ? requestedShippingCost
        : 25000;
    const finalAmount = totalAmount + shippingCost;
    const requestedEstimatedDays = Number(body.estimatedDays ?? 4);
    const estimatedDays =
      Number.isFinite(requestedEstimatedDays) && requestedEstimatedDays > 0
        ? requestedEstimatedDays
        : 4;
    const paymentMethod = parsePaymentMethod(body.paymentMethod);
    const courier = String(body.courier ?? "JNE Reguler").trim() || "JNE Reguler";
    const paidAt = new Date();
    const trackingNumber = generateTrackingNumber(courier);

    const order = await prisma.$transaction(async (tx) => {
      const savedAddress = await tx.address.create({
        data: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          province: shippingAddress.province,
          postalCode: shippingAddress.postalCode,
          userId: checkoutUser.id,
        },
      });

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: OrderStatus.SHIPPED,
          paymentStatus: PaymentStatus.COMPLETED,
          shippingStatus: ShippingStatus.SHIPPED,
          totalAmount,
          shippingCost,
          finalAmount,
          notes: body.notes ? String(body.notes) : undefined,
          userId: checkoutUser.id,
          addressId: savedAddress.id,
          items: {
            create: products.map(({ requested, product }) => ({
              productId: product!.id,
              quantity: Number(requested.quantity),
              price: product!.price,
            })),
          },
          payment: {
            create: {
              method: paymentMethod,
              status: PaymentStatus.COMPLETED,
              amount: finalAmount,
              paidAt,
            },
          },
          shipment: {
            create: {
              carrier: courier,
              status: ShippingStatus.SHIPPED,
              trackingNumber,
              estimatedDays,
              shippedAt: paidAt,
            },
          },
        },
      });

      for (const { requested, product } of products) {
        await tx.product.update({
          where: { id: product!.id },
          data: {
            stock: {
              decrement: Number(requested.quantity),
            },
            sold: {
              increment: Number(requested.quantity),
            },
          },
        });
      }

      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        order: serializeOrder(order),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat pesanan" },
      { status: 500 }
    );
  }
}
