# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Configuration and accounts: fail-fast env config, sign-up, login/logout, password change and per-user access control

Capacity: 20 points · Committed: 17

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign up with email and password | 5 | backend-agent | US-024 |
| US-002 | Story | Log in and log out | 5 | backend-agent | US-001 |
| US-003 | Story | Change my password while signed in | 2 | backend-agent | US-002 |
| US-004 | Story | Keep each user's data private | 3 | security-agent | US-002 |
| US-024 | Story | Configure models and storage through environment variables | 2 | devops-agent | — |

## Sprint 2: Sprint 2

Document upload to S3 with validation, synchronous extract/chunk/embed into pgvector, and ready/failed status with retry

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-005 | Story | Upload a document to my library | 5 | backend-agent | US-004, US-024 |
| US-006 | Story | Reject unsupported or oversized files | 2 | backend-agent | US-005 |
| US-007 | Story | Extract, chunk and embed on upload | 8 | backend-agent | US-005 |
| ↳ US-007-T1 | Task | Add document_chunks migration with pgvector | — | backend-agent | — |
| ↳ US-007-T2 | Task | Implement text extraction and chunker | — | backend-agent | — |
| ↳ US-007-T3 | Task | Wire gemini-embedding-001 indexing and persistence | — | backend-agent | — |
| ↳ US-007-T4 | Task | Add ingestion pipeline test suite | — | qa-agent | — |
| US-008 | Story | See whether a document is ready or failed | 3 | backend-agent | US-007 |

## Sprint 3: Sprint 3

Chat sessions, per-chat document attachment, library browsing, chat deletion and the dashboard

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-009 | Story | Browse my document library | 3 | frontend-agent | US-008, US-012 |
| US-011 | Story | Create and name a chat session | 3 | backend-agent | US-004 |
| US-012 | Story | Attach and detach library documents for a chat | 5 | backend-agent | US-011, US-008 |
| US-014 | Story | Delete a chat | 2 | backend-agent | US-012 |
| US-021 | Story | See my library and chats on one dashboard | 5 | frontend-agent | US-009, US-011 |

## Sprint 4: Sprint 4

Grounded question answering scoped to attached documents, with persisted citations, an honest 'not in your documents' reply and saved history

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-013 | Story | Return to a chat and read its full history | 3 | backend-agent | US-016 |
| US-015 | Story | Ask a question and get an answer from my attached documents | 8 | backend-agent | US-012, US-007 |
| ↳ US-015-T1 | Task | Implement chat-scoped pgvector retrieval | — | backend-agent | — |
| ↳ US-015-T2 | Task | Implement grounded answer generation | — | backend-agent | — |
| ↳ US-015-T3 | Task | Build chat message pane and input | — | frontend-agent | — |
| ↳ US-015-T4 | Task | Add retrieval isolation tests | — | qa-agent | — |
| US-016 | Story | See citations for every answer | 5 | backend-agent | US-015 |
| US-017 | Story | Be told plainly when the documents do not contain the answer | 3 | backend-agent | US-015 |

## Sprint 5: Sprint 5

Streaming answers, follow-up context, failure and retry handling, document deletion and the responsive mobile layout

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-010 | Story | Delete a document and its embeddings | 5 | backend-agent | US-008, US-012, US-016 |
| US-018 | Story | Ask follow-up questions in context | 3 | backend-agent | US-015, US-013 |
| US-019 | Story | Watch the answer stream in | 5 | integration-agent | US-015, US-013 |
| US-020 | Story | Handle chats with no usable documents and model failures | 3 | backend-agent | US-015 |
| US-022 | Story | Use the app comfortably on a phone | 3 | frontend-agent | US-021, US-016 |

## Sprint 6: Sprint 6

Setup README verified end to end from a clean checkout

Capacity: 20 points · Committed: 2

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-023 | Story | Follow a short README to run the app | 2 | devops-agent | US-024, US-019, US-010 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
