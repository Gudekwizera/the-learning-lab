import { requireAdmin } from "@/lib/auth";
import { PostEditor } from "@/components/post-editor";

export default async function NewPostPage() {
  await requireAdmin();
  return <PostEditor />;
}
