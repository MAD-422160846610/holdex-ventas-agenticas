import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack/server";

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser();
  const testSession = request.cookies.get("test-session");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  const isBypassRoute = request.nextUrl.pathname.startsWith("/api/test/auth-bypass");

  // Allow bypass route
  if (isBypassRoute) return NextResponse.next();

  // CYBERSECURITY LAYER 1: AUTHENTICATION
  if (isDashboardPage && !user && !testSession) {
    return NextResponse.redirect(new URL("/handler/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
