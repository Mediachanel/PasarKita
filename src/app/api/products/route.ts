import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { slugify } from "@/lib/utils";
import { productInclude, serializeProduct } from "@/lib/server/products";

export const dynamic = "force-dynamic";

const categoryAliases: Record<string, string> = {
  makanan: "makanan-minuman",
  "makanan-minuman": "makanan-minuman",
  fashion: "fashion",
  elektronik: "elektronik",
  kerajinan: "kerajinan",
  "alat-rumah": "alat-rumah-tangga",
  "alat-rumah-tangga": "alat-rumah-tangga",
};

function parseSort(sort: string | null): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-low":
      return { price: "asc" };
    case "price-high":
      return { price: "desc" };
    case "rating":
      return { rating: "desc" };
    case "popular":
      return { sold: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const storeId = searchParams.get("storeId")?.trim();
    const sort = searchParams.get("sort");

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { is: { name: { contains: search } } } },
        { store: { is: { name: { contains: search } } } },
      ];
    }

    if (category && category.toLowerCase() !== "semua") {
      const normalized = categoryAliases[category] ?? category;
      where.category = {
        is: {
          OR: [{ slug: normalized }, { name: category }],
        },
      };
    }

    if (storeId) {
      where.storeId = storeId;
    }

    const products = await prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: parseSort(sort),
    });

    return NextResponse.json({
      products: products.map(serializeProduct),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil produk" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock);
    const categoryInput = String(
      body.categoryId ?? body.category ?? ""
    ).trim();
    const variants = Array.isArray(body.variants)
      ? (body.variants as Array<Record<string, unknown>>)
          .map((variant) => ({
            name: String(variant?.name ?? "").trim(),
            value: String(variant?.value ?? "").trim(),
          }))
          .filter((variant) => variant.name && variant.value)
      : [];

    if (!name || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Nama dan harga produk wajib diisi dengan benar" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Stok produk tidak valid" },
        { status: 400 }
      );
    }

    const normalizedCategory =
      categoryAliases[categoryInput] ?? slugify(categoryInput);
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: categoryInput },
          { slug: normalizedCategory },
          { name: categoryInput },
        ],
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const store =
      (body.storeId &&
        (await prisma.store.findUnique({
          where: { id: String(body.storeId) },
        }))) ||
      (body.userId &&
        (await prisma.store.findUnique({
          where: { userId: String(body.userId) },
        }))) ||
      (await prisma.store.findFirst({ orderBy: { createdAt: "asc" } }));

    if (!store) {
      return NextResponse.json(
        { error: "Toko belum tersedia. Buat toko terlebih dahulu." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(name);
    const existingProduct = await prisma.product.findFirst({
      where: {
        storeId: store.id,
        slug: baseSlug,
      },
      select: {
        id: true,
      },
    });

    const product = await prisma.product.create({
      data: {
        name,
        slug: existingProduct ? `${baseSlug}-${Date.now()}` : baseSlug,
        description,
        price,
        stock,
        storeId: store.id,
        categoryId: category.id,
        images: body.imageUrl
          ? {
              create: [
                {
                  url: String(body.imageUrl),
                  order: 0,
                },
              ],
            }
          : undefined,
        variants: variants.length
          ? {
              create: variants,
            }
          : undefined,
      },
      include: productInclude,
    });

    return NextResponse.json(
      { product: serializeProduct(product) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat produk" },
      { status: 500 }
    );
  }
}
