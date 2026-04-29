const APIFY_BASE_URL = 'https://api.apify.com/v2';

export interface ApifyRunResponse {
  id: string;
  actId: string;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  defaultDatasetId: string;
}

export interface ApifySearchResult {
  items: any[];
  total: number;
}

/**
 * Ejecuta un actor de APIFY y devuelve el runId
 */
export async function runApifyActor(
  actorId: string, 
  input: Record<string, any>
): Promise<string> {
  const apiKey = process.env.APIFY_API_KEY;
  if (!apiKey) {
    throw new Error('APIFY_API_KEY not configured');
  }

  const response = await fetch(`${APIFY_BASE_URL}/actor-tasks/${actorId}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`APIFY error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.id; // runId
}

/**
 * Hace polling de resultados hasta que termine el actor o timeout (5 min default)
 */
export async function pollApifyResults(
  runId: string,
  timeoutMs: number = 5 * 60 * 1000
): Promise<any[]> {
  const startTime = Date.now();
  const pollInterval = 5000; // 5 segundos

  while (Date.now() - startTime < timeoutMs) {
    const response = await fetch(`${APIFY_BASE_URL}/actor-runs/${runId}`, {
      headers: { 
        'Authorization': `Bearer ${process.env.APIFY_API_KEY}` 
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`APIFY polling error: ${response.status} - ${errorText}`);
    }

    const run = await response.json();
    
    if (run.status === 'SUCCEEDED') {
      // Obtener dataset
      const datasetResponse = await fetch(
        `${APIFY_BASE_URL}/datasets/${run.defaultDatasetId}/items?limit=1000`,
        { 
          headers: { 
            'Authorization': `Bearer ${process.env.APIFY_API_KEY}` 
          } 
        }
      );
      
      if (!datasetResponse.ok) {
        throw new Error('Failed to fetch dataset from APIFY');
      }

      const dataset = await datasetResponse.json();
      return dataset.items || [];
    }
    
    if (run.status === 'FAILED') {
      throw new Error(`APIFY actor failed: ${run.statusMessage || 'Unknown error'}`);
    }

    // Seguir esperando
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('APIFY polling timeout after 5 minutes');
}
