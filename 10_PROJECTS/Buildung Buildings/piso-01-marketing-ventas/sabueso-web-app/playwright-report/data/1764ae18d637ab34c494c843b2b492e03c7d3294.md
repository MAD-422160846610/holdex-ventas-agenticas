# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> [TC016] La página de sign-in renderiza el formulario de autenticación
- Location: e2e/auth.spec.ts:27:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="password"], input[name="password"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="password"], input[name="password"]').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "0"
          - generic [ref=e15]: "1"
        - generic [ref=e16]: Issue
      - button "Collapse issues badge" [ref=e17]:
        - img [ref=e18]
  - button "Toggle Stack Auth Dev Tools" [ref=e20]:
    - img [ref=e22]
    - generic [ref=e24]: DEV
  - alert [ref=e25]
  - generic [ref=e27]:
    - generic [ref=e28]:
      - heading "Sign in to your account" [level=2] [ref=e29]
      - paragraph [ref=e30]:
        - text: Don't have an account?
        - link "Sign up" [ref=e31] [cursor=pointer]:
          - /url: /handler/sign-up
    - button "Sign in with Google" [ref=e35] [cursor=pointer]:
      - generic [ref=e36]:
        - img [ref=e37]
        - generic [ref=e43]: Sign in with Google
    - generic [ref=e46]: Or continue with
    - generic [ref=e48]:
      - tablist [ref=e49]:
        - tab "Email" [selected] [ref=e50] [cursor=pointer]
        - tab "Email & Password" [ref=e51] [cursor=pointer]
      - tabpanel "Email" [ref=e52]:
        - generic [ref=e53]:
          - generic [ref=e54]: Email
          - textbox "Email" [ref=e56]
          - button "Send email" [ref=e57] [cursor=pointer]:
            - generic [ref=e58]: Send email
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * TC003 — Dashboard access requires authentication
  5  |  * Un usuario NO autenticado que navega a /dashboard debe ser redirigido al login.
  6  |  */
  7  | test('[TC003] Dashboard redirige al sign-in si no hay sesión activa', async ({ page }) => {
  8  |   await page.goto('/dashboard');
  9  |   // Stack Auth redirige al handler de sign-in
  10 |   await expect(page).toHaveURL(/handler\/sign-in/);
  11 | });
  12 | 
  13 | /**
  14 |  * TC003 — Landing page accesible sin autenticación
  15 |  * La página principal es pública.
  16 |  */
  17 | test('[TC003] La landing page es accesible sin autenticación', async ({ page }) => {
  18 |   await page.goto('/');
  19 |   await expect(page).toHaveURL('/');
  20 |   await expect(page.locator('h1')).toContainText(/Sabueso/i);
  21 | });
  22 | 
  23 | /**
  24 |  * TC016 — Sign-in page renders correctamente
  25 |  * La página de login de Stack Auth debe mostrarse con los campos de email y contraseña.
  26 |  */
  27 | test('[TC016] La página de sign-in renderiza el formulario de autenticación', async ({ page }) => {
  28 |   await page.goto('/handler/sign-in');
  29 |   // Stack Auth renderiza sus propios campos
  30 |   await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
> 31 |   await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
     |                                                                                        ^ Error: expect(locator).toBeVisible() failed
  32 | });
  33 | 
  34 | /**
  35 |  * TC016 — Credenciales inválidas son rechazadas
  36 |  * El formulario de Stack Auth debe mostrar un error con credenciales incorrectas.
  37 |  * NOTA: Este test depende de que el servidor de Next.js esté corriendo.
  38 |  */
  39 | test('[TC016] Credenciales inválidas son rechazadas y no redirigen al dashboard', async ({ page }) => {
  40 |   await page.goto('/handler/sign-in');
  41 | 
  42 |   await page.locator('input[type="email"], input[name="email"]').first().fill('invalido@ejemplo.com');
  43 |   await page.locator('input[type="password"], input[name="password"]').first().fill('contraseña_incorrecta');
  44 |   await page.locator('button[type="submit"]').first().click();
  45 | 
  46 |   // No debería redirigir al dashboard
  47 |   await page.waitForTimeout(2000);
  48 |   await expect(page).not.toHaveURL('/dashboard');
  49 | 
  50 |   // Debería permanecer en el sign-in flow
  51 |   await expect(page).toHaveURL(/handler\/sign-in/);
  52 | });
  53 | 
```