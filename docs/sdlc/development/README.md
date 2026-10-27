# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### PLAN-V1 · approved · source: plan:v1

This is the approved version 1 delivery plan for RAG-chatbot-gemini-v7. It covers a RAG chatbot where users upload their own documents and ask questions about them. Answers come from gemini-2.5-flash and embeddings from gemini-embedding-001, with chat history and sessions. The plan spans 5 sprints and 6 epics.

- Plan status: approved, version 1.
- Stated stack and intent (from project description):
  - gemini-2.5-flash for answers.
  - gemini-embedding-001 for embeddings.
  - User-uploaded documents.
  - Chat history and sessions.
- Stack details named in plan items:
  - pgvector for chunk storage and ANN search.
  - S3 for original files.
  - SSE for token streaming.
  - SPA front end.
- Sprints: 5, each with capacity 20 (total capacity 100).
- Epics:
  - EPIC-001 Accounts and Private Access
  - EPIC-002 Document Library and Ingestion
  - EPIC-003 Chat Sessions and Document Attachment
  - EPIC-004 Grounded Question Answering with Citations
  - EPIC-005 Dashboard and Responsive Web Experience
  - EPIC-006 Deployment Configuration and Setup Documentation
- Story points by epic (computed from item points):
  - EPIC-001: 13
  - EPIC-002: 28
  - EPIC-003: 15
  - EPIC-004: 30
  - EPIC-005: 6
  - EPIC-006: 5
  - Total: 97 of 100 capacity.
- Agent roles in use: backend-agent, integration-agent, security-agent, frontend-agent, qa-agent, devops-agent.

**Related:** SPRINT-1, SPRINT-2, SPRINT-3, SPRINT-4, SPRINT-5, EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006

- ⚠ No approval date or approver is recorded for plan v1.
- ⚠ The plan does not explicitly assign stories to sprints. Sprint membership in the SPRINT-* entries is inferred from sprint goal wording.
- ⚠ All epics have role '(unassigned)' and points 'None'.
- ⚠ All sub-tasks (US-007-T*, US-015-T*, US-019-T*) have points 'None'. Their effort is presumably counted in the parent story, but this is not stated.

### SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 covers configuration, sign-up/login/logout, password change, and validated upload of original files to S3. Capacity is 20.

- Goal (verbatim): Configuration, sign-up/login/logout, password change, and validated upload of originals to S3.
- Capacity: 20.
- Stories matching the goal wording (inferred):
  - US-024 Configure models and storage through environment variables (3)
  - US-001 Sign up with email and password (3)
  - US-002 Log in and log out (5)
  - US-003 Change my password while signed in (2)
  - US-005 Upload a document to my library (5)
  - US-006 Reject unsupported or oversized files (2)
- Inferred load: 20 / 20.

**Related:** US-024, US-001, US-002, US-003, US-005, US-006

- ⚠ Story-to-sprint assignment is inferred, not stated in the plan.
- ⚠ No sprint dates and no completion or progress records.

### SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 covers the synchronous extract-chunk-embed pipeline into pgvector, ready/failed document status with retry, the library view, and chat creation. Capacity is 20.

- Goal (verbatim): Synchronous extract-chunk-embed pipeline into pgvector, ready/failed status with retry, library view, chat creation.
- Capacity: 20.
- Stories matching the goal wording (inferred):
  - US-007 Extract, chunk and embed on upload (8), with tasks US-007-T1 to T4
  - US-008 See whether a document is ready or failed (5)
  - US-009 Browse my document library (3)
  - US-011 Create and name a chat session (3)
- Inferred load: 19 / 20.

**Related:** US-007, US-008, US-009, US-011

- ⚠ Story-to-sprint assignment is inferred, not stated in the plan.
- ⚠ The 'retry' behaviour appears in the sprint goal but is not described in any story title. Its scope is undefined in the input.
- ⚠ No sprint dates and no completion or progress records.

### SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers attaching documents to chats, chat-scoped retrieval with grounded answers, persisted chat history, and chat deletion. Capacity is 20.

- Goal (verbatim): Attach documents to chats, chat-scoped retrieval with grounded answers, persisted chat history, chat deletion.
- Capacity: 20.
- Stories matching the goal wording (inferred):
  - US-012 Attach and detach library documents for a chat (5)
  - US-015 Ask a question and get an answer from my attached documents (8), with tasks US-015-T1 to T4
  - US-013 Return to a chat and read its full history (5)
  - US-014 Delete a chat (2)
- Inferred load: 20 / 20.

**Related:** US-012, US-015, US-013, US-014

- ⚠ Story-to-sprint assignment is inferred, not stated in the plan.
- ⚠ No sprint dates and no completion or progress records.

### SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 covers citations, honest 'not in your documents' replies, token streaming over SSE, and per-user isolation hardening. Capacity is 20.

- Goal (verbatim): Citations, honest 'not in your documents' replies, token streaming over SSE, and per-user isolation hardening.
- Capacity: 20.
- Stories matching the goal wording (inferred):
  - US-016 See citations for every answer (5)
  - US-017 Be told plainly when the documents do not contain the answer (3)
  - US-019 Watch the answer stream in (8), with tasks US-019-T1 to T3
  - US-004 Keep each user's data private (3)
- Inferred load: 19 / 20.

**Related:** US-016, US-017, US-019, US-004

- ⚠ Story-to-sprint assignment is inferred, not stated in the plan.
- ⚠ Per-user isolation (US-004) is scheduled as 'hardening' in Sprint 4, while user data (accounts, uploads, chats) exists from Sprint 1. The input does not say what isolation is in place before Sprint 4.
- ⚠ No sprint dates and no completion or progress records.

### SPRINT-5 · approved · source: plan:Sprint 5

Sprint 5 covers document deletion, follow-up question context, failure handling, the dashboard, mobile layout, and the setup README. Capacity is 20.

- Goal (verbatim): Document deletion, follow-up context, failure handling, dashboard, mobile layout and setup README.
- Capacity: 20.
- Stories matching the goal wording (inferred):
  - US-010 Delete a document and its embeddings (5)
  - US-018 Ask follow-up questions in context (3)
  - US-020 Handle chats with no usable documents and model failures (3)
  - US-021 See my library and chats on one dashboard (3)
  - US-022 Use the app comfortably on a phone (3)
  - US-023 Follow a short README to run the app (2)
- Inferred load: 19 / 20.

**Related:** US-010, US-018, US-020, US-021, US-022, US-023

- ⚠ Story-to-sprint assignment is inferred, not stated in the plan.
- ⚠ No sprint dates and no completion or progress records.

### EPIC-001 · approved · source: plan:EPIC-001

Accounts and Private Access: email/password sign-up, login/logout, password change, and per-user data privacy. 13 story points in total.

- Epic owner role: (unassigned). Epic points: None.
- US-001 Sign up with email and password: 3 pts, backend-agent.
- US-002 Log in and log out: 5 pts, backend-agent.
- US-003 Change my password while signed in: 2 pts, backend-agent.
- US-004 Keep each user's data private: 3 pts, security-agent.

**Related:** US-001, US-002, US-003, US-004

- ⚠ No implementation details are recorded, such as auth mechanism, session/token approach, or password hashing.
- ⚠ No development status for any story.

### EPIC-002 · approved · source: plan:EPIC-002

Document Library and Ingestion: upload to S3 with validation, synchronous extraction/chunking/embedding into pgvector, ready/failed status, library browsing, and document deletion. 28 story points in total.

- Epic owner role: (unassigned). Epic points: None.
- US-005 Upload a document to my library: 5 pts, integration-agent.
- US-006 Reject unsupported or oversized files: 2 pts, backend-agent.
- US-007 Extract, chunk and embed on upload: 8 pts, backend-agent.
  - US-007-T1 Add document_chunks migration with pgvector column and ANN index (backend-agent)
  - US-007-T2 Implement text extraction and overlapping chunker (backend-agent)
  - US-007-T3 Wire batched gemini-embedding-001 calls and transactional chunk writes (integration-agent)
  - US-007-T4 Add ingestion pipeline test suite (qa-agent)
- US-008 See whether a document is ready or failed: 5 pts, backend-agent.
- US-009 Browse my document library: 3 pts, frontend-agent.
- US-010 Delete a document and its embeddings: 5 pts, backend-agent.

**Related:** US-005, US-006, US-007, US-008, US-009, US-010

- ⚠ Supported file types and the maximum file size for US-006 are not specified in the input.
- ⚠ Chunk size and overlap, ANN index type, embedding dimensionality, and batch size are not specified.
- ⚠ No development status for any story or task.

### EPIC-003 · approved · source: plan:EPIC-003

Chat Sessions and Document Attachment: create and name chats, attach/detach library documents per chat, view persisted history, and delete chats. 15 story points in total.

- Epic owner role: (unassigned). Epic points: None.
- US-011 Create and name a chat session: 3 pts, backend-agent.
- US-012 Attach and detach library documents for a chat: 5 pts, backend-agent.
- US-013 Return to a chat and read its full history: 5 pts, backend-agent.
- US-014 Delete a chat: 2 pts, backend-agent.

**Related:** US-011, US-012, US-013, US-014

- ⚠ The input does not say whether deleting a chat (US-014) or detaching documents (US-012) affects library documents or embeddings.
- ⚠ No development status for any story.

### EPIC-004 · approved · source: plan:EPIC-004

Grounded Question Answering with Citations: chat-scoped top-k retrieval, grounded gemini-2.5-flash answers, citations, honest no-answer replies, follow-up context, SSE streaming, and failure handling. 30 story points in total, the largest epic.

- Epic owner role: (unassigned). Epic points: None.
- US-015 Ask a question and get an answer from my attached documents: 8 pts, backend-agent.
  - US-015-T1 Implement chat-scoped top-k pgvector retrieval (backend-agent)
  - US-015-T2 Implement grounded prompt assembly and Gemini 2.5 Flash call (integration-agent)
  - US-015-T3 Build chat composer and assistant message view (frontend-agent)
  - US-015-T4 Add retrieval scoping test suite (qa-agent)
- US-016 See citations for every answer: 5 pts, backend-agent.
- US-017 Be told plainly when the documents do not contain the answer: 3 pts, backend-agent.
- US-018 Ask follow-up questions in context: 3 pts, backend-agent.
- US-019 Watch the answer stream in: 8 pts, integration-agent.
  - US-019-T1 Implement SSE streaming of Gemini tokens (backend-agent)
  - US-019-T2 Persist assistant message only on completion and mark interrupted turns failed (backend-agent)
  - US-019-T3 Build streaming message consumer in the SPA (frontend-agent)
- US-020 Handle chats with no usable documents and model failures: 3 pts, backend-agent.

**Related:** US-015, US-016, US-017, US-018, US-019, US-020

- ⚠ The top-k value, similarity threshold for 'not in your documents', citation format, and follow-up context window size are not specified.
- ⚠ US-019 is owned by integration-agent, but all of its tasks are assigned to backend-agent or frontend-agent. Confirm the intended ownership.
- ⚠ No development status for any story or task.

### EPIC-005 · approved · source: plan:EPIC-005

Dashboard and Responsive Web Experience: a single dashboard of library and chats, and a phone-friendly layout. 6 story points in total.

- Epic owner role: (unassigned). Epic points: None.
- US-021 See my library and chats on one dashboard: 3 pts, frontend-agent.
- US-022 Use the app comfortably on a phone: 3 pts, frontend-agent.

**Related:** US-021, US-022

- ⚠ Target breakpoints and devices for mobile layout are not specified.
- ⚠ No development status for either story.

### EPIC-006 · approved · source: plan:EPIC-006

Deployment Configuration and Setup Documentation: environment-variable configuration of models and storage, and a short setup README. 5 story points in total.

- Epic owner role: (unassigned). Epic points: None.
- US-023 Follow a short README to run the app: 2 pts, devops-agent.
- US-024 Configure models and storage through environment variables: 3 pts, devops-agent.

**Related:** US-023, US-024

- ⚠ The list of environment variables (e.g. Gemini API key, model names, S3 bucket/credentials, database URL) is not given in the input.
- ⚠ No development status for either story.

### DEV-PROGRESS · draft

No development execution has been recorded. The input contains only the approved plan, with no ticket updates, commits, PRs, or completion evidence.

- Recorded: plan v1 (approved), sprint goals and capacities, and story points and roles.
- Not recorded: sprint start/end dates, story or task status, merged code, code review outcomes, test results, or a velocity/burndown.
- The end-user guide is deferred because no application functionality is confirmed as built.

**Related:** PLAN-V1

- ⚠ Development has no recorded progress for any of US-001 to US-024 or their tasks.
- ⚠ The user guide cannot be written until development completion of user-facing features is recorded.
- ⚠ No App Design screen list (SCR-* keys) was provided, so future user guide entries have no screen keys to map to.
<!-- sdlc:auto:end narrative -->
