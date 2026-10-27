# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /health | health | `backend/app/main.py:42` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /api/chats/{id}
- DELETE /api/chats/{id}/documents/{document_id}
- DELETE /api/documents/{id}
- GET /api/auth/me
- GET /api/chats
- GET /api/chats/{id}
- GET /api/chats/{id}/messages
- GET /api/documents
- GET /api/documents/{id}/file-url
- GET /api/health
- PATCH /api/chats/{id}
- POST /api/auth/change-password
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/signup
- POST /api/chats
- POST /api/chats/{id}/messages
- POST /api/chats/{id}/messages/{message_id}/retry
- POST /api/documents
- POST /api/documents/{id}/retry
- PUT /api/chats/{id}/documents/{document_id}
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `7196625`
<!-- sdlc:auto:end source -->
