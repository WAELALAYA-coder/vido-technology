# VIDO Technology — Security Baseline

**Review date:** 13 November 2026
**Build:** VIDO Changeable Build V33
**Current deployment:** Local Windows 11 host, Docker Compose
**Public release status:** Not deployed; public registration is disabled.

## Implemented controls

- The Express server serves only the public frontend files: `/`, `/index.html`, `/manifest.webmanifest`, and `/service-worker.js`. Backend source, SQL schema, package files, Compose configuration, Git metadata, and `.env` are not served.
- Docker publishes the application and PostgreSQL ports on `127.0.0.1`, not on all network interfaces.
- Public self-registration is disabled by default through `REGISTRATION_ENABLED=false`. The backend returns HTTP 403 even if a client manually calls the registration API. New accounts can be created by the owner through the authenticated administration API.
- Failed login controls use PostgreSQL rather than process memory. The rate-limit table stores SHA-256 bucket identifiers rather than raw email/IP values. Limits are 10 failures per IP-and-identity pair and 30 failures per IP within 15 minutes. Old rows are cleaned automatically.
- The application does not trust arbitrary `X-Forwarded-For` values. Express proxy trust is explicitly disabled for the current direct localhost deployment.
- Authenticated API requests check the JWT, account status, and a database-backed token version. Password resets, role changes, and status changes increment the version to invalidate older tokens.
- Owner bootstrap creates the owner only when the account does not already exist. It no longer overwrites an existing owner password at every application restart.
- New account passwords, administrative account creation, and password resets require at least 12 characters. Password hashes use bcrypt with cost 12.
- Security response headers include `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, a restrictive Referrer Policy, and a Permissions Policy. The Express identification header is disabled. API responses are marked `no-store`.
- The app and database passed health checks after the changes. The 300-question content audit passed.
- `npm audit` reports zero known vulnerabilities in the checked dependency tree, both on the host and inside the app container.

## Verification performed

- Backend and database health: passed.
- Registration API while disabled: HTTP 403.
- Static frontend and PWA files: HTTP 200.
- Backend/SQL/configuration/secret paths: HTTP 404.
- Identity rate limit: 10 failed attempts followed by HTTP 429.
- IP rate limit: 30 failed attempts across different identities and forged `X-Forwarded-For` values, followed by HTTP 429.
- Persistent rate limit: a lockout remained effective after restarting the app container.
- Session validation: current active token accepted; expired token, wrong token version, changed token version, and suspended account rejected.
- Owner password hash fingerprint and user count were unchanged by the schema migration.
- Temporary test rate-limit rows and temporary test users were not retained.

## Current environment and limitations

This is a hardened **local deployment**, not a public production service.

1. **HTTPS/TLS is not configured.** Localhost is currently served over HTTP. A public release needs a domain, TLS reverse proxy, HSTS at the HTTPS edge, and secure certificate renewal.
2. **Reverse proxy trust is deliberately off.** Before placing the app behind a proxy, configure trust only for the exact trusted proxy/network. Do not enable unrestricted proxy trust.
3. **Content Security Policy is not enabled.** The current frontend contains inline scripts and styles. A robust CSP requires moving scripts/styles to managed assets or adding nonces/hashes and testing the full UI first.
4. **Browser tokens remain bearer tokens.** The app keeps its session token in browser session storage; its optional “keep me signed in” feature uses local storage. A future public release should consider an HttpOnly, Secure, SameSite cookie session design and CSRF controls.
5. **No MFA, email verification, or self-service password reset workflow is configured.** Public registration remains disabled until these product flows are designed.
6. **Database backups are local.** The scheduled backup task and private GitHub source synchronization do not create an off-site copy of the PostgreSQL dump. Public production requires encrypted off-site backups and periodic restore drills.
7. **AI tutor is disabled.** No AI API key or provider configuration was enabled.
8. **Database transport is plain inside the current private Docker network.** An externally hosted database must use its provider's TLS connection settings and private networking where available.
9. **Container image tags are not digest-pinned.** Pin reviewed image digests for a reproducible public production deployment.

## Release gate before going public

- Select an EU-based hosting provider and configure a domain.
- Configure HTTPS, secure reverse-proxy IP handling, and production security headers.
- Move secrets into the hosting provider's secret manager; never commit `.env`.
- Confirm owner/admin credentials in a password manager and rotate any secret that has been reused elsewhere.
- Configure encrypted off-site PostgreSQL backups and test recovery from that location.
- Decide whether registration stays invite-only or is opened with email verification, abuse protection, and account recovery.
- Test the application on the production hostname, including login, session revocation, PWA installation, mobile layout, administration, and database recovery.

**Important:** GitHub Pages can host only a static frontend. It cannot run this VIDO Express API or PostgreSQL service. It is not the production hosting target for the complete application.
