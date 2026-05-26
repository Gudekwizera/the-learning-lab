import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ postId: string }>;
}

export async function GET(req: Request, { params }: Params) {
  const { postId } = await params;
  const comments = await prisma.comment.findMany({
    where: { postId, approved: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request, { params }: Params) {
  const { postId } = await params;
  const { name, message } = await req.json();

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
  }
  if (name.length > 100 || message.length > 1000) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: postId, status: "PUBLISHED" } });
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { postId, name: name.trim(), message: message.trim() },
  });

  return NextResponse.json(comment, { status: 201 });
}
