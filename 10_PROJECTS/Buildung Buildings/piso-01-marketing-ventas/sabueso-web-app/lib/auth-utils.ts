import { stackServerApp } from "@/stack/server";
import { cookies } from "next/headers";

/**
 * Helper to get the current user or check for a test session.
 */
export async function getAuthenticatedUser() {
  const user = await stackServerApp.getUser();
  if (user) return user;

  // Check for test session
  const cookieStore = await cookies();
  const testSession = cookieStore.get("test-session");
  
  if (testSession && testSession.value === "true") {
    // Return a mock user object for testing
    return {
      id: "test-user-id",
      displayName: "Test Runner Agent",
      primaryEmail: "test@example.com",
    };
  }

  return null;
}
