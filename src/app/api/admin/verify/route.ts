import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", req.url));
  }

  const magicSession = await prisma.adminSession.findUnique({ where: { token } });

  if (!magicSession || magicSession.expiresAt < new Date()) {
    if (magicSession) await prisma.adminSession.delete({ where: { token } });
    return NextResponse.redirect(new URL("/admin/login?error=expired", req.url));
  }

  // Replace the short-lived magic token with a 7-day session token
  const sessionToken = nanoid(64);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.adminSession.update({
    where: { token },
    data: { token: sessionToken, expiresAt },
  });

  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set("admin_session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });

  return res;
}
