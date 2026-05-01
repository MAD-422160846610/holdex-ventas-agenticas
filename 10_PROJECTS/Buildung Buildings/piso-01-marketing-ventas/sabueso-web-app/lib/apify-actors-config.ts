// Configuración de actores soportados de APIFY

export interface ApifyActorConfig {
  id: string;
  name: string;
  description: string;
  inputFields: {
    name: string;
    label: string;
    required: boolean;
    defaultValue?: string | number;
    type: 'text' | 'number';
  }[];
  outputMapping: {
    // Campos de APIFY → Campos de Neon (people table)
    [apifyField: string]: keyof typeof import('@/lib/db/schema').people.$inferInsert;
  };
}

export const SUPPORTED_ACTORS: Record<string, ApifyActorConfig> = {
  'apify/google-maps-scraper': {
    id: 'apify/google-maps-scraper',
    name: 'Google Maps Scraper',
    description: 'Busca empresas por ubicación geográfica',
    inputFields: [
      { name: 'searchString', label: 'Qué buscar', required: true, type: 'text' },
      { name: 'location', label: 'Ubicación', required: false, type: 'text' },
      { name: 'maxPlaces', label: 'Cantidad máxima', required: false, type: 'number', defaultValue: 50 },
    ],
    outputMapping: {
      'title': 'fullName',
      'address': 'metadata',  // 'location' no es columna en people, guardar en metadata
      'phone': 'phone',
      'website': 'companyWebsite',
      'email': 'email',
    }
  },
  'apify/google-search-scraper': {
    id: 'apify/google-search-scraper',
    name: 'Google Search Scraper',
    description: 'Búsqueda web genérica',
    inputFields: [
      { name: 'queries', label: 'Queries (una por línea)', required: true, type: 'text' },
      { name: 'maxPages', label: 'Páginas máximas', required: false, type: 'number', defaultValue: 1 },
    ],
    outputMapping: {
      'title': 'fullName',
      'url': 'companyWebsite',
    }
  },
   'apify/linkedin-companies-scraper': {
    id: 'apify/linkedin-companies-scraper',
    name: 'LinkedIn Companies',
    description: 'Búsqueda de empresas en LinkedIn',
    inputFields: [
      { name: 'keywords', label: 'Keywords', required: true, type: 'text' },
      { name: 'location', label: 'Ubicación', required: false, type: 'text' },
      { name: 'maxCompanies', label: 'Máximo', required: false, type: 'number', defaultValue: 50 },
    ],
    outputMapping: {
      'name': 'fullName',
      'website': 'companyWebsite',
      'industry': 'metadata', // Guardar en metadata (no es columna directa en people)
    }
  },
  'apify/contact-scraper': {
    id: 'apify/contact-scraper',
    name: 'Contact Scraper',
    description: 'Extracción de emails de sitios web',
    inputFields: [
      { name: 'startUrls', label: 'URLs de inicio (una por línea)', required: true, type: 'text' },
      { name: 'maxRequests', label: 'Máximo requests', required: false, type: 'number', defaultValue: 100 },
    ],
    outputMapping: {
      'email': 'email',
      'phone': 'phone',
      'website': 'companyWebsite',
    }
  }
};
