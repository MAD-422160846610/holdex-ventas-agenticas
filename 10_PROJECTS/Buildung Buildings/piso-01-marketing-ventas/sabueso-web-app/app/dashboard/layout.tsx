import { stackServerApp } from '@/stack/server';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { Sidebar } from '@/components/Sidebar';

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

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar role={profile.role} />
      <div className="flex-1 relative overflow-auto">
        {children}
      </div>
    </div>
  );
}
