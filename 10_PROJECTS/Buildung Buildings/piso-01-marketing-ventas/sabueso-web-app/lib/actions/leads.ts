"use server";

import { stackServerApp } from "@/stack/server";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { leads, activities } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function uploadLeadsAction(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("UNAUTHORIZED_ACCESS_");
  }

  const file = formData.get("file") as File;
  const mappingStr = formData.get("mapping") as string;
  
  if (!file) {
    return { success: false, error: "No se proporcionó ningún archivo." };
  }

  const mapping = mappingStr ? JSON.parse(mappingStr) : { name: "nombre", company: "empresa", email: "email", website: "web" };

  // Validación básica de seguridad
  if (!file.name.endsWith(".csv")) {
    return { success: false, error: "Formato no permitido. Solo CSV." };
  }

  try {
    const content = await file.text();
    const rows = content.split("\n").map(r => r.trim()).filter(row => row !== "");
    
    if (rows.length < 2) {
      return { success: false, error: "El archivo está vacío o no tiene datos." };
    }

    const headers = rows[0].split(",").map(h => h.trim().replace(/"/g, ''));
    const dataRows = rows.slice(1);
    
    const getIndex = (field: string) => headers.indexOf(mapping[field]);

    const leadsToInsert = dataRows.map(row => {
      const columns = row.split(",").map(s => s.trim().replace(/"/g, ''));
      
      return {
        name: columns[getIndex('name')] || "Desconocido",
        company: columns[getIndex('company')] || "N/A",
        email: columns[getIndex('email')] || null,
        website: columns[getIndex('website')] || null,
        status: "new" as const,
      };
    });

    // Inserción masiva en Neon
    const insertedLeads = await db.insert(leads).values(leadsToInsert).returning();

    // Registrar actividad de subida
    await db.insert(activities).values({
      leadId: insertedLeads[0].id,
      type: "UPLOAD",
      description: `Se cargaron ${insertedLeads.length} leads nuevos con mapeo personalizado.`,
    });

    revalidatePath("/dashboard");
    return { success: true, count: insertedLeads.length };
  } catch (err: any) {
    console.error("DATABASE_ERROR_", err);
    return { success: false, error: "Error al procesar la base de datos o el mapeo." };
  }
}

export async function processLeadWithAIAction(leadId: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  try {
    // MOCK AI PROCESSING
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const qualificationReason = "Este prospecto muestra un alto encaje con Buildung Buildings debido a su presencia activa en el sector y su infraestructura tecnológica actual. Se recomienda un enfoque directo resaltando nuestra capacidad de escala.";
    const personalTouch = "Noté que están expandiendo su equipo técnico, lo cual es el momento perfecto para implementar nuestras soluciones de automatización.";
    const draftEmail = `Hola, vi que están creciendo en el área técnica y me encantaría charlar sobre cómo Buildung Buildings puede potenciar ese crecimiento.`;

    await db.update(leads)
      .set({
        score,
        qualificationReason,
        personalTouch,
        draftEmail,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));

    await db.insert(activities).values({
      leadId,
      type: "AI_PROCESSING",
      description: "Sabueso AI procesó el lead y generó una propuesta personalizada.",
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/lead/${leadId}`, "page");
    return { success: true };
  } catch (err: any) {
    console.error("AI_PROCESSING_ERROR_", err);
    return { success: false, error: "Error al procesar con IA." };
  }
}

export async function processAllLeadsAction() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  try {
    const leadsToProcess = await db.query.leads.findMany();
    
    for (const lead of leadsToProcess) {
      // Reuse logic from processLeadWithAIAction for each lead
      const score = Math.floor(Math.random() * 40) + 60;
      const qualificationReason = "Procesamiento masivo completado. El lead muestra potencial estándar.";
      const personalTouch = "Personalización generada automáticamente durante el lote masivo.";
      const draftEmail = `Hola ${lead.name}, te contacto de parte de Buildung Buildings para conversar sobre oportunidades.`;

      await db.update(leads)
        .set({
          score,
          qualificationReason,
          personalTouch,
          draftEmail,
          updatedAt: new Date(),
          status: 'qualified' // Mark as qualified for visibility
        })
        .where(eq(leads.id, lead.id));
    }

    await db.insert(activities).values({
      leadId: leadsToProcess[0]?.id || "system",
      type: "AI_PROCESSING",
      description: `Se procesaron ${leadsToProcess.length} leads en lote masivo.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/lead/[id]", "page");
    return { success: true, count: leadsToProcess.length };
  } catch (err: any) {
    console.error("BATCH_AI_PROCESSING_ERROR_", err);
    return { success: false, error: "Error al procesar lote de leads." };
  }
}
