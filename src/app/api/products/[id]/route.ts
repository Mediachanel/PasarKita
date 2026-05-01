import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";
import {
  productDetailInclude,
  productInclude,
  serializeProduct,
  serializeProductDetail,
} from "@/lib/server/products";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    id: string;
  };
}

async function findProduct(id: string) {
  const byId = await prisma.product.findUnique({
    where: { id },
    include: productDetailInclude,
  });

  if (byId) return byId;

  const bySlug = await prisma.product.findFirst({
    where: { slug: id },
    include: productDetailInclude,
  });

  if (bySlug) return bySlug;

  const legacyIndex = Number(id);
  if (Number.isInteger(legacyIndex) && legacyIndex > 0) {
    const [legacyProduct] = await prisma.product.findMany({
      include: productDetailInclude,
      orderBy: { createdAt: "asc" },
      skip: legacyIndex - 1,
      take: 1,
    });

    return legacyProduct ?? null;
  }

  return null;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const product = await findProduct(params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product: serializeProductDetail(product),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil detail produk" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const currentProduct = await findProduct(params.id);

    if (!currentProduct) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updateData: {
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      stock?: number;
      categoryId?: string;
    } = {};

    if (typeof body.name === "string" && body.name.trim()) {
      updateData.name = body.name.trim();
      updateData.slug = slugify(body.name);
    }

    if (typeof body.description === "string") {
      updateData.description = body.description.trim();
    }

    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          { error: "Harga produk tidak valid" },
          { status: 400 }
        );
      }
      updateData.price = price;
    }

    if (body.stock !== undefined) {
      const stock = Number(body.stock);
      if (!Number.isFinite(stock) || stock < 0) {
        return NextResponse.json(
          { error: "Stok produk tidak valid" },
          { status: 400 }
        );
      }
      updateData.stock = stock;
    }

    if (body.categoryId) {
      updateData.categoryId = String(body.categoryId);
    }

    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : undefined;

    await prisma.product.update({
      where: { id: currentProduct.id },
      data: updateData,
    });

    if (imageUrl) {
      await prisma.productImage.deleteMany({
        where: {
          productId: currentProduct.id,
        },
      });
      await prisma.productImage.create({
        data: {
          productId: currentProduct.id,
          url: imageUrl,
          order: 0,
        },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: currentProduct.id },
      include: productInclude,
    });

    return NextResponse.json({
      product: product ? serializeProduct(product) : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const product = await findProduct(params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: product.id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
