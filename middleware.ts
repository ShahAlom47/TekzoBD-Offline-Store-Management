import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface SessionCookie {
  value: string;
}

export function middleware(req: NextRequest): NextResponse {
  const session: SessionCookie | undefined = req.cookies.get("session");

  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}