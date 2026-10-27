<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-10-27

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Django
- Express

## Decision Outcome

Chosen option: FastAPI 0.115, because Async StreamingResponse relays Gemini tokens as SSE, and run_in_threadpool keeps pypdf and boto3 off the event loop (NFR-005). Pydantic models enforce the citation contract (NFR-029), and pydantic-settings provides fail-fast config (NFR-028).

## Consequences

Synchronous ingestion holds a worker connection for seconds per upload. This is accepted per NFR-006, and the ALB timeout is raised to fit.
<!-- sdlc:auto:end adr -->