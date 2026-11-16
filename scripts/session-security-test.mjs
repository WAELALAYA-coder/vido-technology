import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
const csrfParts=csrf.split('.');
const changedSignature=(csrfParts[1][0]==='A'?'B':'A')+csrfParts[1].slice(1);
assert.equal(verifyCsrfToken(sessionA,csrfParts[0]+'.'+changedSignature,secret),false,'tampered token must fail');
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
assert.ok(persistent[0].includes('; Path=/'),'session cookie must be scoped to the site root');
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


const authHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const resetStart = authHtml.indexOf("const initialUrlParams=new URLSearchParams(window.location.search);");
const resetEnd = authHtml.indexOf("function accountStatus", resetStart);
assert.ok(resetStart >= 0 && resetEnd > resetStart, 'reset URL bootstrap must exist');
const resetBootstrap = authHtml.slice(resetStart, resetEnd);
assert.ok(resetBootstrap.indexOf("initialUrlParams.get('reset')") >= 0, 'reset token must be read from URL parameters');
assert.ok(resetBootstrap.indexOf("initialUrlParams.delete('reset')") > resetBootstrap.indexOf("initialUrlParams.get('reset')"), 'reset token must be removed from URL parameters after capture');
assert.ok(resetBootstrap.indexOf("history.replaceState") > resetBootstrap.indexOf("initialUrlParams.delete('reset')"), 'browser history must be cleaned after capturing the reset token');
assert.ok(resetBootstrap.indexOf("history.replaceState") < resetBootstrap.indexOf("setAuthMode('reset')"), 'reset token must be removed before the reset form is shown');

const registrationStart = authHtml.indexOf("async function register(){");
const registrationEnd = authHtml.indexOf("async function login(){", registrationStart);
assert.ok(registrationStart >= 0 && registrationEnd > registrationStart, 'account registration handler must exist');
const registrationHandler = authHtml.slice(registrationStart, registrationEnd);
assert.ok(registrationHandler.includes('من 12 حرفاً على الأقل.'), 'Arabic registration hint must match the 12-character rule');
assert.ok(registrationHandler.includes('mindestens 12 Zeichen'), 'German registration hint must match the 12-character rule');
assert.ok(!registrationHandler.includes('8 أحرف على الأقل') && !registrationHandler.includes('mindestens 8 Zeichen'), 'registration hint must not show the outdated 8-character rule');

const authErrorStart = authHtml.indexOf('function describeAuthError');
const authErrorEnd = authHtml.indexOf('async function gateLogin', authErrorStart);
const authErrorHandler = authHtml.slice(authErrorStart, authErrorEnd);
for (const language of ['ar', 'de', 'en']) {
  const mapStart = authErrorHandler.indexOf(`const ${language}={`);
  const mapEnd = authErrorHandler.indexOf('};', mapStart);
  assert.ok(mapStart >= 0 && mapEnd > mapStart, `${language} authentication error map must exist`);
  const languageMap = authErrorHandler.slice(mapStart, mapEnd);
  assert.ok(languageMap.includes('too_many_password_reset_attempts:'), `${language} reset rate-limit error mapping must exist`);
}
console.log('PASS: reset token URL cleanup, localized password-reset throttling, and consistent account password guidance.');
