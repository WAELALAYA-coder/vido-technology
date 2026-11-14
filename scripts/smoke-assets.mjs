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

  for(const privatePath of ['/backend/server.js','/backend/schema.sql','/.env.example','/docker-compose.yml','/package.json']){
    const response=await get(privatePath);
    assert.equal(response.status,404,`private path must not be served: ${privatePath}`);
  }
  console.log('PASS: Express serves the home page, seven learning assets and keeps backend/configuration paths private.');
} finally {
  if(child.exitCode===null&&child.signalCode===null){
    child.kill('SIGTERM');
    await Promise.race([new Promise(resolve=>child.once('exit',resolve)),pause(1500)]);
  }
}
