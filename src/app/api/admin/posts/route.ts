import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, slug, weekNumber, excerpt, content, coverImage, tags, status } = await req.json();

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "title, slug, and content are required." }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      weekNumber: weekNumber ?? 1,
      excerpt: excerpt ?? null,
      content,
      coverImage: coverImage ?? null,
      status: status ?? "DRAFT",
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      tags: {
        connectOrCreate: (tags as string[]).map((name: string) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
