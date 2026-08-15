import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const GOAL_TRACKS = ["web", "backend", "blockchain", "cs"] as const;

const payloadSchema = z.object({
  goalTrack: z.enum(GOAL_TRACKS),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardedAt: true },
  });

  if (existing?.onboardedAt) {
    return NextResponse.json({ ok: true, alreadyOnboarded: true });
  }

  const payload = await request.json();
  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { goalTrack: parsed.data.goalTrack, onboardedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
