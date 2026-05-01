import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { DiscountType } from "@/lib/enums";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId")?.trim();

    const vouchers = await prisma.voucher.findMany({
      where: storeId ? { storeId } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        store: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      vouchers: vouchers.map((voucher) => ({
        id: voucher.id,
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minPurchase: voucher.minPurchase,
        maxUsage: voucher.maxUsage,
        usedCount: voucher.usedCount,
        active: voucher.active,
        validUntil: voucher.validUntil.toISOString(),
        store: voucher.store,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil voucher" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = String(body.code ?? "").trim().toUpperCase();
    const discountValue = Number(body.discountValue);

    if (!code || !Number.isFinite(discountValue) || discountValue <= 0) {
      return NextResponse.json(
        { error: "Kode dan nilai diskon wajib valid" },
        { status: 400 }
      );
    }

    const store =
      (body.storeId &&
        (await prisma.store.findUnique({
          where: {
            id: String(body.storeId),
          },
        }))) ||
      (await prisma.store.findFirst({ orderBy: { createdAt: "asc" } }));

    if (!store) {
      return NextResponse.json(
        { error: "Toko tidak ditemukan" },
        { status: 404 }
      );
    }

    const voucher = await prisma.voucher.create({
      data: {
        code,
        description: body.description ? String(body.description) : undefined,
        discountType:
          String(body.discountType ?? "PERCENTAGE").toUpperCase() === "FIXED"
            ? DiscountType.FIXED
            : DiscountType.PERCENTAGE,
        discountValue,
        minPurchase: body.minPurchase ? Number(body.minPurchase) : undefined,
        maxUsage: body.maxUsage ? Number(body.maxUsage) : undefined,
        validFrom: new Date(),
        validUntil: body.validUntil
          ? new Date(String(body.validUntil))
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        storeId: store.id,
      },
    });

    return NextResponse.json({ voucher }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat voucher" },
      { status: 500 }
    );
  }
}
