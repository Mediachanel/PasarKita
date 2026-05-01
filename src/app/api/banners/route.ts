import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getBannerImageUrl } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";

    const banners = await prisma.banner.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({
      banners: banners.map((banner) => ({
        id: banner.id,
        title: banner.title,
        image: getBannerImageUrl(banner.image),
        link: banner.link,
        order: banner.order,
        active: banner.active,
        createdAt: banner.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil banner" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const image = String(body.image ?? "").trim();

    if (!title || !image) {
      return NextResponse.json(
        { error: "Judul dan gambar banner wajib diisi" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        image,
        link: body.link ? String(body.link) : undefined,
        order: Number(body.order ?? 0),
        active: Boolean(body.active ?? true),
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat banner" },
      { status: 500 }
    );
  }
}
