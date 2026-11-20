import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const curriculumSource=fs.readFileSync('diagram-curriculum-v38.js','utf8');
const engineSource=fs.readFileSync('diagram-engine-v38.js','utf8');
new vm.Script(curriculumSource,{filename:'diagram-curriculum-v38.js'});
new vm.Script(engineSource,{filename:'diagram-engine-v38.js'});
const sandbox={window:{}};
vm.runInNewContext(curriculumSource,sandbox,{timeout:2000});
vm.runInNewContext(engineSource,sandbox,{timeout:2000});
const data=sandbox.window.VIDO_DIAGRAM_CONTENT;
const engine=sandbox.window.VIDO_DIAGRAM_ENGINE;
assert(data&&engine,'diagram curriculum and validation engine must load');
assert.equal(data.version,'38.0');
assert.equal(data.modules.length,11,'expected 11 diagram learning modules');
assert.equal(new Set(data.modules.map(m=>m.id)).size,data.modules.length,'module IDs must be unique');
for(const module of data.modules){
  assert(module.id&&module.type&&module.level,'missing module metadata: '+module.id);
  for(const locale of ['de','en','ar']){
    const lesson=module[locale];
    assert(lesson&&lesson.title&&lesson.goal,'missing '+locale+' title/goal: '+module.id);
    assert(Array.isArray(lesson.body)&&lesson.body.length>=4,'insufficient '+locale+' lesson content: '+module.id);
    assert(Array.isArray(lesson.rules)&&lesson.rules.length>=3,'insufficient '+locale+' rules: '+module.id);
    assert(lesson.practice&&lesson.exam,'practice/exam content missing: '+module.id+'/'+locale);
    assert(Array.isArray(lesson.terms)&&lesson.terms.length>=4,'glossary missing: '+module.id+'/'+locale);
    assert(lesson.terms.every(term=>Array.isArray(term)&&term.length===3&&term.every(x=>String(x).trim())),'invalid glossary entry: '+module.id+'/'+locale);
  }
}
assert.equal(data.templates.length,8,'expected eight verified example templates');
assert.equal(new Set(data.templates.map(t=>t.id)).size,data.templates.length,'template IDs must be unique');
assert.equal(new Set(data.templates.map(t=>t.kind)).size,data.templates.length,'each diagram type must have one example template');
const allowed=['flow','network','uml-class','erd','sequence','bpmn','c4','dfd'].sort();
assert.deepEqual([...engine.validKinds].sort(),allowed,'validator diagram kinds do not match curriculum examples');
for(const template of data.templates){
  assert(template.id&&template.title&&template.kind&&template.model,'invalid template metadata: '+template.id);
  const model=template.model;
  assert.equal(model.kind,template.kind,'template/model kind mismatch: '+template.id);
  assert(model.meta&&model.meta.title&&model.meta.purpose&&model.meta.audience&&model.meta.scope&&model.meta.author&&model.meta.updated&&model.meta.legend,'incomplete diagram documentation: '+template.id);
  assert(Array.isArray(model.nodes)&&Array.isArray(model.links),'template nodes/links missing: '+template.id);
  const ids=model.nodes.map(n=>n.id);
  assert.equal(new Set(ids).size,ids.length,'duplicate node IDs: '+template.id);
  for(const link of model.links){
    assert(ids.includes(link.from),'unknown link source '+link.from+': '+template.id);
    assert(ids.includes(link.to),'unknown link target '+link.to+': '+template.id);
  }
  const result=engine.validateModel(model);
  assert.equal(result.errors.length,0,'template '+template.id+' invalid: '+JSON.stringify(result.errors));
}
const broken=JSON.parse(JSON.stringify(data.templates.find(t=>t.kind==='flow').model));
broken.links[0].to='missing-node';
const brokenResult=engine.validateModel(broken);
assert(brokenResult.errors.some(e=>e.code==='LINK_TO_UNKNOWN'),'validator must detect dangling target links');
const noStart=JSON.parse(JSON.stringify(data.templates.find(t=>t.kind==='flow').model));
noStart.nodes=noStart.nodes.filter(n=>n.kind!=='start');
const noStartResult=engine.validateModel(noStart);
assert(noStartResult.errors.some(e=>e.code==='FLOW_START'),'validator must detect missing flowchart start');
assert.equal(data.quiz.length,20,'expected 20 original diagram practice questions');
assert.equal(new Set(data.quiz.map(q=>q.id)).size,data.quiz.length,'quiz IDs must be unique');
for(const question of data.quiz){
  assert(question.id&&question.topic,'quiz metadata missing: '+question.id);
  assert(Number.isInteger(question.a)&&question.a>=0&&question.a<4,'invalid answer index: '+question.id);
  for(const locale of ['de','en','ar']){
    assert(question.q&&question.q[locale],'missing '+locale+' question: '+question.id);
    assert(Array.isArray(question.o&&question.o[locale])&&question.o[locale].length===4,'invalid '+locale+' options: '+question.id);
    assert(question.o[locale].every(x=>typeof x==='string'&&x.trim()),'empty option: '+question.id+'/'+locale);
    assert(question.why&&question.why[locale],'missing '+locale+' explanation: '+question.id);
  }
}
assert(data.sources.length>=8,'official reference list is incomplete');
for(const source of data.sources)assert(source.label&&/^https:\/\//.test(source.url),'invalid source link: '+source.label);
const app=fs.readFileSync('diagram-trainer.js','utf8');
new vm.Script(app,{filename:'diagram-trainer.js'});
assert(app.includes('window.VIDO_DIAGRAM_APP'),'diagram app API missing');
assert(app.includes("view.dataset.view='diagrams'"),'diagram view route missing');
assert(app.includes('localStorage.setItem(STORE'),'local-only progress/draft persistence missing');
assert(app.includes('JSON.stringify'),'JSON studio logic missing');
assert(app.includes('image/svg+xml'),'SVG export missing');
assert(app.includes('offset=(state.quizIndex*3+1)%4'),'quiz answer positions must be rotated');
const css=fs.readFileSync('diagram-trainer.css','utf8');
assert(css.includes('.diagramLayout')&&css.includes('@media(max-width:600px)'),'responsive diagram UI styles missing');
const html=fs.readFileSync('index.html','utf8');
assert(html.includes('diagram-trainer.css'),'diagram CSS must be linked');
for(const asset of ['diagram-curriculum-v38.js','diagram-engine-v38.js','diagram-trainer.js']){
  assert(html.includes('<script src="'+asset+'"></script>'),'diagram script is not loaded: '+asset);
}
assert(html.indexOf('diagram-curriculum-v38.js')<html.indexOf('diagram-engine-v38.js'),'curriculum must load before engine');
assert(html.indexOf('diagram-engine-v38.js')<html.indexOf('diagram-trainer.js'),'engine must load before app');
assert(html.lastIndexOf('diagram-trainer.js')>html.indexOf('window.vidoCore='),'diagram app must load after core initialization');
const backend=fs.readFileSync('backend/server.js','utf8');
for(const pair of [
  ['diagram-curriculum-v38.js','/diagram-curriculum-v38.js'],
  ['diagram-engine-v38.js','/diagram-engine-v38.js'],
  ['diagram-trainer.js','/diagram-trainer.js'],
  ['diagram-trainer.css','/diagram-trainer.css']
]){
  assert(backend.includes("app.get('"+pair[1]+"'"),'missing explicit route: '+pair[1]);
  assert(backend.includes("'"+pair[0]+"'"),'missing asset mapping: '+pair[0]);
}
const serviceWorker=fs.readFileSync('service-worker.js','utf8');
assert(serviceWorker.includes('vido-ui-20261119-v41-avatar-motion'),'service worker cache version missing');
for(const asset of ['icons/vido-app-icon.svg','icons/vido-192.png','icons/vido-512.png'])assert(serviceWorker.includes('./'+asset),'service worker does not precache '+asset);
for(const asset of ['diagram-curriculum-v38.js','diagram-engine-v38.js','diagram-trainer.js','diagram-trainer.css','virtual-office/','virtual-office/office.css','virtual-office/office.js','virtual-office/presence-motion.js']){
  assert(serviceWorker.includes('./'+asset),'service worker does not precache '+asset);
}
console.log('PASS: 11 trilingual modules / 8 valid templates / 20 trilingual questions / 9 official sources / negative validator tests / browser wiring.');


const trainer = fs.readFileSync('diagram-trainer.js','utf8');
assert(trainer.includes('MAX_MODEL_JSON_CHARS=64*1024'),'diagram JSON size cap missing');
assert(trainer.includes('function isPreviewSafe(model)'),'diagram preview safety guard missing');
assert(trainer.includes('model.nodes.length<=100')&&trainer.includes('model.links.length<=200'),'diagram renderer must cap nodes and links before rendering');
assert(trainer.includes('if(isPreviewSafe(model))renderDiagram(canvas,model);else canvas.textContent=t(\'previewUnsafe\')'),'saved diagram drafts must be checked before preview rendering');
assert(trainer.includes('if(!isPreviewSafe(model))'),'SVG export must reject unsafe diagram structures');
assert(trainer.includes('r.draft.length<=MAX_MODEL_JSON_CHARS'),'oversized saved drafts must be discarded when loaded');

const diagramEngine = fs.readFileSync('diagram-engine-v38.js','utf8');
assert(diagramEngine.includes('if (nodes.length > 100 || links.length > 200)'),'diagram validator must stop before processing oversized arrays');
assert(diagramEngine.includes('return { errors, warnings, score:0, valid:false };'),'oversized diagram models must fail closed');
