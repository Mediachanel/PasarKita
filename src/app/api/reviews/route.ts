import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = String(body.productId ?? "").trim();
    const rating = Number(body.rating);
    const comment = String(body.comment ?? "").trim();

    if (!productId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Produk dan rating 1-5 wajib diisi" },
        { status: 400 }
      );
    }

    let user =
      (body.userId &&
        (await prisma.user.findUnique({
          where: {
            id: String(body.userId),
          },
        }))) ||
      (await prisma.user.findFirst({
        orderBy: {
          createdAt: "asc",
        },
      }));

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: user.id,
        productId,
        rating,
        comment,
      },
    });

    const aggregate = await prisma.review.aggregate({
      where: {
        productId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        rating: Number((aggregate._avg.rating ?? rating).toFixed(1)),
        totalReviews: aggregate._count.id,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan ulasan" },
      { status: 500 }
    );
  }
}
