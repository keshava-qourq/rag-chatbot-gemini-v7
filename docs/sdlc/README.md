# RAG-chatbot-gemini-v7 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
Build a rag chatbot where user can upload there own documents and ask queries about them use gemini-2.5-flash for answers and gemini-embedding-001 for embeddings and have chat history and sessions

**Documentation version:** v5
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 22 entries |
| [Development](development/README.md) | 13 entries |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 3 entries |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 5 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 1 route |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 1 release |
| [Traceability matrix](traceability-matrix.md) | 24 requirements |
| [Changelog](CHANGELOG.md) | 5 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- AWS hosting components (ECS Fargate, CloudFront + S3, RDS) are named only as rationale. No user story or NFR covers provisioning or deploying them; EPIC-006 covers local setup only.
- The React rationale mentions an in-browser PDF viewer that highlights cited passages. The acceptance criteria (AC-050) require only displaying the passage text. See top-level gap on citation viewing.
- The embedding dimension is undecided: 1536 with an ANN index, or halfvec(3072).
- The 'API keys this app needs' list omits the database connection string and session secret. AC-070, NFR-009 and NFR-028 require both.
- The input does not state an approval status or approver for the stories and NFRs, only for the stack and services. Stories are recorded as draft.
- No story covers account deletion, so a user cannot remove their account and all of its data.
- AC-007 says unauthenticated API endpoint requests are 'redirected to the login page'. The expected API response is not specified: an HTTP redirect, or a 401 that the frontend handles.
- It is not stated whether other active sessions are invalidated after a password change.
- The per-file size cap value is deferred to build time.
- Chunk size and overlap are not specified.
- AC-016 distinguishes duplicates 'by upload date'. It is unclear whether a full timestamp is shown, which matters when duplicates are uploaded on the same day.
- The functional summary adds that each chunk stores its chunk text and character offsets; AC-022 lists only document ID, index and page. This is consistent but broader.
- AC-032 requires historical citation text to stay visible after AC-030 deletes all chunks. The requirements do not say where that citation text is preserved (e.g. a snapshot stored on the message). See top-level gap.
- The top-k value, relevance threshold and recent-turn window size are not specified.
- The functional summary adds an 'option to open the original file from S3', and the stack rationale mentions highlighting in an in-browser PDF viewer. Neither appears in AC-049 to AC-051.
- AC-053 leaves skipping the model call optional; the implementation choice is undecided.
- The relevance threshold value is unspecified.
- AC-055 says turns are used 'when the question is interpreted'. It is not specified whether this means rewriting the query before embedding, or only adding prompt context.
- The window size is unspecified.
- AC-060 allows showing the 'completed stored answer' after navigating away. It is not specified whether server-side generation continues after the client disconnects.
- The timeout duration for Gemini calls is unspecified.
- The exact tablet breakpoint width is unspecified.
- No story covers cloud deployment, despite the approved AWS components (ECS Fargate, CloudFront + S3, RDS).
- 'A few seconds' is not quantified.
- Which dimension option is chosen remains undecided.
- The ANN index type (e.g. HNSW/IVFFlat) is not specified.
- The hashing algorithm (bcrypt or argon2) is not chosen.
- Session lifetime and expiry are unspecified.
- The presigned URL lifetime is unspecified.
- The S3 delete cannot join the DB transaction. Ordering and failure handling between the DB commit and S3 deletion are unspecified.
- No WCAG conformance level is specified.
- NFR-029 requires references to resolve to real chunk rows. After document deletion (AC-030), those rows no longer exist, yet AC-032 keeps the citations visible. See top-level gap.

### Architecture

- The approver and approval date for this architecture are not stated in the input.
- No mapping from components, endpoints or critical paths to user stories US-001 to US-024 is provided. Requirement-level traceability for this phase cannot be established from the input.
- The rationale cites NFR-002, NFR-003, NFR-005, NFR-017, NFR-018, NFR-020, NFR-028 and NFR-029. None of these appear in the known requirement key list (US-001 to US-024). Their source and wording need confirmation.
- No observability, monitoring or alerting design is described beyond logging of failed S3 deletes.
- No rate limiting or abuse controls for uploads, chat turns or authentication attempts are described.
- No industry or domain skill was named, so no compliance traceability was performed.
- The account settings screen's contents beyond change password are not specified. For example, account deletion is not listed among the endpoints.
- Upload progress is listed, but ingestion is synchronous with no progress endpoint. It is unclear whether progress means transfer progress only.
- GET /api/health is presumably unauthenticated for the load balancer, but the component description says the auth dependency applies to every route except signup and login. This is a discrepancy that needs confirmation.
- CSRF protection for cookie-authenticated state-changing requests is not described.
- Cookie attributes beyond 'signed httpOnly' (for example Secure, SameSite) are not specified.
- Session lifetime (expires_at duration) and any idle timeout are not specified.
- It is not stated whether changing the password revokes other active sessions. users.password_changed_at exists, but its use is not described.
- Password policy (minimum length or complexity) is not specified.
- Password reset or recovery is not described.
- The maximum upload size is not specified.
- Chunk size and overlap values are not specified.
- Embedding batch size, and handling of Gemini rate limits or quotas during batch embedding, are not specified.
- The outcome for PDFs with no text layer (scanned or image-only) is not explicitly described, beyond the general failed status. The wording of failure_reason is not specified.
- Text encoding handling for .txt and .md files is not specified.
- The top-k value, the relevance threshold value and the history window size N are not specified.
- Behaviour when a chat has no attached documents is not described.
- HNSW index parameters (m, ef_construction, ef_search) are not specified.
- The presigned URL lifetime is not specified.
- It is not stated whether reduced-dimension (1536) embeddings are normalized before cosine indexing.
- Timeouts, retry or backoff policy, and quota handling for Gemini calls are not specified.
- Synchronous ingestion of large files must finish within the ALB idle timeout of 120s. No file size or page limit is stated to guarantee this, and behaviour on timeout is not described.
- It is not specified whether the S3 object is kept or removed when ingestion fails. Retry implies it is kept.
- Behaviour when the model output fails Pydantic citation validation is not described. For example, it is unclear whether the turn is marked failed or regenerated, and what the user sees after already-streamed tokens.
- The exact wording of the canned not-in-documents reply and the SSE event format are not specified.
- The values of N (history turns) and the threshold are not specified.
- The outcome if the single S3 delete retry also fails is not described, for example reconciliation of orphaned objects.
- Allowed values are not enumerated for documents.status (ready and failed are mentioned; any intermediate state is not), messages.turn_status (pending, complete and failed are mentioned), messages.role and messages.answer_kind.
- Cascade behaviour on chat deletion for message_citations is not explicitly stated. The DELETE /api/chats endpoint mentions messages and attachments only.
- Uniqueness constraints (for example on users.email or on the chat_documents pair) are not stated.
- page_number semantics for .txt and .md files (which have no pages) are not stated.
- Request and response schemas and error codes are not specified.
- Pagination for the document list is not specified.
- Error responses for oversized or unsupported files are not specified.
- The date format in the default chat name is not specified.
- Pagination for the chat list and message history is not specified. Message history is described as 'full'.
- Maximum chat name length and question length limits are not specified.
- It is not explicitly stated that this endpoint is exempt from session authentication (see ARCH-COMP-api).
- The source of injected secrets (for example Secrets Manager or SSM) is not specified.
- ECS task count, autoscaling and CPU or memory sizing are not specified.
- The RDS instance class, Multi-AZ setting and backup retention period are not specified.
- Environments (dev, staging, prod), networking (VPC and subnets) and the CI/CD pipeline are not described.
- Discrepancy: the S3 key pattern ends with a trailing slash here (users/{user_id}/documents/{document_id}/) but not in the ingestion component (users/{user_id}/documents/{document_id}). The exact key layout needs confirmation.
- CloudFront behaviour for long-lived SSE responses on /api/* (origin timeouts, caching disabled) is not specified.
- NFR-005, NFR-028 and NFR-029 are not in the known requirement key list. Their definitions need to be sourced.
- NFR-003, NFR-017 and NFR-018 are not in the known requirement key list. Their definitions need to be sourced.
- The input does not say why AWS was chosen over Google Cloud despite the Gemini dependency. Any cross-cloud latency or egress considerations are undocumented.

### Development

- No approval date or approver is recorded for plan v1.
- The plan does not explicitly assign stories to sprints. Sprint membership in the SPRINT-* entries is inferred from sprint goal wording.
- All epics have role '(unassigned)' and points 'None'.
- All sub-tasks (US-007-T*, US-015-T*, US-019-T*) have points 'None'. Their effort is presumably counted in the parent story, but this is not stated.
- Story-to-sprint assignment is inferred, not stated in the plan.
- No sprint dates and no completion or progress records.
- The 'retry' behaviour appears in the sprint goal but is not described in any story title. Its scope is undefined in the input.
- Per-user isolation (US-004) is scheduled as 'hardening' in Sprint 4, while user data (accounts, uploads, chats) exists from Sprint 1. The input does not say what isolation is in place before Sprint 4.
- No implementation details are recorded, such as auth mechanism, session/token approach, or password hashing.
- No development status for any story.
- Supported file types and the maximum file size for US-006 are not specified in the input.
- Chunk size and overlap, ANN index type, embedding dimensionality, and batch size are not specified.
- No development status for any story or task.
- The input does not say whether deleting a chat (US-014) or detaching documents (US-012) affects library documents or embeddings.
- The top-k value, similarity threshold for 'not in your documents', citation format, and follow-up context window size are not specified.
- US-019 is owned by integration-agent, but all of its tasks are assigned to backend-agent or frontend-agent. Confirm the intended ownership.
- Target breakpoints and devices for mobile layout are not specified.
- No development status for either story.
- The list of environment variables (e.g. Gemini API key, model names, S3 bucket/credentials, database URL) is not given in the input.
- Development has no recorded progress for any of US-001 to US-024 or their tasks.
- The user guide cannot be written until development completion of user-facing features is recorded.
- No App Design screen list (SCR-* keys) was provided, so future user guide entries have no screen keys to map to.

### Testing

- The testing phase has not started. No test plans or results exist for the 74 acceptance criteria or 30 NFRs.

### Deployment

- No deployment date or time recorded.
- No deployer or approver recorded; no release sign-off documented.
- No environment name given (e.g. production vs. staging/preview).
- Version '1b54677ca9a6' looks like a commit or build identifier, but the input does not say what it refers to or link it to a source revision.
- No release notes or change list.
- No list of which requirements (US-001 to US-024) are included in this release, so related_ids to requirements could not be set.
- No post-deployment health check or smoke-test results recorded.
- No rollback plan or previous version recorded.
- No monitoring, logging, or alerting configuration recorded.
- No record of how Gemini API credentials (gemini-2.5-flash, gemini-embedding-001) are configured or secured in the deployed environment.
- No custom domain recorded; the default Amplify domain is in use.
- No record of which backend URL or environment variables the frontend build is configured with.
- No accessibility or availability check result recorded for this URL.
- No hosting or infrastructure details provided (server type, region, container/runtime).
- The backend relies on sslip.io wildcard DNS and a raw IP rather than a custom domain; a human should confirm whether this is intended for this environment.
- No API health endpoint or health-check result recorded.
- No record of where uploaded documents, embeddings/vector index, and chat history/sessions are persisted in this deployment.
- No CORS, authentication, or rate-limiting configuration recorded.

### Maintenance

- There is no post-deployment activity, because nothing has been deployed.
<!-- sdlc:auto:end open-gaps -->
