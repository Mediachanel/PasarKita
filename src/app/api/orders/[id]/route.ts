import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { OrderStatus, PaymentStatus, ShippingStatus } from "@/lib/enums";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                store: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        address: true,
        payment: true,
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status.toLowerCase(),
        paymentStatus: order.paymentStatus.toLowerCase(),
        shippingStatus: order.shippingStatus.toLowerCase(),
        total: order.finalAmount,
        subtotal: order.totalAmount,
        shippingCost: order.shippingCost,
        customer: order.user,
        address: order.address,
        date: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.product.name,
          store: item.product.store,
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
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil detail pesanan" },
      { status: 500 }
    );
  }
}

function parseOrderStatus(status: unknown) {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized in OrderStatus) return normalized as OrderStatus;

  return null;
}

function parsePaymentStatus(status: unknown) {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized in PaymentStatus) return normalized as PaymentStatus;

  return null;
}

function parseShippingStatus(status: unknown) {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized in ShippingStatus) return normalized as ShippingStatus;

  return null;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const body = await request.json();
    const orderStatus = parseOrderStatus(body.status);
    const paymentStatus = parsePaymentStatus(body.paymentStatus);
    const shippingStatus = parseShippingStatus(body.shippingStatus);

    const order = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        ...(orderStatus ? { status: orderStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(shippingStatus ? { shippingStatus } : {}),
        payment: paymentStatus
          ? {
              update: {
                status: paymentStatus,
                paidAt:
                  paymentStatus === PaymentStatus.COMPLETED
                    ? new Date()
                    : undefined,
              },
            }
          : undefined,
        shipment:
          shippingStatus || body.trackingNumber || body.carrier
            ? {
                update: {
                  ...(shippingStatus ? { status: shippingStatus } : {}),
                  ...(body.trackingNumber
                    ? { trackingNumber: String(body.trackingNumber) }
                    : {}),
                  ...(body.carrier ? { carrier: String(body.carrier) } : {}),
                  ...(shippingStatus === ShippingStatus.SHIPPED
                    ? { shippedAt: new Date() }
                    : {}),
                  ...(shippingStatus === ShippingStatus.DELIVERED
                    ? { deliveredAt: new Date() }
                    : {}),
                },
              }
            : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status.toLowerCase(),
        paymentStatus: order.paymentStatus.toLowerCase(),
        shippingStatus: order.shippingStatus.toLowerCase(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui status pesanan" },
      { status: 500 }
    );
  }
}
