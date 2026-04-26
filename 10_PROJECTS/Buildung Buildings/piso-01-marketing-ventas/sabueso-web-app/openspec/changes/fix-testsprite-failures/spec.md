# Spec: fix-testsprite-failures

## 1. Authentication Bypass (Test Environment)

### Scenario: Test Agent Logs In via Bypass
- **GIVEN** the application is running in a test environment.
- **AND** the environment variable `NEXT_PUBLIC_TEST_BYPASS_TOKEN` is set.
- **WHEN** a request is made with the valid token.
- **THEN** the application MUST establish a valid session for the test user.
- **AND** the application MUST NOT show the Stack Auth Dev Tools panel to the agent.

## 2. Outreach Validation & Feedback

### Scenario: Empty Subject/Message Error
- **GIVEN** the lead detail view is open.
- **WHEN** the user attempts to send an outreach with an empty subject or message.
- **THEN** an error message MUST appear with ID `outreach-error-msg`.
- **AND** the error message MUST contain "ERROR: El [campo] no puede estar vacío".

### Scenario: Successful Send Confirmation
- **GIVEN** the lead detail view is open and a valid draft is prepared.
- **WHEN** the user clicks the "DISPARAR_ATAQUE_" button.
- **THEN** a success container with ID `outreach-success-container` MUST appear.
- **AND** the header with ID `outreach-success-msg` MUST contain "ATAQUE_EXITOSO_".
- **AND** a token with ID `confirmation-token` MUST be displayed containing "MAIL_SENT_SUCCESSFULLY".

## 3. Data Integrity & Sync

### Scenario: UI Reflects AI Processing Result
- **GIVEN** a lead with status "PENDING".
- **WHEN** the AI processing is triggered and completes successfully.
- **THEN** the page MUST automatically reflect the new status and AI classification without manual refresh.
