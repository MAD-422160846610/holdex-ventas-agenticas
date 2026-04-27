"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { people, activities, companies } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

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

    // 2. Insert People linked to Companies
    const peopleToInsert = leadsData.map(l => ({
      fullName: l.fullName,
      email: l.email,
      companyId: companyMap.get(l.companyName),
      status: "new" as const,
    }));

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
    // MOCK AI PROCESSING (V2 with Metadata)
    const score = Math.floor(Math.random() * 40) + 60;
    const aiInsight = {
      qualificationReason: "Análisis de Master Suite completado.",
      personalTouch: "Este lead tiene alto potencial en su industria.",
      suggestedEmail: "Hola, vi lo que están haciendo y me interesa..."
    };

    await db.update(people)
      .set({
        score,
        metadata: aiInsight,
        updatedAt: new Date(),
      })
      .where(eq(people.id, personId));

    await db.insert(activities).values({
      personId,
      type: "AI_PROCESSING",
      description: "Sabueso AI procesó el contacto y actualizó la metadata estratégica.",
    });

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
    const peopleToProcess = await db.query.people.findMany();
    
    for (const person of peopleToProcess) {
      const score = Math.floor(Math.random() * 40) + 60;
      await db.update(people)
        .set({
          score,
          status: 'qualified',
          updatedAt: new Date(),
        })
        .where(eq(people.id, person.id));
    }

    revalidatePath("/dashboard");
    return { success: true, count: peopleToProcess.length };
  } catch (err: any) {
    console.error("BATCH_AI_PROCESSING_ERROR_", err);
    return { success: false, error: "Error al procesar lote masivo." };
  }
}
