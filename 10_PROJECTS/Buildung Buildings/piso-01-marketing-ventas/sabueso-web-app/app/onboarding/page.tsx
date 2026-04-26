import { stackServerApp } from '@/stack/server';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/OnboardingForm';

export default async function OnboardingPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect('/handler/sign-in');
  }

  // Si ya tiene perfil, lo mandamos al dashboard
  const existingProfile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, user.id)
  });

  if (existingProfile) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen relative flex flex-col bg-[#05070a] text-[#f0f6fc] font-sans items-center justify-center p-6">
      <div className="cyber-bg" />
      <div className="grid-bg" />
      <div className="scanlines opacity-[0.08]" />

      <div className="z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00ff8c]/20 blur-lg" />
            <div className="relative w-12 h-12 glass-panel flex items-center justify-center font-black text-xl text-[#00ff8c] border border-[#00ff8c]/30">
              S
            </div>
          </div>
          <div className="text-xl font-extrabold tracking-tighter text-white uppercase leading-none">
            Sabueso<span className="text-[#00ff8c]">_</span>
          </div>
          <div className="text-[8px] font-mono text-[#8b949e] tracking-[0.4em] uppercase">SYSTEM_INITIALIZATION</div>
        </div>

        <OnboardingForm />
      </div>
    </main>
  );
}
