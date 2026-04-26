## Proposal: User Profiles & Onboarding System

### Intent
We need to handle user registration properly. When a user logs in via Stack Auth, they need to be routed to an onboarding flow to complete their profile (name, role, company data) before accessing the dashboard. We need roles: `vendedor`, `cliente`, and `admin`.

### Proposed Approach
1. **Database Update**: Create a `profiles` table in Drizzle schema.
   - `id`: varchar (matching Stack Auth user ID)
   - `role`: enum ('vendedor', 'cliente', 'admin')
   - `fullName`: text
   - `phone`: text
   - `company`: text

2. **Routing & Middleware**:
   - Update `app/dashboard/page.tsx` (or middleware) to check if the user exists in the `profiles` table.
   - If not, redirect to `/onboarding`.

3. **Onboarding Flow (`/onboarding`)**:
   - A cyber-brutalist form asking for their details.
   - Saves to the `profiles` table.
   - Redirects to `/dashboard` upon completion.

### Risks & Mitigations
- **Security**: Only allow users to set themselves as `vendedor` or `cliente`. `admin` must be set manually in the database.
- **Data Sync**: Stack Auth manages authentication, our DB manages authorization and business profile data.

### Next Steps
If approved, we will move to the Specifications and Task breakdown.
