# Tasks: fix-testsprite-failures

## 1. Infrastructure (Auth Bypass)
- [ ] 1.1 Create `lib/actions/test-auth.ts` with `bypassAuthAction`.
- [ ] 1.2 Create `app/api/test/auth-bypass/route.ts` to handle the bypass request.
- [ ] 1.3 Update `middleware.ts` to allow access to the bypass route without authentication.
- [ ] 1.4 Add `TEST_BYPASS_TOKEN` to `.env.local` (manually for local testing).

## 2. UI Refinement (OutreachAction)
- [ ] 2.1 Update `components/OutreachAction.tsx` to include `MAIL_SENT_SUCCESSFULLY` in the success token.
- [ ] 2.2 Verify and fix all unique IDs for subject, body, and send buttons.
- [ ] 2.3 Implement enhanced error messages for empty fields with explicit IDs.

## 3. Data Sync & Verification
- [ ] 3.1 Update `app/dashboard/lead/[id]/page.tsx` to use a dynamic key for the container.
- [ ] 3.2 Perform manual verification of the Cyber-Brutalist theme consistency.
- [ ] 3.3 Prepare the environment for TestSprite relaunch (Port 3001).
