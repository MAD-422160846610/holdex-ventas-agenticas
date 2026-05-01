"use server";

import { stackServerApp } from "@/stack/server";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { resend } from "@/lib/resend";
import { db } from "@/lib/db";
import { leads, activities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OutreachEmail from "@/components/emails/OutreachEmail";
import { revalidatePath } from "next/cache";

export async function sendOutreachAction(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("UNAUTHORIZED_ACCESS_");
  }

  const leadId = formData.get("leadId") as string;
  const leadEmail = formData.get("leadEmail") as string;
  const leadName = formData.get("leadName") as string;
  const customMessage = formData.get("customMessage") as string;
  const subject = (formData.get("subject") as string) || `Propuesta Estratégica - Buildung Buildings x ${leadName}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Sabueso Outreach <onboarding@resend.dev>", 
      to: [leadEmail],
      subject,
      react: OutreachEmail({ 
        leadName, 
        senderName: user.displayName || "Agente de Piso 01",
        customMessage 
      }),
    });

    if (error) {
      console.error("RESEND_ERROR_", error);
      return { success: false, error: error.message };
    }

    // Registrar actividad y actualizar estado del lead
    await db.transaction(async (tx) => {
      await tx.update(leads)
        .set({ status: "contacted", updatedAt: new Date() })
        .where(eq(leads.id, leadId));

      await tx.insert(activities).values({
        personId: leadId,
        type: "EMAIL_SENT",
        description: `Mail de outreach enviado a ${leadEmail} por ${user.displayName || user.primaryEmail}`,
      });
    });

    console.log(`MAIL_SENT_AND_LOGGED_TO_ ${leadEmail}`);
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/lead/${leadId}`);
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("SERVER_ACTION_ERROR_", err);
    return { success: false, error: "Ocurrió un error inesperado al enviar el mail." };
  }
}
