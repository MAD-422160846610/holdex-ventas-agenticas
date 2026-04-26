'use server';

import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { stackServerApp } from '@/stack/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProfile(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error('No estás autenticado');
  }

  const fullName = formData.get('fullName') as string;
  const company = formData.get('company') as string;
  const phone = formData.get('phone') as string;

  if (!fullName) {
    throw new Error('El nombre es obligatorio');
  }

  await db.insert(userProfiles).values({
    id: user.id,
    role: 'vendedor', // Default role for now
    fullName,
    company,
    phone,
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
