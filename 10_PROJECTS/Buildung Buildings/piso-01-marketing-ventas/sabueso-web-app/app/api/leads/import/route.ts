import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { people, activities } from '@/lib/db/schema';
import { SUPPORTED_ACTORS } from '@/lib/apify-actors-config';
import { eq, sql } from 'drizzle-orm';

/**
 * POST /api/leads/import
 * Importa leads obtenidos de APIFY a la base de datos
 * 
 * Body: {
 *   results: any[],
 *   actorId: string
 * }
 */
export async function POST(request: Request) {
  try {
    const { results, actorId } = await request.json();

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionaron resultados para importar.' },
        { status: 400 }
      );
    }

    const config = SUPPORTED_ACTORS[actorId];
    if (!config) {
      return NextResponse.json(
        { success: false, error: `Actor no soportado: ${actorId}` },
        { status: 400 }
      );
    }

    // Mapear resultados según configuración del actor
    const leadsData = results.map((item: any) => {
      const mapped: any = {
        status: 'new' as const,
        apifySource: actorId,
      };

      // Aplicar mapeo - simplificado para evitar errores de TypeScript
      if (item['title']) mapped.fullName = item['title'];
      if (item['address']) {
        if (typeof mapped.metadata !== 'object') mapped.metadata = {};
        mapped.metadata['address'] = item['address'];
      }
      if (item['phone']) mapped.phone = item['phone'];
      if (item['website']) mapped.companyWebsite = item['website'];
      if (item['email']) mapped.email = item['email'];

      return mapped;
    });

    // Filtrar duplicados por email si existe
    const uniqueLeads = leadsData.filter((lead, index, self) =>
      lead.email ? self.findIndex((l: any) => l.email === lead.email) === index : true
    );

    // Insertar en DB
    const insertedPeople = await db.insert(people).values(uniqueLeads).returning();

    await db.insert(activities).values({
      type: 'APIFY_IMPORT',
      description: `Importados ${insertedPeople.length} leads desde APIFY (${actorId})`,
    });

    return NextResponse.json({
      success: true,
      count: insertedPeople.length,
    });

  } catch (error: any) {
    console.error('APIFY_IMPORT_ERROR_', error);
    return NextResponse.json(
      { success: false, error: `Error al importar: ${error.message}` },
      { status: 500 }
    );
  }
}
