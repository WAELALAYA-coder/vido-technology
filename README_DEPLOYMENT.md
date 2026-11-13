# VIDO Technology — Deployment Guide

## Current V33 runtime

VIDO V33 is a full-stack application:

- Frontend: index.html, manifest.webmanifest, service-worker.js (PWA).
- Backend: Node.js 22 and Express 5.
- Database: PostgreSQL 16.
- Local runtime: Docker Compose.

The local deployment binds the application and PostgreSQL to 127.0.0.1. Public self-registration is disabled. The security controls are documented in SECURITY_BASELINE.md.

## Important hosting distinction

GitHub is the private source-code repository. GitHub Pages can serve static files only; it cannot run the VIDO Express API or PostgreSQL database. A Pages-only deployment would not provide login, administration, or cloud synchronization.

The complete application needs a server/container host and a PostgreSQL service.

## Local start and verification

From the project root, run:

    docker compose --env-file .env up -d

Check the API:

    Invoke-RestMethod http://127.0.0.1:3000/api/health

Run the content and dependency audits:

    npm test
    npm audit

Expected content-audit result: 300 questions and 210 unique IDs.

## Local environment

Keep real values in the local .env file only. Use .env.example as a template. It contains placeholders, not working credentials.

Important variables:

- POSTGRES_PASSWORD
- JWT_SECRET (long, randomly generated secret)
- OWNER_EMAIL and OWNER_PASSWORD (the owner is created only if the account does not already exist)
- ADMIN_USERNAME and ADMIN_PASSWORD (server-side quick-admin login)
- REGISTRATION_ENABLED=false
- Optional AI variables: AI_API_URL, AI_API_KEY, AI_MODEL

Never commit .env, database dumps, or backup folders.

## Prepared production container deployment

The repository includes:

- Dockerfile: production Node image, npm ci --omit=dev, non-root node user, health check.
- .dockerignore: excludes local environment files, Git data, node_modules, dumps, backups, and temporary scripts from the image.
- compose.production.yml: Caddy is the only public service. The app has no published host port. PostgreSQL is on a private internal Docker network.
- Caddyfile.production: reverse proxy with automatic HTTPS and security headers.
- .env.production.example: environment template only; it contains placeholders, not usable credentials.

The Node, PostgreSQL, and Caddy images are pinned by digest.

### Prepare the production host

1. Choose an EU-based server/container host and a domain.
2. Point the domain's DNS A record to the server's public IPv4 address. Configure IPv6 only when the provider and firewall support it correctly.
3. Allow inbound TCP 80 and 443. UDP 443 is optional for HTTP/3. Do not expose PostgreSQL.
4. Copy the repository to the host and create the real environment file:

       cp .env.production.example .env.production

5. Replace every placeholder using a password manager. Generate POSTGRES_PASSWORD and JWT_SECRET as unique URL-safe random values. The database password is embedded in a PostgreSQL connection URL, so use only letters, digits, underscore, and hyphen.
6. Keep REGISTRATION_ENABLED=false for the private launch.
7. The template fixes Caddy at 172.29.250.2 and the app at 172.29.250.3. TRUSTED_PROXY_IP must match Caddy's exact address: 172.29.250.2. If the subnet conflicts with the hosting network, change the Compose subnet and both static IPs consistently.
8. Validate the configuration and start the service:

       docker compose --env-file .env.production -f compose.production.yml config --quiet
       docker compose --env-file .env.production -f compose.production.yml up -d --build

Caddy will request and renew the TLS certificate after the domain resolves to the server and ports 80/443 are reachable. The backend trusts only the exact Caddy container IPv4 address; it does not trust arbitrary forwarding headers from clients.

## Production template validation status

- Production Compose configuration passed docker compose config --quiet.
- Caddyfile passed caddy validate.
- The production app image built successfully from the pinned Node image.
- The image runs as the non-root node user (UID 1000).
- The image excludes .env, .env.production, .git, backup folders, and temporary scripts.

These are local build/configuration checks only. The production stack has intentionally not been started on the local PC because it publishes ports 80/443 and requires a real domain, DNS, a public host, and production secrets.

## Production operations still required

- Enable encrypted storage and automated off-site database backups in the hosting provider. The Windows scheduled task in local development does not back up a remote production database.
- Test a restore from the provider's off-site backup before launch.
- Configure monitoring and alerts for disk space, container health, certificate renewal, database availability, and backup failures.
- Keep SSH and provider firewall rules restricted. Do not publish the database port.
- Refresh pinned image digests through a controlled review process as security updates are released.

Do not start the production Compose file on the current local PC as a public launch. It publishes ports 80/443 and uses a separate production database volume. It is prepared for the future hosting server; the current local app remains on its existing Compose file and volumes.

The production Compose profile enables a startup credential gate. It will refuse to start if the JWT secret is shorter than 48 characters or still a placeholder, if the owner/admin passwords are shorter than 12 characters or still placeholders, if those two passwords are identical, if DATABASE_URL still contains a placeholder, or if public registration is enabled. The local development Compose profile does not enable this production-only gate.
