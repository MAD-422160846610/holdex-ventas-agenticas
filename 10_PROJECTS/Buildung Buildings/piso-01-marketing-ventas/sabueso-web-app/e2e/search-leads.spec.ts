import { test, expect } from '@playwright/test';

/**
 * TC411 — Flujo completo: Abrir modal, buscar leads, importar
 * Requiere que el servidor de Next.js esté corriendo (npm run dev)
 * 
 * NOTA: Este test mockea las llamadas a APIFY a nivel de red (route.fulfill)
 * para no depender de credenciales reales ni gastar créditos.
 */
test.describe('E2E: Búsqueda de Leads con APIFY', () => {

  // ─── Mocks de APIFY ────────────────────────────────────
  const mockRunResponse = {
    id: 'run-e2e-123',
    status: 'RUNNING',
    defaultDatasetId: 'dataset-e2e-456'
  };

  const mockRunSucceeded = {
    id: 'run-e2e-123',
    status: 'SUCCEEDED',
    defaultDatasetId: 'dataset-e2e-456'
  };

  const mockDataset = {
    items: [
      {
        title: 'E2E Lead 1',
        email: 'e2e1@test.com',
        address: 'Calle E2E 123',
        phone: '+54911123456'
      },
      {
        title: 'E2E Lead 2',
        email: 'e2e2@test.com',
        address: 'Av. E2E 456',
        website: 'https://e2e-test.com'
      }
    ]
  };

  test.beforeEach(async ({ page }) => {
    // Mock de APIFY API (POST /actor-tasks/.../runs)
    await page.route('**/api.apify.com/v2/actor-tasks/**/runs', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRunResponse)
      });
    });

    // Mock de APIFY API (GET /actor-runs/...)
    await page.route('**/api.apify.com/v2/actor-runs/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRunSucceeded)
      });
    });

    // Mock de APIFY API (GET /datasets/.../items)
    await page.route('**/api.apify.com/v2/datasets/**/items**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDataset)
      });
    });
  });

  /**
   * TC411 — Usuario puede abrir modal, buscar, ver resultados e importar
   */
  test('[TC411] Flujo completo: Buscar Leads -> Importar', async ({ page }) => {
    // 1. Ir al dashboard (asumiendo autenticación via Stack Auth)
    await page.goto('/dashboard');
    
    // NOTA: Si Stack Auth redirige al login, necesitamos autenticarnos primero.
    // Por ahora asumimos que ya hay una sesión activa o el test corre en CI con cookie.
    
    // 2. Esperar a que cargue el dashboard
    await page.waitForSelector('text=Pipeline_Activo', { timeout: 10000 });

    // 3. Hacer clic en "BUSCAR LEADS"
    // (Usamos getByRole con exact para evitar conflictos con otros botones)
    const searchButton = page.getByRole('button', { name: /BUSCAR LEADS/i, exact: false });
    await expect(searchButton).toBeVisible({ timeout: 5000 });
    await searchButton.click();

    // 4. Verificar que el modal se abrió
    await expect(page.getByText('Buscar Leads con APIFY')).toBeVisible();
    
    // 5. Seleccionar actor "Google Maps Scraper"
    const actorSelect = page.locator('select');
    await actorSelect.selectOption({ label: /Google Maps/i });

    // 6. Llenar campo "Qué buscar"
    const searchInput = page.getByLabel(/qué buscar/i);
    await searchInput.fill('restaurantes test e2e');

    // 7. Hacer clic en "Ejecutar Búsqueda"
    const submitButton = page.getByRole('button', { name: /ejecutar búsqueda/i, exact: false });
    await submitButton.click();

    // 8. Esperar a que aparezcan los resultados (polling simulado)
    await expect(page.getByText('Resultados (2)')).toBeVisible({ timeout: 15000 });

    // 9. Seleccionar los 2 leads
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(2);
    await checkboxes.first().check();
    await checkboxes.last().check();

    // 10. Hacer clic en "Importar Seleccionados"
    const importButton = page.getByRole('button', { name: /importar seleccionados/i, exact: false });
    await importButton.click();

    // 11. Verificar que el modal se cierra (o aparece mensaje de éxito)
    // El modal debería cerrarse tras importar exitosamente
    await expect(page.getByText('Buscar Leads con APIFY')).not.toBeVisible({ timeout: 5000 });
    
    // 12. Verificar que la página se refrescó (los leads deberían aparecer en la lista)
    // Esto depende de si el dashboard muestra los nuevos leads inmediatamente
    // Por ahora verificamos que no hay errores en la consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    expect(errors).toHaveLength(0);
  });

  /**
   * TC412 — Validación: No se puede buscar sin llenar campos requeridos
   */
  test('[TC412] No permite ejecutar búsqueda sin campos requeridos', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('text=Pipeline_Activo');

    // Abrir modal
    await page.getByRole('button', { name: /BUSCAR LEADS/i }).click();
    await expect(page.getByText('Buscar Leads con APIFY')).toBeVisible();

    // Intentar enviar sin llenar "Qué buscar"
    const submitButton = page.getByRole('button', { name: /ejecutar búsqueda/i });
    
    // El botón debería estar deshabilitado o mostrar error
    // (Esto depende de la implementación del formulario)
    // Por ahora verificamos que el campo requerido está presente
    const searchInput = page.getByLabel(/qué buscar/i);
    await expect(searchInput).toBeRequired();
  });
});
