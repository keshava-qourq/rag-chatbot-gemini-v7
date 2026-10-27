# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V0 · draft · source: plan:preview-v0

This is the development plan for RAG-chatbot-gemini-v7, still in preview at version 0. It has 5 sprints, each with a capacity of 20 points, and 6 epics containing 24 stories worth 97 points in total. The plan has not been approved, and no implementation work is recorded.

Project goal (from project description):
- RAG chatbot where users upload their own documents and ask questions about them.
- Answers come from gemini-2.5-flash.
- Embeddings come from gemini-embedding-001.
- Chat history and sessions are kept.

Plan status:
- Status: preview.
- Version: 0.

Capacity:
- 5 sprints x 20 points = 100 points of capacity.
- Stories total 97 points.

Technology named in plan item titles and goals:
- S3 for storing original uploaded files.
- pgvector for chunk embeddings, with an ANN index.
- Server-Sent Events (SSE) for token streaming.
- An SPA frontend.
- Environment-variable configuration of models and storage.

Agent roles assigned across items:
- backend-agent
- integration-agent
- security-agent
- frontend-agent
- qa-agent
- devops-agent
- Epics are unassigned.

**Related:** SPRINT-1, SPRINT-2, SPRINT-3, SPRINT-4, SPRINT-5, EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006

- ⚠ The plan is in 'preview' status. No approval, approver or approval date is recorded.
- ⚠ No development activity is recorded: no completed tickets, commits, PRs, sprint dates or sprint outcomes.
- ⚠ Stories are not explicitly assigned to sprints. The mapping in the sprint entries is inferred from goal wording.
- ⚠ No sprint start or end dates are given.

### DEV-STATUS · draft

The input contains no implementation progress. It is unknown whether any story has started, been completed or been merged.

- The development input contains only the plan.
- There are no ticket statuses, code references, test results or demo notes.
- The application cannot yet be documented as built.
- For that reason, no end-user guide is written for this phase.

**Related:** DEV-PLAN-V0

- ⚠ Development has not reported any completed work, so the application is not documented as built.
- ⚠ No user guide can be written until implemented screens and features are reported. No App Design screen keys (e.g. SCR-xxx) were provided either.

### SPRINT-1 · draft · source: plan:Sprint 1

Sprint 1 sets up configuration, account basics (sign-up, login, logout, password change) and validated uploads of original files to S3. Capacity is 20 points.

Goal: Configuration, sign-up/login/logout, password change, and validated upload of originals to S3.

Capacity: 20.

Stories inferred from the goal (20 points total):
- US-024 Configure models and storage through environment variables (3)
- US-001 Sign up with email and password (3)
- US-002 Log in and log out (5)
- US-003 Change my password while signed in (2)
- US-005 Upload a document to my library (5)
- US-006 Reject unsupported or oversized files (2)

**Related:** US-024, US-001, US-002, US-003, US-005, US-006

- ⚠ The story-to-sprint mapping is inferred, not stated in the input.
- ⚠ The input does not define which file types are supported or the maximum file size (US-006).

### SPRINT-2 · draft · source: plan:Sprint 2

Sprint 2 builds the synchronous extract, chunk and embed pipeline into pgvector. It also covers ready/failed document status with retry, the library view and chat creation.

Goal: Synchronous extract-chunk-embed pipeline into pgvector, ready/failed status with retry, library view, chat creation.

Capacity: 20.

Stories inferred from the goal (19 points total):
- US-007 Extract, chunk and embed on upload (8)
- US-008 See whether a document is ready or failed (5)
- US-009 Browse my document library (3)
- US-011 Create and name a chat session (3)

**Related:** US-007, US-008, US-009, US-011

- ⚠ The story-to-sprint mapping is inferred, not stated in the input.
- ⚠ Retry behaviour for failed documents is not specified (manual or automatic, and the retry limit).

### SPRINT-3 · draft · source: plan:Sprint 3

Sprint 3 delivers attaching documents to chats, chat-scoped retrieval with grounded answers, persisted chat history and chat deletion.

Goal: Attach documents to chats, chat-scoped retrieval with grounded answers, persisted chat history, chat deletion.

Capacity: 20.

Stories inferred from the goal (20 points total):
- US-012 Attach and detach library documents for a chat (5)
- US-015 Ask a question and get an answer from my attached documents (8)
- US-013 Return to a chat and read its full history (5)
- US-014 Delete a chat (2)

**Related:** US-012, US-015, US-013, US-014

- ⚠ The story-to-sprint mapping is inferred, not stated in the input.

### SPRINT-4 · draft · source: plan:Sprint 4

Sprint 4 adds citations, honest 'not in your documents' replies, token streaming over SSE and hardening of per-user data isolation.

Goal: Citations, honest 'not in your documents' replies, token streaming over SSE, and per-user isolation hardening.

Capacity: 20.

Stories inferred from the goal (19 points total):
- US-016 See citations for every answer (5)
- US-017 Be told plainly when the documents do not contain the answer (3)
- US-019 Watch the answer stream in (8)
- US-004 Keep each user's data private (3)

**Related:** US-016, US-017, US-019, US-004

- ⚠ The story-to-sprint mapping is inferred, not stated in the input.
- ⚠ US-004 (privacy and isolation) appears scheduled for Sprint 4 as 'hardening'. The input does not say whether baseline per-user isolation is enforced from Sprint 1, when user documents first arrive. This needs confirmation.

### SPRINT-5 · draft · source: plan:Sprint 5

Sprint 5 covers document deletion, follow-up context, failure handling, the dashboard, mobile layout and a setup README.

Goal: Document deletion, follow-up context, failure handling, dashboard, mobile layout and setup README.

Capacity: 20.

Stories inferred from the goal (19 points total):
- US-010 Delete a document and its embeddings (5)
- US-018 Ask follow-up questions in context (3)
- US-020 Handle chats with no usable documents and model failures (3)
- US-021 See my library and chats on one dashboard (3)
- US-022 Use the app comfortably on a phone (3)
- US-023 Follow a short README to run the app (2)

**Related:** US-010, US-018, US-020, US-021, US-022, US-023

- ⚠ The story-to-sprint mapping is inferred, not stated in the input.
- ⚠ Document deletion (US-010) lands after attachment (Sprint 3). The input does not say how deleting a document affects chats it is attached to or their past citations.

### EPIC-001 · draft · source: plan:EPIC-001

Accounts and Private Access: email/password sign-up, login and logout, password change, and per-user data privacy. Contains 13 points across 4 stories.

Stories:
- US-001 Sign up with email and password: 3 points, backend-agent
- US-002 Log in and log out: 5 points, backend-agent
- US-003 Change my password while signed in: 2 points, backend-agent
- US-004 Keep each user's data private: 3 points, security-agent

The epic owner is unassigned.

**Related:** US-001, US-002, US-003, US-004

- ⚠ The epic has no assigned owner.
- ⚠ No implementation status is recorded for any story.

### EPIC-002 · draft · source: plan:EPIC-002

Document Library and Ingestion: uploading, validating, extracting, chunking and embedding documents, plus status display, browsing and deletion. Contains 28 points across 6 stories.

Stories:
- US-005 Upload a document to my library: 5 points, integration-agent
- US-006 Reject unsupported or oversized files: 2 points, backend-agent
- US-007 Extract, chunk and embed on upload: 8 points, backend-agent (tasks T1 to T4)
- US-008 See whether a document is ready or failed: 5 points, backend-agent
- US-009 Browse my document library: 3 points, frontend-agent
- US-010 Delete a document and its embeddings: 5 points, backend-agent

The epic owner is unassigned.

**Related:** US-005, US-006, US-007, US-008, US-009, US-010, DEV-TASKS-US-007

- ⚠ The epic has no assigned owner.
- ⚠ No implementation status is recorded for any story.

### DEV-TASKS-US-007 · draft · source: plan:US-007

This is the task breakdown for the ingestion pipeline (US-007). It covers the pgvector schema, extraction and chunking, batched Gemini embeddings and tests.

Tasks:
- US-007-T1: Add document_chunks migration with pgvector column and ANN index (backend-agent)
- US-007-T2: Implement text extraction and overlapping chunker (backend-agent)
- US-007-T3: Wire batched gemini-embedding-001 calls and transactional chunk writes (integration-agent)
- US-007-T4: Add ingestion pipeline test suite (qa-agent)

The pipeline is described as synchronous (Sprint 2 goal).

**Related:** US-007, US-007-T1, US-007-T2, US-007-T3, US-007-T4

- ⚠ Tasks have no point estimates.
- ⚠ The input does not specify chunk size, overlap, embedding dimension, ANN index type or batch size.

### EPIC-003 · draft · source: plan:EPIC-003

Chat Sessions and Document Attachment: creating and naming chats, attaching and detaching documents, viewing persisted history, and deleting chats. Contains 15 points across 4 stories.

Stories:
- US-011 Create and name a chat session: 3 points, backend-agent
- US-012 Attach and detach library documents for a chat: 5 points, backend-agent
- US-013 Return to a chat and read its full history: 5 points, backend-agent
- US-014 Delete a chat: 2 points, backend-agent

The epic owner is unassigned.

**Related:** US-011, US-012, US-013, US-014

- ⚠ The epic has no assigned owner.
- ⚠ No implementation status is recorded for any story.
- ⚠ No frontend role is assigned to the chat session stories, although they imply UI work.

### EPIC-004 · draft · source: plan:EPIC-004

Grounded Question Answering with Citations: chat-scoped retrieval, grounded gemini-2.5-flash answers, citations, honest 'not found' replies, follow-ups, streaming and failure handling. Contains 30 points across 6 stories.

Stories:
- US-015 Ask a question and get an answer from my attached documents: 8 points, backend-agent (tasks T1 to T4)
- US-016 See citations for every answer: 5 points, backend-agent
- US-017 Be told plainly when the documents do not contain the answer: 3 points, backend-agent
- US-018 Ask follow-up questions in context: 3 points, backend-agent
- US-019 Watch the answer stream in: 8 points, integration-agent (tasks T1 to T3)
- US-020 Handle chats with no usable documents and model failures: 3 points, backend-agent

The epic owner is unassigned.

**Related:** US-015, US-016, US-017, US-018, US-019, US-020, DEV-TASKS-US-015, DEV-TASKS-US-019

- ⚠ The epic has no assigned owner.
- ⚠ No implementation status is recorded for any story.
- ⚠ The input does not define the threshold or criterion for deciding that the answer is 'not in your documents' (US-017).

### DEV-TASKS-US-015 · draft · source: plan:US-015

This is the task breakdown for grounded question answering (US-015). It covers retrieval, prompt assembly with the Gemini call, the chat UI and scoping tests.

Tasks:
- US-015-T1: Implement chat-scoped top-k pgvector retrieval (backend-agent)
- US-015-T2: Implement grounded prompt assembly and Gemini 2.5 Flash call (integration-agent)
- US-015-T3: Build chat composer and assistant message view (frontend-agent)
- US-015-T4: Add retrieval scoping test suite (qa-agent)

**Related:** US-015, US-015-T1, US-015-T2, US-015-T3, US-015-T4

- ⚠ Tasks have no point estimates.
- ⚠ The input does not specify the value of top-k or the similarity metric.

### DEV-TASKS-US-019 · draft · source: plan:US-019

This is the task breakdown for streamed answers (US-019). It covers SSE token streaming, persisting a message only when it completes, marking interrupted turns as failed, and an SPA stream consumer.

Tasks:
- US-019-T1: Implement SSE streaming of Gemini tokens (backend-agent)
- US-019-T2: Persist assistant message only on completion and mark interrupted turns failed (backend-agent)
- US-019-T3: Build streaming message consumer in the SPA (frontend-agent)

The story role is integration-agent, while its tasks are assigned to backend-agent and frontend-agent.

**Related:** US-019, US-019-T1, US-019-T2, US-019-T3, US-013

- ⚠ Tasks have no point estimates.
- ⚠ The story owner (integration-agent) differs from every task owner. It is unclear who is accountable for integration.

### EPIC-005 · draft · source: plan:EPIC-005

Dashboard and Responsive Web Experience: one dashboard for the library and chats, and a mobile-friendly layout. Contains 6 points across 2 stories.

Stories:
- US-021 See my library and chats on one dashboard: 3 points, frontend-agent
- US-022 Use the app comfortably on a phone: 3 points, frontend-agent

The epic owner is unassigned.

**Related:** US-021, US-022

- ⚠ The epic has no assigned owner.
- ⚠ No implementation status is recorded for any story.
- ⚠ No target devices or breakpoints are specified for the mobile layout.

### EPIC-006 · draft · source: plan:EPIC-006

Deployment Configuration and Setup Documentation: a short setup README and environment-variable configuration of models and storage. Contains 5 points across 2 stories.

Stories:
- US-023 Follow a short README to run the app: 2 points, devops-agent
- US-024 Configure models and storage through environment variables: 3 points, devops-agent

The epic owner is unassigned.

**Related:** US-023, US-024

- ⚠ The epic has no assigned owner.
- ⚠ No implementation status is recorded for any story.
- ⚠ The input does not list the specific environment variables (e.g. model names, S3 bucket, database URL, API keys).
<!-- sdlc:auto:end narrative -->
