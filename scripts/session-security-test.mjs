import assert from 'node:assert/strict';
import {
  SESSION_COOKIE_NAME, CSRF_COOKIE_NAME, SESSION_MAX_AGE_SECONDS,
  buildSessionCookies, clearSessionCookies, createCsrfToken,
  readCookieValue, verifyCsrfToken
} from '../backend/session-security.js';

const secret='test-only-secret-with-at-least-thirty-two-characters';
const sessionA='session-token-A.with.jwt.parts';
const sessionB='session-token-B.with.jwt.parts';
const csrf=createCsrfToken(sessionA,secret);
assert.equal(verifyCsrfToken(sessionA,csrf,secret),true,'valid token must verify');
assert.equal(verifyCsrfToken(sessionB,csrf,secret),false,'CSRF token must be bound to its session');
assert.equal(verifyCsrfToken(sessionA,csrf.slice(0,-1)+'x',secret),false,'tampered token must fail');
assert.equal(verifyCsrfToken(sessionA,'',secret),false,'empty CSRF token must fail');
assert.equal(verifyCsrfToken(sessionA,csrf,'short'),false,'weak secret must fail');

const header=SESSION_COOKIE_NAME+'='+encodeURIComponent(sessionA)+'; '+CSRF_COOKIE_NAME+'='+encodeURIComponent(csrf)+'; other=value';
assert.equal(readCookieValue(header,SESSION_COOKIE_NAME),sessionA,'session cookie must parse');
assert.equal(readCookieValue(header,CSRF_COOKIE_NAME),csrf,'CSRF cookie must parse');
assert.equal(readCookieValue(header,'missing'),null,'missing cookie must return null');
assert.equal(readCookieValue(SESSION_COOKIE_NAME+'=%E0%A4%A',SESSION_COOKIE_NAME),null,'malformed cookie encoding must fail closed');

const persistent=buildSessionCookies({sessionToken:sessionA,csrfToken:csrf,secure:true,remember:true});
assert.equal(persistent.length,2);
assert.match(persistent[0],new RegExp('^'+SESSION_COOKIE_NAME+'='));
assert.match(persistent[0],/; HttpOnly/);
assert.match(persistent[0],/; Secure/);
assert.match(persistent[0],/; SameSite=Lax/);
assert.match(persistent[0],/; Path=\//);
assert.match(persistent[0],new RegExp('; Max-Age='+SESSION_MAX_AGE_SECONDS));
assert.doesNotMatch(persistent[1],/; HttpOnly/,'CSRF cookie must be readable by same-origin JavaScript');
assert.match(persistent[1],/; Secure/);
assert.match(persistent[1],/; SameSite=Lax/);
assert.match(persistent[1],/; Max-Age=604800/);

const browserSession=buildSessionCookies({sessionToken:sessionA,csrfToken:csrf,secure:false,remember:false});
assert.doesNotMatch(browserSession[0],/; Secure/);
assert.doesNotMatch(browserSession[0],/; Max-Age=/,'unchecked remember-me must issue a browser-session cookie');

const cleared=clearSessionCookies({secure:true});
assert.equal(cleared.length,2);
assert.match(cleared[0],/; Max-Age=0/);
assert.match(cleared[0],/; HttpOnly/);
assert.match(cleared[1],/; Max-Age=0/);
console.log('PASS: signed CSRF binding, cookie parsing, secure/session cookie flags, remember-me lifetime and cookie clearing.');
