import { stackServerApp } from '@/stack/server';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect('/handler/sign-in');
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, user.id)
  });

  if (!profile) {
    redirect('/onboarding');
  }

  return <>{children}</>;
}
