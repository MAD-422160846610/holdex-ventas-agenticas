"use server";

import { getAuthenticatedUser } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { people, activities, companies } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";
import {
  generateEmbedding,
  buildPersonEmbedText,
  buildActivityEmbedText,
} from "@/lib/embeddings";

// ───────────────────────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────────────────────

export type SemanticSearchResult = {
  type: "person" | "activity";
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  similarity: number;
  href: string;
};

// ───────────────────────────────────────────────────────────────────────────────
// Core semantic search action
// ───────────────────────────────────────────────────────────────────────────────

export async function semanticSearchAction(query: string): Promise<{
  success: boolean;
  results?: SemanticSearchResult[];
  error?: string;
}> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  if (!query || query.trim().length < 2) {
    return { success: true, results: [] };
  }

  try {
    // 1. Generate query embedding
    const queryEmbedding = await generateEmbedding(query.trim());
    const embeddingLiteral = `[${queryEmbedding.join(",")}]`;

    // 2. Cosine similarity search on people
    // pgvector: <=> is cosine distance (0 = identical, 2 = opposite)
    // similarity = 1 - distance
    const peopleResults = await db.execute(sql`
      SELECT
        p.id,
        p.full_name,
        p.job_title,
        p.email,
        p.status,
        c.name AS company_name,
        1 - (p.embedding <=> ${embeddingLiteral}::vector) AS similarity
      FROM people p
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE p.embedding IS NOT NULL
      ORDER BY p.embedding <=> ${embeddingLiteral}::vector
      LIMIT 5
    `);

    // 3. Cosine similarity search on activities
    const activitiesResults = await db.execute(sql`
      SELECT
        a.id,
        a.type,
        a.description,
        a.created_at,
        p.full_name AS person_name,
        c.name AS company_name,
        1 - (a.embedding <=> ${embeddingLiteral}::vector) AS similarity
      FROM activities a
      LEFT JOIN people p ON a.person_id = p.id
      LEFT JOIN companies c ON a.company_id = c.id
      WHERE a.embedding IS NOT NULL
      ORDER BY a.embedding <=> ${embeddingLiteral}::vector
      LIMIT 5
    `);

    // 4. Map and merge results
    const SIMILARITY_THRESHOLD = 0.3;

    const mappedPeople: SemanticSearchResult[] = (peopleResults as any[])
      .filter((r) => Number(r.similarity) >= SIMILARITY_THRESHOLD)
      .map((r) => ({
        type: "person" as const,
        id: r.id,
        title: r.full_name,
        subtitle: [r.job_title, r.company_name].filter(Boolean).join(" @ "),
        detail: r.email || r.status,
        similarity: Number(r.similarity),
        href: `/dashboard/lead/${r.id}`,
      }));

    const mappedActivities: SemanticSearchResult[] = (activitiesResults as any[])
      .filter((r) => Number(r.similarity) >= SIMILARITY_THRESHOLD)
      .map((r) => ({
        type: "activity" as const,
        id: r.id,
        title: `[${r.type}] ${r.description.slice(0, 60)}${r.description.length > 60 ? "..." : ""}`,
        subtitle: r.person_name ? `Contacto: ${r.person_name}` : r.company_name || "",
        detail: new Date(r.created_at).toLocaleDateString("es-AR"),
        similarity: Number(r.similarity),
        href: `/dashboard/lead/${r.person_id || ""}`,
      }));

    // 5. Merge and sort by similarity descending
    const merged = [...mappedPeople, ...mappedActivities].sort(
      (a, b) => b.similarity - a.similarity
    );

    return { success: true, results: merged };
  } catch (err: any) {
    console.error("SEMANTIC_SEARCH_ERROR_", err);
    return { success: false, error: "Error en búsqueda semántica." };
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Embed a single person (called after AI processing or manual update)
// ───────────────────────────────────────────────────────────────────────────────

export async function embedPersonAction(personId: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  try {
    const person = await db.query.people.findFirst({
      where: eq(people.id, personId),
      with: { company: true },
    });

    if (!person) return { success: false, error: "Persona no encontrada." };

    const text = buildPersonEmbedText({
      fullName: person.fullName,
      jobTitle: person.jobTitle,
      email: person.email,
      companyName: person.company?.name,
      industry: person.company?.industry,
      metadata: person.metadata as Record<string, unknown> | null,
    });

    const embedding = await generateEmbedding(text);

    await db
      .update(people)
      .set({ embedding: embedding as any, updatedAt: new Date() })
      .where(eq(people.id, personId));

    return { success: true };
  } catch (err: any) {
    console.error("EMBED_PERSON_ERROR_", err);
    return { success: false, error: "Error al generar embedding." };
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Embed a single activity (called after activity creation)
// ───────────────────────────────────────────────────────────────────────────────

export async function embedActivityAction(activityId: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  try {
    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, activityId),
      with: { person: true, company: true },
    });

    if (!activity) return { success: false, error: "Actividad no encontrada." };

    const text = buildActivityEmbedText({
      type: activity.type,
      description: activity.description,
      transcription: activity.transcription,
      personName: activity.person?.fullName,
      companyName: activity.company?.name,
    });

    const embedding = await generateEmbedding(text);

    await db
      .update(activities)
      .set({ embedding: embedding as any })
      .where(eq(activities.id, activityId));

    return { success: true };
  } catch (err: any) {
    console.error("EMBED_ACTIVITY_ERROR_", err);
    return { success: false, error: "Error al generar embedding de actividad." };
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Batch embed all people without embeddings
// ───────────────────────────────────────────────────────────────────────────────

export async function batchEmbedPeopleAction(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_");

  try {
    // Find all people without embeddings
    const unembedded = await db.execute(sql`
      SELECT p.id, p.full_name, p.job_title, p.email, p.metadata,
             c.name AS company_name, c.industry
      FROM people p
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE p.embedding IS NULL
    `);

    let count = 0;
    for (const row of unembedded as any[]) {
      try {
        const text = buildPersonEmbedText({
          fullName: row.full_name,
          jobTitle: row.job_title,
          email: row.email,
          companyName: row.company_name,
          industry: row.industry,
          metadata: row.metadata,
        });

        const embedding = await generateEmbedding(text);

        await db
          .update(people)
          .set({ embedding: embedding as any, updatedAt: new Date() })
          .where(eq(people.id, row.id));

        count++;
      } catch {
        // Skip individual failures; continue batch
        continue;
      }
    }

    return { success: true, count };
  } catch (err: any) {
    console.error("BATCH_EMBED_ERROR_", err);
    return { success: false, error: "Error en embedding masivo." };
  }
}
