## Architecture / Implementation Approach
- **OutreachAction.tsx**: 
  - Add a check `if (message.trim() === '')` in the `handleSend` function.
  - Set an error state using the existing error management (e.g., local state `error`) if validation fails.
  - Modify the success message in the `handleSend` response handling.
- **DashboardClient.tsx**:
  - Locate the string "SUBIR LEADS CSV" and replace it with "IMPORTAR LEADS CSV" in the button child element.
