import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { UserRole } from "@/lib/enums";

export const dynamic = "force-dynamic";

function parseSenderRole(role: unknown) {
  const normalized = String(role ?? "BUYER").toUpperCase();

  if (normalized in UserRole) return normalized as UserRole;

  return UserRole.BUYER;
}

function serializeConversation(
  conversation: Awaited<ReturnType<typeof findConversationById>>
) {
  if (!conversation) return null;

  return {
    id: conversation.id,
    user: conversation.user,
    updatedAt: conversation.updatedAt.toISOString(),
    messages: conversation.messages.map((message) => ({
      id: message.id,
      content: message.content,
      senderRole: message.senderRole,
      createdAt: message.createdAt.toISOString(),
    })),
  };
}

async function findConversationById(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")?.trim();
    const conversationId = searchParams.get("conversationId")?.trim();

    if (conversationId) {
      const conversation = await findConversationById(conversationId);

      return NextResponse.json({
        conversation: serializeConversation(conversation),
      });
    }

    const conversations = await prisma.conversation.findMany({
      where: userId ? { userId } : undefined,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      conversations: conversations.map((conversation) => ({
        id: conversation.id,
        user: conversation.user,
        updatedAt: conversation.updatedAt.toISOString(),
        lastMessage: conversation.messages[0]?.content ?? "Belum ada pesan",
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil chat" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = String(body.content ?? "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    let conversationId = body.conversationId
      ? String(body.conversationId)
      : "";

    if (!conversationId) {
      let userId = body.userId ? String(body.userId) : "";

      if (!userId) {
        const buyer = await prisma.user.findFirst({
          where: {
            role: UserRole.BUYER,
          },
          orderBy: {
            createdAt: "asc",
          },
        });
        userId = buyer?.id ?? "";
      }

      if (!userId) {
        return NextResponse.json(
          { error: "User chat tidak ditemukan" },
          { status: 404 }
        );
      }

      const conversation = await prisma.conversation.create({
        data: {
          userId,
        },
      });
      conversationId = conversation.id;
    }

    await prisma.message.create({
      data: {
        conversationId,
        content,
        senderRole: parseSenderRole(body.senderRole),
      },
    });

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    const conversation = await findConversationById(conversationId);

    return NextResponse.json(
      {
        conversation: serializeConversation(conversation),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
