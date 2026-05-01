import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { UserRole } from "@/lib/enums";
import { slugify, validateEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

function parseRole(role: unknown) {
  const normalized = String(role ?? "buyer").toUpperCase();

  if (normalized === "SELLER") return UserRole.SELLER;
  if (normalized === "ADMIN") return UserRole.ADMIN;

  return UserRole.BUYER;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = parseRole(body.role);

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const storeSlug = slugify(name);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        store:
          role === UserRole.SELLER
            ? {
                create: {
                  name,
                  slug: storeSlug,
                  description: `Toko ${name} di Pasar Kita`,
                },
              }
            : undefined,
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
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          store: user.store,
        },
        token: `token-${user.id}`,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat registrasi" },
      { status: 500 }
    );
  }
}
