import crypto from 'node:crypto';

export const SESSION_COOKIE_NAME = 'vido_session';
export const CSRF_COOKIE_NAME = 'vido_csrf';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function hmacCsrf(sessionToken, nonce, secret) {
  return crypto.createHmac('sha256', secret)
    .update('vido-csrf-v1:' + sessionToken + ':' + nonce)
    .digest('base64url');
}

export function createCsrfToken(sessionToken, secret) {
  if (typeof sessionToken !== 'string' || !sessionToken || typeof secret !== 'string' || secret.length < 32) {
    throw new TypeError('A session token and strong signing secret are required');
  }
  const nonce = crypto.randomBytes(32).toString('base64url');
  return nonce + '.' + hmacCsrf(sessionToken, nonce, secret);
}

export function verifyCsrfToken(sessionToken, suppliedToken, secret) {
  if (typeof sessionToken !== 'string' || !sessionToken ||
      typeof suppliedToken !== 'string' || typeof secret !== 'string' || secret.length < 32) return false;
  const parts = suppliedToken.split('.');
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]{40,50}$/.test(parts[0]) ||
      !/^[A-Za-z0-9_-]{40,50}$/.test(parts[1])) return false;
  const expected = Buffer.from(hmacCsrf(sessionToken, parts[0], secret), 'base64url');
  const actual = Buffer.from(parts[1], 'base64url');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export function readCookieValue(header, name) {
  if (typeof header !== 'string' || typeof name !== 'string' || !name) return null;
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0 || part.slice(0, index).trim() !== name) continue;
    try { return decodeURIComponent(part.slice(index + 1).trim()); }
    catch { return null; }
  }
  return null;
}

function cookieFlags({ secure = false, remember = false } = {}) {
  return '; Path=/; SameSite=Lax' + (secure ? '; Secure' : '') +
    (remember ? '; Max-Age=' + SESSION_MAX_AGE_SECONDS : '');
}

export function buildSessionCookies({ sessionToken, csrfToken, secure = false, remember = false }) {
  if (typeof sessionToken !== 'string' || !sessionToken ||
      typeof csrfToken !== 'string' || !csrfToken) throw new TypeError('Session and CSRF tokens are required');
  const flags = cookieFlags({ secure, remember });
  return [
    SESSION_COOKIE_NAME + '=' + encodeURIComponent(sessionToken) + flags + '; HttpOnly',
    CSRF_COOKIE_NAME + '=' + encodeURIComponent(csrfToken) + flags
  ];
}

export function clearSessionCookies({ secure = false } = {}) {
  const flags = '; Path=/; SameSite=Lax' + (secure ? '; Secure' : '') +
    '; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  return [
    SESSION_COOKIE_NAME + '=' + flags + '; HttpOnly',
    CSRF_COOKIE_NAME + '=' + flags
  ];
}
