import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const data = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (!data) {
    const routes = ["/signin", "/signup"];
    if (!routes.includes(pathname)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  if (data) {
    const routes = ["/signin", "/signup"];
    if (routes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|.*\\..*).*)", "/signup", "/signin"],
};
