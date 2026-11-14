# VIDO Technology — Deployment Guide

## Current application build

The current learning build is **VIDO Technology V37** (13 November 2026). It extends the V35 application foundation with an expanded learning library; the backend authentication and database model are unchanged.

- Frontend: `index.html`, `manifest.webmanifest`, and `service-worker.js` (PWA).
- Learning data: `questions-v37.js` (100 new questions) and `lessons-v37.js` (10 structured lessons in German, English and Arabic).
- Backend: Node.js 22 and Express 5.
- Database: PostgreSQL 16.
- Local runtime: Docker Compose.
- Public self-registration: disabled by default.
- AI Tutor: optional; it requires a provider URL and API key in the server environment.

GitHub is the private source-code repository. GitHub Pages can serve static files only; it cannot run the VIDO Express API or PostgreSQL database. A Pages-only deployment would therefore not provide login, administration, or cloud synchronization.

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

The content audit checks 440 questions across 44 skills, fourteen lesson modules in German/English/Arabic, the mapping of each lesson to ten related questions, source records, PWA asset wiring and unique HTML element IDs. It also checks the existing learning foundation. Automated checks do not replace real browser testing on desktop and mobile devices.

## Continuous integration

GitHub Actions validates pushes to `main` and pull requests targeting `main`. The workflow:

1. Installs the exact dependency versions from `package-lock.json` with `npm ci`.
2. Runs `npm test`.
3. Checks production dependency advisories at high severity and above.
4. Builds the production Docker image.

The workflow result is the source of truth for whether those CI checks passed. Local checks and documentation must not be described as a successful CI run unless GitHub reports a successful run.

## Prepared production container deployment

The repository includes:

- `Dockerfile`: production Node image, `npm ci --omit=dev`, non-root `node` user, and health check.
- `.dockerignore`: excludes local environment files, Git data, `node_modules`, dumps, backups, and temporary development scripts from the image.
- `compose.production.yml`: Caddy is the only public service. The app has no published host port. PostgreSQL is on a private internal Docker network.
- `Caddyfile.production`: reverse proxy, automatic HTTPS, and security headers.

The Express app serves the two learning-data files through explicit public frontend routes (`/questions-v37.js` and `/lessons-v37.js`). Backend source, SQL, environment files and Compose configuration remain outside the public route list.
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
- Review Content Security Policy and browser token storage before opening registration. The current frontend uses inline scripts/styles, and its bearer-token storage is documented in `SECURITY_BASELINE.md`.

Do not start the production Compose file on the current local PC as a public launch. It publishes ports 80/443 and uses a separate production database volume. It is prepared for a future hosting server; the current local app remains on its existing Compose profile and volumes.

The production Compose profile enables a startup credential gate. It refuses to start if the JWT secret is shorter than 48 characters or still a placeholder, if the owner/admin passwords are shorter than 12 characters or still placeholders, if those two passwords are identical, if the database URL still contains a placeholder, or if public registration is enabled.

For the current security posture and known limitations, see `SECURITY_BASELINE.md`.
