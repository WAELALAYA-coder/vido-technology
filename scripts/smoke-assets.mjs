import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port=35000+(process.pid%10000);
const base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['backend/server.js'],{
  env:{...process.env,PORT:String(port),DATABASE_URL:'',JWT_SECRET:'ci-only-not-a-real-secret'},
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

  const [home,questions,lessons]=await Promise.all([
    get('/'),get('/questions-v37.js'),get('/lessons-v37.js')
  ]);
  assert.equal(home.status,200,'home page must be served');
  assert.equal(questions.status,200,'question data must be publicly served');
  assert.equal(lessons.status,200,'lesson data must be publicly served');
  assert.match(questions.headers.get('content-type')||'',/application\/javascript/i);
  assert.match(lessons.headers.get('content-type')||'',/application\/javascript/i);
  assert.match(questions.headers.get('cache-control')||'',/no-cache/i);
  assert.match(lessons.headers.get('cache-control')||'',/no-cache/i);
  assert((await home.text()).includes('questions-v37.js'),'home page must load question data');
  assert((await questions.text()).includes('window.VIDO_EXTRA_QUESTIONS'),'question dataset payload missing');
  assert((await lessons.text()).includes('window.VIDO_LESSONS'),'lesson dataset payload missing');

  for(const privatePath of ['/backend/server.js','/backend/schema.sql','/.env.example','/docker-compose.yml','/package.json']){
    const response=await get(privatePath);
    assert.equal(response.status,404,`private path must not be served: ${privatePath}`);
  }
  console.log('PASS: Express serves the home page and two learning assets while keeping backend/configuration paths private.');
} finally {
  if(child.exitCode===null&&child.signalCode===null){
    child.kill('SIGTERM');
    await Promise.race([new Promise(resolve=>child.once('exit',resolve)),pause(1500)]);
  }
}
