import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readFile } from 'node:fs/promises';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;
const databaseUrl = process.env.VIDO_TEST_DATABASE_URL || '';
if (!databaseUrl) throw new Error('VIDO_TEST_DATABASE_URL is required; use a disposable local database.');
const parsedDatabaseUrl = new URL(databaseUrl);
const databaseName = decodeURIComponent(parsedDatabaseUrl.pathname.replace(/^\//, ''));
if (!['127.0.0.1', 'localhost', '::1'].includes(parsedDatabaseUrl.hostname) ||
    !/(?:^|[_-])(?:test|ci)(?:$|[_-])/i.test(databaseName)) {
  throw new Error('Refusing to run: the test database must be local and its name must contain test or ci.');
}

const ownerEmail = `vido-ci-${randomUUID()}@example.invalid`;
const ownerPassword = randomBytes(24).toString('base64url');
const adminUsername = `ci-admin-${randomUUID().slice(0, 8)}`;
const adminPassword = randomBytes(24).toString('base64url');
const jwtSecret = randomBytes(48).toString('base64url');
const database = new Pool({ connectionString: databaseUrl, ssl: false });
let child;
let stdout = '';
let stderr = '';
let baseUrl = '';
let ownerCreated = false;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function reservePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  await new Promise(resolve => server.close(resolve));
  return address.port;
}
function cookieLines(response) {
  if (typeof response.headers.getSetCookie === 'function') return response.headers.getSetCookie();
  const value = response.headers.get('set-cookie');
  return value ? [value] : [];
}
function authCookieSet(response) {
  const lines = cookieLines(response);
  const session = lines.find(line => line.startsWith('vido_session='));
  const csrf = lines.find(line => line.startsWith('vido_csrf='));
  assert(session, 'The server did not issue the vido_session cookie.');
  assert(csrf, 'The server did not issue the vido_csrf cookie.');
  const sessionPair = session.split(';', 1)[0];
  const csrfPair = csrf.split(';', 1)[0];
  return {
    cookie: `${sessionPair}; ${csrfPair}`,
    csrfToken: decodeURIComponent(csrfPair.slice('vido_csrf='.length)),
    sessionLine: session,
    csrfLine: csrf,
    lines
  };
}
async function api(path, options = {}) {
  const headers = {};
  if (options.json !== undefined) headers['content-type'] = 'application/json';
  if (options.origin !== null) headers.origin = options.origin || baseUrl;
  if (options.cookie) headers.cookie = options.cookie;
  if (options.csrf !== undefined) headers['x-csrf-token'] = options.csrf;
  if (options.authorization) headers.authorization = options.authorization;
  return fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.json === undefined ? undefined : JSON.stringify(options.json),
    signal: AbortSignal.timeout(5000)
  });
}
async function json(response) {
  return response.json();
}
async function login() {
  const response = await api('/api/auth/login', {
    method: 'POST',
    json: { email: ownerEmail, password: ownerPassword, remember: true }
  });
  assert(response.status === 200, `Owner login returned HTTP ${response.status}.`);
  const body = await json(response);
  assert(body.user?.role === 'owner', 'Owner login did not return the database owner role.');
  assert(!/\b(?:access_?token|jwt|token)\b/i.test(JSON.stringify(body)), 'Login JSON unexpectedly exposed a token.');
  return authCookieSet(response);
}

try {
  const schema = await readFile(new URL('../backend/schema.sql', import.meta.url), 'utf8');
  await database.query(schema);

  const port = await reservePort();
  baseUrl = `http://127.0.0.1:${port}`;
  const childPath = process.env.PATH || process.env.Path || '';
  const childEnv = {
    PATH: childPath,
    ...(process.env.SystemRoot ? { SystemRoot: process.env.SystemRoot } : {}),
    ...(process.env.SYSTEMROOT ? { SYSTEMROOT: process.env.SYSTEMROOT } : {}),
    ...(process.env.TEMP ? { TEMP: process.env.TEMP } : {}),
    ...(process.env.TMP ? { TMP: process.env.TMP } : {}),
    ...(process.env.HOME ? { HOME: process.env.HOME } : {}),
    NODE_ENV: 'test',
    PORT: String(port),
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    OWNER_EMAIL: ownerEmail,
    OWNER_PASSWORD: ownerPassword,
    ADMIN_USERNAME: adminUsername,
    ADMIN_PASSWORD: adminPassword,
    REGISTRATION_ENABLED: 'false',
    RESEND_API_KEY: 'test-resend-key',
    RESEND_FROM_EMAIL: 'noreply@example.invalid',
    PUBLIC_APP_URL: 'https://vido.example.invalid',
    NODE_OPTIONS: '--import=./scripts/mock-resend-fetch.mjs'
  };

  child = spawn(process.execPath, ['backend/server.js'], {
    cwd: process.cwd(),
    env: childEnv,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', chunk => { stdout = (stdout + chunk.toString()).slice(-5000); });
  child.stderr.on('data', chunk => { stderr = (stderr + chunk.toString()).slice(-5000); });

  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (child.exitCode !== null) throw new Error(`Backend exited during startup. ${stderr || stdout}`);
    try {
      const health = await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(1500) });
      if (health.status === 200 && (await health.json()).database === true) {
        ready = true;
        break;
      }
    } catch {}
    await sleep(250);
  }
  assert(ready, `Backend did not become ready with PostgreSQL. ${stderr || stdout}`);

  // Cross-origin unsafe requests must be rejected before authentication.
  const crossOrigin = await api('/api/auth/login', {
    method: 'POST',
    origin: 'https://attacker.example',
    json: { email: ownerEmail, password: ownerPassword }
  });
  assert(crossOrigin.status === 403, `Cross-origin login returned HTTP ${crossOrigin.status}, expected 403.`);

  // Public registration remains disabled in the initial deployment.
  const registration = await api('/api/auth/register', {
    method: 'POST',
    json: { email: `new-${randomUUID()}@example.invalid`, password: randomBytes(24).toString('base64url') }
  });
  assert(registration.status === 403, `Registration returned HTTP ${registration.status}, expected 403.`);

  // Password recovery must not reveal whether an account exists, even when the mail provider fails.
  const recoveryStatus = await api('/api/auth/recovery-status');
  assert(recoveryStatus.status === 200, `Recovery status returned HTTP ${recoveryStatus.status}.`);
  assert((await json(recoveryStatus)).emailEnabled === true, 'Recovery email test provider should be enabled.');
  const unknownForgot = await api('/api/auth/forgot-password', {
    method: 'POST',
    json: { email: `missing-${randomUUID()}@example.invalid` }
  });
  const knownForgot = await api('/api/auth/forgot-password', {
    method: 'POST',
    json: { email: ownerEmail }
  });
  assert(unknownForgot.status === 200 && knownForgot.status === 200, 'Known and unknown accounts must receive the same HTTP status.');
  const unknownForgotBody = await json(unknownForgot);
  const knownForgotBody = await json(knownForgot);
  assert(knownForgotBody.ok === unknownForgotBody.ok && knownForgotBody.message === unknownForgotBody.message, 'Known and unknown accounts must receive the same response body when delivery fails.');
  assert.equal(knownForgotBody.message, 'If the account exists, a reset email will be sent.', 'Password recovery must use a generic response.');
  // The test-only Resend stub always returns HTTP 500; failed delivery must remove the unusable token.
  for (let attempt = 0; attempt < 20; attempt++) {
    const pending = await database.query('SELECT COUNT(*)::int AS count FROM password_reset_tokens');
    if (Number(pending.rows[0].count) === 0) break;
    await sleep(50);
  }
  const pendingResetTokens = await database.query('SELECT COUNT(*)::int AS count FROM password_reset_tokens');
  assert.equal(Number(pendingResetTokens.rows[0].count), 0, 'A failed email delivery must remove the reset token.');
  const invalidReset = await api('/api/auth/reset-password', {
    method: 'POST',
    json: { token: 'invalid', password: randomBytes(24).toString('base64url') }
  });
  assert(invalidReset.status === 400, `Invalid reset request returned HTTP ${invalidReset.status}, expected 400.`);

  // Legacy Bearer authentication is no longer accepted.
  const bearerOnly = await api('/api/auth/me', { authorization: 'Bearer legacy.invalid.token' });
  assert(bearerOnly.status === 401, `Bearer-only request returned HTTP ${bearerOnly.status}, expected 401.`);

  // Session and CSRF cookies are issued, and the JWT is not returned in JSON.
  const first = await login();
  assert(/HttpOnly/i.test(first.sessionLine), 'Session cookie is missing HttpOnly.');
  assert(/SameSite=Lax/i.test(first.sessionLine), 'Session cookie is missing SameSite=Lax.');
  assert(/Path=\//i.test(first.sessionLine), 'Session cookie is missing Path=/.');
  assert(!/HttpOnly/i.test(first.csrfLine), 'CSRF cookie must be readable by same-origin JavaScript.');
  assert(/Max-Age=604800/i.test(first.sessionLine), 'Remember-me session cookie must have a seven-day Max-Age.');

  const me = await api('/api/auth/me', { cookie: first.cookie });
  assert(me.status === 200, `Cookie-authenticated /me returned HTTP ${me.status}.`);
  assert((await json(me)).user?.email === ownerEmail, 'Cookie-authenticated /me returned the wrong account.');

  // A missing/incorrect CSRF header must block an authenticated mutation.
  const csrfBlocked = await api('/api/auth/logout', {
    method: 'POST',
    cookie: first.cookie,
    csrf: 'incorrect-csrf-value',
    json: {}
  });
  assert(csrfBlocked.status === 403, `Tampered CSRF request returned HTTP ${csrfBlocked.status}, expected 403.`);

  // Account-wide revocation: logging out of one session invalidates another session.
  const sessionA = await login();
  const sessionB = await login();
  const logout = await api('/api/auth/logout', {
    method: 'POST',
    cookie: sessionA.cookie,
    csrf: sessionA.csrfToken,
    json: {}
  });
  assert(logout.status === 200, `Logout returned HTTP ${logout.status}.`);
  const logoutBody = await json(logout);
  assert(logoutBody.scope === 'all_sessions', 'Logout did not report the documented all_sessions scope.');
  assert(cookieLines(logout).some(line => /vido_session=/.test(line) && /Max-Age=0/i.test(line)), 'Logout did not clear the session cookie.');

  const revoked = await api('/api/auth/me', { cookie: sessionB.cookie });
  assert(revoked.status === 401, `A second session remained valid after account-wide logout (HTTP ${revoked.status}).`);

  // Quick-admin must authenticate against the database owner role, then permit owner-only API access.
  const quickAdmin = await api('/api/auth/quick-admin', {
    method: 'POST',
    json: { username: adminUsername.toLowerCase(), password: adminPassword, remember: true }
  });
  assert(quickAdmin.status === 200, `Quick-admin login returned HTTP ${quickAdmin.status}.`);
  const adminBody = await json(quickAdmin);
  assert(adminBody.user?.role === 'owner', 'Quick-admin did not use the verified database owner role.');
  assert(!/\b(?:access_?token|jwt|token)\b/i.test(JSON.stringify(adminBody)), 'Quick-admin JSON unexpectedly exposed a token.');
  const adminCookies = authCookieSet(quickAdmin);
  const overview = await api('/api/admin/overview', { cookie: adminCookies.cookie });
  assert(overview.status === 200, `Owner admin overview returned HTTP ${overview.status}.`);
  assert((await json(overview)).role === 'owner', 'Admin overview did not recognize the database owner role.');

  // A valid one-time reset token changes the password and revokes all old sessions.
  const resetToken = randomBytes(32).toString('base64url');
  const resetTokenHash = createHash('sha256').update(resetToken).digest('hex');
  await database.query(
    "INSERT INTO password_reset_tokens(user_id,token_hash,expires_at) SELECT id,$2,NOW()+INTERVAL '30 minutes' FROM users WHERE email=$1",
    [ownerEmail, resetTokenHash]
  );
  const replacementPassword = randomBytes(24).toString('base64url');
  const reset = await api('/api/auth/reset-password', {
    method: 'POST',
    json: { token: resetToken, password: replacementPassword }
  });
  assert(reset.status === 200, `Valid password reset returned HTTP ${reset.status}.`);
  assert((await json(reset)).email === ownerEmail, 'Password reset returned the wrong account.');
  const oldAdminSession = await api('/api/auth/me', { cookie: adminCookies.cookie });
  assert(oldAdminSession.status === 401, 'Password reset did not revoke existing sessions.');
  const replacementLogin = await api('/api/auth/login', {
    method: 'POST',
    json: { email: ownerEmail, password: replacementPassword }
  });
  assert(replacementLogin.status === 200, 'The new password did not work after a reset.');
  const reusedReset = await api('/api/auth/reset-password', {
    method: 'POST',
    json: { token: resetToken, password: randomBytes(24).toString('base64url') }
  });
  assert(reusedReset.status === 400, 'The password reset token was reusable.');

  ownerCreated = true;
  console.log('PASS: PostgreSQL-backed authentication integration tests');
  console.log('PASS: same-origin enforcement, disabled-by-default registration, cookie-only auth, CSRF validation, session revocation, quick-admin owner role, single-use password reset, and owner API access.');
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  if (stdout) console.error('Backend stdout:', stdout);
  if (stderr) console.error('Backend stderr:', stderr);
  process.exitCode = 1;
} finally {
  if (child && child.exitCode === null) {
    await new Promise(resolve => {
      const timer = setTimeout(resolve, 2500);
      child.once('exit', () => { clearTimeout(timer); resolve(); });
      child.kill('SIGTERM');
    });
  }
  if (ownerCreated) await database.query('DELETE FROM users WHERE email=$1', [ownerEmail]).catch(() => {});
  await database.end().catch(() => {});
}
