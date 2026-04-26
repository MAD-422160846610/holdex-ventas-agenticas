# Spec: Initial Setup & Authentication

## Requirements

### 1. Database Foundation
- MUST use PostgreSQL (Neon) for data persistence.
- SHOULD implement a schema for:
    - Users (handled by Stack Auth)
    - Leads (id, name, company, website, email, status, qualification_reason, draft_email, created_at)
    - Audit Logs (to track who touched which lead)

### 2. User Authentication (Stack Auth)
- MUST restrict access to the dashboard via a sign-in page.
- MUST support role-based access control (RBAC):
    - **Admin**: Full access to lead management and system settings.
    - **SDR (Josué)**: Can view, update, and contact leads.
- MUST redirect unauthenticated users to `/handler/sign-in`.

### 3. Visual System (Premium Glassmorphism)
- MUST follow a dark-mode first design.
- MUST use a curated color palette (harmonious HSL colors).
- MUST implement glassmorphic effects (backdrop-filter, subtle borders).
- MUST use modern typography (Inter/Outfit).

### 4. User Profiles (RBAC Database Layer)
- MUST persist user profiles in a `user_profiles` table: `id` (PK, Stack Auth user ID), `role` (enum: vendedor, cliente, admin), `full_name`, `company`, `phone`, `created_at`.
- Role assignment from the frontend MUST only allow `vendedor` or `cliente`.
- Promoting a user to `admin` MUST be done exclusively via DB admin operations.

### 5. Onboarding Interceptor
- MUST check if a newly authenticated user has a corresponding `user_profiles` row.
- If no profile exists, MUST redirect to `/onboarding` before granting access to any protected route.
- The onboarding page MUST capture: Full Name (required), Company (optional), Phone (optional).
- On form submit, the profile MUST be created via a Server Action and the user redirected to `/dashboard`.
- An existing-profile user accessing `/onboarding` MUST be redirected to `/dashboard`.

## Scenarios

### Scenario: Unauthenticated Access
**Given** a user is not logged in
**When** they attempt to access `/dashboard`
**Then** they MUST be redirected to `/handler/sign-in`

### Scenario: Successful Login
**Given** a valid user with the role "SDR"
**When** they sign in via Stack Auth
**Then** they SHOULD be redirected to the Lead Dashboard
**And** they MUST only see active leads for processing.

### Scenario: First Time Login (Onboarding)
**Given** a user has just signed up via Stack Auth
**When** they try to access `/dashboard`
**Then** the system intercepts and redirects to `/onboarding`
**When** the user submits the onboarding form
**Then** their profile is created and they are redirected to `/dashboard`.

### Scenario: Returning User with Profile
**Given** a user with an existing profile logs in
**When** they try to access `/dashboard`
**Then** the system allows the request without interruption.
