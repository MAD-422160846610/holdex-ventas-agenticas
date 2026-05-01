"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { people, activities, companies } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, sql, inArray } from "drizzle-orm";
import { generateLeadInsights } from "@/lib/ai";
import { generateEmbedding, buildPersonEmbedText, buildActivityEmbedText } from "@/lib/embeddings";

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

    const leadsData = dataRows.map(row => {
      const columns = row.split(",").map(s => s.trim().replace(/"/g, ''));
      const nameIdx = getIndex('name');
      const companyIdx = getIndex('company');
      const emailIdx = getIndex('email');
      const websiteIdx = getIndex('website');

      return {
        fullName: (nameIdx >= 0 && columns[nameIdx]) ? columns[nameIdx] : "Desconocido",
        companyName: (companyIdx >= 0 && columns[companyIdx]) ? columns[companyIdx] : "N/A",
        email: (emailIdx >= 0 && columns[emailIdx]) ? columns[emailIdx] : null,
        website: (websiteIdx >= 0 && columns[websiteIdx]) ? columns[websiteIdx] : null,
      };
    });

    // 1. Deduplicate and Insert Companies
    const uniqueCompanyNames = Array.from(new Set(leadsData.map(l => l.companyName)));
    
    // Process companies in bulk (simplified for now)
    for (const cName of uniqueCompanyNames) {
      await db.insert(companies).values({ name: cName })
        .onConflictDoUpdate({ target: companies.name, set: { updatedAt: new Date() } });
    }

    // Fetch all companies to map IDs
    const allCos = await db.query.companies.findMany();
    const companyMap = new Map(allCos.map(c => [c.name, c.id]));

    const peopleToInsert = leadsData.map(l => ({
      fullName: l.fullName,
      email: l.email,
      companyId: companyMap.get(l.companyName),
      status: "new" as const,
    }));

    if (peopleToInsert.length === 0) {
      return { success: false, error: "No se encontraron leads válidos en el archivo." };
    }

    const insertedPeople = await db.insert(people).values(peopleToInsert).returning();

    if (insertedPeople.length > 0) {
      await db.insert(activities).values({
        personId: insertedPeople[0].id,
        type: "UPLOAD",
        description: `Se cargaron ${insertedPeople.length} leads nuevos (V2 Relacional).`,
      });
    }

    revalidatePath("/dashboard");
    return { success: true, count: insertedPeople.length };
  } catch (err: any) {
    console.error("DATABASE_ERROR_", err);
    return { success: false, error: "Error al procesar la base de datos o el mapeo." };
  }
}

export async function processLeadWithAIAction(personId: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  try {
    // REAL AI PROCESSING (V2 with Metadata)
    const person = await db.query.people.findFirst({
      where: eq(people.id, personId),
      with: { company: true }
    });

    if (!person) throw new Error("PERSON_NOT_FOUND_");

    const aiInsight = await generateLeadInsights({
      fullName: person.fullName,
      jobTitle: person.jobTitle,
      companyName: person.company?.name || "N/A",
      industry: person.company?.industry
    });

    await db.update(people)
      .set({
        score: aiInsight.score,
        metadata: {
          qualificationReason: aiInsight.qualificationReason,
          personalTouch: aiInsight.personalTouch,
          suggestedEmail: aiInsight.suggestedEmail
        },
        updatedAt: new Date(),
      })
      .where(eq(people.id, personId));

    await db.insert(activities).values({
      personId,
      type: "AI_PROCESSING",
      description: `Sabueso AI calificó a ${person.fullName} con ${aiInsight.score} pts.`,
    });

    // Auto-generate embedding so this person is immediately searchable
    try {
      const embedText = buildPersonEmbedText({
        fullName: person.fullName,
        jobTitle: person.jobTitle,
        email: person.email,
        companyName: person.company?.name,
        industry: person.company?.industry,
        metadata: {
          qualificationReason: aiInsight.qualificationReason,
          personalTouch: aiInsight.personalTouch,
        },
      });
      const embedding = await generateEmbedding(embedText);
      await db.update(people).set({ embedding: embedding as any }).where(eq(people.id, personId));
    } catch {
      // Non-blocking: embedding failure doesn't fail the main action
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/lead/${personId}`, "page");
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
    const peopleToProcess = await db.query.people.findMany({
      where: eq(people.status, 'new'),
      with: { company: true }
    });
    
    for (const person of peopleToProcess) {
      const aiInsight = await generateLeadInsights({
        fullName: person.fullName,
        jobTitle: person.jobTitle,
        companyName: person.company?.name || "N/A",
        industry: person.company?.industry
      });

      await db.update(people)
        .set({
          score: aiInsight.score,
          status: 'qualified',
          metadata: {
            qualificationReason: aiInsight.qualificationReason,
            personalTouch: aiInsight.personalTouch,
            suggestedEmail: aiInsight.suggestedEmail
          },
          updatedAt: new Date(),
        })
        .where(eq(people.id, person.id));
      
      await db.insert(activities).values({
        personId: person.id,
        type: "AI_PROCESSING",
        description: `Procesamiento masivo: ${person.fullName} calificado.`,
      });
    }

    revalidatePath("/dashboard");
    return { success: true, count: peopleToProcess.length };
  } catch (err: any) {
    console.error("BATCH_AI_PROCESSING_ERROR_", err);
    return { success: false, error: "Error al procesar lote masivo." };
  }
}

export async function handoverLeadAction(personId: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  try {
    await db.update(people)
      .set({
        status: 'handover',
        updatedAt: new Date(),
      })
      .where(eq(people.id, personId));

    await db.insert(activities).values({
      personId,
      type: "HANDOVER",
      description: "Lead transferido al equipo de cierre (HANDOVER).",
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/lead/${personId}`, "page");
    return { success: true };
  } catch (err: any) {
    console.error("HANDOVER_ERROR_", err);
    return { success: false, error: "Error en el handover." };
  }
}

export async function deleteLeadsAction(personIds: string[]) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  try {
    // Delete in bulk
    await db.delete(people).where(inArray(people.id, personIds));
    
    // Log activity
    await db.insert(activities).values({
      type: "DELETE",
      description: `Eliminación masiva de ${personIds.length} leads.`,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("DELETE_ERROR_", err);
    return { success: false, error: "Error al eliminar leads." };
  }
}
