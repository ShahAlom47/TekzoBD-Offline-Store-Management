// import { NextResponse } from "next/server";
import { NextRequest, NextResponse } from "next/server";
// import { verify } from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET as string;

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }


//   try {
//     verify(token, JWT_SECRET);
//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };


export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // login page এ middleware apply করো না
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}