<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-10-27

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- Google Cloud
- Azure

## Decision Outcome

Chosen option: AWS, because ECS Fargate runs the API container, CloudFront and S3 host the SPA, RDS provides managed PostgreSQL 16 with pgvector and backups, and S3 stores the original files with presigned access.

## Consequences

The ALB plus CloudFront path needs care with buffering, caching and timeouts for SSE. RDS dev cost is a fixed baseline even when idle.
<!-- sdlc:auto:end adr -->