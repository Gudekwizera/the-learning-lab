import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/post-editor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!post) notFound();

  return <PostEditor post={post} />;
}
