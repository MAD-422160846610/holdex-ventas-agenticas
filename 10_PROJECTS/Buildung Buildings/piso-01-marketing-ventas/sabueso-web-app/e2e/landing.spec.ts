import { test, expect } from '@playwright/test';

test('La Landing Page carga correctamente con el diseño Cyber-Brutalist', async ({ page }) => {
  // Navegar a la página principal
  await page.goto('/');

  // Verificar el título principal
  await expect(page.locator('h1')).toContainText(/Sabueso/i);

  // Verificar que el componente AsciiBg esté en el DOM y visible
  const asciiBg = page.locator('.absolute.inset-0.z-0');
  // Usamos una verificación más flexible ya que es un div con caracteres
  await expect(asciiBg).toBeVisible();

  // Verificar que los botones principales estén presentes
  await expect(page.getByRole('link', { name: /Login/i })).toBeVisible();
});
