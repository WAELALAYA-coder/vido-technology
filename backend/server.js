import express from 'express';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { isIP } from 'node:net';
import { SESSION_COOKIE_NAME, CSRF_COOKIE_NAME, readCookieValue, createCsrfToken, verifyCsrfToken, buildSessionCookies, clearSessionCookies } from './session-security.js';

const { Pool } = pg;
const app = express();
const TRUSTED_PROXY_IP = String(process.env.TRUSTED_PROXY_IP || '').trim();
if (TRUSTED_PROXY_IP && isIP(TRUSTED_PROXY_IP) !== 4) throw new Error('TRUSTED_PROXY_IP must be one exact IPv4 address');
app.set('trust proxy', TRUSTED_PROXY_IP || false);
app.disable('x-powered-by');
app.use((_req,res,next)=>{ res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('X-Frame-Options','DENY'); res.setHeader('Referrer-Policy','strict-origin-when-cross-origin'); res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()'); res.setHeader('Cross-Origin-Resource-Policy','same-origin'); next(); });
app.use('/api',(_req,res,next)=>{ res.setHeader('Cache-Control','no-store, max-age=0'); res.setHeader('Pragma','no-cache'); next(); });
const UNSAFE_METHODS=new Set(['POST','PUT','PATCH','DELETE']);
function isSameOriginUnsafeRequest(req){
  let supplied=req.get('origin');
  if(!supplied&&req.get('referer')){
    try{supplied=new URL(req.get('referer')).origin;}catch{return false;}
  }
  if(!supplied)return process.env.NODE_ENV!=='production';
  try{
    const forwardedProto=String(req.get('x-forwarded-proto')||'').split(',')[0].trim().toLowerCase();
    const expectedProtocol=forwardedProto||req.protocol;
    const parsed=new URL(supplied);
    return parsed.host.toLowerCase()===String(req.get('host')||'').toLowerCase()
      && parsed.protocol===expectedProtocol+':';
  }catch{return false;}
}
app.use('/api',(req,res,next)=>{
  if(!UNSAFE_METHODS.has(req.method))return next();
  if(!isSameOriginUnsafeRequest(req))return res.status(403).json({error:'same_origin_required'});
  next();
});

app.use(express.json({limit:'1mb'}));
const PUBLIC_ROOT = process.cwd();
app.get('/', (_req,res)=>res.sendFile('index.html',{root:PUBLIC_ROOT}));
app.get('/index.html', (_req,res)=>res.sendFile('index.html',{root:PUBLIC_ROOT}));
app.get('/manifest.webmanifest', (_req,res)=>res.sendFile('manifest.webmanifest',{root:PUBLIC_ROOT,headers:{'Content-Type':'application/manifest+json'}}));
app.get('/icons/vido-app-icon.svg', (_req,res)=>res.sendFile('icons/vido-app-icon.svg',{root:PUBLIC_ROOT,headers:{'Content-Type':'image/svg+xml; charset=utf-8','Cache-Control':'public, max-age=86400'}}));
app.get('/icons/vido-192.png', (_req,res)=>res.sendFile('icons/vido-192.png',{root:PUBLIC_ROOT,headers:{'Content-Type':'image/png','Cache-Control':'public, max-age=86400'}}));
app.get('/icons/vido-512.png', (_req,res)=>res.sendFile('icons/vido-512.png',{root:PUBLIC_ROOT,headers:{'Content-Type':'image/png','Cache-Control':'public, max-age=86400'}}));
app.get('/service-worker.js', (_req,res)=>res.sendFile('service-worker.js',{root:PUBLIC_ROOT,headers:{'Service-Worker-Allowed':'/'}}));
app.get('/questions-v37.js', (_req,res)=>res.sendFile('questions-v37.js',{root:PUBLIC_ROOT,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache'}}));
app.get('/lessons-v37.js', (_req,res)=>res.sendFile('lessons-v37.js',{root:PUBLIC_ROOT,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache'}}));

app.get('/diagram-curriculum-v38.js', (_req,res)=>res.sendFile('diagram-curriculum-v38.js',{root:PUBLIC_ROOT,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache'}}));
app.get('/diagram-engine-v38.js', (_req,res)=>res.sendFile('diagram-engine-v38.js',{root:PUBLIC_ROOT,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache'}}));
app.get('/diagram-trainer.js', (_req,res)=>res.sendFile('diagram-trainer.js',{root:PUBLIC_ROOT,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache'}}));
app.get('/diagram-trainer.css', (_req,res)=>res.sendFile('diagram-trainer.css',{root:PUBLIC_ROOT,headers:{'Content-Type':'text/css; charset=utf-8','Cache-Control':'no-cache'}}));
const pool = process.env.DATABASE_URL ? new Pool({connectionString:process.env.DATABASE_URL, ssl:false}) : null;
const JWT_SECRET = process.env.JWT_SECRET || '';
if (process.env.NODE_ENV === 'production' && JWT_SECRET.length < 32) { throw new Error('JWT_SECRET must be at least 32 characters in production'); }
if (pool && JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters when database-backed sessions are enabled');
const AI_URL = process.env.AI_API_URL || '';
const AI_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';
const ADMIN_USERNAME = String(process.env.ADMIN_USERNAME || 'Admin').trim();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '');
const REGISTRATION_ENABLED = String(process.env.REGISTRATION_ENABLED || 'false').toLowerCase() === 'true';
const REQUIRE_STRONG_CREDENTIALS = process.env.VIDO_REQUIRE_STRONG_CREDENTIALS === 'true';
if (REQUIRE_STRONG_CREDENTIALS) {
  const OWNER_PASSWORD = String(process.env.OWNER_PASSWORD || '');
  const DB_URL = String(process.env.DATABASE_URL || '');
  if (JWT_SECRET.length < 48 || /^REPLACE_/i.test(JWT_SECRET)) throw new Error('Production JWT_SECRET must be a unique random secret of at least 48 characters');
  if (OWNER_PASSWORD.length < 12 || /^REPLACE_/i.test(OWNER_PASSWORD)) throw new Error('Production OWNER_PASSWORD must be replaced and contain at least 12 characters');
  if (ADMIN_PASSWORD.length < 12 || /^REPLACE_/i.test(ADMIN_PASSWORD)) throw new Error('Production ADMIN_PASSWORD must be replaced and contain at least 12 characters');
  if (OWNER_PASSWORD === ADMIN_PASSWORD) throw new Error('Production owner and quick-admin passwords must be different');
  if (!DB_URL || DB_URL.includes('REPLACE_WITH')) throw new Error('Production DATABASE_URL still contains a placeholder');
  if (REGISTRATION_ENABLED) throw new Error('Public registration is disabled in the initial private production profile');
}
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;
const IP_LOGIN_MAX_ATTEMPTS = 30;
let lastRateLimitCleanup = 0;
function clientIp(req){ return String(req.ip || req.socket?.remoteAddress || 'unknown'); }

function normalizeLoginIdentity(value){ return String(value ?? '').trim().toLowerCase().slice(0,254) || 'unknown'; }
function rateLimitKeys(req,identity){
  const ip=clientIp(req);
  const ipHash=crypto.createHash('sha256').update(ip).digest('hex');
  const identityHash=crypto.createHash('sha256').update(ip+'|'+normalizeLoginIdentity(identity)).digest('hex');
  return {ipKey:'ip:'+ipHash,identityKey:'identity:'+identityHash};
}
async function loginAllowed(req,identity){
  if(!pool) return false;
  let client;
  try{
    const {ipKey,identityKey}=rateLimitKeys(req,identity);
    client=await pool.connect();
    await client.query('BEGIN');
    for(const key of [ipKey,identityKey].sort()){
      await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))',[key]);
    }
    const sql="SELECT bucket_key,attempts FROM auth_rate_limits WHERE bucket_key=ANY($1::text[]) AND window_started_at>NOW()-($2::double precision*INTERVAL '1 millisecond')";
    const r=await client.query(sql,[[ipKey,identityKey],LOGIN_WINDOW_MS]);
    const counts=new Map(r.rows.map(row=>[row.bucket_key,Number(row.attempts)]));
    const allowed=(counts.get(ipKey)||0)<IP_LOGIN_MAX_ATTEMPTS && (counts.get(identityKey)||0)<LOGIN_MAX_ATTEMPTS;
    if(allowed){
      const upsert="INSERT INTO auth_rate_limits(bucket_key,window_started_at,attempts) SELECT key,NOW(),1 FROM unnest($1::text[]) AS t(key) ON CONFLICT(bucket_key) DO UPDATE SET attempts=CASE WHEN auth_rate_limits.window_started_at < NOW()-($2::double precision*INTERVAL '1 millisecond') THEN 1 ELSE auth_rate_limits.attempts+1 END, window_started_at=CASE WHEN auth_rate_limits.window_started_at < NOW()-($2::double precision*INTERVAL '1 millisecond') THEN NOW() ELSE auth_rate_limits.window_started_at END";
      await client.query(upsert,[[ipKey,identityKey],LOGIN_WINDOW_MS]);
    }
    await client.query('COMMIT');
    const now=Date.now();
    if(now-lastRateLimitCleanup>10*60*1000){
      lastRateLimitCleanup=now;
      pool.query("DELETE FROM auth_rate_limits WHERE window_started_at < NOW()-INTERVAL '1 day'").catch(()=>{});
    }
    return allowed;
  }catch(e){
    if(client) await client.query('ROLLBACK').catch(()=>{});
    console.error('Authentication rate-limit transaction failed');
    return false;
  }finally{client?.release();}
}
async function clearLoginFailures(req,identity){
  if(!pool) return;
  try{
    const {identityKey}=rateLimitKeys(req,identity);
    await pool.query('DELETE FROM auth_rate_limits WHERE bucket_key=$1',[identityKey]);
  }catch(e){ console.error('Authentication failure counter cleanup failed'); }
}

async function tutorRequestAllowed(userId){
  const userKey='ai:'+crypto.createHash('sha256').update(String(userId)).digest('hex');
  const r=await pool.query(
    "INSERT INTO auth_rate_limits(bucket_key,window_started_at,attempts) VALUES($1,NOW(),1) ON CONFLICT(bucket_key) DO UPDATE SET attempts=CASE WHEN auth_rate_limits.window_started_at < NOW()-INTERVAL '1 minute' THEN 1 WHEN auth_rate_limits.attempts < 11 THEN auth_rate_limits.attempts+1 ELSE 11 END, window_started_at=CASE WHEN auth_rate_limits.window_started_at < NOW()-INTERVAL '1 minute' THEN NOW() ELSE auth_rate_limits.window_started_at END RETURNING attempts",
    [userKey]
  );
  return Number(r.rows[0]?.attempts||0)<=10;
}
function token(user){ return jwt.sign({sub:user.id,email:user.email,role:user.role||'user',ver:Number(user.token_version||0)},JWT_SECRET,{algorithm:'HS256',expiresIn:'7d'}); }
function issueSessionCookies(res,user,remember=false){
  const sessionToken=token(user);
  const csrfToken=createCsrfToken(sessionToken,JWT_SECRET);
  res.append('Set-Cookie',buildSessionCookies({
    sessionToken,csrfToken,
    secure:process.env.NODE_ENV==='production',
    remember:remember===true
  }));
}
function clearAuthCookies(res){
  res.append('Set-Cookie',clearSessionCookies({secure:process.env.NODE_ENV==='production'}));
}


function ua(req){ return req.headers['user-agent']||null; }
async function logSecurity({userId=null,email=null,eventType,req,metadata={}}){ if(!pool)return; await pool.query('INSERT INTO security_log(user_id,email,event_type,ip,user_agent,metadata) VALUES($1,$2,$3,$4,$5,$6)',[userId,email,eventType,clientIp(req),ua(req),metadata]); }
async function logActivity({userId,eventType,route=null,req,metadata={}}){ if(!pool)return; await pool.query('INSERT INTO activity_log(user_id,event_type,route,ip,user_agent,metadata) VALUES($1,$2,$3,$4,$5,$6)',[userId,eventType,route,clientIp(req),ua(req),metadata]); }
async function adminUser(req,res,next){ if(!pool)return requireDb(res); try { const r=await pool.query('SELECT id,email,role,status FROM users WHERE id=$1',[req.user.sub]); if(!r.rowCount||r.rows[0].status!=='active'||!['owner','super_admin','analyst','content_manager','video_manager','lab_manager'].includes(r.rows[0].role)) return res.status(403).json({error:'admin_forbidden'}); req.admin=r.rows[0]; next(); } catch { res.status(500).json({error:'admin_check_failed'}); } }
async function ownerOnly(req,res,next){ if(!req.admin||req.admin.role!=='owner') return res.status(403).json({error:'owner_only'}); next(); }
async function auth(req,res,next){
  const sessionToken=readCookieValue(req.headers.cookie,SESSION_COOKIE_NAME);
  if(!sessionToken)return res.status(401).json({error:'unauthorized'});
  let payload;
  try{ payload=jwt.verify(sessionToken,JWT_SECRET,{algorithms:['HS256']}); }
  catch{ clearAuthCookies(res); return res.status(401).json({error:'unauthorized'}); }
  if(UNSAFE_METHODS.has(req.method)){
    const csrfCookie=readCookieValue(req.headers.cookie,CSRF_COOKIE_NAME);
    const csrfHeader=req.get('x-csrf-token')||'';
    if(!csrfCookie||csrfHeader!==csrfCookie||!verifyCsrfToken(sessionToken,csrfCookie,JWT_SECRET)){
      clearAuthCookies(res);
      return res.status(403).json({error:'csrf_validation_failed'});
    }
  }
  if(!requireDb(res))return;
  try{
    const r=await pool.query('SELECT status,token_version FROM users WHERE id=$1',[payload.sub]);
    if(!r.rowCount||r.rows[0].status!=='active'||Number(payload.ver??0)!==Number(r.rows[0].token_version??0)){
      clearAuthCookies(res);
      return res.status(401).json({error:'unauthorized'});
    }
    req.user=payload;
    next();
  }catch(e){return res.status(503).json({error:'auth_check_unavailable'});}
}
function requireDb(res){ if(!pool){res.status(503).json({error:'DATABASE_URL is not configured'}); return false;} return true; }

app.get('/api/health', async (_req,res)=>{ let db=false; if(pool){ try{ await pool.query('SELECT 1'); db=true; }catch{} } res.status(db?200:503).json({ok:db,backend:true,database:db,ai:!!(AI_URL&&AI_KEY)}); });
app.post('/api/auth/register', async (req,res)=>{
  if(!REGISTRATION_ENABLED) return res.status(403).json({error:'registration_disabled'});
  if(!requireDb(res)) return; const email=String(req.body?.email||'').toLowerCase().trim(); const password=String(req.body?.password||'');
  if(!/^\S+@\S+\.\S+$/.test(email)||password.length<12) return res.status(400).json({error:'email and password (12+ chars) required'});
  if(!(await loginAllowed(req,email))){ await logSecurity({email,eventType:'registration_rate_limited',req}); return res.status(429).json({error:'too_many_registration_attempts'}); }
  try { const hash=await bcrypt.hash(password,12); const r=await pool.query('INSERT INTO users(email,password_hash) VALUES($1,$2) RETURNING id,email,role,status,token_version',[email,hash]); await clearLoginFailures(req,email); await logSecurity({userId:r.rows[0].id,email:r.rows[0].email,eventType:'register',req}); await logActivity({userId:r.rows[0].id,eventType:'register',route:'/account',req}); issueSessionCookies(res,r.rows[0],req.body?.remember===true); res.status(201).json({user:r.rows[0]}); }
  catch(e){ if(e.code==='23505'){ return res.status(409).json({error:'email already registered'});} res.status(500).json({error:'registration failed'}); }
});
app.get('/api/auth/me', auth, async (req,res)=>{
  if(!requireDb(res)) return;
  const r=await pool.query('SELECT id,email,role,status FROM users WHERE id=$1',[req.user.sub]);
  if(!r.rowCount || r.rows[0].status!=='active') return res.status(401).json({error:'unauthorized'});
  res.json({user:r.rows[0]});
});

app.post('/api/auth/logout', auth, async (req,res)=>{
  try{
    const result=await pool.query('UPDATE users SET token_version=token_version+1 WHERE id=$1 AND token_version=$2 RETURNING id',[req.user.sub,Number(req.user.ver??0)]);
    if(!result.rowCount) return res.status(401).json({error:'unauthorized'});
    logSecurity({userId:req.user.sub,eventType:'logout',req}).catch(()=>{});
    clearAuthCookies(res);
    return res.json({ok:true,scope:'all_sessions'});
  }catch{
    return res.status(503).json({error:'logout_failed'});
  }
});

app.post('/api/auth/quick-admin', async (req,res)=>{
  if(!requireDb(res)) return;
  const username=String(req.body?.username||'').trim();
  const password=String(req.body?.password||'');
  if(!(await loginAllowed(req,username))){ await logSecurity({email:username||ADMIN_USERNAME,eventType:'quick_admin_login_rate_limited',req}); return res.status(429).json({error:'too_many_login_attempts'}); }
  if(!ADMIN_PASSWORD || username!==ADMIN_USERNAME || password!==ADMIN_PASSWORD){

    await logSecurity({email:username||ADMIN_USERNAME,eventType:'quick_admin_login_failed',req});
    return res.status(401).json({error:'invalid admin credentials'});
  }
  const email=process.env.OWNER_EMAIL ? String(process.env.OWNER_EMAIL).toLowerCase().trim() : 'admin@vido.local';
  const r=await pool.query('SELECT id,email,role,status,token_version FROM users WHERE email=$1',[email]);
  if(!r.rowCount) return res.status(503).json({error:'owner account is not initialized'});
  const user=r.rows[0];
  if(user.status!=='active') return res.status(403).json({error:'account_suspended'});
  if(user.role!=='owner') return res.status(403).json({error:'owner_role_required'});
  await pool.query('UPDATE users SET last_login_at=NOW(),last_ip=$2,last_user_agent=$3 WHERE id=$1',[user.id,clientIp(req),ua(req)]);
  await clearLoginFailures(req,username);
  await logSecurity({userId:user.id,email:user.email,eventType:'quick_admin_login_success',req});
  await logActivity({userId:user.id,eventType:'quick_admin_login',route:'/login',req});
  issueSessionCookies(res,user,req.body?.remember===true);
  res.json({user:{id:user.id,email:user.email,role:user.role,status:user.status}});
});

app.post('/api/auth/login', async (req,res)=>{
  if(!requireDb(res)) return; const {email,password}=req.body||{};
  const cleanEmail=String(email||'').toLowerCase().trim();
  if(!(await loginAllowed(req,cleanEmail))){ await logSecurity({email:cleanEmail,eventType:'login_rate_limited',req}); return res.status(429).json({error:'too_many_login_attempts'}); }
  const r=await pool.query('SELECT id,email,password_hash,role,status,token_version FROM users WHERE email=$1',[cleanEmail]);
  if(!r.rowCount||!(await bcrypt.compare(String(password||''),r.rows[0].password_hash))) {  await logSecurity({email:cleanEmail,eventType:'login_failed',req}); return res.status(401).json({error:'invalid credentials'}); }
  if(r.rows[0].status!=='active'){ await logSecurity({userId:r.rows[0].id,email:cleanEmail,eventType:'login_blocked',req}); return res.status(403).json({error:'account_suspended'}); }
  await clearLoginFailures(req,cleanEmail);
  await pool.query('UPDATE users SET last_login_at=NOW(),last_ip=$2,last_user_agent=$3 WHERE id=$1',[r.rows[0].id,clientIp(req),ua(req)]); await logSecurity({userId:r.rows[0].id,email:cleanEmail,eventType:'login_success',req}); await logActivity({userId:r.rows[0].id,eventType:'login',route:'/account',req});
  issueSessionCookies(res,r.rows[0],req.body?.remember===true);
  res.json({user:{id:r.rows[0].id,email:r.rows[0].email,role:r.rows[0].role,status:r.rows[0].status}});
});

app.post('/api/activity',auth,async(req,res)=>{if(!requireDb(res))return; const e=req.body||{}; await logActivity({userId:req.user.sub,eventType:String(e.eventType||'view'),route:e.route||null,req,metadata:e.metadata||{}});res.json({ok:true});});

app.get('/api/admin/overview',auth,adminUser,async(req,res)=>{if(!requireDb(res))return; const [u,a,s,active]=await Promise.all([pool.query("SELECT COUNT(*)::int count FROM users"),pool.query("SELECT COUNT(*)::int count FROM activity_log WHERE created_at>NOW()-INTERVAL '24 hours'"),pool.query("SELECT COUNT(*)::int count FROM security_log WHERE event_type='login_failed' AND created_at>NOW()-INTERVAL '24 hours'"),pool.query("SELECT COUNT(DISTINCT user_id)::int count FROM activity_log WHERE created_at>NOW()-INTERVAL '15 minutes' AND user_id IS NOT NULL")]);res.json({users:u.rows[0].count,activity24h:a.rows[0].count,failedLogins24h:s.rows[0].count,active15m:active.rows[0].count,role:req.admin.role});});
app.get('/api/admin/users',auth,adminUser,async(req,res)=>{if(!requireDb(res))return; const r=await pool.query("SELECT id,email,role,status,created_at,last_login_at,last_ip::text last_ip,last_user_agent FROM users ORDER BY created_at DESC LIMIT 500");res.json(r.rows);});
app.get('/api/admin/activity',auth,adminUser,async(req,res)=>{if(!requireDb(res))return; const r=await pool.query("SELECT a.id,a.event_type,a.route,a.ip::text ip,a.user_agent,a.country,a.city,a.created_at,u.email FROM activity_log a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT 300");res.json(r.rows);});
app.get('/api/admin/security',auth,adminUser,async(req,res)=>{if(!requireDb(res))return; const r=await pool.query("SELECT s.id,s.email,s.event_type,s.ip::text ip,s.user_agent,s.created_at,u.email user_email FROM security_log s LEFT JOIN users u ON u.id=s.user_id ORDER BY s.created_at DESC LIMIT 300");res.json(r.rows);});
app.post('/api/admin/users/:id/status',auth,adminUser,ownerOnly,async(req,res)=>{if(!requireDb(res))return; const status=req.body?.status; if(!['active','suspended'].includes(status))return res.status(400).json({error:'invalid_status'}); if(req.params.id===req.user.sub && status!=='active')return res.status(400).json({error:'cannot_suspend_current_owner'}); await pool.query('UPDATE users SET status=$2,token_version=token_version+1 WHERE id=$1',[req.params.id,status]); await pool.query('INSERT INTO audit_log(actor_user_id,action,target_type,target_id,metadata) VALUES($1,$2,$3,$4,$5)',[req.user.sub,'change_user_status','user',req.params.id,{status}]);res.json({ok:true});});
app.post('/api/admin/users/:id/role',auth,adminUser,ownerOnly,async(req,res)=>{if(!requireDb(res))return; const role=req.body?.role; const roles=['owner','super_admin','content_manager','video_manager','lab_manager','analyst','user']; if(!roles.includes(role))return res.status(400).json({error:'invalid_role'}); if(req.params.id===req.user.sub && role!=='owner')return res.status(400).json({error:'cannot_remove_current_owner_role'}); await pool.query('UPDATE users SET role=$2,token_version=token_version+1 WHERE id=$1',[req.params.id,role]); await pool.query('INSERT INTO audit_log(actor_user_id,action,target_type,target_id,metadata) VALUES($1,$2,$3,$4,$5)',[req.user.sub,'change_user_role','user',req.params.id,{role}]);res.json({ok:true});});

app.get('/api/admin/audit',auth,adminUser,async(req,res)=>{ if(!requireDb(res))return; const r=await pool.query("SELECT a.id,a.action,a.target_type,a.target_id,a.metadata,a.created_at,u.email actor_email FROM audit_log a LEFT JOIN users u ON u.id=a.actor_user_id ORDER BY a.created_at DESC LIMIT 300"); res.json(r.rows); });
app.get('/api/admin/system',auth,adminUser,async(req,res)=>{ if(!requireDb(res))return; const r=await pool.query("SELECT role,COUNT(*)::int count FROM users GROUP BY role ORDER BY role"); res.json({node:process.version,environment:process.env.NODE_ENV||'development',database:true,ai:!!(AI_URL&&AI_KEY),roles:r.rows}); });
app.post('/api/admin/users',auth,adminUser,ownerOnly,async(req,res)=>{ if(!requireDb(res))return; const email=String(req.body?.email||'').toLowerCase().trim(); const password=String(req.body?.password||''); const role=String(req.body?.role||'user'); const roles=['owner','super_admin','content_manager','video_manager','lab_manager','analyst','user']; if(!email||!/^\S+@\S+\.\S+$/.test(email)||password.length<12||!roles.includes(role)) return res.status(400).json({error:'email,password(12+),and valid role required'}); try{ const hash=await bcrypt.hash(password,12); const r=await pool.query("INSERT INTO users(email,password_hash,role,status) VALUES($1,$2,$3,'active') RETURNING id,email,role,status,created_at",[email,hash,role]); await pool.query('INSERT INTO audit_log(actor_user_id,action,target_type,target_id,metadata) VALUES($1,$2,$3,$4,$5)',[req.user.sub,'create_user','user',r.rows[0].id,{email,role}]); res.status(201).json(r.rows[0]); }catch(e){res.status(409).json({error:e.code==='23505'?'email already registered':'user creation failed'});} });
app.post('/api/admin/users/:id/password',auth,adminUser,ownerOnly,async(req,res)=>{ if(!requireDb(res))return; const password=String(req.body?.password||''); if(password.length<12)return res.status(400).json({error:'password must be 12+ characters'}); const hash=await bcrypt.hash(password,12); const r=await pool.query('UPDATE users SET password_hash=$2,token_version=token_version+1 WHERE id=$1 RETURNING email',[req.params.id,hash]); if(!r.rowCount)return res.status(404).json({error:'user_not_found'}); await pool.query('INSERT INTO audit_log(actor_user_id,action,target_type,target_id,metadata) VALUES($1,$2,$3,$4,$5)',[req.user.sub,'reset_user_password','user',req.params.id,{}]); res.json({ok:true,email:r.rows[0].email}); });
app.delete('/api/admin/users/:id',auth,adminUser,ownerOnly,async(req,res)=>{ if(!requireDb(res))return; if(req.params.id===req.user.sub)return res.status(400).json({error:'cannot_delete_current_owner'}); const r=await pool.query('DELETE FROM users WHERE id=$1 RETURNING email',[req.params.id]); if(!r.rowCount)return res.status(404).json({error:'user_not_found'}); await pool.query('INSERT INTO audit_log(actor_user_id,action,target_type,target_id,metadata) VALUES($1,$2,$3,$4,$5)',[req.user.sub,'delete_user','user',req.params.id,{email:r.rows[0].email}]); res.json({ok:true}); });

app.get('/api/state',auth,async(req,res)=>{if(!requireDb(res))return; const r=await pool.query('SELECT state FROM app_state WHERE user_id=$1',[req.user.sub]);res.json(r.rowCount?r.rows[0].state:null);});
app.put('/api/state',auth,async(req,res)=>{if(!requireDb(res))return; const state=req.body?.state; if(!state)return res.status(400).json({error:'state required'}); await pool.query(`INSERT INTO app_state(user_id,state) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET state=EXCLUDED.state,updated_at=NOW()`,[req.user.sub,state]);res.json({ok:true});});
app.post('/api/events',auth,async(req,res)=>{if(!requireDb(res))return; const e=req.body||{}; await pool.query('INSERT INTO learning_events(user_id,question_id,skill,correct,answer_time_ms,hints_used) VALUES($1,$2,$3,$4,$5,$6)',[req.user.sub,e.questionId,e.skill,!!e.correct,Number(e.answerTimeMs)||0,Number(e.hintsUsed)||0]);res.json({ok:true});});
app.get('/api/mastery',auth,async(req,res)=>{if(!requireDb(res))return; const r=await pool.query('SELECT skill,score,next_review,interval_days,repetitions FROM mastery WHERE user_id=$1',[req.user.sub]);res.json(r.rows);});
app.post('/api/tutor',auth,async(req,res)=>{
  if(!AI_URL||!AI_KEY) return res.status(503).json({error:'AI integration is not configured. Set AI_API_URL and AI_API_KEY on the server.'});
  const {question,answer,skill,level,hintsUsed,language}=req.body||{};
  const skillText=String(skill??'');
  const levelText=String(level??'');
  const hintCount=hintsUsed??0;
  if(typeof question!=='string'||!question.trim()||question.length>8000||typeof answer!=='string'||answer.length>8000||skillText.length>160||levelText.length>80||!['de','en','ar'].includes(language)||!Number.isSafeInteger(hintCount)||hintCount<0||hintCount>100)
    return res.status(400).json({error:'invalid_tutor_request'});
  let allowed=false;
  try{ allowed=await tutorRequestAllowed(req.user.sub); }
  catch{ return res.status(503).json({error:'AI tutor temporarily unavailable'}); }
  if(!allowed) return res.status(429).json({error:'tutor_rate_limit_exceeded'});
  const system=`You are VIDO Tutor for an IT/IHK learning platform. Respond in ${language}. Use Socratic guidance. Do not reveal the final answer unless explicitly requested. Explain the next reasoning step, rule, or diagnostic check. Keep technical terms precise.`;
  try { const r=await fetch(AI_URL,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${AI_KEY}`},signal:AbortSignal.timeout(30_000),body:JSON.stringify({model:AI_MODEL,messages:[{role:'system',content:system},{role:'user',content:JSON.stringify({question,answer,skill:skillText,level:levelText,hintsUsed:hintCount})}]})}); const data=await r.json(); if(!r.ok) return res.status(502).json({error:'AI provider error'}); res.json({reply:data.choices?.[0]?.message?.content||data.output_text||'No tutor response.'}); }
  catch(e){res.status(502).json({error:'AI request failed'});}
});

async function bootstrapOwner(){ if(!pool||!process.env.OWNER_EMAIL||!process.env.OWNER_PASSWORD)return; const email=process.env.OWNER_EMAIL.toLowerCase().trim(); const hash=await bcrypt.hash(process.env.OWNER_PASSWORD,12); await pool.query(`INSERT INTO users(email,password_hash,role,status) VALUES($1,$2,'owner','active') ON CONFLICT(email) DO NOTHING`,[email,hash]); }
const port=Number(process.env.PORT||3000);
async function startServer(){
  try{
    if(pool){
      await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0");
      await pool.query("CREATE TABLE IF NOT EXISTS auth_rate_limits (bucket_key TEXT PRIMARY KEY,window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0))");
      await pool.query('CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_window ON auth_rate_limits(window_started_at)');
      await bootstrapOwner();
      const cleanup=setInterval(()=>{ pool.query("DELETE FROM auth_rate_limits WHERE window_started_at < NOW()-INTERVAL '1 day'").catch(()=>{}); },60*60*1000);
      cleanup.unref();
    }
    app.listen(port,()=>console.log('VIDO backend listening on http://localhost:'+port));
  }catch(e){
    console.error('VIDO startup failed:',e.message);
    process.exit(1);
  }
}
startServer();
