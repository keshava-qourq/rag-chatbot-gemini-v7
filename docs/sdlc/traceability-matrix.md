# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Sign up with email and password | US-001 | 1 | POST /api/auth/signup, api, auth_service, db, user_sessions, users, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-002 | EPIC-001 | Log in and log out | US-002 | 1 | GET /api/auth/me, POST /api/auth/login, POST /api/auth/logout, api, auth_service, db, user_sessions, users, web_spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-003 | EPIC-001 | Change my password while signed in | US-003 | 1 | POST /api/auth/change-password, auth_service, users, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-004 | EPIC-001 | Keep each user's data private | US-004 | 1 | api, auth_service, chats, db, document_chunks, documents, messages, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-005 | EPIC-002 | Upload a document to my library | US-005 | 2 | POST /api/documents, api, db, documents, ingestion_service, object_store, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-006 | EPIC-002 | Reject unsupported or oversized files | US-006 | 2 | POST /api/documents, documents, ingestion_service, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-007 | EPIC-002 | Extract, chunk and embed on upload | US-007, US-007-T1, US-007-T2, US-007-T3, US-007-T4 | 2 | POST /api/documents, db, document_chunks, documents, gemini, ingestion_service | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-008 | EPIC-002 | See whether a document is ready or failed | US-008 | 2 | GET /api/documents, POST /api/documents/{id}/retry, document_chunks, documents, ingestion_service, object_store, web_spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-009 | EPIC-002 | Browse my document library | US-009 | 3 | GET /api/documents, api, chat_documents, chats, documents, web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-010 | EPIC-002 | Delete a document and its embeddings | US-010 | 5 | DELETE /api/documents/{id}, chat_documents, db, document_chunks, documents, ingestion_service, message_citations, object_store, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-011 | EPIC-003 | Create and name a chat session | US-011 | 3 | GET /api/chats/{id}, PATCH /api/chats/{id}, POST /api/chats, api, chat_service, chats, db, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-012 | EPIC-003 | Attach and detach library documents for a chat | US-012 | 3 | DELETE /api/chats/{id}/documents/{document_id}, PUT /api/chats/{id}/documents/{document_id}, api, chat_documents, chat_service, chats, db, documents, web_spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-013 | EPIC-003 | Return to a chat and read its full history | US-013 | 4 | GET /api/chats, GET /api/chats/{id}/messages, chat_service, chats, message_citations, messages, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-014 | EPIC-003 | Delete a chat | US-014 | 3 | DELETE /api/chats/{id}, chat_documents, chat_service, chats, messages, web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-015 | EPIC-004 | Ask a question and get an answer from my attached documents | US-015, US-015-T1, US-015-T2, US-015-T3, US-015-T4 | 4 | POST /api/chats/{id}/messages, chat_documents, chat_service, db, document_chunks, documents, gemini, messages, web_spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-016 | EPIC-004 | See citations for every answer | US-016 | 4 | GET /api/chats/{id}/messages, GET /api/documents/{id}/file-url, chat_service, document_chunks, message_citations, messages, object_store, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-017 | EPIC-004 | Be told plainly when the documents do not contain the answer | US-017 | 4 | POST /api/chats/{id}/messages, chat_service, gemini, messages | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-018 | EPIC-004 | Ask follow-up questions in context | US-018 | 5 | POST /api/chats/{id}/messages, chat_service, gemini, messages | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-019 | EPIC-004 | Watch the answer stream in | US-019 | 5 | POST /api/chats/{id}/messages, chat_service, gemini, messages, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-020 | EPIC-004 | Handle chats with no usable documents and model failures | US-020 | 5 | POST /api/chats/{id}/messages/{message_id}/retry, chat_service, messages, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-021 | EPIC-005 | See my library and chats on one dashboard | US-021 | 3 | GET /api/auth/me, GET /api/chats, GET /api/documents, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-022 | EPIC-005 | Use the app comfortably on a phone | US-022 | 5 | web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-023 | EPIC-006 | Follow a short README to run the app | US-023 | 6 | db, object_store | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-024 | EPIC-006 | Configure models and storage through environment variables | US-024 | 1 | GET /api/health, api, db, gemini, object_store | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
<!-- sdlc:auto:end matrix -->
