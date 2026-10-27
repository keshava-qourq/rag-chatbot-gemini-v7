# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEPLOY-1b54677ca9a6 · draft · source: deployment:1b54677ca9a6

RAG-chatbot-gemini-v7 is deployed and reported as live at version 1b54677ca9a6. The deployment has a separate frontend and backend, each with its own public URL. No other deployment metadata was provided.

- Status: live
- Version: 1b54677ca9a6
- Frontend URL: https://p318d0f073ea3.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://52-12-35-55.sslip.io/apps/318d0f073ea3/
- Both URLs contain the identifier '318d0f073ea3', which suggests they belong to the same app instance.
- Status is recorded here as 'draft' because no approval or sign-off was provided. 'Live' is the deployment's runtime status, not a documentation approval.

**Related:** DEPLOY-1b54677ca9a6-FE, DEPLOY-1b54677ca9a6-BE

- ⚠ No deployment date or time recorded.
- ⚠ No deployer or approver recorded; no release sign-off documented.
- ⚠ No environment name given (e.g. production vs. staging/preview).
- ⚠ Version '1b54677ca9a6' looks like a commit or build identifier, but the input does not say what it refers to or link it to a source revision.
- ⚠ No release notes or change list.
- ⚠ No list of which requirements (US-001 to US-024) are included in this release, so related_ids to requirements could not be set.
- ⚠ No post-deployment health check or smoke-test results recorded.
- ⚠ No rollback plan or previous version recorded.
- ⚠ No monitoring, logging, or alerting configuration recorded.
- ⚠ No record of how Gemini API credentials (gemini-2.5-flash, gemini-embedding-001) are configured or secured in the deployed environment.

### DEPLOY-1b54677ca9a6-FE · draft · source: deployment:1b54677ca9a6

This is the public frontend endpoint for deployment 1b54677ca9a6. The amplifyapp.com domain indicates AWS Amplify hosting.

- URL: https://p318d0f073ea3.d3j61xaup4zgrx.amplifyapp.com
- Hosting: the amplifyapp.com domain indicates AWS Amplify. This is inferred from the URL only; no hosting configuration was provided.
- Protocol: HTTPS

**Related:** DEPLOY-1b54677ca9a6

- ⚠ No custom domain recorded; the default Amplify domain is in use.
- ⚠ No record of which backend URL or environment variables the frontend build is configured with.
- ⚠ No accessibility or availability check result recorded for this URL.

### DEPLOY-1b54677ca9a6-BE · draft · source: deployment:1b54677ca9a6

This is the public backend endpoint for deployment 1b54677ca9a6. It is served under an sslip.io hostname that resolves to IP 52.12.35.55, at the path /apps/318d0f073ea3/.

- URL: https://52-12-35-55.sslip.io/apps/318d0f073ea3/
- The hostname uses the sslip.io wildcard DNS service. It maps to IP address 52.12.35.55, which is derived from the hostname format.
- The app is served under a path prefix (/apps/318d0f073ea3/), which suggests a shared host serving multiple apps. This is an inference from the URL only.
- Protocol: HTTPS

**Related:** DEPLOY-1b54677ca9a6

- ⚠ No hosting or infrastructure details provided (server type, region, container/runtime).
- ⚠ The backend relies on sslip.io wildcard DNS and a raw IP rather than a custom domain; a human should confirm whether this is intended for this environment.
- ⚠ No API health endpoint or health-check result recorded.
- ⚠ No record of where uploaded documents, embeddings/vector index, and chat history/sessions are persisted in this deployment.
- ⚠ No CORS, authentication, or rate-limiting configuration recorded.
<!-- sdlc:auto:end narrative -->
