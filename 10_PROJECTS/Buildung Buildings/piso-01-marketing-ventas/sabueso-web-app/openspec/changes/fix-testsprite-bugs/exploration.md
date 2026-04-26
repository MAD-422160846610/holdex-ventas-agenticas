## Exploration: fix-testsprite-bugs

### Current State
El reporte de TestSprite arrojó que casi todos los tests fallaron o quedaron bloqueados (16 de 18).
Los tres problemas principales son:
1. **Bloqueo de Autenticación (Auth Blocker)**: Stack Auth utiliza un Shadow DOM para las Dev Tools y, por defecto, muestra el login con Magic Link. TestSprite no puede hacer clic en "Quick Sign In" porque está en el Shadow DOM o tapado por un overlay, y no puede usar el login normal porque no ve los campos de Email + Password (solo Magic Link). Esto bloquea el 90% de los tests.
2. **Falta de Validación en Outreach (TC009, TC019)**: El componente `OutreachAction.tsx` no valida si el `message` está vacío antes de enviarlo. Además, el mensaje de éxito `ATAQUE_EXITOSO_` no incluye las palabras clave que el QA busca ("enviado con éxito", "Success", etc.).
3. **Botón de Importación (TC018)**: El dashboard tiene un botón que dice "SUBIR LEADS CSV", pero TestSprite estaba buscando específicamente "Importar", "Import" o "Leads".

### Affected Areas
- `components/OutreachAction.tsx` — Falta validación de string vacío y ajuste del copy de éxito.
- `components/DashboardClient.tsx` — Ajustar el texto del botón a "IMPORTAR LEADS" para mayor claridad.
- `app/handler/[...stack]/page.tsx` o configuración local — Necesitamos una forma de que los tests puedan saltarse el Dev Tool o tener un usuario pre-inyectado en entorno de testing.

### Approaches
1. **Mockear Autenticación para Testing + Fixes UI**
   - Pros: Soluciona el bloqueo principal de TestSprite.
   - Cons: Requiere tocar cómo inicializamos Stack Auth o usar cookies falsas para testing.
   - Effort: Medium

2. **Fixes UI puros (Validación y Textos) y pedir configuración manual de TestSprite**
   - Pros: Cambios rápidos y seguros en el código de frontend.
   - Cons: TestSprite seguirá fallando en los tests bloqueados por Auth a menos que se configure una ruta de bypass en Stack Auth.
   - Effort: Low

### Recommendation
Implementar el **Approach 2** primero para dejar el código frontend impecable. Para el bloqueo de autenticación, la mejor solución real a largo plazo es desactivar el Magic Link en el dashboard de Stack Auth y activar Email+Password, o deshabilitar la vista de Dev Tools para que TestSprite interactúe con el formulario nativo (usando variables de entorno como `NEXT_PUBLIC_STACK_DEV_UI=false`).

### Risks
- Cambiar la configuración de Stack Auth puede requerir acceso al panel de control que solo el usuario tiene.
- Modificar los strings de UI solo para pasar el test puede arruinar el tono "Brutalista" de la app si no se hace con cuidado.

### Ready for Proposal
Yes — Estamos listos para definir la propuesta de cambios en código y el workaround de Auth.
