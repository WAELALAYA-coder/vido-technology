# VIDO Technology — Deployment Guide

## Current V33 runtime

VIDO V33 is a full-stack application:

- Frontend: `index.html`, `manifest.webmanifest`, `service-worker.js` (PWA).
- Backend: Node.js 22 and Express 5.
- Database: PostgreSQL 16.
- Runtime: Docker Compose.

The local Docker deployment binds the app and database to `127.0.0.1`. Public self-registration is disabled by default. The deployment settings and current security controls are documented in [SECURITY_BASELINE.md](SECURITY_BASELINE.md).

## Important hosting distinction

GitHub is used as a **private source-code repository**. GitHub Pages can serve static files only; it cannot run the VIDO Express API or PostgreSQL database. A Pages-only deployment would therefore not provide the complete VIDO experience, including login, administration, and cloud synchronization.

The complete application needs a server/container host and a PostgreSQL service. A public production deployment has not been configured yet.

## Local start and verification

From the project root:

```powershell
docker compose --env-file .env up -d
```

Check the API:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
```

Run the content audit and dependency security audit:

```powershell
npm test
npm audit
```

Expected content-audit result: 300 questions and 210 unique IDs.

## Environment variables

Keep real values in the local `.env` file only. Use `.env.example` as a template; it contains placeholders, not working credentials.

Important variables:

- `DATABASE_URL` / `POSTGRES_PASSWORD`
- `JWT_SECRET` (long, randomly generated secret)
- `OWNER_EMAIL` and `OWNER_PASSWORD` (used to create the owner account only if it does not already exist)
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` (server-side quick-admin login)
- `REGISTRATION_ENABLED=false` (keep disabled for the private deployment)
- Optional AI variables: `AI_API_URL`, `AI_API_KEY`, `AI_MODEL`

Never commit `.env`, database dumps, or backup folders.

## Public production release gate

Before opening the service to the internet:

1. Choose an EU-based container host and managed/private PostgreSQL service.
2. Configure a domain, HTTPS reverse proxy, certificate renewal, and HSTS at the HTTPS edge.
3. Configure trusted proxy addresses precisely; do not enable unrestricted proxy trust.
4. Store secrets in the hosting provider's secret manager and rotate credentials that may have been reused.
5. Use TLS for an externally hosted database.
6. Configure encrypted off-site database backups and test a restore from the off-site copy.
7. Decide whether accounts remain invite-only or public registration is introduced with email verification and account recovery.
8. Review the CSP/session-storage limitations documented in [SECURITY_BASELINE.md](SECURITY_BASELINE.md), then test the full application on the production hostname.

Do not expose PostgreSQL directly to the internet. Keep database access on a private network and restrict administrative access.
