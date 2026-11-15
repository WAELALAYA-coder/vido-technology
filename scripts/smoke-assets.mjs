import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import jwt from 'jsonwebtoken';
import { createCsrfToken, buildSessionCookies } from '../backend/session-security.js';

const port=35000+(process.pid%10000);
const base=`http://127.0.0.1:${port}`;
const testSecret='ci-only-cookie-session-test-secret-0123456789-abcdef';
const child=spawn(process.execPath,['backend/server.js'],{
  env:{PATH:process.env.PATH||'',PORT:String(port),DATABASE_URL:'',JWT_SECRET:testSecret,NODE_ENV:'production'},
  stdio:'ignore'
});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function get(path){
  return fetch(base+path,{redirect:'manual'});
}
try{
  let ready=false,lastError;
  for(let attempt=0;attempt<60;attempt++){
    try{
      const response=await get('/questions-v37.js');
      if(response.status===200){ready=true;break;}
      lastError=new Error('asset route returned HTTP '+response.status);
    }catch(error){lastError=error;}
    await pause(100);
  }
  assert(ready,'Express did not start the learning asset routes: '+(lastError?.message||'timeout'));

  const paths=['/','/questions-v37.js','/lessons-v37.js','/diagram-curriculum-v38.js','/diagram-engine-v38.js','/diagram-trainer.js','/diagram-trainer.css'];
  const responses=await Promise.all(paths.map(get));
  const [home,questions,lessons,curriculum,engine,trainer,styles]=responses;
  for(let i=0;i<responses.length;i++)assert.equal(responses[i].status,200,'public asset must be served: '+paths[i]);
  for(const response of [questions,lessons,curriculum,engine,trainer]){
    assert.match(response.headers.get('content-type')||'',/application\/javascript/i);
    assert.match(response.headers.get('cache-control')||'',/no-cache/i);
  }
  assert.match(styles.headers.get('content-type')||'',/text\/css/i);
  assert.match(styles.headers.get('cache-control')||'',/no-cache/i);
  assert((await home.text()).includes('diagram-trainer.js'),'home page must load diagram trainer');
  assert((await questions.text()).includes('window.VIDO_EXTRA_QUESTIONS'),'question dataset payload missing');
  assert((await lessons.text()).includes('window.VIDO_LESSONS'),'lesson data payload missing');
  assert((await curriculum.text()).includes('window.VIDO_DIAGRAM_CONTENT'),'diagram curriculum payload missing');
  assert((await engine.text()).includes('window.VIDO_DIAGRAM_ENGINE'),'diagram validation engine payload missing');
  assert((await trainer.text()).includes('window.VIDO_DIAGRAM_APP'),'diagram trainer app payload missing');
  assert((await styles.text()).includes('.diagramLayout'),'diagram stylesheet payload missing');

  const missingOrigin=await fetch(base+'/api/auth/login',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({email:'nobody@example.test',password:'not-a-real-password'})
  });
  assert.equal(missingOrigin.status,403,'production must reject unsafe API requests without Origin or Referer');

  const evilOrigin=await fetch(base+'/api/auth/login',{
    method:'POST',headers:{'content-type':'application/json',origin:'https://evil.example'},
    body:JSON.stringify({email:'nobody@example.test',password:'not-a-real-password'})
  });
  assert.equal(evilOrigin.status,403,'cross-origin login must be rejected before authentication');
  assert.equal((await evilOrigin.json()).error,'same_origin_required');

  const sameOrigin=await fetch(base+'/api/auth/login',{
    method:'POST',headers:{'content-type':'application/json',origin:base},
    body:JSON.stringify({email:'nobody@example.test',password:'not-a-real-password'})
  });
  assert.equal(sameOrigin.status,503,'same-origin login must pass Origin validation and reach the missing test database');

  const noCookie=await get('/api/auth/me');
  assert.equal(noCookie.status,401,'API auth must reject requests without the HttpOnly session cookie');
  const legacyBearer=await fetch(base+'/api/auth/me',{headers:{authorization:'Bearer legacy-token'}});
  assert.equal(legacyBearer.status,401,'API auth must not accept legacy Bearer tokens');

  const sessionToken=jwt.sign({sub:'00000000-0000-4000-8000-000000000001',ver:0},testSecret,{algorithm:'HS256',expiresIn:'1m'});
  const csrfToken=createCsrfToken(sessionToken,testSecret);
  const cookieParts=buildSessionCookies({sessionToken,csrfToken,secure:true}).map(value=>value.slice(0,value.indexOf(';')));
  const cookieHeader=cookieParts.join('; ');
  const missingCsrf=await fetch(base+'/api/auth/logout',{
    method:'POST',headers:{'content-type':'application/json',origin:base,cookie:cookieParts[0]},
    body:'{}'
  });
  assert.equal(missingCsrf.status,403,'a valid session cookie without CSRF must be rejected');
  const badCsrf=await fetch(base+'/api/auth/logout',{
    method:'POST',headers:{'content-type':'application/json',origin:base,cookie:cookieHeader,'x-csrf-token':'invalid'},
    body:'{}'
  });
  assert.equal(badCsrf.status,403,'a bad CSRF header must be rejected');
  const validCsrf=await fetch(base+'/api/auth/logout',{
    method:'POST',headers:{'content-type':'application/json',origin:base,cookie:cookieHeader,'x-csrf-token':csrfToken},
    body:'{}'
  });
  assert.equal(validCsrf.status,503,'valid session+CSRF must pass authentication and stop at the intentionally absent database');

  const crossOriginMutation=await fetch(base+'/api/auth/logout',{
    method:'POST',headers:{'content-type':'application/json',origin:'https://evil.example'},
    body:'{}'
  });
  assert.equal(crossOriginMutation.status,403,'cross-origin unsafe API requests must be rejected');

  for(const privatePath of ['/backend/server.js','/backend/schema.sql','/.env.example','/docker-compose.yml','/package.json']){
    const response=await get(privatePath);
    assert.equal(response.status,404,`private path must not be served: ${privatePath}`);
  }
  console.log('PASS: public learning assets, private paths, cookie-only auth, CSRF token validation, legacy Bearer rejection and same-origin mutation guards.');
} finally {
  if(child.exitCode===null&&child.signalCode===null){
    child.kill('SIGTERM');
    await Promise.race([new Promise(resolve=>child.once('exit',resolve)),pause(1500)]);
  }
}
