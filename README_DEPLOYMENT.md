# VIDO Technology — Deployment Guide

## Current application build

The current learning build is **VIDO Technology V39** (15 November 2026): the V38 Diagram Academy and V37 learning library, plus the coordinated HttpOnly cookie-session and CSRF hardening. The V39 authentication changes use a session-bound CSRF token and account-wide logout revocation. They require a live PostgreSQL integration test and real-browser verification before production rollout.

- Frontend: `index.html`, `manifest.webmanifest`, and `service-worker.js` (PWA).
- Learning data: `questions-v37.js` (140 additional questions, IDs `0301`–`0440`; 440 questions total) and `lessons-v37.js` (14 structured lessons in German, English and Arabic).
- Diagram Academy: 11 trilingual learning modules, eight editable example models and 20 original practice questions, with browser-side editing and SVG export.
- Backend: Node.js 22 and Express 5.
- Database: PostgreSQL 16.
- Local runtime: Docker Compose.
- Public self-registration: disabled by default.
- AI Tutor: optional; it requires a provider URL and API key in the server environment.

GitHub is the source-code repository. GitHub Pages can serve static files only; it cannot run the VIDO Express API or PostgreSQL database. A Pages-only deployment would therefore not provide login, administration, or cloud synchronization.

## Local development and verification

The committed `docker-compose.yml` maps the application to `127.0.0.1:3000` and PostgreSQL to `127.0.0.1:5432`. This is the repository default. The Windows development machine may use a separate, local-only LAN adjustment for phone access; keep such machine-specific networking changes out of Git. When LAN access is enabled, restrict inbound TCP 3000 to the trusted local subnet with Windows Firewall. Do not expose PostgreSQL to the LAN or the public internet.

Keep real environment values in the local `.env` file only. Use `.env.example` as a template. It contains placeholders, not working credentials.

Important variables:

- `POSTGRES_PASSWORD`
- `JWT_SECRET` (long, randomly generated secret)
- `OWNER_EMAIL` and `OWNER_PASSWORD` (the owner is created only if the account does not already exist)
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` (server-side quick-admin login)
- `REGISTRATION_ENABLED=false`
- Optional AI variables: `AI_API_URL`, `AI_API_KEY`, `AI_MODEL`

Start the local services:

    docker compose --env-file .env up -d

Check the API:

    Invoke-RestMethod http://127.0.0.1:3000/api/health

Install the locked Node dependencies and run the local checks:

    npm ci
    npm test
    npm audit --omit=dev --audit-level=high

The audits check 440 questions across 44 skills, fourteen lesson modules in German/English/Arabic, ten-question lesson mappings, eleven trilingual diagram modules, eight example models, twenty original diagram quizzes, official source records, negative validator cases, PWA asset wiring and unique HTML element IDs. Automated checks do not replace real browser testing on desktop and mobile devices.

## Continuous integration

GitHub Actions validates pushes to `main` and pull requests targeting `main`. The workflow:

1. Installs the exact dependency versions from `package-lock.json` with `npm ci`.
2. Checks JavaScript syntax for the backend, learning assets and audit scripts.
3. Runs `npm test` (diagram audit and application/content audit).
4. Smoke-tests the six public learning assets and confirms private backend/configuration paths return HTTP 404.
5. Checks production dependency advisories at high severity and above.
6. Builds the production Docker image.

The workflow grants only `contents: read`, disables checkout credential persistence, and pins third-party actions to immutable full commit SHAs. It uses `actions/checkout` v7.0.1 and `actions/setup-node` v7.0.0 (Node.js 24 for the action runtime); the application test/runtime target remains Node.js 22 to match the production image. The former Node.js 20 action-runtime deprecation warning is resolved.

The workflow result is the source of truth for whether those CI checks passed. Local checks and documentation must not be described as a successful CI run unless GitHub reports a successful run.

## Prepared production container deployment

The repository includes:

- `Dockerfile`: production Node image, `npm ci --omit=dev`, non-root `node` user, and health check.
- `.dockerignore`: excludes local environment files, Git data, `node_modules`, dumps, backups, and temporary development scripts from the image.
- `compose.production.yml`: Caddy is the only public service. The app has no published host port. PostgreSQL is on a private internal Docker network.
- `Caddyfile.production`: reverse proxy, automatic HTTPS, and security headers.

The Express app serves six learning assets through explicit public frontend routes: `/questions-v37.js`, `/lessons-v37.js`, `/diagram-curriculum-v38.js`, `/diagram-engine-v38.js`, `/diagram-trainer.js`, and `/diagram-trainer.css`. These routes expose browser learning content only. Backend source, SQL, environment files and Compose configuration remain outside the public route list.
- `.env.production.example`: environment template only; it contains placeholders, not usable credentials.

The Node, PostgreSQL, and Caddy images are pinned by digest in the production configuration.

### Prepare the production host

1. Choose an EU-based server/container host and a domain.
2. Point the domain's DNS A record to the server's public IPv4 address. Configure IPv6 only when the provider and firewall support it correctly.
3. Allow inbound TCP 80 and 443. UDP 443 is optional for HTTP/3. Do not expose PostgreSQL.
4. Copy the repository to the host and create the real environment file:

       cp .env.production.example .env.production

5. Replace every placeholder using a password manager. Generate `POSTGRES_PASSWORD` and `JWT_SECRET` as unique URL-safe random values. The database password is embedded in a PostgreSQL connection URL, so use only letters, digits, underscore, and hyphen.
6. Keep `REGISTRATION_ENABLED=false` for the private launch.
7. The template fixes Caddy at `172.29.250.2` and the app at `172.29.250.3`. `TRUSTED_PROXY_IP` must match Caddy's exact address: `172.29.250.2`. If the subnet conflicts with the hosting network, change the Compose subnet and both static IPs consistently.
8. Validate the configuration and start the service:

       docker compose --env-file .env.production -f compose.production.yml config --quiet
       docker compose --env-file .env.production -f compose.production.yml up -d --build

Caddy will request and renew the TLS certificate after the domain resolves to the server and ports 80/443 are reachable. The backend trusts only the exact Caddy container IPv4 address; it does not trust arbitrary forwarding headers from clients.

## Production template validation status

The production Compose configuration, Caddyfile, and production image were validated/built during the documented local preparation. These are configuration and image-build checks only; they do not mean that a public production stack is running.

The production stack has intentionally not been started on the local PC because it publishes ports 80/443 and requires a real domain, DNS, a public host, and production secrets.

## Production operations still required

- Enable encrypted storage and automated off-site database backups with the hosting provider.
- Test a restore from the provider's off-site backup before launch.
- Configure monitoring and alerts for disk space, container health, certificate renewal, database availability, and backup failures.
- Keep SSH and provider firewall rules restricted. Do not publish the database port.
- Refresh pinned image digests through a controlled security review process.
- Review Content Security Policy and complete browser-based HTTPS authentication tests (including Safari/iOS) before opening registration. The current frontend uses inline scripts/styles. Authentication now uses an HttpOnly session cookie and a separate session-bound CSRF cookie; the JWT is not returned to browser JavaScript.

Do not start the production Compose file on the current local PC as a public launch. It publishes ports 80/443 and uses a separate production database volume. It is prepared for a future hosting server; the current local app remains on its existing Compose profile and volumes.

The production Compose profile enables a startup credential gate. It refuses to start if the JWT secret is shorter than 48 characters or still a placeholder, if the owner/admin passwords are shorter than 12 characters or still placeholders, if those two passwords are identical, if the database URL still contains a placeholder, or if public registration is enabled.

For the current security posture and known limitations, see `SECURITY_BASELINE.md`.


## Diagram Academy V38 assets

The V38 learning interface adds a browser-side Diagram Academy. The Express server exposes only the explicit learning asset routes for the diagram curriculum, validator, trainer JavaScript and trainer CSS. The diagram practice editor stores drafts and progress in the browser's local storage; it does not add database tables or send diagram drafts to the API. The SVG export is generated client-side. CI validates the curriculum and sample models and smoke-tests the explicit asset routes.


## V39 PostgreSQL authentication integration test

The CI workflow runs `npm run test:auth-postgres` against a disposable PostgreSQL 16 service. The test initializes the schema, starts an isolated Express process and checks cookie-based login, CSRF rejection, same-origin enforcement, closed self-registration, quick-admin owner-role enforcement, and account-wide logout revocation.

For local execution, set `VIDO_TEST_DATABASE_URL` to a disposable PostgreSQL database on `127.0.0.1` or `localhost` whose database name contains `test` or `ci`. The test intentionally refuses remote database hosts and database names that do not match that safety rule. Do not use a production or personal learning database.

This integration test does not replace a manual HTTPS browser test. Safari/iOS and other real-device checks remain outstanding.


## Local Windows workstation notes

The following values describe a local development example. They are not production endpoints and may differ from your workstation:

- VIDO frontend: `http://127.0.0.1:3001`
- Backend health: `http://127.0.0.1:3001/api/health`
- Optional local PostgreSQL port: `127.0.0.1:5433`

Keep local application and database ports bound to loopback. Do not change host bindings to `0.0.0.0` or expose PostgreSQL to the LAN or public internet. If the repository's Compose configuration uses different ports, follow that configuration.

Run the provided `start-vido.bat` and `stop-vido.bat` scripts from the project directory when they are present. Stopping Compose does not delete named volumes. Do not use `docker compose down -v` unless you intentionally want to delete the local database and other named-volume data.

Keep backup archives outside the repository. Exclude `.env`, credentials, API keys and personal data; verify backup integrity and perform restore drills against a separate disposable database. Maintain an encrypted off-device copy before relying on backups for recovery. Configure scheduled backup jobs locally and keep machine-specific paths, task names and backup filenames out of public documentation.

A local development setup is not a public production release. Configure optional AI provider credentials only as server-side environment variables; never place API keys in frontend code or commit them to Git.

## Account registration and password recovery

The server keeps public registration disabled by default. Enabling it requires both `REGISTRATION_ENABLED=true` and the explicit production approval flag `VIDO_ALLOW_PUBLIC_REGISTRATION=true`. Registration validates email syntax, requires a password of at least 12 characters, and uses the database-backed login rate limits. There is no mailbox ownership verification until an email sender is configured.

The sign-in screen provides account creation and a **Forgot password** flow. Password recovery uses single-use, random tokens stored only as SHA-256 hashes, expires after 30 minutes, and increments the account's token version so existing sessions are revoked. The reset email is sent through Resend. Configure all three server variables to activate delivery:

- `RESEND_API_KEY`: Resend API key.
- `RESEND_FROM_EMAIL`: a sender address verified by Resend.
- `PUBLIC_APP_URL`: the public HTTPS origin, for example `https://vido-web-production.up.railway.app`.

Without a configured, verified sender, the recovery screen explains that email delivery is not ready; it does not claim that a reset email was sent. Never place the Resend key in frontend code or commit it to Git.
