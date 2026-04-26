## Technical Design: User Profiles & Onboarding

### Architecture
We will use React Server Components for authorization checks and Server Actions for data mutation.

### Database Changes (`lib/db/schema.ts`)
Add `userRoleEnum`:
```typescript
export const userRoleEnum = pgEnum('user_role', ['vendedor', 'cliente', 'admin']);
```

Add `userProfiles` table:
```typescript
export const userProfiles = pgTable('user_profiles', {
  id: text('id').primaryKey(), // Stack Auth user ID
  role: userRoleEnum('role').default('vendedor').notNull(),
  fullName: text('full_name').notNull(),
  company: text('company'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Server Actions (`lib/actions/profiles.ts`)
Create a new action `createProfile(formData: FormData)`:
- Gets the current user from `stackServerApp.getUser()`.
- Validates the user exists and is not already in the `user_profiles` table.
- Inserts the new profile into the DB.
- Redirects to `/dashboard` using `revalidatePath` and `redirect`.

### Routing Interception
Since querying the database from Next.js middleware (Edge runtime) can cause issues with standard Postgres drivers, we will enforce the onboarding check at the Layout level for protected routes.
- **`app/dashboard/layout.tsx`**: 
  - Fetch user from `stackServerApp.getUser()`.
  - Fetch profile from DB `db.query.userProfiles.findFirst({ where: eq(userProfiles.id, user.id) })`.
  - If no profile, `redirect('/onboarding')`.

### UI Components
- **`app/onboarding/page.tsx`**: A Server Component that verifies the user is logged in (via Stack Auth), but has no profile. Renders the form.
- **`components/OnboardingForm.tsx`**: A Client Component with the cyber-brutalist aesthetic to capture input and submit to the server action.
