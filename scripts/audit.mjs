import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html=fs.readFileSync('index.html','utf8');
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'duplicate HTML ids');

// Parse every inline script with Node's JavaScript parser before shipping the HTML.
let inlineScriptCount=0;
for(const [index,match] of [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].entries()){
  if(/\bsrc\s*=/.test(match[1]))continue;
  const code=match[2].trim();
  if(!code)continue;
  new vm.Script(code,{filename:`index.html:inline-script-${index+1}`});
  inlineScriptCount++;
}
assert(inlineScriptCount>0,'no inline application scripts were syntax-checked');

function readArrayFile(path,assignment){
  const source=fs.readFileSync(path,'utf8');
  const escaped=assignment.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const match=source.match(new RegExp('^\\s*window\\.'+escaped+'\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;?\\s*$'));
  assert(match, path+' must contain a JSON array assigned to window.'+assignment);
  return JSON.parse(match[1]);
}

const baseStart=html.indexOf('const BASE_Q=[');
assert(baseStart>=0,'BASE_Q array not found');
let depth=0,end=-1,inString=false,quote='';
for(let i=baseStart+13;i<html.length;i++){
  const ch=html[i],previous=html[i-1];
  if(inString){if(ch===quote&&previous!=='\\')inString=false;continue;}
  if(ch==='"'||ch==="'"){inString=true;quote=ch;continue;}
  if(ch==='[')depth++;
  else if(ch===']'){depth--;if(depth===0){end=i+1;break;}}
}
assert(end>0,'BASE_Q array end not found');
const base=Function('return '+html.slice(baseStart+13,end))();
const extra=readArrayFile('questions-v37.js','VIDO_EXTRA_QUESTIONS');
const questions=[...base,...extra];

assert.equal(base.length,300,'base question count must remain 300');
assert.equal(extra.length,140,'V37 must add exactly 140 questions');
assert.equal(questions.length,440,'total question count must be 440');
assert.deepEqual(questions.map(q=>q.id),Array.from({length:440},(_,i)=>String(i+1).padStart(4,'0')),'question IDs must be 0001..0440');
assert.equal(new Set(questions.map(q=>q.skill)).size,44,'expected 44 unique skills');
for(const q of questions){
  if(q.id>='0301')assert(q.why&&q.whyEn&&q.whyAr,`missing V37 explanations ${q.id}`);
  assert(q.answer!==undefined&&q.answer!=='',`missing answer ${q.id}`);
  assert(q.skill&&q.topic,`missing skill or topic ${q.id}`);
  assert(q.target&&q.en&&q.ar,`missing DE/EN/AR question text ${q.id}`);
}
const skillsMatch=html.match(/const skills=\[([\s\S]*?)\];\s*const glossary=/);
assert(skillsMatch,'skill catalogue not found');
const skillList=Function('return ['+skillsMatch[1]+']')();
assert.equal(skillList.length,44,'skill catalogue must contain 44 skills');
assert.equal(new Set(skillList).size,44,'skill catalogue must not contain duplicates');
assert.deepEqual([...new Set(questions.map(q=>q.skill))].sort(),[...skillList].sort(),'every question skill must exist in the skill catalogue');

const skillCounts=new Map();
for(const q of questions)skillCounts.set(q.skill,(skillCounts.get(q.skill)||0)+1);
for(const [skill,count] of skillCounts)assert.equal(count,10,`${skill} must have 10 questions`);

const lessons=readArrayFile('lessons-v37.js','VIDO_LESSONS');
assert.equal(lessons.length,14,'expected 14 new lessons');
for(const lesson of lessons){
  assert(lesson.id&&lesson.topic&&lesson.sources?.length,`missing lesson metadata: ${lesson.id}`);
  assert(lesson.sources.every(source=>/^https:\/\//.test(source.url)&&source.label),'invalid lesson source URL: '+lesson.id);
  assert.equal(questions.filter(q=>q.topic===lesson.topic).length,10,`lesson ${lesson.id} must map to 10 questions`);
  for(const locale of ['de','en','ar']){
    const v=lesson[locale];
    assert(v?.title&&v.summary,`missing ${locale} title/summary: ${lesson.id}`);
    assert.equal(v.sections?.length,4,`lesson ${lesson.id} must have 4 ${locale} sections`);
    assert(v.sections.every(section=>section.heading&&section.body),`empty lesson section: ${lesson.id}/${locale}`);
    assert(v.example?.heading&&v.example.body&&v.example.code,`missing example: ${lesson.id}/${locale}`);
    assert.equal(v.practice?.steps?.length,3,`lesson ${lesson.id} must have 3 practice steps`);
    assert(v.exam?.heading&&v.exam.text,`missing exam context: ${lesson.id}/${locale}`);
    assert.equal(v.terms?.length,4,`lesson ${lesson.id} must have 4 glossary terms`);
  }
}
assert(html.includes('<script src="questions-v37.js"></script>'),'question data script is not loaded');
assert(html.includes('<script src="lessons-v37.js"></script>'),'lesson data script is not loaded');
assert(html.indexOf('<script src="questions-v37.js"></script>')<html.indexOf('const BASE_Q=['),'question dataset must load before the app script');
assert(html.includes('function renderLessons()'),'lesson renderer missing');
assert(html.includes('id="lessonList"')&&html.includes('id="lessonDetail"'),'lesson UI is incomplete');
assert(html.includes('value="de"')&&html.includes('value="en"')&&html.includes('value="ar"'),'language selector missing');
assert(html.includes('showAnswer'),'show answer missing');
assert(html.includes('VIDO Tutor'),'Tutor integration missing');
assert(html.includes('Adaptive Learning')||html.includes('Adaptives Lernen'),'adaptive learning missing');
assert(html.includes('Spaced Repetition'),'spaced repetition missing');

const backend=fs.readFileSync('backend/server.js','utf8');
const quickAdminStart=backend.indexOf("app.post('/api/auth/quick-admin'");
const quickAdminEnd=backend.indexOf("app.post('/api/auth/login'",quickAdminStart);
assert(quickAdminStart>=0&&quickAdminEnd>quickAdminStart,'quick-admin route boundaries missing');
const quickAdminRoute=backend.slice(quickAdminStart,quickAdminEnd);
assert(quickAdminRoute.includes("if(user.role!=='owner') return res.status(403).json({error:'owner_role_required'});")&&quickAdminRoute.includes('issueSessionCookies(res,user'),'quick-admin must verify the owner role and issue an HttpOnly cookie session');
assert(!quickAdminRoute.includes('token:token(user)'),'quick-admin must not return JWTs in JSON');
assert(backend.includes("algorithm:'HS256'"),'JWTs must be signed explicitly with HS256');
assert(backend.includes("jwt.verify(sessionToken,JWT_SECRET,{algorithms:['HS256']})"),'cookie session JWT verification must allow only HS256');
const sessionSecurity=fs.readFileSync('backend/session-security.js','utf8');
assert(backend.includes("readCookieValue(req.headers.cookie,SESSION_COOKIE_NAME)"),'auth middleware must read the HttpOnly session cookie');
assert(backend.includes('verifyCsrfToken(sessionToken,csrfCookie,JWT_SECRET)'),'auth middleware must validate the session-bound CSRF token');
assert(backend.includes('same_origin_required')&&backend.includes('csrf_validation_failed'),'mutating API requests must enforce origin and CSRF checks');
assert(backend.includes('issueSessionCookies(res,r.rows[0],req.body?.remember===true)'),'login must issue an HttpOnly cookie and signed CSRF cookie');
assert(!backend.includes('req.headers.authorization')&&!backend.includes("h.startsWith('Bearer ')"),'backend must not accept legacy bearer authentication');
assert(!backend.includes('res.json({token:token('),'authentication routes must not expose session JWTs in JSON');
assert(backend.includes("if(!supplied)return process.env.NODE_ENV!=='production'"),'production must reject unsafe API requests without Origin or Referer');
assert(sessionSecurity.includes('HttpOnly')&&sessionSecurity.includes('SameSite=Lax'),'session cookie must be HttpOnly and SameSite=Lax');
assert(sessionSecurity.includes('Secure'),'cookie helper must support Secure cookies in production');
assert(sessionSecurity.includes('timingSafeEqual'),'CSRF signatures must be compared in constant time');
const logoutStart=backend.indexOf("app.post('/api/auth/logout'");
const logoutEnd=backend.indexOf("app.post('/api/auth/quick-admin'",logoutStart);
const logoutRoute=backend.slice(logoutStart,logoutEnd);
assert(logoutStart>=0&&logoutEnd>logoutStart,'server-side logout route missing');
assert(logoutRoute.includes('token_version=token_version+1')&&logoutRoute.includes("scope:'all_sessions'"),'logout must revoke account sessions using token version');
assert(html.includes("api('/auth/logout',{method:'POST'})")&&html.includes('async function logout()'),'browser logout must request server-side token revocation');

assert(html.includes('window.VIDO_API_CLIENT=function(path,opts={})'),'central cookie API client missing');
assert(html.includes("headers['x-csrf-token']=csrf"),'central API client must attach the CSRF cookie to unsafe requests');
assert(html.includes("credentials:'same-origin'"),'central API client must send same-origin cookies');
assert(html.includes('const api=(path,opts={})=>window.VIDO_API_CLIENT(path,opts);'),'main application must use central cookie API client');
assert.equal((html.match(/return window\.VIDO_API_CLIENT\(path,opts\)/g)||[]).length,2,'account and button helpers must delegate to central API client');
assert(html.includes("const r=await api('/auth/me')"),'session restore must validate the server cookie');
assert(!html.includes("return fetch('/api'+path"),'legacy independent API fetch wrapper remains');
assert(!html.includes('authorization')&&!html.includes('Bearer '),'browser must not store or send bearer JWTs');

const tutorStart=backend.indexOf("app.post('/api/tutor'");
const tutorRoute=backend.slice(tutorStart);
assert(tutorStart>=0&&!tutorRoute.includes('detail:data'),'AI provider error responses must not expose raw upstream details');
assert(backend.includes('async function tutorRequestAllowed(userId)'),'AI tutor rate limiter missing');
assert(backend.includes("INTERVAL '1 minute'")&&backend.includes('auth_rate_limits.attempts < 11'),'AI tutor database rate limiter must cap users at 10 requests per minute');
assert(tutorRoute.includes('await tutorRequestAllowed(req.user.sub)'),'AI tutor route must enforce per-user rate limiting');
assert(tutorRoute.includes('AbortSignal.timeout(30_000)'),'AI provider requests must have a 30-second timeout');
assert(tutorRoute.includes('question.length>8000')&&tutorRoute.includes('answer.length>8000'),'AI tutor must bound question and answer lengths');
assert(tutorRoute.includes("!['de','en','ar'].includes(language)"),'AI tutor must restrict response language to supported locales');
assert(backend.includes("app.get('/questions-v37.js'"),'question data route missing from Express');
assert(backend.includes("app.get('/lessons-v37.js'"),'lesson data route missing from Express');
assert(backend.includes("'Content-Type':'application/javascript; charset=utf-8'"),'learning data routes must declare JavaScript content type');

const sw=fs.readFileSync('service-worker.js','utf8');
assert(sw.includes('vido-ui-20261115-v39-cookie-sessions'),'service worker cache version is stale');
assert(sw.includes('./questions-v37.js')&&sw.includes('./lessons-v37.js'),'lesson data is not cached');
for(const asset of ['./diagram-curriculum-v38.js','./diagram-engine-v38.js','./diagram-trainer.js','./diagram-trainer.css'])assert(sw.includes(asset),'diagram asset is not cached: '+asset);
for(const route of ['/diagram-curriculum-v38.js','/diagram-engine-v38.js','/diagram-trainer.js','/diagram-trainer.css'])assert(backend.includes("app.get('"+route+"'"),'diagram route missing: '+route);
console.log(`PASS: ${questions.length} questions / ${skillCounts.size} skills / ${lessons.length} lessons (DE/EN/AR) / ${inlineScriptCount} inline scripts / ${ids.length} unique HTML IDs.`);
