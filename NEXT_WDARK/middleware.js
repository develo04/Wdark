import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  // Redirige "/blog/node/1" a "/blog"
  if (url.pathname === "/blog/node/1") {
    return NextResponse.redirect(new URL("/blog", req.url));
  }

  // Permite el acceso a otras rutas
  return NextResponse.next();
}

export const config = {
  matcher: "/blog/node/:path*",
};
