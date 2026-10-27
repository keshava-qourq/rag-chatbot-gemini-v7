<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-10-27

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- PostgreSQL plus a separate vector database

## Decision Outcome

Chosen option: PostgreSQL 16, because pgvector vector(1536) with an HNSW cosine index lets one SQL query join chunks to chat_documents and filter by owner (NFR-003, NFR-017). Cascading foreign keys delete chunks and attachments in the same transaction (NFR-018).

## Consequences

The HNSW filtered search over-fetches when a chat's attachments are a small fraction of a user's corpus. At MVP scale this is negligible, and hnsw.ef_search can be raised or exact search used for small attachment sets.
<!-- sdlc:auto:end adr -->