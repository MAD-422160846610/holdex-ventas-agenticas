## Specification: User Profiles & Onboarding

### Requirements
1. **Data Model**:
   - Create `user_profiles` table with: `id` (PK, string), `role` (enum: vendedor, cliente, admin), `full_name` (string), `company` (string), `phone` (string), `created_at` (timestamp).
   
2. **Middleware / Interceptor**:
   - Create a mechanism to check if the current Stack Auth user has a corresponding row in `user_profiles`.
   - If the user is authenticated but has no profile, redirect them to `/onboarding` regardless of the route they are trying to access (except public routes or the onboarding route itself).

3. **Onboarding Page (`/onboarding`)**:
   - A cyber-brutalist styled page.
   - Form fields: Full Name (required), Company (optional), Phone (optional).
   - Submit button creates the profile via a Server Action.
   - Default role assigned: `vendedor`.

### Scenarios
- **Scenario A: First Time Login**
  - Given a user has just signed up via Stack Auth.
  - When they try to access `/dashboard`.
  - Then the system intercepts the request, notes the missing profile, and redirects to `/onboarding`.
  - When the user submits the onboarding form, the profile is created and they are redirected to `/dashboard`.

- **Scenario B: Returning User**
  - Given a user with an existing profile logs in.
  - When they try to access `/dashboard`.
  - Then the system allows the request without interruption.

### Security
- Role assignment in the frontend must only ever assign `vendedor` or `cliente`. 
- Only DB admins can promote a user to `admin`.
