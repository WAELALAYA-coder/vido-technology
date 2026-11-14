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
assert.equal(new Set(skillList).size,40,'skill catalogue must not contain duplicates');
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
assert(backend.includes("app.get('/questions-v37.js'"),'question data route missing from Express');
assert(backend.includes("app.get('/lessons-v37.js'"),'lesson data route missing from Express');
assert(backend.includes("'Content-Type':'application/javascript; charset=utf-8'"),'learning data routes must declare JavaScript content type');

const sw=fs.readFileSync('service-worker.js','utf8');
assert(sw.includes('vido-ui-20261113-v37-learning-library'),'service worker cache version is stale');
assert(sw.includes('./questions-v37.js')&&sw.includes('./lessons-v37.js'),'lesson data is not cached');
console.log(`PASS: ${questions.length} questions / ${skillCounts.size} skills / ${lessons.length} lessons (DE/EN/AR) / ${inlineScriptCount} inline scripts / ${ids.length} unique HTML IDs.`);
