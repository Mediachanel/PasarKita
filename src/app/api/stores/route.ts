import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { UserRole } from "@/lib/enums";
import { slugify, validateEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const storeName = String(body.storeName ?? "").trim();
    const storeDescription = String(body.storeDescription ?? "").trim();
    const ownerName = String(body.ownerName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();

    if (!storeName || !ownerName || !email) {
      return NextResponse.json(
        { error: "Nama toko, nama pemilik, dan email wajib diisi" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    let user =
      (body.userId &&
        (await prisma.user.findUnique({
          where: {
            id: String(body.userId),
          },
          include: {
            store: true,
          },
        }))) ||
      (await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          store: true,
        },
      }));

    if (!user) {
      const password = await bcrypt.hash("password123", 10);
      user = await prisma.user.create({
        data: {
          email,
          password,
          name: ownerName,
          phone,
          role: UserRole.SELLER,
        },
        include: {
          store: true,
        },
      });
    }

    const baseSlug = slugify(storeName);
    const existingStoreWithSlug = await prisma.store.findFirst({
      where: user.store
        ? {
            slug: baseSlug,
            NOT: {
              id: user.store.id,
            },
          }
        : {
            slug: baseSlug,
          },
      select: {
        id: true,
      },
    });
    const slug = existingStoreWithSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: ownerName,
        email,
        phone,
        role: UserRole.SELLER,
        store: user.store
          ? {
              update: {
                name: storeName,
                slug,
                description: storeDescription,
              },
            }
          : {
              create: {
                name: storeName,
                slug,
                description: storeDescription,
              },
            },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          role: updatedUser.role,
          store: updatedUser.store,
        },
        store: updatedUser.store,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan toko" },
      { status: 500 }
    );
  }
}
