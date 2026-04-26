import { NextRequest, NextResponse } from "next/server";
import { bypassAuthAction } from "@/lib/actions/test-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const result = await bypassAuthAction(token);

  if (result.success) {
    // Redirect to dashboard after successful bypass
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.json({ error: "Invalid token" }, { status: 401 });
}
