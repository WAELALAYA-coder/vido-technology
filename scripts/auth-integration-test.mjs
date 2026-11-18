import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import pg from 'pg';

const { Pool } = pg;
const databaseUrl = process.env.VIDO_TEST_DATABASE_URL;
if (!databaseUrl) throw new Error('VIDO_TEST_DATABASE_URL is required for the isolated PostgreSQL integration test');
const parsedDatabaseUrl = new URL(databaseUrl);
const databaseName = decodeURIComponent(parsedDatabaseUrl.pathname.slice(1));
if (!['127.0.0.1','localhost','::1'].includes(parsedDatabaseUrl.hostname) ||
    !/(?:^|[_-])(?:test|ci)(?:$|[_-])/i.test(databaseName)) {
  throw new Error('Refusing to run: integration tests require a local database whose name contains test or ci.');
}

const port = 37000 + (process.pid % 10000);
const base = 'http://127.0.0.1:' + port;
const secret = 'ci-only-cookie-session-secret-0123456789-abcdef';
const ownerEmail = 'owner-integration@vido.test';
const ownerPassword = 'ci-owner-password-very-long-2026';
const adminUsername = 'VidoIntegrationAdmin';
const adminPassword = 'ci-admin-password-very-long-2026';
const testEmail = 'student-integration@vido.test';
const testPassword = 'ci-student-password-very-long-2026';
const pool = new Pool({ connectionString: databaseUrl, max: 2 });
const child = spawn(process.execPath, ['backend/server.js'], {
  env: {
    PATH: process.env.PATH || '',
    PORT: String(port),
    NODE_ENV: 'production',
    DATABASE_URL: databaseUrl,
    JWT_SECRET: secret,
    OWNER_EMAIL: ownerEmail,
    OWNER_PASSWORD: ownerPassword,
    ADMIN_USERNAME: adminUsername,
    ADMIN_PASSWORD: adminPassword,
    REGISTRATION_ENABLED: 'true'
  },
  stdio: ['ignore', 'ignore', 'pipe']
});
let stderr = '';
child.stderr.on('data', chunk => { stderr = (stderr + chunk.toString()).slice(-5000); });

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function setCookies(response) {
  const values = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [response.headers.get('set-cookie')].filter(Boolean);
  assert(values.length >= 2, 'authentication response must issue session and CSRF cookies');
  const session = values.find(value => value.startsWith('vido_session='));
  const csrf = values.find(value => value.startsWith('vido_csrf='));
  assert(session && csrf, 'both named cookies must be present');
  return {
    sessionPair: session.slice(0, session.indexOf(';')),
    csrfPair: csrf.slice(0, csrf.indexOf(';')),
    csrfToken: decodeURIComponent(csrf.slice('vido_csrf='.length, csrf.indexOf(';'))),
    sessionHeader: session,
    csrfHeader: csrf,
    cookieHeader: [
      session.slice(0, session.indexOf(';')),
      csrf.slice(0, csrf.indexOf(';'))
    ].join('; ')
  };
}
async function request(path, { method = 'GET', cookies = null, csrf = null, accountId = null, body = undefined } = {}) {
  const headers = { origin: base };
  if (cookies) headers.cookie = cookies;
  if (csrf) headers['x-csrf-token'] = csrf;
  if (accountId) headers['x-vido-account-id'] = accountId;
  if (body !== undefined) headers['content-type'] = 'application/json';
  return fetch(base + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual'
  });
}
async function waitForDatabaseAndServer() {
  let last;
  for (let i = 0; i < 80; i++) {
    if (child.exitCode !== null) throw new Error('API server exited before readiness: ' + stderr);
    try {
      const response = await fetch(base + '/api/health');
      if (response.status === 200) {
        const data = await response.json();
        if (data.database === true) return;
      }
      last = new Error('API health returned HTTP ' + response.status);
    } catch (error) { last = error; }
    await pause(150);
  }
  throw new Error('API server/database did not become ready: ' + (last?.message || 'timeout') + '\n' + stderr);
}

try {
  // Initialize a dedicated ephemeral CI database. It contains no real user records.
  await pool.query(fs.readFileSync('backend/schema.sql', 'utf8'));
  await waitForDatabaseAndServer();

  // Registration must create a cookie session, never return a JavaScript-readable JWT.
  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: { email: testEmail, password: testPassword, remember: false }
  });
  assert.equal(registration.status, 201, 'registration must succeed');
  const registeredBody = await registration.json();
  assert(registeredBody.user?.id && registeredBody.user?.email === testEmail, 'registration user payload missing');
  assert.equal(Object.hasOwn(registeredBody, 'token'), false, 'registration must not return a JWT in JSON');
  const registeredCookies = setCookies(registration);
  assert.match(registeredCookies.sessionHeader, /; HttpOnly/);
  assert.match(registeredCookies.sessionHeader, /; Secure/);
  assert.match(registeredCookies.sessionHeader, /; SameSite=Lax/);
  assert.doesNotMatch(registeredCookies.sessionHeader, /; Max-Age=/, 'unchecked remember-me must produce a browser-session cookie');
  assert.doesNotMatch(registeredCookies.csrfHeader, /; HttpOnly/, 'CSRF cookie must be readable by same-origin JavaScript');

  // /auth/me reads only the HttpOnly cookie.
  const me = await request('/api/auth/me', { cookies: registeredCookies.cookieHeader });
  assert.equal(me.status, 200, 'cookie session must authenticate /auth/me');
  assert.equal((await me.json()).user.email, testEmail);

  // Mutating endpoints reject absent/tampered CSRF and accept the correct session-bound token.
  const missingCsrf = await request('/api/state', {
    method: 'PUT',
    cookies: registeredCookies.sessionPair,
    body: { state: { integration: 'missing-csrf' } }
  });
  assert.equal(missingCsrf.status, 403, 'missing CSRF must fail');
  assert((missingCsrf.headers.getSetCookie?.() || []).some(value => value.startsWith('vido_session=;')), 'failed CSRF must clear the session cookie');

  const wrongCsrf = await request('/api/state', {
    method: 'PUT',
    cookies: registeredCookies.cookieHeader,
    csrf: 'tampered-csrf-token',
    body: { state: { integration: 'wrong-csrf' } }
  });
  assert.equal(wrongCsrf.status, 403, 'tampered CSRF must fail');

  const saveState = await request('/api/state', {
    method: 'PUT',
    cookies: registeredCookies.cookieHeader,
    csrf: registeredCookies.csrfToken,
    accountId: registeredBody.user.id,
    body: { state: { integration: 'cookie-csrf-passed', completed: true } }
  });
  assert.equal(saveState.status, 200, 'valid cookie+CSRF+account context must save user state');
  const readState = await request('/api/state', {
    cookies: registeredCookies.cookieHeader,
    accountId: registeredBody.user.id
  });
  assert.equal(readState.status, 200);
  assert.deepEqual(await readState.json(), { integration: 'cookie-csrf-passed', completed: true });

  // Login with "remember me" must create a persistent seven-day cookie.
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { email: testEmail, password: testPassword, remember: true }
  });
  assert.equal(login.status, 200, 'login must succeed');
  const loginBody = await login.json();
  assert.equal(Object.hasOwn(loginBody, 'token'), false, 'login must not return a JWT in JSON');
  const loginCookies = setCookies(login);
  assert.match(loginCookies.sessionHeader, /; Max-Age=604800/, 'remember-me cookie must persist for seven days');
  assert.match(loginCookies.sessionHeader, /; HttpOnly/);
  assert.match(loginCookies.sessionHeader, /; Secure/);
  assert.match(loginCookies.sessionHeader, /; SameSite=Lax/);

  // Issue a second independent session. Logging out one session must revoke both.
  const secondLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { email: testEmail, password: testPassword, remember: false }
  });
  assert.equal(secondLogin.status, 200, 'second login must succeed');
  const secondCookies = setCookies(secondLogin);

  const logout = await request('/api/auth/logout', {
    method: 'POST',
    cookies: loginCookies.cookieHeader,
    csrf: loginCookies.csrfToken,
    body: {}
  });
  assert.equal(logout.status, 200, 'logout must succeed');
  const logoutBody = await logout.json();
  assert.equal(logoutBody.scope, 'all_sessions', 'logout scope must be explicit');
  const clearedCookies = logout.headers.getSetCookie?.() || [];
  assert(clearedCookies.some(value => value.startsWith('vido_session=;') && value.includes('Max-Age=0')), 'logout must clear session cookie');
  assert(clearedCookies.some(value => value.startsWith('vido_csrf=;') && value.includes('Max-Age=0')), 'logout must clear CSRF cookie');

  const revokedCurrent = await request('/api/auth/me', { cookies: loginCookies.cookieHeader });
  assert.equal(revokedCurrent.status, 401, 'logout must revoke the current session');
  const revokedOtherDevice = await request('/api/auth/me', { cookies: secondCookies.cookieHeader });
  assert.equal(revokedOtherDevice.status, 401, 'logout must revoke other device sessions too');

  // Bootstrap and quick-admin use the DB-confirmed owner role and issue cookie sessions only.
  const quickAdmin = await request('/api/auth/quick-admin', {
    method: 'POST',
    body: { username: adminUsername, password: adminPassword, remember: true }
  });
  assert.equal(quickAdmin.status, 200, 'quick-admin owner login must succeed');
  const quickBody = await quickAdmin.json();
  assert.equal(Object.hasOwn(quickBody, 'token'), false, 'quick-admin must not return a JWT in JSON');
  const quickCookies = setCookies(quickAdmin);
  const quickMe = await request('/api/auth/me', { cookies: quickCookies.cookieHeader });
  assert.equal(quickMe.status, 200);
  assert.equal((await quickMe.json()).user.email, ownerEmail);

  await pool.query("UPDATE users SET role='analyst' WHERE email=$1", [ownerEmail]);
  const demotedQuickAdmin = await request('/api/auth/quick-admin', {
    method: 'POST',
    body: { username: adminUsername, password: adminPassword }
  });
  assert.equal(demotedQuickAdmin.status, 403, 'quick-admin must reject a configured account demoted from owner');
  assert.equal((await demotedQuickAdmin.json()).error, 'owner_role_required');
  await pool.query("UPDATE users SET role='owner' WHERE email=$1", [ownerEmail]);

  console.log('PASS: PostgreSQL-backed registration/login, HttpOnly cookies, CSRF, user state, remember-me, all-device logout, quick-admin owner enforcement.');
} finally {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGTERM');
    await Promise.race([
      new Promise(resolve => child.once('exit', resolve)),
      pause(2000)
    ]);
  }
  await pool.end();
}
