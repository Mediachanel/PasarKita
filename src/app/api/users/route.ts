import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { UserRole } from "@/lib/enums";

export const dynamic = "force-dynamic";

function parseRole(role: string | null) {
  const normalized = String(role ?? "").toUpperCase();

  if (normalized in UserRole) return normalized as UserRole;

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = parseRole(searchParams.get("role"));

    const users = await prisma.user.findMany({
      where: role ? { role } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            rating: true,
            totalReviews: true,
          },
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        store: user.store,
        orders: user._count.orders,
        reviews: user._count.reviews,
        createdAt: user.createdAt.toISOString(),
        status: "active",
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil user" },
      { status: 500 }
    );
  }
}
