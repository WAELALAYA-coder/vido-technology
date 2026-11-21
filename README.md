# VIDO Technology

**A multilingual learning platform for IT fundamentals and Fachinformatiker/in für Systemintegration (FiSi).**

VIDO Technology brings structured lessons, practice questions and interactive technical exercises together in German, English and Arabic.

## What is included?

- **440 practice questions** across 44 skills.
- **14 structured lessons** in German, English and Arabic.
- **Diagram Academy:** 11 progressive modules covering flowcharts, UML, ER modelling, network diagrams, BPMN, C4 and data-flow diagrams.
- **8 editable diagram examples** with browser-side editing and SVG export.
- **20 original diagram practice questions** with explanations.
- **Optional AI Tutor** that can provide guided hints when a provider is configured by the server administrator.
- Progressive Web App (PWA) support.

The practice questions are original learning material. They are not official IHK examination questions and are not an official IHK product.

## Start learning locally

The complete application uses **Node.js 22, Express 5 and PostgreSQL 16**. Docker Desktop is the simplest way to start the complete stack on Windows.

1. Install and start Docker Desktop.
2. Clone this repository and open its folder:

   `git clone https://github.com/WAELALAYA-coder/vido-technology.git`

   `cd vido-technology`

3. Create your private environment file:

   **PowerShell**
   `Copy-Item .env.example .env`

4. Open `.env` and replace every `REPLACE_...` value. Set your own owner email, a unique owner password of at least 12 characters, a different admin password, a long random JWT secret (at least 32 characters), and a unique database password. Keep the AI variables empty when you do not use the optional AI Tutor.

5. Create the two external Docker volumes required by `docker-compose.yml` (safe to repeat; existing volume data is preserved):

   `docker volume create vido_technology_v39_pgdata`

   `docker volume create vido_technology_v39_node_modules`

6. Start the local application:

   `docker compose --env-file .env up -d --build`

7. Open **http://127.0.0.1:3001** in your browser. Check the backend/database health with:

   `Invoke-RestMethod http://127.0.0.1:3001/api/health`

The first owner account is created from `OWNER_EMAIL` and `OWNER_PASSWORD` when the database starts. The optional quick-admin login uses `ADMIN_USERNAME` and `ADMIN_PASSWORD`. Public self-registration is disabled by default.

To stop the local services:

`docker compose --env-file .env down`

Your PostgreSQL data remains in the Docker volume. Do not use `docker compose down -v` unless you intentionally want to delete that database volume.

## Development checks

Install the locked dependencies:

`npm ci`

Run the content and security unit audits:

`npm test`

Run the PostgreSQL-backed authentication integration test against a **separate disposable local database**:

`npm run test:auth-postgres`

The integration test requires `VIDO_TEST_DATABASE_URL`. It deliberately refuses remote database hosts and database names that do not contain `test` or `ci`. Never point it at production or personal learning data.

The GitHub Actions workflow runs syntax checks, content and security audits, HTTP smoke tests, PostgreSQL-backed authentication integration tests, dependency advisory checks and the production Docker image build.

## Important deployment notes

- This repository contains source code and local deployment instructions. A public GitHub repository is **not** the same as a live hosted application.
- GitHub Pages cannot run the Express API or PostgreSQL database. Login, administration and server-side progress require the full backend and database.
- The production Compose profile is prepared for a real server and domain. It has not been deployed by this repository change.
- Before production use, complete real-browser testing (including Safari/iOS), backup/restore drills, monitoring and the remaining security review.
- Never commit `.env`, `.env.production`, passwords, API keys, database backups or personal data.
- See [Deployment Guide](README_DEPLOYMENT.md), [Security Baseline](SECURITY_BASELINE.md) and [Learning Sources](LEARNING_SOURCES.md).

## License

No license file is currently included. Public visibility allows people to inspect the repository on GitHub, but does not automatically grant permission to reuse or redistribute the code and learning material. Add an explicit license before accepting external reuse contributions.

## Computer, tablet and phone support
VIDO uses one responsive web application for desktop, tablet and mobile browsers; there are no separate Windows, Android or iOS codebases to keep in sync. On a deployed HTTPS address, use **Install app** in desktop Chrome/Edge, **Install app / Add to Home Screen** in Android Chrome, or **Share → Add to Home Screen** in iPhone Safari. The PWA includes VIDO app icons and an offline shell for previously cached learning assets; sign-in and API features still require the server to be reachable.

**Local Windows note:** the default Docker setup binds to `127.0.0.1:3001` intentionally. It is reachable only on that computer. To use VIDO from a separate phone/tablet, deploy behind a trusted HTTPS hostname or configure a properly trusted private HTTPS reverse proxy. Do not expose the database port or disable Secure session cookies.