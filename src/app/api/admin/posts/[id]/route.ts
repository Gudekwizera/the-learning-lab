import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { title, slug, weekNumber, excerpt, content, coverImage, tags, status } = await req.json();

  const existing = await prisma.post.findUnique({ where: { id }, include: { tags: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      weekNumber,
      excerpt: excerpt ?? null,
      content,
      coverImage: coverImage ?? null,
      status,
      publishedAt:
        status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt,
      tags: {
        set: [],
        connectOrCreate: (tags as string[]).map((name: string) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
