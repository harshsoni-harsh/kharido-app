import { NextResponse } from "next/server";

export async function middleware(request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cookie = request.headers.get("jwt");

  if (!cookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const authRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: cookie },
  });
  const data = await authRes.json();

  const metaRes = await fetch(`${baseUrl}/api/users/get-meta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({ email: data?.email }),
  });
  const meta = await metaRes.json();

  if (meta.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
