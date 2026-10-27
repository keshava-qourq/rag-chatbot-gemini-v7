# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Configuration, sign-up/login/logout, password change, and validated upload of originals to S3

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign up with email and password | 3 | backend-agent | US-024 |
| US-002 | Story | Log in and log out | 5 | backend-agent | US-001 |
| US-003 | Story | Change my password while signed in | 2 | backend-agent | US-002 |
| US-005 | Story | Upload a document to my library | 5 | integration-agent | US-002, US-024 |
| US-006 | Story | Reject unsupported or oversized files | 2 | backend-agent | US-005 |
| US-024 | Story | Configure models and storage through environment variables | 3 | devops-agent | — |

## Sprint 2: Sprint 2

Synchronous extract-chunk-embed pipeline into pgvector, ready/failed status with retry, library view, chat creation

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-007 | Story | Extract, chunk and embed on upload | 8 | backend-agent | US-005 |
| ↳ US-007-T1 | Task | Add document_chunks migration with pgvector column and ANN index | — | backend-agent | — |
| ↳ US-007-T2 | Task | Implement text extraction and overlapping chunker | — | backend-agent | — |
| ↳ US-007-T3 | Task | Wire batched gemini-embedding-001 calls and transactional chunk writes | — | integration-agent | — |
| ↳ US-007-T4 | Task | Add ingestion pipeline test suite | — | qa-agent | — |
| US-008 | Story | See whether a document is ready or failed | 5 | backend-agent | US-007 |
| US-009 | Story | Browse my document library | 3 | frontend-agent | US-005, US-008 |
| US-011 | Story | Create and name a chat session | 3 | backend-agent | US-002 |

## Sprint 3: Sprint 3

Attach documents to chats, chat-scoped retrieval with grounded answers, persisted chat history, chat deletion

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-012 | Story | Attach and detach library documents for a chat | 5 | backend-agent | US-011, US-008 |
| US-013 | Story | Return to a chat and read its full history | 5 | backend-agent | US-011, US-015 |
| US-014 | Story | Delete a chat | 2 | backend-agent | US-011 |
| US-015 | Story | Ask a question and get an answer from my attached documents | 8 | backend-agent | US-012, US-007 |
| ↳ US-015-T1 | Task | Implement chat-scoped top-k pgvector retrieval | — | backend-agent | — |
| ↳ US-015-T2 | Task | Implement grounded prompt assembly and Gemini 2.5 Flash call | — | integration-agent | — |
| ↳ US-015-T3 | Task | Build chat composer and assistant message view | — | frontend-agent | — |
| ↳ US-015-T4 | Task | Add retrieval scoping test suite | — | qa-agent | — |

## Sprint 4: Sprint 4

Citations, honest 'not in your documents' replies, token streaming over SSE, and per-user isolation hardening

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-004 | Story | Keep each user's data private | 3 | security-agent | US-009, US-013, US-015 |
| US-016 | Story | See citations for every answer | 5 | backend-agent | US-015 |
| US-017 | Story | Be told plainly when the documents do not contain the answer | 3 | backend-agent | US-015 |
| US-019 | Story | Watch the answer stream in | 8 | integration-agent | US-015, US-013 |
| ↳ US-019-T1 | Task | Implement SSE streaming of Gemini tokens | — | backend-agent | — |
| ↳ US-019-T2 | Task | Persist assistant message only on completion and mark interrupted turns failed | — | backend-agent | — |
| ↳ US-019-T3 | Task | Build streaming message consumer in the SPA | — | frontend-agent | — |

## Sprint 5: Sprint 5

Document deletion, follow-up context, failure handling, dashboard, mobile layout and setup README

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-010 | Story | Delete a document and its embeddings | 5 | backend-agent | US-012, US-016 |
| US-018 | Story | Ask follow-up questions in context | 3 | backend-agent | US-015 |
| US-020 | Story | Handle chats with no usable documents and model failures | 3 | backend-agent | US-015, US-019 |
| US-021 | Story | See my library and chats on one dashboard | 3 | frontend-agent | US-009, US-013 |
| US-022 | Story | Use the app comfortably on a phone | 3 | frontend-agent | US-021, US-019 |
| US-023 | Story | Follow a short README to run the app | 2 | devops-agent | US-024, US-015 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
