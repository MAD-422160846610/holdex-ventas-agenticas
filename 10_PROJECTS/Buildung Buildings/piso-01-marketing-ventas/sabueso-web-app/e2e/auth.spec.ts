import { test, expect } from '@playwright/test';

/**
 * TC003 — Dashboard access requires authentication
 * Un usuario NO autenticado que navega a /dashboard debe ser redirigido al login.
 */
test('[TC003] Dashboard redirige al sign-in si no hay sesión activa', async ({ page }) => {
  await page.goto('/dashboard');
  // Stack Auth redirige al handler de sign-in
  await expect(page).toHaveURL(/handler\/sign-in/);
});

/**
 * TC003 — Landing page accesible sin autenticación
 * La página principal es pública.
 */
test('[TC003] La landing page es accesible sin autenticación', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toContainText(/Sabueso/i);
});

/**
 * TC016 — Sign-in page renders correctamente
 * La página de login de Stack Auth debe mostrarse con los campos de email y contraseña.
 */
test('[TC016] La página de sign-in renderiza el formulario de autenticación', async ({ page }) => {
  await page.goto('/handler/sign-in');
  // Stack Auth renderiza sus propios campos. El de email suele ser visible por defecto.
  await expect(page.locator('#email')).toBeVisible();
  
  // Para ver el password, hay que cambiar a la pestaña correspondiente
  await page.getByRole('tab', { name: /password/i }).click();
  await expect(page.locator('#password')).toBeVisible();
});

/**
 * TC016 — Credenciales inválidas son rechazadas
 * El formulario de Stack Auth debe mostrar un error con credenciales incorrectas.
 * NOTA: Este test depende de que el servidor de Next.js esté corriendo.
 */
test('[TC016] Credenciales inválidas son rechazadas y no redirigen al dashboard', async ({ page }) => {
  await page.goto('/handler/sign-in');

  await page.locator('#email').fill('invalido@ejemplo.com');
  
  // Cambiar a pestaña password
  await page.getByRole('tab', { name: /password/i }).click();
  await page.locator('#password').fill('contraseña_incorrecta');
  
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  // No debería redirigir al dashboard
  await page.waitForTimeout(2000);
  await expect(page).not.toHaveURL('/dashboard');

  // Debería permanecer en el sign-in flow
  await expect(page).toHaveURL(/handler\/sign-in/);
});
