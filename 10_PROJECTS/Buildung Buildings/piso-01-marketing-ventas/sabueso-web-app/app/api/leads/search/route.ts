import { NextResponse } from 'next/server';
import { runApifyActor, pollApifyResults } from '@/lib/apify';
import { db } from '@/lib/db';
import { activities } from '@/lib/db/schema';
import { SUPPORTED_ACTORS } from '@/lib/apify-actors-config';

/**
 * POST /api/leads/search
 * Ejecuta una búsqueda de leads via APIFY
 * 
 * Body: {
 *   actorId: string,
 *   ...inputFields (dynamic según el actor)
 * }
 */
export async function POST(request: Request) {
  try {
    // 1. Parsear el body
    const body = await request.json();
    const { actorId, ...input } = body;

    // 2. Validar actorId
    if (!actorId) {
      return NextResponse.json(
        { success: false, error: 'actorId es requerido para búsqueda APIFY.' },
        { status: 400 }
      );
    }

    // 3. Validar que el actor esté soportado
    const config = SUPPORTED_ACTORS[actorId];
    if (!config) {
      return NextResponse.json(
        { success: false, error: `Actor no soportado: ${actorId}` },
        { status: 400 }
      );
    }

    // 4. Ejecutar actor de APIFY
    const runId = await runApifyActor(actorId, input);
    
    // 5. Hacer polling hasta que termine
    const results = await pollApifyResults(runId);

    // 6. Log activity
    await db.insert(activities).values({
      type: 'APIFY_SEARCH',
      description: `Búsqueda APIFY: ${results.length} leads encontrados`,
    });

    // 7. Devolver resultados
    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    });

  } catch (error: any) {
    console.error('APIFY_SEARCH_ERROR_', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Error en búsqueda APIFY: ${error.message}` 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads/search
 * Endpoint de health check o configuración de actores
 */
export async function GET() {
  try {
    const actors = Object.values(SUPPORTED_ACTORS).map(({ id, name, description, inputFields }) => ({
      id,
      name,
      description,
      inputFields,
    }));

    return NextResponse.json({
      success: true,
      actors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
