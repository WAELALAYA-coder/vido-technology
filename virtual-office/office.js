import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = (id) => document.getElementById(id);
const translations = {
  de:{prototype:'3D-Vorschau',back:'Zur Lernplattform',welcomeTitle:'Willkommen im virtuellen Büro',welcomeText:'Erkunde unseren digitalen Arbeitsplatz. Bewege dich frei und entdecke die Räume.',enter:'Büro betreten',controls:'Steuerung: WASD oder Pfeiltasten · Maus zum Umschauen · ESC zum Freigeben',location:'DEIN STANDORT',reception:'Empfang',workspace:'Arbeitsbereich',meeting:'Meetingraum',server:'Serverraum',roomReception:'Der zentrale Empfang von VIDO Technology.',roomWorkspace:'Ein offener Arbeitsplatz für konzentriertes Lernen und Zusammenarbeit.',roomMeeting:'Ein moderner Raum für Besprechungen und Präsentationen.',roomServer:'Die technische Infrastruktur des virtuellen Campus.',hint:'Klicke auf „Büro betreten“, um dich umzusehen.',loading:'3D-Büro wird geladen …'},
  en:{prototype:'3D preview',back:'Learning platform',welcomeTitle:'Welcome to the virtual office',welcomeText:'Explore our digital workplace. Move around freely and discover the rooms.',enter:'Enter office',controls:'Controls: WASD or arrow keys · Drag mouse to look around · ESC to release',location:'YOUR LOCATION',reception:'Reception',workspace:'Workspace',meeting:'Meeting room',server:'Server room',roomReception:'The central reception of VIDO Technology.',roomWorkspace:'An open workspace for focused learning and collaboration.',roomMeeting:'A modern room for meetings and presentations.',roomServer:'The technical infrastructure of the virtual campus.',hint:'Click “Enter office” to start exploring.',loading:'Loading 3D office …'},
  ar:{prototype:'معاينة ثلاثية الأبعاد',back:'منصة التعلم',welcomeTitle:'أهلاً بك في المكتب الافتراضي',welcomeText:'اكتشف مساحة العمل الرقمية. تحرك بحرية وتعرّف على الغرف.',enter:'دخول المكتب',controls:'التحكم: WASD أو الأسهم · اسحب بالماوس للنظر · ESC للتحرير',location:'موقعك الحالي',reception:'الاستقبال',workspace:'مساحة العمل',meeting:'غرفة الاجتماعات',server:'غرفة الخوادم',roomReception:'الاستقبال الرئيسي لشركة VIDO Technology.',roomWorkspace:'مساحة عمل مفتوحة للتعلم والتركيز والتعاون.',roomMeeting:'غرفة حديثة للاجتماعات والعروض التقديمية.',roomServer:'البنية التحتية التقنية للحرم الافتراضي.',hint:'اضغط على دخول المكتب لبدء الاستكشاف.',loading:'جارٍ تحميل المكتب ثلاثي الأبعاد …'}
};
let language='de', currentRoom='reception', entered=false;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#b8c8d3');
scene.fog = new THREE.Fog('#b8c8d3', 24, 65);
const camera = new THREE.PerspectiveCamera(58, innerWidth/innerHeight, .1, 120);
camera.position.set(0, 5.4, 13);
const renderer = new THREE.WebGLRenderer({canvas:$('world'),antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
const controls = new OrbitControls(camera,renderer.domElement);
controls.target.set(0,1.4,0); controls.enableDamping=true; controls.dampingFactor=.06;
controls.minDistance=4; controls.maxDistance=22; controls.maxPolarAngle=Math.PI*.48;
controls.enablePan=false;

scene.add(new THREE.HemisphereLight(0xe5f3ff,0x77705e,2.0));
const sun=new THREE.DirectionalLight(0xffedcf,3.0);sun.position.set(-8,14,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;scene.add(sun);
const fill=new THREE.PointLight(0x83cfff,45,32);fill.position.set(0,5,-5);scene.add(fill);

const mat=(color,roughness=.72,metalness=0,extra={})=>new THREE.MeshStandardMaterial({color,roughness,metalness,...extra});
const materials={
  floor:mat('#b8b2a7'),wall:mat('#e7e5df'),dark:mat('#172635'),blue:mat('#147ba8',.35,.25),wood:mat('#8a6245'),woodLight:mat('#c69c70'),glass:mat('#8fc7d8',.2,.05,{transparent:true,opacity:.23}),black:mat('#101820',.25,.3),white:mat('#f3f5f4',.4),green:mat('#315e48'),metal:mat('#8999a7',.28,.72),screen:mat('#142e45',.25,.12,{emissive:'#071d32',emissiveIntensity:.6})
};
function box(parent,x,y,z,w,h,d,material,cast=true){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=cast;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function cylinder(parent,x,y,z,r1,r2,h,material,segments=20){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function textPanel(parent,label,x,y,z,w=2.2,h=.45){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=220;const c=canvas.getContext('2d');c.fillStyle='#0b2234';c.fillRect(0,0,1024,220);c.fillStyle='#67d2fa';c.font='bold 76px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(label,512,112);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true}));m.position.set(x,y,z);parent.add(m)}
function plant(parent,x,z,scale=1){cylinder(parent,x,.32*scale,z,.28*scale,.34*scale,.64*scale,mat('#9a7053'));for(let i=0;i<7;i++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(.16*scale,.9*scale,7),mat(i%2?'#397455':'#4d8964'));leaf.position.set(x+Math.cos(i)*.22*scale,.92*scale,z+Math.sin(i)*.22*scale);leaf.rotation.z=(Math.cos(i)*.35);leaf.rotation.x=Math.sin(i)*.25;leaf.castShadow=true;parent.add(leaf)}}
function desk(parent,x,z,rotation=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;parent.add(g);box(g,0,.82,0,2.2,.12,1.05,materials.woodLight);for(const dx of [-.88,.88])for(const dz of [-.38,.38])box(g,dx,.4,dz,.09,.8,.09,materials.metal);box(g,0,1.48,-.25,.92,.58,.07,materials.black);box(g,0,1.48,-.205,.82,.46,.012,materials.screen,false);box(g,0,1.13,-.2,.18,.04,.18,materials.metal);box(g,.62,.9,.22,.35,.035,.28,materials.white);const chair=cylinder(g,0,.35,.95,.32,.32,.12,materials.black);cylinder(g,0,.65,.95,.07,.07,.5,materials.metal);box(g,0,.92,1.13,.68,.12,.15,materials.black);return g}
function meetingTable(parent,x,z){const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);box(g,0,.83,0,4.3,.16,2.0,materials.woodLight);for(const x1 of [-1.6,1.6])for(const z1 of [-.65,.65])box(g,x1,.4,z1,.12,.8,.12,materials.metal);for(let i=0;i<6;i++){const xx=-1.6+(i%3)*1.6,zz=i<3?-1.55:1.55;cylinder(g,xx,.38,zz,.32,.32,.12,materials.blue);cylinder(g,xx,.65,zz,.07,.07,.48,materials.metal);box(g,xx,.95,zz,.62,.12,.55,materials.blue)}box(g,0,2.4,-3.2,3.6,1.8,.13,materials.black);box(g,0,2.4,-3.1,3.35,1.55,.015,materials.screen,false);textPanel(g,'VIDO MEETING',0,3.7,-3.08,2.8,.4)}
function serverRack(parent,x,z){const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);box(g,0,1.35,0,1.25,2.7,.9,materials.black);for(let i=0;i<6;i++){const y=.35+i*.38;box(g,0,y,.47,1.05,.28,.035,materials.metal);for(let j=0;j<4;j++){const led=new THREE.Mesh(new THREE.SphereGeometry(.025,8,8),mat(j%2?'#4fdc9b':'#54c9ff',.2,.1,{emissive:j%2?'#0a8b50':'#0b6794',emissiveIntensity:2}));led.position.set(-.4+j*.12,y,.51);g.add(led)}}}
function partition(x,z,length=5){box(scene,x,1.5,z,length,3,.1,materials.wall);box(scene,x,2.95,z,length,.08,.12,materials.blue)}
// Architecture: open-plan modern office with separate zones, glass partitions and branded feature wall.
box(scene,0,-.18,0,34,.35,28,materials.floor,false);
box(scene,0,3.15,-13.8,34,6.3,.35,materials.wall);
box(scene,-16.8,3,0,.35,6,28,materials.wall);
box(scene,16.8,3,0,.35,6,28,materials.wall);
box(scene,0,6.1,0,34,.25,28,materials.white,false);
for(let x=-13;x<=13;x+=6){box(scene,x,3,-13.55,3.4,2.1,.08,materials.blue);box(scene,x,4.35,-13.48,3.4,.06,.06,materials.white)}
textPanel(scene,'VIDO TECHNOLOGY',0,4.4,-13.35,5.8,.85);
for(let x=-15;x<=15;x+=5){box(scene,x,3,13.55,3.8,2.1,.08,materials.glass);box(scene,x,4.2,13.5,3.8,.06,.08,materials.metal)}
// reception desk
box(scene,-10,.58,-8,4.2,1.15,1.25,materials.wood);box(scene,-10,1.2,-7.35,4.2,.08,.08,materials.blue);textPanel(scene,'WELCOME',-10,1.55,-7.3,2.5,.5);plant(scene,-13,-6,1.1);plant(scene,-7,-6,.9);
// open workspace
desk(scene,-4,-7,0);desk(scene,1,-7,0);desk(scene,-4,-2,0);desk(scene,1,-2,0);plant(scene,4,-6,1);plant(scene,4,-1,.9);
partition(5,-4,0.12);box(scene,5,1.5,-4, .12,3,9,materials.glass);
// meeting room
meetingTable(scene,10,-6);box(scene,8,1.5,-10,5,.12,0.12,materials.glass);box(scene,13,1.5,-5,.12,3,7,materials.glass);textPanel(scene,'MEETING ROOM',10,3.2,-11,3.4,.55);
// server room
box(scene,-10,1.5,4,7,3,.12,materials.glass);box(scene,-6.5,1.5,7.5,.12,3,7,materials.glass);serverRack(scene,-12,7);serverRack(scene,-9.5,7);serverRack(scene,-7,7);textPanel(scene,'SERVER ROOM',-10,3.3,3.8,3.1,.5);
// lights and furnishings
for(const x of [-12,-6,0,6,12])for(const z of [-10,-3,4,10]){const lamp=new THREE.PointLight(0xffe7c2,16,8);lamp.position.set(x,5.5,z);scene.add(lamp);box(scene,x,5.95,z,1.5,.035,.35,materials.white,false)}
// welcome floor markings
const accentLine=mat('#2e9cc8',.45,.2);box(scene,0,.012,0,13,.018,.045,accentLine,false);
const roomTargets={reception:new THREE.Vector3(-10,1.5,-4),workspace:new THREE.Vector3(-1,1.5,-4),meeting:new THREE.Vector3(10,1.5,-3),server:new THREE.Vector3(-10,1.5,9)};
const roomNames={reception:'reception',workspace:'workspace',meeting:'meeting',server:'server'};
function setRoom(name){currentRoom=name;const t=translations[language];$('roomName').textContent=t[roomNames[name]];$('roomDescription').textContent=t['room'+name[0].toUpperCase()+name.slice(1)];document.querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('active',b.dataset.room===name));const p=roomTargets[name];camera.position.set(p.x+2.8,4.2,p.z+4.2);controls.target.copy(p);controls.update()}
document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>setRoom(b.dataset.room)));
function setLanguage(code){language=translations[code]?code:'de';document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';$('office').classList.toggle('rtl',language==='ar');document.querySelectorAll('[data-i18n]').forEach(el=>{const v=translations[language][el.dataset.i18n];if(v)el.textContent=v});setRoom(currentRoom)}
$('language').addEventListener('change',e=>setLanguage(e.target.value));
$('enter').addEventListener('click',()=>{entered=true;$('welcome').classList.add('hidden');$('hint').textContent=translations[language].controls;document.querySelector('.crosshair').style.display='block';});
const keys=new Set();window.addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){keys.add(e.code);e.preventDefault()}});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
document.querySelectorAll('[data-move]').forEach(b=>{const code={forward:'KeyW',back:'KeyS',left:'KeyA',right:'KeyD'}[b.dataset.move];b.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(code)});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>keys.delete(code)))});
function move(dt){if(!entered)return;const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0)).normalize();const v=new THREE.Vector3();if(keys.has('KeyW')||keys.has('ArrowUp'))v.add(forward);if(keys.has('KeyS')||keys.has('ArrowDown'))v.sub(forward);if(keys.has('KeyD')||keys.has('ArrowRight'))v.add(right);if(keys.has('KeyA')||keys.has('ArrowLeft'))v.sub(right);if(v.lengthSq()){v.normalize().multiplyScalar(dt*5);camera.position.add(v);controls.target.add(v);camera.position.x=THREE.MathUtils.clamp(camera.position.x,-15,15);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-12,12);controls.target.x=THREE.MathUtils.clamp(controls.target.x,-15,15);controls.target.z=THREE.MathUtils.clamp(controls.target.z,-12,12)}}
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);move(dt);controls.update();renderer.render(scene,camera)}
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8))});
try{setLanguage('de');setRoom('reception');animate();$('loading').classList.add('done');setTimeout(()=>$('loading').remove(),500)}catch(err){console.error(err);$('loading').classList.add('done');$('error').hidden=false;$('error').textContent='3D office could not start: '+err.message}
