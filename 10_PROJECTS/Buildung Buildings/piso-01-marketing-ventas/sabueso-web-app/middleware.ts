import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack/server";

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser();
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // CYBERSECURITY LAYER 1: AUTHENTICATION
  // Only authenticated users can access the dashboard.
  // The onboarding check (profile existence) is handled in app/dashboard/layout.tsx
  if (isDashboardPage && !user) {
    return NextResponse.redirect(new URL("/handler/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
