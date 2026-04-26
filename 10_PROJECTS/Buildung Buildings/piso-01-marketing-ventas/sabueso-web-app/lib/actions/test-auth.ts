"use server";

import { cookies } from "next/headers";

/**
 * Action to bypass authentication during E2E tests.
 * ONLY ACTIVE IF THE TOKEN MATCHES.
 */
export async function bypassAuthAction(token: string) {
  const secret = process.env.TEST_BYPASS_TOKEN;
  
  if (!secret || token !== secret) {
    return { success: false, error: "Unauthorized" };
  }

  // Set a mock session cookie that the app/middleware can recognize as "Test User"
  // Note: For real Stack Auth integration, we'd ideally use their SDK to sign in a test user.
  // For now, we'll set a 'test-session' cookie and update middleware to respect it.
  const cookieStore = await cookies();
  cookieStore.set("test-session", "true", { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600 // 1 hour
  });

  return { success: true };
}
