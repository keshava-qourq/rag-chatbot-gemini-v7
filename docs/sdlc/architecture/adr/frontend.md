<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-10-27

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue 3
- Svelte

## Decision Outcome

Chosen option: React 19, because Built as a static SPA served from CloudFront and S3. React state cleanly separates the streaming assistant bubble from independently updating document statuses, and react-router covers the dashboard, library, chat and settings routes.

## Consequences

Client-side routing means auth gating happens through /api/auth/me plus server 401s, not server rendering. That is acceptable because every API call is authenticated server-side.
<!-- sdlc:auto:end adr -->