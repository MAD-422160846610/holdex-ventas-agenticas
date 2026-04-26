## Tasks: User Profiles & Onboarding

- [ ] **1. Schema Update**
  - Update `lib/db/schema.ts` to include `userRoleEnum` and `userProfiles` table.
  - Run `npm run db:push` (or drizzle-kit push) to update the Neon database.

- [ ] **2. Profile Server Actions**
  - Create `lib/actions/profiles.ts`.
  - Implement `createProfile(formData)` integrating with Drizzle and Stack Auth.

- [ ] **3. UI: Onboarding Form**
  - Create `components/OnboardingForm.tsx` with fields for Full Name, Company, and Phone.
  - Apply the V2 Cyber-Brutalist CSS tokens (`glass-panel`, `cyber-input`, `cyber-button`).

- [ ] **4. Routing: Onboarding Page**
  - Create `app/onboarding/page.tsx`.
  - Verify user is logged in via Stack Auth, redirect to sign-in if not.
  - Render the `OnboardingForm`.

- [ ] **5. Interceptor: Dashboard Layout**
  - Modify `app/dashboard/layout.tsx`.
  - Fetch user profile. If `null`, redirect to `/onboarding`.
