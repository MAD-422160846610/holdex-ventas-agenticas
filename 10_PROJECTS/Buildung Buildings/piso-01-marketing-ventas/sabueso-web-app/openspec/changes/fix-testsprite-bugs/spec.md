## Requirements
1. **OutreachAction Validation**: The form must prevent submission if the `message` field is empty or contains only whitespace.
2. **OutreachAction Error Handling**: An explicit error message "El mensaje no puede estar vacío" must be displayed when attempting to send an empty message.
3. **OutreachAction Success Feedback**: The success message must include "Enviado con éxito" so TestSprite can detect it, appended to the brutalist "ATAQUE_EXITOSO_".
4. **DashboardClient Button Label**: The CSV upload button must be labeled "IMPORTAR LEADS CSV" instead of "SUBIR LEADS CSV" to match TestSprite's expected terminology.

## Scenarios
- **Scenario 1:** User clicks "DISPARAR_ATAQUE_" with an empty message. Result: Error message appears, action is aborted.
- **Scenario 2:** User clicks "DISPARAR_ATAQUE_" with a valid message. Result: Message sends, success message "ATAQUE_EXITOSO_ (Enviado con éxito)" appears.
- **Scenario 3:** Test runner looks for the import button. Result: Test runner successfully finds the button labeled "IMPORTAR LEADS CSV".
