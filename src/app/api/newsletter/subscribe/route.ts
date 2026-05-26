import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: true }); // silent — don't reveal if subscribed
  }

  await prisma.subscriber.create({
    data: {
      email,
      token: nanoid(32),
      confirmedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
