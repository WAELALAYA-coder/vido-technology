# VIDO Technology — Security Baseline

Review date: 15 November 2026
Build: VIDO Technology V38 (V35 application foundation + V37 learning library + V38 Diagram Academy)
Current deployment: Local Windows 11 host with Docker Compose
Public release status: Not deployed. Public self-registration is disabled.

## Implemented controls

- Express serves the public frontend routes: `/`, `/index.html`, `/manifest.webmanifest`, `/service-worker.js`, `/questions-v37.js`, `/lessons-v37.js`, `/diagram-curriculum-v38.js`, `/diagram-engine-v38.js`, `/diagram-trainer.js`, and `/diagram-trainer.css`. The six learning-asset routes expose only browser content and use explicit content types with no-cache headers. Backend source, SQL schema, package files, Compose configuration, Git metadata, and environment files are not served.
- The local Docker deployment publishes the app on TCP 3000 for trusted home-LAN access. Windows Firewall has an inbound allow rule for TCP 3000 restricted to RemoteAddress LocalSubnet. PostgreSQL remains bound to 127.0.0.1:5432. The app transport is plain HTTP; use this LAN access only on a trusted private network.
- Public self-registration is disabled by default. The API returns HTTP 403 while disabled. New accounts can be created by the owner through the authenticated administration API.
- Failed-login counters are stored in PostgreSQL. The table contains SHA-256 bucket identifiers rather than raw email addresses or IP values.
- Rate-limit checks and counter reservations run in a single PostgreSQL transaction protected by transaction-scoped advisory locks. Concurrent attempts cannot race through the same limit.
- Limits allow up to 10 failed attempts for one IP-and-identity pair and 30 total login attempts per IP within 15 minutes. A successful login clears the identity counter. IP counters also count successful attempts.
- Old rate-limit rows are deleted automatically.
- Arbitrary client-supplied X-Forwarded-For values are not trusted. Proxy trust is disabled locally. The production template configures trust for one exact IPv4 address assigned to Caddy; invalid or non-IPv4 values stop the server from starting.
- Authenticated API requests validate the JWT, account status, and a database-backed token version. Password resets, role changes, and status changes increment the version and invalidate earlier tokens.
- Owner bootstrap creates the owner only if the account does not already exist. It no longer overwrites an existing owner password on every restart.
- Quick-admin login is restricted to the account configured by `OWNER_EMAIL` only while that database account still has the `owner` role. The JWT uses the verified database role; demoting the account prevents quick-admin from minting an owner token.
- The owner cannot suspend their own account or remove their own owner role through the administration API. The API also prevents deleting the currently authenticated owner.
- New account creation and password resets require at least 12 characters. Password hashes use bcrypt with cost 12.
- Security headers include X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, and Cross-Origin-Resource-Policy. The Express identification header is disabled. API responses are marked no-store.
- The production Dockerfile uses npm ci --omit=dev, runs as the non-root node user, and has a read-only runtime filesystem in the production Compose configuration.
- Node, PostgreSQL, and Caddy production images are pinned by digest in the production templates.
- The GitHub Actions workflow grants only `contents: read` and pins its third-party actions to immutable full commit SHAs.
- npm audit reports zero known vulnerabilities in the checked dependency tree.

## Verification performed

- Backend and database health: passed.
- Registration API while disabled: HTTP 403.
- Static frontend and PWA routes: HTTP 200.
- Backend, SQL, package, Compose, environment, and Git paths: HTTP 404.
- Concurrent identity test: 20 simultaneous invalid logins produced exactly 10 HTTP 401 responses and 10 HTTP 429 responses.
- IP test: 30 invalid requests using different identities and changed X-Forwarded-For values were followed by HTTP 429 on request 31.
- Persistent lockout: a rate-limit lock remained effective after restarting the app container.
- Session validation: valid active token accepted; expired token, wrong token version, changed token version, and suspended account rejected.
- Owner password hash fingerprint and user count were unchanged by the database migration.
- Temporary test rate-limit rows and temporary test identities were removed after testing.
- Production Compose configuration passed docker compose config --quiet using the example environment file.
- Caddyfile passed caddy validate and was formatted.
- Production app image built successfully from the pinned Node base image. It runs as UID 1000 and contains no .env, .env.production, .git, backup directory, or temporary test scripts.
- The automated content audits check 440 questions across 44 skills, fourteen structured lessons in German/English/Arabic, ten question mappings per lesson, eleven trilingual diagram modules, eight example models, twenty original diagram questions, official source links, negative validator cases, PWA asset loading and unique HTML IDs.
- The HTTP smoke tests verify all six public learning assets and confirm that backend/configuration paths remain unavailable (HTTP 404).
- Host and container dependency audits reported zero known vulnerabilities.

## Learning content expansion (V37)

- The front end loads the additional question and lesson datasets as two dedicated read-only JavaScript assets.
- Express exposes only those two exact asset paths; it does not enable a broad static directory listing or expose server-side source/configuration files.
- Lesson content is original instructional material with links to official or specialist documentation. User-specific learning progress remains in the existing local/browser and optional authenticated sync mechanisms.
- This content update does not modify authentication, authorization, payment, database schema, or existing user records.

## Current environment and limitations

This is a hardened local deployment, not a public production service.

1. HTTPS/TLS is not active locally. The production Caddy configuration is prepared for automatic HTTPS, but no public domain or server has been connected.
2. Proxy trust is disabled locally. The production template trusts only the exact Caddy IPv4 address 172.29.250.2.
3. Content Security Policy is not enabled because the current frontend includes inline scripts and styles. A strong CSP requires refactoring these assets and testing the full UI.
4. Browser tokens are bearer tokens stored in browser session storage; the optional keep-me-signed-in feature uses local storage. A future public release should consider HttpOnly, Secure, SameSite cookie sessions and CSRF protections.
5. MFA, email verification, and self-service password recovery are not configured. Registration remains closed.
6. Backups currently reside on the Windows device. The scheduled task and private GitHub source synchronization do not provide off-site PostgreSQL backups. Production needs encrypted off-site backups and regular restore drills.
7. The AI tutor is disabled in the running container because the runtime has no provider URL or API key configured.
8. The local database connection is plain inside the private Docker network. An externally hosted database must use provider TLS and private networking.
9. Production image digests are pinned in the prepared Dockerfile and Compose template. Update them through controlled security reviews.

## Prepared production files

- Dockerfile: production Node runtime, non-root user, health check.
- .dockerignore: excludes secrets, Git metadata, backups, and temporary development scripts.
- compose.production.yml: Caddy is the only public service; app and database are not published as host ports; PostgreSQL is on an internal network.
- Caddyfile.production: reverse proxy, automatic HTTPS, security headers.
- .env.production.example: placeholders only, no working secrets.

The production configuration was validated and the app image was built. The production stack has not been started on the local PC because it would open ports 80 and 443 and requires a real domain, public host, DNS, and production secrets.

## Release gate before going public

- Select an EU-based hosting provider and configure a domain.
- Point DNS to the hosting server and enable inbound TCP 80/443; UDP 443 is optional for HTTP/3.
- Create the real .env.production file on the hosting server using a password manager. Never commit it.
- Keep registration disabled for the initial private launch.
- Configure provider-encrypted storage, encrypted off-site PostgreSQL backups, and tested recovery.
- Review CSP and browser token storage before opening registration.
- Configure monitoring for application health, database availability, disk space, certificates, and backup failures.

Important: GitHub Pages can host only a static frontend. It cannot run this Express API and PostgreSQL database, so it is not a complete VIDO hosting target.

- The production-only credential gate requires a unique JWT secret of at least 48 characters, owner and quick-admin passwords of at least 12 characters, different owner/admin passwords, a real database URL, and disabled public registration. It rejects the example placeholders before the public service can start. The local development Compose profile does not enable this gate.


## V38 diagram learning assets

- Public learning assets: `diagram-curriculum-v38.js`, `diagram-engine-v38.js`, `diagram-trainer.js`, and `diagram-trainer.css`, served only through explicit Express routes.
- These assets contain instructional material and example models; they do not contain credentials, user records, production configuration or secrets.
- Diagram drafts and completion progress are stored locally in the user's browser. No new database schema, authentication, payment or production deployment settings were changed for V38.
- The semantic validator is a learning-time consistency checker, not proof that a real network or system configuration is correct. Validate network diagrams against the actual device configuration and approved documentation.
- The diagram audit checks the 11 modules, eight example templates, 20 trilingual quizzes, source links and negative validator cases; this is structural validation, not formal standards certification.


## AI tutor request controls

- The authenticated AI tutor endpoint validates input types/lengths and accepts only the supported German, English, and Arabic locale codes.
- Each authenticated user is limited to 10 AI tutor requests per 60-second database window. The counter reuses the persistent auth_rate_limits table and stores a SHA-256-derived user key rather than a raw user identifier.
- Counter updates use a single PostgreSQL upsert, so simultaneous requests for one account cannot bypass the limit. Counters are capped at 11 while blocked and are removed by the existing one-day cleanup.
- Outbound AI provider requests have a 30-second timeout. Upstream non-success response bodies are not returned to the browser.
- These controls reduce accidental or abusive provider usage; they do not replace provider-side spending limits, monitoring, or account-level billing alerts.


## Browser API client consolidation

- The main application, account helper, button reliability helper, and remember-me session validation now route requests through one `window.VIDO_API_CLIENT` function.
- The client preserves existing same-origin API paths, JSON headers, and current bearer-token behavior. JWT storage remains in sessionStorage, with the optional remember-me copy still in localStorage.
- This is a preparatory refactor only. It does not claim HttpOnly cookie sessions or CSRF protection; those require a separate coordinated backend/frontend migration and dedicated session tests.


## Server-side logout and token revocation

- The authenticated `POST /api/auth/logout` endpoint increments the account's database-backed `token_version`.
- This invalidates every JWT currently issued for that account, including a remembered browser token and tokens on other devices. The endpoint reports `scope: all_sessions` so the behavior is explicit.
- The browser requests revocation before clearing its local session. If the request fails, local sign-out still completes and the login screen displays a warning that server-side revocation could not be confirmed.
- This does not replace the planned HttpOnly cookie migration or CSRF protection.
- This is an authentication behavior change separate from the V38 learning-content feature. It is present on the open maintenance branch and requires explicit maintainer approval before merge; no production deployment is implied.
