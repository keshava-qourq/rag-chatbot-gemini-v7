# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-STACK · approved · source: requirements:technology-stack

The product owner approved the technology stack: FastAPI 0.115, AWS, PostgreSQL 16 and React 19. Design must use exactly these, with no substitutions.

- **Backend: FastAPI 0.115**
  - The pipeline is Python end to end: pypdf extraction, chunking, and the google-genai SDK for gemini-embedding-001 and Gemini 2.5 Flash.
  - Async-native, so Gemini responses can be streamed to the browser over SSE.
  - Can hold seconds-long synchronous ingestion requests open without blocking other users.
  - Pydantic enforces the citation contract: an answer without source chunk references fails validation.
- **Cloud: AWS**
  - Four needs, each met by a managed service:
    - ECS Fargate (container for FastAPI)
    - CloudFront + S3 (static hosting for React)
    - RDS Postgres with the pgvector extension
    - S3 (original PDFs)
  - Managed Postgres matters most, because the vector store and user data share one database (backups and point-in-time recovery).
- **Database: PostgreSQL 16**
  - With pgvector, per-chat retrieval scoping is a single query joining chunks to the chat's attached documents.
  - Avoids drift between a separate vector DB and attachment state.
  - Also holds users, sessions, message history and the library/attachment many-to-many relationship.
  - Document deletion cascades its embeddings in the same transaction.
- **Frontend: React 19**
  - One screen archetype: chat pane with streaming tokens, a document tray with ready/failed status, and clickable citations.
  - Library ecosystem covers an in-browser PDF viewer for highlighting cited passages and markdown rendering for answers.

**Related:** NFR-003, NFR-005, NFR-028, NFR-029, EPIC-006

- ⚠ AWS hosting components (ECS Fargate, CloudFront + S3, RDS) are named only as rationale. No user story or NFR covers provisioning or deploying them; EPIC-006 covers local setup only.
- ⚠ The React rationale mentions an in-browser PDF viewer that highlights cited passages. The acceptance criteria (AC-050) require only displaying the passage text. See top-level gap on citation viewing.

### REQ-SERVICES · approved · source: requirements:services

The product owner approved three runtime services: Google Gemini (AI provider), pgvector in PostgreSQL (vector store) and Amazon S3 (file storage). The listed API keys are AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, GEMINI_API_KEY and S3_BUCKET.

- **Google Gemini** (SaaS, env GEMINI_API_KEY)
  - Gemini 2.5 Flash composes answers: streaming, system instruction, low temperature.
  - gemini-embedding-001 embeds both chunks and questions.
  - Indexing must use task_type RETRIEVAL_DOCUMENT and querying RETRIEVAL_QUERY, with the same model; otherwise similarity scores are subtly wrong.
- **pgvector in PostgreSQL** (known)
  - Embeddings live alongside the document and user rows, so scoping and isolation are enforced by SQL joins.
  - Deletion removes embeddings in the same transaction.
  - Store chunk text, page number and character offsets with each vector.
  - Set output_dimensionality to 1536 so the vector is indexable, OR use halfvec to keep the full 3072.
- **Amazon S3** (SaaS, env AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET)
  - The original PDF must outlive the ingesting request so citations can be verified.
  - Uses per-user key prefixes, private objects, and presigned GET URLs that the browser PDF viewer fetches directly.

**Related:** NFR-003, NFR-004, NFR-012, NFR-019, US-024

- ⚠ The embedding dimension is undecided: 1536 with an ANN index, or halfvec(3072).
- ⚠ The 'API keys this app needs' list omits the database connection string and session secret. AC-070, NFR-009 and NFR-028 require both.

### REQ-SCOPE · draft · source: requirements:scope

Delivery scope is lightweight, Requirements version 1. The input lists capabilities in scope and explicit exclusions.

**Out of scope:**
- Team/organisation shared libraries and shared chats
- OCR for scanned/image PDFs
- Office formats (.docx, .pptx, .xlsx)
- URL/web page ingestion
- Falling back to the model's general world knowledge
- Queued/distributed ingestion
- Per-user storage quotas and cost-control dashboards
- Email (SendGrid removed from the stack)

**In scope:**
- Accounts and access:
  - Email/password sign-up and login
  - Sign-up without email verification
  - Change password while signed in
  - No email-based password reset
  - Private per-user accounts
- Documents:
  - Personal document library
  - PDF/.txt/.md upload with size and type checks
  - Direct text extraction, chunking and embedding on upload
  - Immediate processing with no background queue
  - Ready/failed status
  - S3 storage
  - Deleting documents removes their embeddings
- Chats:
  - Multiple named chat sessions
  - Attach library documents to a chat
  - Answers from attached documents only
  - Citations to source document and page or chunk
  - Plain 'not in your documents' reply
  - Follow-up questions using earlier turns
  - Streaming answers
  - Persisted chat history
  - Delete chats
- Experience: library and chats dashboard; responsive browser layout
- Models and search: Gemini 2.5 Flash, gemini-embedding-001, pgvector passage search
- Docs: short README with setup and environment variables

**Related:** NFR-006, NFR-007, NFR-014, NFR-015, NFR-027

- ⚠ The input does not state an approval status or approver for the stories and NFRs, only for the stack and services. Stories are recorded as draft.

### EPIC-001 · draft · source: requirements:EPIC-001

Accounts and Private Access: email and password accounts with sign-up, login, logout and in-app password change. Every user's documents and chats are private to that account.

**Stated assumptions:**
- Email + password only; no social/SSO login.
- No email verification on sign-up.
- No email-based password reset, because SendGrid was removed.
- A signed-in user can change their own password.
- No admin console, billing or subscription tiers.

**Related:** US-001, US-002, US-003, US-004

- ⚠ No story covers account deletion, so a user cannot remove their account and all of its data.

### US-001 · draft · source: requirements:US-001

[critical] Sign up with email and password. A new visitor creates an account, is signed in immediately and lands on the dashboard.

- **AC-001:** A valid email and a password of at least 8 characters, for an email with no existing account:
  - The account is created and the password is stored only as a salted hash.
  - The user is signed in immediately with no verification step and lands on the dashboard.
- **AC-002:** For an already-registered email, no account is created. The user sees a clear 'already registered' message with a link to login.
- **AC-003:** A malformed email or a too-short password is rejected with an inline message naming the field at fault. No account is created.

**Related:** EPIC-001, AC-001, AC-002, AC-003, NFR-008, NFR-010, NFR-015, NFR-022

### US-002 · draft · source: requirements:US-002

[critical] Log in and log out, so that only the account owner can reach their documents and chats.

- **AC-004:** Correct credentials establish a session and take the user to the dashboard showing library and chats.
- **AC-005:** Wrong credentials keep the user signed out and show a single generic message ('Email or password is incorrect') that does not reveal whether the email exists.
- **AC-006:** Logout invalidates the session. Later attempts to open document, chat or dashboard pages redirect to login.
- **AC-007:** When not signed in, any page or API endpoint other than sign-up and login is rejected and redirects to login.

**Related:** EPIC-001, AC-004, AC-005, AC-006, AC-007, NFR-009, NFR-010, NFR-015

- ⚠ AC-007 says unauthenticated API endpoint requests are 'redirected to the login page'. The expected API response is not specified: an HTTP redirect, or a 401 that the frontend handles.

### US-003 · draft · source: requirements:US-003

[high] Change password while signed in, with no reset email.

- **AC-008:** On the account settings page, a correct current password plus a valid new password (at least 8 characters) updates the hash and shows a confirmation.
- **AC-009:** An incorrect current password rejects the change with a 'current password is wrong' message. The existing password stays in force.
- **AC-010:** The login page offers no 'forgot password' email flow and states that password recovery requires being signed in.

**Related:** EPIC-001, AC-008, AC-009, AC-010, NFR-008, NFR-014

- ⚠ It is not stated whether other active sessions are invalidated after a password change.

### US-004 · draft · source: requirements:US-004

[critical] Keep each user's data private, so documents and chats are visible only to their owner.

- **AC-011:** If user B requests user A's document or chat by ID (UI or API), the request is refused with not-found or forbidden. No content, filenames or answers are returned.
- **AC-012:** List endpoints (library, chat list, chat history) return only the caller's rows, filtered on the server.
- **AC-013:** Vector search is constrained to passages from the asking user's own documents that are attached to that chat.

**Related:** EPIC-001, AC-011, AC-012, AC-013, NFR-016, NFR-017, NFR-012

### EPIC-002 · draft · source: requirements:EPIC-002

Document Library and Ingestion: a personal library of text-based PDF, .txt and .md files. Each file is stored in S3, extracted without OCR, chunked, embedded with gemini-embedding-001 into pgvector synchronously, and shown with a ready/failed status. Documents can be deleted, along with their embeddings.

**Stated assumptions:**
- A per-file size cap and an allowed-extension check apply, with sensible defaults. Exact numbers are to be set at build time.
- Documents are under roughly 20 pages, so synchronous ingestion takes seconds.
- A document is embedded once and reused across chats.
- English is the primary target language.
- There are no per-user quotas.

**Related:** US-005, US-006, US-007, US-008, US-009, US-010

- ⚠ The per-file size cap value is deferred to build time.
- ⚠ Chunk size and overlap are not specified.

### US-005 · draft · source: requirements:US-005

[critical] Upload a text-based PDF, .txt or .md file to the personal library.

- **AC-014:** Selecting or dragging in a .pdf, .txt or .md file within the size cap starts the upload. The document appears with a 'processing' state, its original filename and a progress indicator.
- **AC-015:** The original file is written to the configured S3 bucket under a key scoped to user ID and document ID. The key is recorded on the document row.
- **AC-016:** If a filename matches an existing document, both are listed as separate entries distinguished by upload date. Neither overwrites the other.

**Related:** EPIC-002, AC-014, AC-015, AC-016, NFR-001, NFR-007, NFR-012

- ⚠ AC-016 distinguishes duplicates 'by upload date'. It is unclear whether a full timestamp is shown, which matters when duplicates are uploaded on the same day.

### US-006 · draft · source: requirements:US-006

[high] Reject unsupported or oversized files with clear messages.

- **AC-017:** Other extensions (e.g. .docx, .pptx, .xlsx, .png) are refused before any processing. The message names the supported formats. No S3 object or document row is created.
- **AC-018:** Files over the cap are refused with a message stating the maximum allowed size.
- **AC-019:** The server re-validates extension and size independently of the browser.

**Related:** EPIC-002, AC-017, AC-018, AC-019, NFR-011, NFR-022, NFR-026

### US-007 · draft · source: requirements:US-007

[critical] Extract, chunk and embed each document on upload so it is queryable within seconds.

- **AC-020:** For a PDF, text is extracted from the text layer without OCR, split into overlapping chunks, and each chunk is embedded with gemini-embedding-001. Chunks and vectors are stored in PostgreSQL/pgvector.
- **AC-021:** For .txt and .md, the content is read as text and chunked/embedded the same way. Markdown is stored as raw text.
- **AC-022:** Each chunk records its source document ID, ordinal chunk index and, for PDFs, its page number.
- **AC-023:** For a document under roughly 20 pages, ingestion completes synchronously within the upload request in a few seconds, with no queue. The response returns the final status.

**Related:** EPIC-002, AC-020, AC-021, AC-022, AC-023, NFR-001, NFR-004, NFR-005, NFR-006, NFR-019

- ⚠ The functional summary adds that each chunk stores its chunk text and character offsets; AC-022 lists only document ID, index and page. This is consistent but broader.

### US-008 · draft · source: requirements:US-008

[high] Each document shows a ready or failed status, with retry available for failures.

- **AC-024:** On success, the document shows status 'ready' plus the number of passages indexed, and is attachable.
- **AC-025:** A PDF with no extractable text is marked 'failed' with the reason 'no extractable text found — scanned documents are not supported'. It is not attachable.
- **AC-026:** An extraction or embedding error (e.g. embedding API down) marks the document 'failed' with a short human-readable reason. No partial chunks are left searchable, and retry or delete is offered.
- **AC-027:** Retry re-runs ingestion from the file already in S3, with no re-upload.

**Related:** EPIC-002, AC-024, AC-025, AC-026, AC-027, NFR-020, NFR-026

### US-009 · draft · source: requirements:US-009

[high] Browse the document library.

- **AC-028:** The library lists the user's documents most recent first, showing filename, format, upload date, status and the chats each is attached to.
- **AC-029:** With no uploads, an empty state explains that PDF, .txt and .md are supported and shows a prominent upload control.

**Related:** EPIC-002, AC-028, AC-029, NFR-016

### US-010 · draft · source: requirements:US-010

[high] Delete a document along with its embeddings and S3 object.

- **AC-030:** After the user confirms an 'cannot be undone' warning, the document row, all its chunks and vectors, and its S3 object are deleted.
- **AC-031:** The document is auto-detached from all chats. Chats and their history are preserved, and new questions no longer retrieve from it.
- **AC-032:** Historical messages that cited the document keep their citation text visible. The citation is shown as referring to a deleted document rather than linking to missing content.

**Related:** EPIC-002, AC-030, AC-031, AC-032, NFR-018

- ⚠ AC-032 requires historical citation text to stay visible after AC-030 deletes all chunks. The requirements do not say where that citation text is preserved (e.g. a snapshot stored on the message). See top-level gap.

### EPIC-003 · draft · source: requirements:EPIC-003

Chat Sessions and Document Attachment: multiple named chats with persisted history. Each chat has its own attached document set, and retrieval is scoped to that set, reusing the upload-time embeddings. Chats can be renamed and deleted.

- Out of scope at this version: shared or team chats, and sharing a chat with another user.

**Related:** US-011, US-012, US-013, US-014

### US-011 · draft · source: requirements:US-011

[critical] Create and name a chat session.

- **AC-033:** 'New chat' on the dashboard creates an empty owned session with a default name (e.g. 'New chat' plus the date). It opens ready for document attachment.
- **AC-034:** An edited name persists and appears in the chat list and the chat header.
- **AC-035:** An empty name is rejected inline and the previous name is kept.

**Related:** EPIC-003, AC-033, AC-034, AC-035

### US-012 · draft · source: requirements:US-012

[critical] Attach and detach library documents per chat.

- **AC-036:** The attach panel lists ready documents with attached ones marked. 'Processing' and 'failed' documents are shown as unavailable.
- **AC-037:** Attaching to a second or third chat creates only a link. Existing chunks and vectors are reused, with no re-upload or re-embedding.
- **AC-038:** Detaching keeps the document in the library and in other chats, but stops retrieval from it in this chat.
- **AC-039:** Attached documents are listed visibly in the chat.

**Related:** EPIC-003, AC-036, AC-037, AC-038, AC-039, NFR-017, NFR-023

### US-013 · draft · source: requirements:US-013

[critical] Return to a chat and read its full persisted history.

- **AC-040:** The chat list shows all chats with their name and last-message time, ordered most recently active first.
- **AC-041:** After re-login or from another browser, the full ordered history, including citations, renders exactly as persisted.
- **AC-042:** The user message and the assistant message with its citation references are both written to the DB before the chat is considered up to date.

**Related:** EPIC-003, AC-040, AC-041, AC-042, NFR-016, NFR-021

### US-014 · draft · source: requirements:US-014

[medium] Delete a chat.

- **AC-043:** After confirmation, the chat, its messages and its attachment links are removed. It disappears from the list.
- **AC-044:** Previously attached documents remain in the library with their embeddings intact and are unaffected in other chats.

**Related:** EPIC-003, AC-043, AC-044, NFR-018

### EPIC-004 · draft · source: requirements:EPIC-004

Grounded Question Answering with Citations: the core RAG loop. The question is embedded, chat-scoped pgvector top-k retrieval runs, and Gemini 2.5 Flash composes an answer from passages plus recent turns. The answer streams with citations, or plainly says the documents don't contain it.

**Stated assumptions:**
- Answers stream token by token.
- Prior turns in the same chat are used as context for follow-ups.
- Citations identify the document and its page or chunk, with passage text viewable in the app.

**Out of scope:** world-knowledge fallback.

**Related:** US-015, US-016, US-017, US-018, US-019, US-020

- ⚠ The top-k value, relevance threshold and recent-turn window size are not specified.

### US-015 · draft · source: requirements:US-015

[critical] Ask a question and get an answer drawn from the chat's attached documents.

- **AC-045:** The question is embedded with gemini-embedding-001. A pgvector search returns the top-k passages, restricted by SQL to chunks of documents attached to this chat.
- **AC-046:** Passages go to Gemini 2.5 Flash with a system instruction to answer only from them. The answer is shown as an assistant message.
- **AC-047:** Passages from documents attached to other chats, or unattached in the library, are never considered.
- **AC-048:** Empty or whitespace input sends nothing and makes no model call; the input keeps focus.

**Related:** EPIC-004, AC-045, AC-046, AC-047, AC-048, NFR-002, NFR-003, NFR-004, NFR-017

### US-016 · draft · source: requirements:US-016

[critical] See citations for every answer.

- **AC-049:** Each answer has a citation list naming the source document and location: page number for PDFs, chunk index for .txt/.md.
- **AC-050:** Selecting a citation displays the cited passage text without leaving the chat.
- **AC-051:** Reopened chats still show their citations, resolving to the same passages, because references are persisted with the message.

**Related:** EPIC-004, AC-049, AC-050, AC-051, NFR-012, NFR-023, NFR-024, NFR-029

- ⚠ The functional summary adds an 'option to open the original file from S3', and the stack rationale mentions highlighting in an in-browser PDF viewer. Neither appears in AC-049 to AC-051.

### US-017 · draft · source: requirements:US-017

[critical] Be told plainly when the documents do not contain the answer.

- **AC-052:** When attached documents don't address the question, the reply is a plain 'not in the attached documents' statement with no citations and no world-knowledge answer.
- **AC-053:** When no passages pass the relevance threshold, the 'not in your documents' reply is returned, optionally without a model call, instead of sending empty context.
- **AC-054:** Well-known public facts absent from the documents still get the 'not in documents' reply.

**Related:** EPIC-004, AC-052, AC-053, AC-054, NFR-004, NFR-023, NFR-029

- ⚠ AC-053 leaves skipping the model call optional; the implementation choice is undecided.
- ⚠ The relevance threshold value is unspecified.

### US-018 · draft · source: requirements:US-018

[high] Ask follow-up questions in context.

- **AC-055:** Recent turns are included when interpreting a follow-up (pronouns, shorthand) and when composing the answer.
- **AC-056:** Only a bounded window of recent turns is sent to the model. The full history stays stored and visible.
- **AC-057:** Follow-up answers stay strictly grounded in retrieved passages and carry citations.

**Related:** EPIC-004, AC-055, AC-056, AC-057

- ⚠ AC-055 says turns are used 'when the question is interpreted'. It is not specified whether this means rewriting the query before embedding, or only adding prompt context.
- ⚠ The window size is unspecified.

### US-019 · draft · source: requirements:US-019

[high] Watch the answer stream in.

- **AC-058:** Partial answer tokens stream into the assistant bubble as they arrive.
- **AC-059:** On completion, citations render beneath the answer and the message is persisted.
- **AC-060:** On a dropped connection or navigation away and back, a half-written message is never shown as final. The chat shows either the completed stored answer or the turn marked as failed with an ask-again option.

**Related:** EPIC-004, AC-058, AC-059, AC-060, NFR-002, NFR-021

- ⚠ AC-060 allows showing the 'completed stored answer' after navigating away. It is not specified whether server-side generation continues after the client disconnects.

### US-020 · draft · source: requirements:US-020

[medium] Handle chats with no usable documents, and model failures.

- **AC-061:** In a chat with no documents attached, the user is prompted to attach a ready document. No embedding or model call is made.
- **AC-062:** When a Gemini call fails or times out, a non-technical error with a retry action is shown. The question stays visible and no fabricated answer is stored.
- **AC-063:** Retry re-runs retrieval and generation for the same question without retyping.

**Related:** EPIC-004, AC-061, AC-062, AC-063, NFR-013, NFR-020, NFR-022

- ⚠ The timeout duration for Gemini calls is unspecified.

### EPIC-005 · draft · source: requirements:EPIC-005

Dashboard and Responsive Web Experience: a single signed-in web experience for library and chats, usable on desktop and mobile browsers.

- No native mobile app.
- No admin console.
- No usage analytics.

**Related:** US-021, US-022

### US-021 · draft · source: requirements:US-021

[high] See library and chats on one dashboard.

- **AC-064:** After sign-in, chats and library appear side by side or as labelled sections, with New chat and Upload actions.
- **AC-065:** A brand-new user sees a guided empty state: upload a document, create a chat, attach the document, ask a question.
- **AC-066:** Primary navigation reaches the dashboard, any chat, the library and account settings without the browser back button.

**Related:** EPIC-005, AC-064, AC-065, AC-066, NFR-025

### US-022 · draft · source: requirements:US-022

[medium] Use the app comfortably on a phone.

- **AC-067:** Below the tablet breakpoint:
  - The conversation fills the screen.
  - The attached-documents panel and chat list collapse behind toggles.
  - The input stays reachable above the keyboard.
- **AC-068:** On mobile, controls are touch-sized, there is no horizontal scrolling, and citations remain expandable.

**Related:** EPIC-005, AC-067, AC-068, NFR-024, NFR-025

- ⚠ The exact tablet breakpoint width is unspecified.

### EPIC-006 · draft · source: requirements:EPIC-006

Deployment Configuration and Setup Documentation: what a developer needs to run the app. This covers PostgreSQL with pgvector, an S3 bucket, Gemini credentials, and a short README. No email provider is used.

- Covers local/developer setup and environment-driven configuration.

**Related:** US-023, US-024, REQ-STACK, REQ-SERVICES

- ⚠ No story covers cloud deployment, despite the approved AWS components (ECS Fargate, CloudFront + S3, RDS).

### US-023 · draft · source: requirements:US-023

[medium] A short README lets a developer run the app.

- **AC-069:** The README lists:
  - Prerequisites
  - Install and run commands
  - Migrations, including enabling pgvector
  - S3 bucket creation
- **AC-070:** The configuration section names and describes every required environment variable, with an example .env and no real secrets committed. Variables to cover:
  - Database connection
  - Gemini key
  - Model names
  - S3 bucket and region
  - AWS credentials
  - Session secret
  - Max upload size
- **AC-071:** Following the README from a clean checkout enables sign-up, upload, attaching a document to a chat, and receiving a cited answer.

**Related:** EPIC-006, AC-069, AC-070, AC-071, NFR-030

### US-024 · draft · source: requirements:US-024

[medium] Configure models and storage through environment variables.

- **AC-072:** A missing or empty required variable makes startup fail fast, naming the variable.
- **AC-073:** The app uses the configured embedding model (default gemini-embedding-001) and answer model (default gemini-2.5-flash). The embedding dimension must match the pgvector column.
- **AC-074:** Gemini and AWS secrets never appear in logs or API responses.

**Related:** EPIC-006, AC-072, AC-073, AC-074, NFR-013, NFR-028

### NFR-001 · draft · source: requirements:NFR-001

[performance] Synchronous ingestion completes inside the upload request.

- Upload, extraction, chunking, embedding and pgvector persistence all happen in one HTTP request.
- The response carries the final status (ready or failed).
- No queue or worker is introduced.
- **Target:** a document under roughly 20 pages finishes in a few seconds.

**Related:** US-005, US-007, US-008

- ⚠ 'A few seconds' is not quantified.

### NFR-002 · draft · source: requirements:NFR-002

[performance] Answer streaming gives immediate visible feedback.

- The turn shows as in-progress immediately.
- Tokens render as they arrive over SSE, with no full buffering.
- Pre-stream delay is limited to one embedding call plus one vector query.

**Related:** US-015, US-019

### NFR-003 · draft · source: requirements:NFR-003

[performance] Vector search stays indexable and chat-scoped at the SQL level.

- The pgvector column dimensionality must support an ANN index: 1536, or halfvec if 3072 is kept.
- The top-k query joins chunks to the chat's attached documents in one round trip, with no Python post-filtering.
- **Target:** 1536 with an ANN index, or halfvec(3072); one retrieval query per turn.

**Related:** US-015, US-004, REQ-SERVICES

- ⚠ Which dimension option is chosen remains undecided.
- ⚠ The ANN index type (e.g. HNSW/IVFFlat) is not specified.

### NFR-004 · draft · source: requirements:NFR-004

[performance] Indexing and query embeddings use matching task types.

- Chunks use RETRIEVAL_DOCUMENT and questions use RETRIEVAL_QUERY.
- Both use the same gemini-embedding-001 model and dimensionality, so scores and the threshold behave consistently.

**Related:** US-007, US-015, US-017

### NFR-005 · draft · source: requirements:NFR-005

[scalability] Long-running ingestion must not block other users.

- pypdf extraction, embedding calls and S3 writes run off the event loop (async clients or a threadpool).
- Concurrent uploads, chat turns and page loads are served normally.

**Related:** US-007, US-015

### NFR-006 · draft · source: requirements:NFR-006

[scalability] Accepted risk: no queued or distributed ingestion.

- **Accepted consequence:** documents much larger than about 20 pages, or bursts of uploads, may time out or degrade.
- The only recovery path is user-initiated retry from S3.

**Related:** US-007, US-008

### NFR-007 · draft · source: requirements:NFR-007

[scalability] Accepted risk: no per-user storage quotas or cost controls.

- **Accepted consequence:** a single account can accumulate unbounded S3 objects and embedding spend with no ceiling or visibility.
- Only the per-file cap limits growth.

**Related:** US-005, US-006

### NFR-008 · draft · source: requirements:NFR-008

[security] Passwords are stored only as salted hashes.

- Uses a modern adaptive algorithm (e.g. bcrypt or argon2).
- Plaintext or reversible passwords never appear in the DB, logs or responses.
- A minimum of 8 characters is enforced on sign-up and on password change.

**Related:** US-001, US-003

- ⚠ The hashing algorithm (bcrypt or argon2) is not chosen.

### NFR-009 · draft · source: requirements:NFR-009

[security] Session handling and authenticated-by-default routing.

- Sessions use a signed, httpOnly, secure cookie derived from an environment session secret.
- Sessions are invalidated server-side on logout.
- The session is verified on every page and endpoint except sign-up and login.
- Unauthenticated requests are rejected and redirected, never served partial data.

**Related:** US-002, US-004

- ⚠ Session lifetime and expiry are unspecified.

### NFR-010 · draft · source: requirements:NFR-010

[security] No account enumeration on login or sign-up errors.

- Failed logins return a generic message, with no obvious timing difference between existing and non-existing emails.
- The sign-up duplicate-email message is the only disclosure, and only to someone registering that address.

**Related:** US-001, US-002

### NFR-011 · draft · source: requirements:NFR-011

[security] Server-side revalidation of every upload.

- Browser checks are convenience only.
- The server re-validates the extension (.pdf/.txt/.md) and both declared and actual byte size.
- Invalid uploads are rejected before any S3 write or DB row.

**Related:** US-006

### NFR-012 · draft · source: requirements:NFR-012

[security] Private S3 objects are served via short-lived presigned URLs.

- Keys are prefixed by user ID and document ID, with no public ACL.
- The browser accesses objects only through presigned GET URLs issued after an ownership check.
- URLs are short-lived and never issued for documents the requester does not own.

**Related:** US-005, US-016, US-004

- ⚠ The presigned URL lifetime is unspecified.

### NFR-013 · draft · source: requirements:NFR-013

[security] Secrets are never logged or echoed.

- GEMINI_API_KEY, AWS keys, the DB URL and the session secret never appear in logs, browser-facing error traces or responses.
- Upstream errors are summarised into non-technical messages.

**Related:** US-024, US-020

### NFR-014 · draft · source: requirements:NFR-014

[security] Accepted risk: no password recovery when signed out.

- **Accepted consequence:** a user who forgets their password is permanently locked out of their account, documents and chats.
- The login page must state this plainly.

**Related:** US-003, US-002

### NFR-015 · draft · source: requirements:NFR-015

[security] Accepted risk: no email verification and no brute-force rate limiting.

- **Accepted consequences:**
  - Accounts can be registered for addresses the registrant does not control.
  - Credential stuffing is slowed only by the hashing cost.

**Related:** US-001, US-002

### NFR-016 · draft · source: requirements:NFR-016

[privacy] Per-user isolation is enforced in SQL, not in the browser.

- Every read and write is constrained by owner ID in the server query.
- Cross-user requests return not-found or forbidden and leak no filenames, text or metadata.
- Client-side filtering is not acceptable.

**Related:** US-004, US-009, US-013

### NFR-017 · draft · source: requirements:NFR-017

[privacy] Retrieval is scoped to the chat's own attachments.

- Similarity search is restricted by join to chunks of documents that are both owned by the user and currently attached to the chat.
- Unattached documents, other chats' documents and other users' documents are unreachable.

**Related:** US-004, US-012, US-015

### NFR-018 · draft · source: requirements:NFR-018

[privacy] Deletion removes content everywhere it was stored.

- **Document delete:** removes the row, chunks, vectors and S3 object. DB work happens in a single transaction, and attachment links are removed.
- **Chat delete:** removes messages and links.
- No orphaned vectors or S3 objects remain retrievable.

**Related:** US-010, US-014

- ⚠ The S3 delete cannot join the DB transaction. Ordering and failure handling between the DB commit and S3 deletion are unspecified.

### NFR-019 · draft · source: requirements:NFR-019

[privacy] Accepted risk: document content is processed by a third-party model provider.

- Chunk and question text are sent to Google Gemini.
- No DPA, region pinning or opt-out was specified.
- **Accepted consequence:** users' material is subject to Gemini API terms.

**Related:** US-007, US-015

### NFR-020 · draft · source: requirements:NFR-020

[availability] Graceful degradation when Gemini or S3 is unavailable.

- **Failed ingestion:** marks the document 'failed' with a human-readable reason and leaves no partial chunks searchable.
- **Failed chat turn:** shows a non-technical error with retry, keeps the question visible, and stores no fabricated or partial answer.

**Related:** US-008, US-020

### NFR-021 · draft · source: requirements:NFR-021

[availability] Interrupted streams never persist as a finished answer.

- The assistant message is written only on completion.
- After a drop or navigation, the chat shows either the completed stored answer or a failed turn with an ask-again option.

**Related:** US-019, US-013

### NFR-022 · draft · source: requirements:NFR-022

[usability] Actionable, non-technical feedback at every failure point.

- Each failure state names what to do next:
  - Sign-up: the field at fault.
  - Upload rejection: supported formats and maximum size.
  - Failed document: the reason plus retry or delete.
  - Chat with no documents: a prompt to attach a ready document.
  - Model failure: a retry action.
- No stack traces or provider error codes are shown.

**Related:** US-001, US-006, US-008, US-020

### NFR-023 · draft · source: requirements:NFR-023

[usability] Grounding is always visible to the user.

- The chat lists its attached documents.
- Each grounded answer has a citation list (document name plus page or chunk index).
- Passage text is readable in-chat.
- The 'not in your documents' reply shows no citations.

**Related:** US-012, US-016, US-017

### NFR-024 · draft · source: requirements:NFR-024

[accessibility] Touch-friendly and keyboard-operable interface.

- Upload, attach/detach, send, citation expanders and chat list items are:
  - Touch-sized on mobile
  - Keyboard-operable with visible focus
  - Labelled for screen readers
- Citation expansion and streaming updates are announced.

**Related:** US-016, US-022

- ⚠ No WCAG conformance level is specified.

### NFR-025 · draft · source: requirements:NFR-025

[compatibility] Responsive single web experience on current browsers.

- The React 19 app works on current evergreen desktop and mobile browsers; there is no native app.
- Below the tablet breakpoint:
  - The conversation fills the screen.
  - Chat list and document panels collapse.
  - The input stays above the keyboard.
  - No view requires horizontal scrolling.

**Related:** US-021, US-022

### NFR-026 · draft · source: requirements:NFR-026

[compatibility] Text-layer PDFs only, with an honest failure.

- Extraction uses the pypdf text layer only.
- PDFs without text are marked 'failed' with the reason 'no extractable text found — scanned documents are not supported'.
- Such PDFs are not attachable, rather than ingesting as empty.

**Related:** US-006, US-008

### NFR-027 · draft · source: requirements:NFR-027

[compliance] Accepted risk: no formal compliance regime or data-export tooling.

- None of the following were requested:
  - GDPR data-export or subject-access tooling
  - HIPAA controls
  - SOC 2 evidence
  - Audit logging
  - Data-residency guarantee
- **Accepted consequence:** the product is unsuitable as-is for regulated content. Applies to the whole system.

### NFR-028 · draft · source: requirements:NFR-028

[maintainability] All configuration comes from the environment, with fail-fast startup.

- Read via Pydantic settings:
  - DB connection
  - GEMINI_API_KEY
  - Model names (defaults gemini-embedding-001 / gemini-2.5-flash)
  - Embedding dimension
  - AWS keys, region and S3_BUCKET
  - Session secret
  - Max upload size
- A missing or empty required variable aborts startup, naming the variable.
- The embedding dimension must match the pgvector column.

**Related:** US-024

### NFR-029 · draft · source: requirements:NFR-029

[maintainability] The citation contract is enforced by a single validated model.

- The response shape is defined once as a Pydantic model.
- A grounded answer cannot be persisted without chunk references that resolve to real chunk rows.
- Answers failing validation are treated as failed turns.

**Related:** US-016, US-017

- ⚠ NFR-029 requires references to resolve to real chunk rows. After document deletion (AC-030), those rows no longer exist, yet AC-032 keeps the citations visible. See top-level gap.

### NFR-030 · draft · source: requirements:NFR-030

[maintainability] The README is reproducible from a clean checkout.

- The README covers:
  - Prerequisites
  - Install and run commands
  - Migrations, including CREATE EXTENSION vector
  - S3 bucket creation
  - Every environment variable described
  - An example .env with no secrets
- Following it end to end enables sign-up, upload, attach and a cited answer.

**Related:** US-023, US-024
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-10-27

**Capabilities in scope:** Email and password sign-up and login, Change password while signed in, Private per-user accounts, Personal document library, PDF, .txt and .md upload with size and type checks, Direct text extraction, chunking and embedding on upload, Document ready or failed status, Document storage in Amazon S3, Delete documents with embeddings removed, Multiple named chat sessions, Attach library documents to a chat, Question answering from attached documents only, Citations to source document and page or chunk, Plain 'not in your documents' reply, Follow-up questions using earlier chat turns, Streaming answers, Persisted chat history, Delete chats, Library and chats dashboard, Responsive browser layout, No email-based password reset, since email was removed from the stack, Gemini 2.5 Flash for answers, gemini-embedding-001 for embeddings, pgvector in PostgreSQL for passage search, Uploads processed immediately, no background queue, Short README with setup and environment variables, Sign-up needs no email verification

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | Your pipeline is Python-shaped end to end: PDF text extraction (pypdf), chunking, the google-genai SDK for gemini-embedding-001 and Gemini 2.5 Flash. FastAPI is async-native, so streaming Gemini's response straight through to the browser over SSE is a few lines rather than a framework fight, and it holds the request open during seconds-long synchronous ingestion without blocking other users. Pydantic gives you one honest place to enforce the citation contract — an answer without source chunk references fails validation. |
| cloud | AWS | You need exactly four things — a container for FastAPI, static hosting for React, managed Postgres, and object storage for the original PDFs — and AWS gives all four with no bespoke work: ECS Fargate, CloudFront + S3, RDS Postgres with pgvector available as an extension, and S3. Managed Postgres matters most here, because your vector store and your user data are the same database and you do not want to be the person doing its backups and point-in-time recovery. |
| database | PostgreSQL | Per-chat retrieval scoping is your sharpest requirement, and with pgvector it is one query: join chunks to the chat's attached documents and order by vector distance. A separate vector database would force you to mirror attachment state and hope the two never drift — drift there means one chat surfacing another's content. Postgres also holds users, named sessions, message history and the library/attachment many-to-many, so reusing one embedding across chats is a foreign key, and deleting a document cascades its embeddings in the same transaction. |
| frontend | React | The whole product is one screen archetype: a chat pane with streaming tokens, a document tray showing ready/failed status per upload, and clickable citations that jump to a passage. React's state model handles the awkward part well — a message still arriving token-by-token while upload statuses update independently. It also has the deepest library bedrock for the two fiddly pieces you need: an in-browser PDF viewer to highlight cited passages, and markdown rendering for answers. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Accounts and Private Access

Email + password accounts with sign-up, login, logout and in-app password change. Every user's documents and chats are private to that account.

Assumptions stated explicitly: authentication is email + password only — no social/SSO login; sign-up requires no email verification; and because email sending (SendGrid) was removed from the stack, there is no email-based password reset in this version. A signed-in user can change their own password. No admin console, billing or subscription tiers.

### US-001: Sign up with email and password

**Priority:** critical

> As a new visitor, I want to create an account with my email address and a password, so that I can upload my own documents and ask questions about them.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am on the sign-up page and no account exists for my email address | I submit a valid email address and a password that meets the minimum strength rule (at least 8 characters) | my account is created, my password is stored only as a salted hash, I am signed in immediately with no email verification step, and I land on my dashboard |
| AC-002 | an account already exists for the email address I entered | I submit the sign-up form | the account is not created and I see a clear message that the email address is already registered, with a link to the login page |
| AC-003 | I am on the sign-up page | I submit a malformed email address or a password shorter than the minimum length | the form is rejected with an inline validation message naming the field at fault and no account is created |

### US-002: Log in and log out

**Priority:** critical

> As a registered user, I want to sign in to my account and sign out again, so that only I can reach my documents and chats.

| ID | Given | When | Then |
|---|---|---|---|
| AC-004 | I have a registered account | I submit my correct email address and password on the login page | a session is established and I am taken to my dashboard showing my library and chats |
| AC-005 | I am on the login page | I submit an email address or password that does not match a registered account | I remain signed out and see a single generic message such as 'Email or password is incorrect' that does not reveal whether the email exists |
| AC-006 | I am signed in | I choose log out | my session is invalidated and any later attempt to open a document, chat or dashboard page redirects me to the login page |
| AC-007 | I am not signed in | I request any application page or API endpoint other than sign-up and login | the request is rejected and I am redirected to the login page |

### US-003: Change my password while signed in

**Priority:** high

> As a signed-in user, I want to change my password from within the app, so that I can keep my account secure without needing a reset email.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | I am signed in and on the account settings page | I enter my current password correctly and a new password meeting the minimum strength rule | my password hash is updated and I see a confirmation that my password was changed |
| AC-009 | I am on the change-password form | I enter an incorrect current password | the change is rejected with a message that the current password is wrong and my existing password remains in force |
| AC-010 | I have forgotten my password and am signed out | I look at the login page | no 'forgot password' email flow is offered, because email delivery is out of scope for this version, and the page states that password recovery requires being signed in |

### US-004: Keep each user's data private

**Priority:** critical

> As a user, I want my documents and chats to be visible only to me, so that my private material is never exposed to another account.

| ID | Given | When | Then |
|---|---|---|---|
| AC-011 | user A owns a document and a chat session | user B is signed in and requests those records by their identifiers through the UI or the API | the request is refused with a not-found or forbidden response and none of user A's content, filenames or answers are returned |
| AC-012 | any list endpoint such as the library list, chat list or chat history | it is called by a signed-in user | it returns only rows owned by that user, filtered by owner on the server rather than in the browser |
| AC-013 | a question is asked in a chat | the system searches passages by vector similarity | the search is constrained to passages belonging to the asking user's own documents that are attached to that chat, and no other user's passages can be returned |

## EPIC-002: Document Library and Ingestion

A personal library where a user uploads text-based PDFs, .txt and .md files. The original file is stored in Amazon S3; text is extracted directly (no OCR), chunked and embedded with gemini-embedding-001 into pgvector in PostgreSQL, synchronously on upload with no background queue. Each document shows a ready or failed status. Documents can be deleted, which removes their embeddings and detaches them from any chat.

Assumptions stated explicitly: a per-file size cap and an allowed-extension check are enforced with sensible defaults (exact numbers to be set at build time); documents are short (under roughly 20 pages) so synchronous ingestion finishes in seconds; a document uploaded once is embedded once and reused across chats; English documents are the primary target; there are no per-user storage quotas.

### US-005: Upload a document to my library

**Priority:** critical

> As a signed-in user, I want to upload a text-based PDF, .txt or .md file, so that I can ask questions about its contents.

| ID | Given | When | Then |
|---|---|---|---|
| AC-014 | I am on my library page | I select or drag in a file with a .pdf, .txt or .md extension within the configured size cap | the upload starts, the document appears in my library with a 'processing' state and its original filename, and a progress indicator is shown |
| AC-015 | an upload is accepted | the file has been received by the server | the original file is written to the configured Amazon S3 bucket under a key scoped to my user id and document id, and that key is recorded against the document row |
| AC-016 | I upload a file whose name matches a document already in my library | the upload completes | both documents are listed as separate entries distinguished by upload date, and neither overwrites the other |

### US-006: Reject unsupported or oversized files

**Priority:** high

> As a signed-in user, I want clear rejection of files the system cannot handle, so that I am not left waiting on an upload that can never be queried.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | I choose a file with an extension other than .pdf, .txt or .md (for example .docx, .pptx, .xlsx or .png) | I attempt to upload it | the upload is refused before any processing and I see a message naming the supported formats; no S3 object and no document row are created |
| AC-018 | I choose a file larger than the configured per-file size cap | I attempt to upload it | the upload is refused with a message stating the maximum allowed file size |
| AC-019 | a client-side check has been bypassed | the file reaches the server | the server re-validates extension and size and rejects the request independently of the browser |

### US-007: Extract, chunk and embed on upload

**Priority:** critical

> As a signed-in user, I want my uploaded document to be turned into searchable passages immediately, so that I can query it within seconds of uploading.

| ID | Given | When | Then |
|---|---|---|---|
| AC-020 | an accepted PDF upload | ingestion runs | text is extracted directly from the PDF's text layer without OCR, split into overlapping chunks, each chunk is embedded with gemini-embedding-001, and the chunks plus vectors are stored in PostgreSQL using pgvector |
| AC-021 | an accepted .txt or .md upload | ingestion runs | the file contents are read as text, chunked and embedded in the same way, with Markdown stored as its raw text |
| AC-022 | each stored chunk | it is written to the database | it records its source document id, its ordinal chunk index and, for PDFs, the page number it came from, so that citations can point back to a document and location |
| AC-023 | a typical document of under roughly 20 pages | it is uploaded | ingestion completes synchronously within the upload request in a few seconds without any background job queue, and the response returns the final document status |

### US-008: See whether a document is ready or failed

**Priority:** high

> As a signed-in user, I want each document to show a ready or failed status, so that I know what I can query and what went wrong.

| ID | Given | When | Then |
|---|---|---|---|
| AC-024 | ingestion finished successfully | I look at the document in my library | it shows status 'ready' together with the number of passages indexed, and it can be attached to a chat |
| AC-025 | a PDF that contains no extractable text, such as a scanned image PDF | ingestion runs | the document is marked 'failed' with the reason 'no extractable text found — scanned documents are not supported', and it cannot be attached to a chat |
| AC-026 | extraction or embedding raises an error, for example the embedding API is unavailable | ingestion fails | the document is marked 'failed' with a short human-readable reason, no partial chunks are left searchable, and I am offered the option to retry or delete it |
| AC-027 | a document marked 'failed' | I choose retry | ingestion is re-run from the file already stored in S3 without me having to upload it again |

### US-009: Browse my document library

**Priority:** high

> As a signed-in user, I want to see all the documents I have uploaded, so that I can decide what to attach to a chat and what to remove.

| ID | Given | When | Then |
|---|---|---|---|
| AC-028 | I have uploaded documents | I open my library | I see a list of my documents with filename, format, upload date, status and the chats each is currently attached to, most recent first |
| AC-029 | I have not uploaded anything yet | I open my library | I see an empty state explaining that I can upload PDF, .txt and .md files and a prominent upload control |

### US-010: Delete a document and its embeddings

**Priority:** high

> As a signed-in user, I want to delete a document from my library, so that its content is removed from the system and no longer answers questions.

| ID | Given | When | Then |
|---|---|---|---|
| AC-030 | a document in my library | I choose delete and confirm the warning that the action cannot be undone | the document row, all of its chunks and vectors in pgvector, and the stored object in S3 are deleted |
| AC-031 | the deleted document was attached to one or more chats | deletion completes | it is detached from those chats automatically, the chats themselves and their past message history are preserved, and new questions in those chats no longer retrieve passages from it |
| AC-032 | an earlier answer in a chat cited the deleted document | I reopen that chat | the historical message and its citation text remain visible but the citation is shown as referring to a deleted document rather than linking to missing content |

## EPIC-003: Chat Sessions and Document Attachment

Users keep multiple named chat sessions with full persisted history. Each chat has its own set of attached library documents, and retrieval for that chat is scoped to those documents only. Attaching a document reuses the embeddings created at upload — nothing is re-embedded per chat. Chats can be renamed and deleted.

Out of scope at this version: shared or team chats, and sharing a chat with another user.

### US-011: Create and name a chat session

**Priority:** critical

> As a signed-in user, I want to start a new chat and give it a name, so that I can keep separate conversations for separate topics.

| ID | Given | When | Then |
|---|---|---|---|
| AC-033 | I am on my dashboard | I choose 'New chat' | an empty chat session is created owned by me, with a default name such as 'New chat' and the date, and it opens ready for documents to be attached |
| AC-034 | an existing chat | I edit its name and save | the new name is persisted and shown in my chat list and in the chat header |
| AC-035 | I submit an empty chat name | I save | the name is rejected with an inline message and the previous name is kept |

### US-012: Attach and detach library documents for a chat

**Priority:** critical

> As a signed-in user, I want to choose which of my library documents a chat can search, so that answers come only from the material relevant to that conversation.

| ID | Given | When | Then |
|---|---|---|---|
| AC-036 | I have ready documents in my library and a chat open | I open the attach-documents panel | I see my ready documents with those already attached marked, and documents in 'processing' or 'failed' state shown as unavailable to attach |
| AC-037 | a document already embedded in my library | I attach it to a second or third chat | only an attachment link is created and the existing chunks and vectors are reused, with no re-upload and no re-embedding |
| AC-038 | a document attached to a chat | I detach it | it stays in my library and in any other chats it is attached to, but subsequent questions in this chat no longer retrieve its passages |
| AC-039 | a chat with attached documents | I view the chat | the attached documents are listed visibly in the chat so I always know what the answers can draw on |

### US-013: Return to a chat and read its full history

**Priority:** critical

> As a signed-in user, I want my chats and their messages to be saved, so that I can come back later and pick up where I left off.

| ID | Given | When | Then |
|---|---|---|---|
| AC-040 | I have had conversations in several chats | I open my chat list | I see all my chats with their names and the time of the most recent message, ordered most recently active first |
| AC-041 | a chat with prior messages | I open it after logging out and back in, or from another browser | the full ordered history of my questions and the assistant's answers, including their citations, is rendered exactly as it was persisted |
| AC-042 | a question and its answer have completed | the exchange ends | both the user message and the assistant message with its citation references are written to the database before the chat is considered up to date |

### US-014: Delete a chat

**Priority:** medium

> As a signed-in user, I want to delete a chat session I no longer need, so that my chat list stays relevant.

| ID | Given | When | Then |
|---|---|---|---|
| AC-043 | a chat in my list | I choose delete and confirm | the chat, its message history and its document attachments are removed and it disappears from my chat list |
| AC-044 | documents were attached to the deleted chat | deletion completes | those documents remain in my library with their embeddings intact and are unaffected in any other chat |

## EPIC-004: Grounded Question Answering with Citations

The core RAG loop. A question is embedded with gemini-embedding-001, the top matching passages are retrieved by pgvector similarity search restricted to the current chat's attached documents, and Gemini 2.5 Flash composes an answer from those passages plus recent conversation turns. The answer streams into the UI and carries citations to source document and page or chunk. If the passages do not contain the answer, the bot says so plainly.

Assumptions stated explicitly: answers stream token by token; prior turns in the same chat are used as context for follow-up questions; citations identify the document and its page or chunk, with the passage text viewable in the app. Out of scope: falling back on the model's general world knowledge when the attached documents lack the answer.

### US-015: Ask a question and get an answer from my attached documents

**Priority:** critical

> As a signed-in user, I want to ask a natural-language question in a chat, so that I get an answer drawn from the documents attached to that chat.

| ID | Given | When | Then |
|---|---|---|---|
| AC-045 | a chat with at least one ready document attached | I submit a question | the question is embedded with gemini-embedding-001 and a pgvector similarity search returns the top-k most relevant passages, restricted by SQL filter to chunks of documents attached to this chat |
| AC-046 | the retrieved passages | the answer is generated | the passages are passed to Gemini 2.5 Flash with a system instruction to answer only from the supplied passages, and the resulting answer is displayed as an assistant message in the chat |
| AC-047 | my chat has documents attached that are not relevant to the question | retrieval runs | passages from documents attached to other chats or sitting unattached in my library are never considered |
| AC-048 | I submit an empty message or only whitespace | I press send | nothing is sent, no model call is made and the input retains focus |

### US-016: See citations for every answer

**Priority:** critical

> As a signed-in user, I want each answer to show where it came from, so that I can verify the claim against my own document.

| ID | Given | When | Then |
|---|---|---|---|
| AC-049 | an answer generated from retrieved passages | it is displayed | it is accompanied by a citation list naming each source document and its location — page number for PDFs, chunk index for .txt and .md |
| AC-050 | a citation shown under an answer | I select it | the text of the cited passage is displayed so I can read the supporting evidence without leaving the chat |
| AC-051 | a past answer in a chat I reopen later | I view the history | its citations are still present and still resolve to the same passages, because citation references are persisted with the message |

### US-017: Be told plainly when the documents do not contain the answer

**Priority:** critical

> As a signed-in user, I want the bot to admit when my documents do not cover my question, so that I never mistake invented content for something my documents said.

| ID | Given | When | Then |
|---|---|---|---|
| AC-052 | a chat whose attached documents do not address my question | I ask it | the assistant replies with a plain statement that the answer is not in the attached documents, offers no citations, and does not supply an answer from the model's general world knowledge |
| AC-053 | similarity search returns no passages above the relevance threshold | the turn is processed | the 'not in your documents' reply is returned, optionally without a model call, rather than sending an empty context to the model |
| AC-054 | a question that the model could answer from general knowledge, such as a well-known public fact absent from my documents | I ask it in a chat | the assistant still states that the attached documents do not contain the answer instead of answering from world knowledge |

### US-018: Ask follow-up questions in context

**Priority:** high

> As a signed-in user, I want the chat to remember what we were just discussing, so that I can ask short follow-ups like 'and what about section 3?'.

| ID | Given | When | Then |
|---|---|---|---|
| AC-055 | a chat with earlier questions and answers | I ask a follow-up that refers back to an earlier turn by pronoun or shorthand | the recent conversation turns are included as context when the question is interpreted and when the answer is composed, so the follow-up is resolved correctly |
| AC-056 | a long chat history | a new turn is processed | only a bounded window of recent turns is sent to the model so the prompt stays within the model's context limit, while the full history remains stored and visible in the UI |
| AC-057 | a follow-up question answered with conversational context | the answer is produced | it is still grounded strictly in passages retrieved from the chat's attached documents and still carries citations |

### US-019: Watch the answer stream in

**Priority:** high

> As a signed-in user, I want the answer to appear progressively as it is generated, so that I get feedback immediately instead of staring at a spinner.

| ID | Given | When | Then |
|---|---|---|---|
| AC-058 | I have submitted a question | Gemini 2.5 Flash begins returning tokens | the partial answer is streamed into the assistant message bubble as it arrives |
| AC-059 | the stream has finished | generation completes | the citation list is rendered beneath the finished answer and the completed message is persisted to the chat history |
| AC-060 | a stream is in progress | the connection drops or I navigate away and return | the chat does not display a half-written message as final — either the completed stored answer is shown or the turn is marked as failed with the option to ask again |

### US-020: Handle chats with no usable documents and model failures

**Priority:** medium

> As a signed-in user, I want clear guidance when a chat cannot answer, so that I know whether to attach a document or simply retry.

| ID | Given | When | Then |
|---|---|---|---|
| AC-061 | a chat with no documents attached | I try to ask a question | I am prompted to attach at least one ready document from my library, and no embedding or model call is made |
| AC-062 | the Gemini answer or embedding call fails or times out | I have asked a question | I see a non-technical error message with a retry action, my question remains visible in the chat, and no fabricated answer is stored |
| AC-063 | a failed turn | I retry it | retrieval and generation are re-run for the same question without me having to retype it |

## EPIC-005: Dashboard and Responsive Web Experience

A single signed-in web experience giving access to the document library and chat sessions, usable in a browser on desktop and mobile. No native mobile app, no admin console, no usage analytics.

### US-021: See my library and chats on one dashboard

**Priority:** high

> As a signed-in user, I want a single home screen for my documents and chat sessions, so that I can get to anything in one click.

| ID | Given | When | Then |
|---|---|---|---|
| AC-064 | I have just signed in | the dashboard loads | I see my chat sessions and my document library side by side or as clearly labelled sections, with actions to start a new chat and upload a document |
| AC-065 | I am a brand-new user with nothing uploaded | I open the dashboard | I see a short guided empty state: upload a document, create a chat, attach the document, ask a question |
| AC-066 | I am anywhere in the app | I use the primary navigation | I can reach my dashboard, any chat, my library and my account settings without using the browser back button |

### US-022: Use the app comfortably on a phone

**Priority:** medium

> As a signed-in user on a mobile browser, I want the layout to adapt to a small screen, so that I can read answers and ask questions away from my desk.

| ID | Given | When | Then |
|---|---|---|---|
| AC-067 | a viewport narrower than a tablet breakpoint | I open a chat | the conversation fills the screen, the attached-documents panel and chat list collapse behind toggles, and the message input stays reachable above the keyboard |
| AC-068 | a mobile browser | I upload a document or read an answer with citations | controls are touch-sized, text does not require horizontal scrolling, and citations remain expandable |

## EPIC-006: Deployment Configuration and Setup Documentation

What a developer needs to run the application: PostgreSQL with the pgvector extension, an Amazon S3 bucket for original files, Gemini API credentials for gemini-embedding-001 and Gemini 2.5 Flash, and a short README covering setup and environment variables. No email provider is configured, since email was removed from the stack.

### US-023: Follow a short README to run the app

**Priority:** medium

> As a developer picking up the project, I want concise setup instructions and a list of environment variables, so that I can run the application locally without reverse-engineering the code.

| ID | Given | When | Then |
|---|---|---|---|
| AC-069 | the repository | I open the README | it lists prerequisites, install and run commands, database migration steps including enabling the pgvector extension, and how to create the S3 bucket |
| AC-070 | the README | I read the configuration section | every required environment variable is named and described — database connection, Gemini API key, model names, S3 bucket and region, AWS credentials, session secret, max upload size — with an example .env file and no real secrets committed |
| AC-071 | I follow the README from a clean checkout | I complete the steps | I can sign up, upload a document, attach it to a chat and receive a cited answer |

### US-024: Configure models and storage through environment variables

**Priority:** medium

> As a developer running the service, I want model names, credentials and storage targets to come from configuration, so that the same build runs in local and deployed environments.

| ID | Given | When | Then |
|---|---|---|---|
| AC-072 | the application starts | a required environment variable is missing or empty | startup fails fast with a message naming the missing variable rather than erroring later during an upload or a chat turn |
| AC-073 | configuration is loaded | the app calls the model provider | it uses the configured embedding model (default gemini-embedding-001) and answer model (default gemini-2.5-flash), and the configured embedding dimension matches the pgvector column definition |
| AC-074 | secrets such as the Gemini API key and AWS credentials | the application logs requests or errors | those values are never written to logs or returned in API responses |
<!-- sdlc:auto:end epics -->
