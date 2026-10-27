# RAG-chatbot-gemini-v7 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
Build a rag chatbot where user can upload there own documents and ask queries about them use gemini-2.5-flash for answers and gemini-embedding-001 for embeddings and have chat history and sessions

**Documentation version:** v1
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 1 entry |
| [Development](development/README.md) | 1 entry |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 1 entry |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | not generated yet |
| [API (OpenAPI)](architecture/api/openapi.yaml) | not generated yet |
| [Decisions (ADRs)](architecture/adr/README.md) | 0 decisions |
| [Sprint plan](development/sprint-plan.md) | not generated yet |
| [Developer guide](development/developer-guide.md) | not generated yet |
| [API reference](development/api-reference.md) | 0 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 24 requirements |
| [Changelog](CHANGELOG.md) | 1 version |
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

- The architecture phase has not started or no design artifacts were provided. Missing items include:
- - Data model (users, documents, chunks, chats, messages, attachments)
- - API design
- - SSE streaming design
- - Chunking parameters
- - Embedding dimension choice
- - AWS deployment topology

### Development

- The development phase has not started or no sprint plans or tickets were provided.

### Testing

- The testing phase has not started. No test plans or results exist for the 74 acceptance criteria or 30 NFRs.

### Deployment

- No deployment recorded yet, to ECS Fargate, CloudFront + S3, RDS or any other target.

### Maintenance

- There is no post-deployment activity, because nothing has been deployed.
<!-- sdlc:auto:end open-gaps -->
