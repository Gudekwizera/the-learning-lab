import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/auth";
import { Resend } from "resend";
import { nanoid } from "nanoid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const token = nanoid(48);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.adminSession.create({ data: { token, email, expiresAt } });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const loginUrl = `${siteUrl}/api/admin/verify?token=${token}`;

  await resend.emails.send({
    from: "The Learning Lab <noreply@thelearninglab.dev>",
    to: email,
    subject: "Your magic login link",
    html: `
      <p>Click the link below to log in to The Learning Lab admin. It expires in 15 minutes.</p>
      <p><a href="${loginUrl}">${loginUrl}</a></p>
      <p>If you didn't request this, you can ignore it.</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
