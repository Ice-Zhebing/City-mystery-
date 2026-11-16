/* Framework-free API; prepared SQL works with D1 and local SQLite. */
const encoder=new TextEncoder();
const hex=bytes=>Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');
const sha=async value=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(value)));
async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},key,256));}
function equal(a,b){let diff=a.length^b.length;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^(b.charCodeAt(i)||0);return diff===0;}
class ApiError extends Error{constructor(status,message){super(message);this.status=status;}}
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
const cookieName=request=>new URL(request.url).protocol==='https:'?'__Host-city-session':'city-session';
function cookieToken(request){return (request.headers.get('cookie')||'').split(';').map(p=>p.trim()).find(p=>p.startsWith(cookieName(request)+'='))?.split('=')[1];}
function sessionCookie(request,value,age=604800){return cookieName(request)+'='+value+'; Path=/; HttpOnly; SameSite=Strict; Max-Age='+age+(new URL(request.url).protocol==='https:'?'; Secure':'');}
async function session(request,db){const token=cookieToken(request);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return db.prepare('SELECT users.id, users.username FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ?').bind(await sha(token),Date.now()).first();}
async function body(request){if(Number(request.headers.get('content-length'))>20000)throw new ApiError(413,'Request too large.');const text=await request.text();if(text.length>20000)throw new ApiError(413,'Request too large.');try{return JSON.parse(text);}catch{throw new ApiError(400,'Please send valid data.');}}
function validTrip(raw,catalogue){
 if(!raw||raw.version!==1||!['trailblazer','easygoing'].includes(raw.mode))throw new ApiError(400,'This trip is not valid.');
 const city=catalogue.find(c=>c.id===raw.city?.id),count=raw.mode==='easygoing'?2:3;
 if(!city||!Array.isArray(raw.sights)||raw.sights.length!==count||!Array.isArray(raw.food)||raw.food.length!==3)throw new ApiError(400,'Reveal all the cards before building your trip.');
 const groups={};for(const group of ['sights','food']){const ids=raw[group].map(p=>p?.id);groups[group]=ids.map(id=>city[group].find(p=>p.id===id));if(new Set(ids).size!==ids.length||groups[group].some(p=>!p))throw new ApiError(400,'Please choose places from your revealed city.');}
 return {version:1,mode:raw.mode,city:{id:city.id,name:city.name,country:city.country,image:city.image},...groups,createdAt:new Date().toISOString()};
}
export function createApi(catalogue){return async function handle(request,env){
 const url=new URL(request.url),db=env.DB;
 try{
  if(!db)throw new ApiError(503,'Account storage is temporarily unavailable. Please try again later.');
  if(request.method!=='GET'){if(request.headers.get('origin')!==url.origin)throw new ApiError(403,'Please submit your request from this website.');if(!request.headers.get('content-type')?.includes('application/json'))throw new ApiError(415,'Please send JSON data.');}
  if(['/api/register','/api/login'].includes(url.pathname)){
   if(request.method!=='POST')throw new ApiError(405,'Method not allowed.');
   const {username,password}=await body(request);
   if(typeof username!=='string'||typeof password!=='string'||!/^[A-Za-z0-9]{1,32}$/.test(username)||!/^[A-Za-z0-9]{1,128}$/.test(password))throw new ApiError(400,'Both fields are required. Use letters and numbers only (username up to 32, password up to 128 characters).');
   const now=Date.now(),bucket=await sha((request.headers.get('cf-connecting-ip')||'local')+':'+username.toLowerCase());
   await db.prepare('INSERT INTO auth_limits (bucket, attempts, reset_at) VALUES (?, 1, ?) ON CONFLICT(bucket) DO UPDATE SET attempts = CASE WHEN reset_at < ? THEN 1 ELSE attempts + 1 END, reset_at = CASE WHEN reset_at < ? THEN excluded.reset_at ELSE reset_at END').bind(bucket,now+900000,now,now).run();
   const limit=await db.prepare('SELECT attempts FROM auth_limits WHERE bucket = ?').bind(bucket).first();if(limit.attempts>15)throw new ApiError(429,'Too many attempts. Please try again in 15 minutes.');
   let user=await db.prepare('SELECT id, username, password_hash, salt FROM users WHERE username = ? COLLATE NOCASE').bind(username).first();
   if(url.pathname==='/api/register'){
    if(user)throw new ApiError(409,'That username is already taken. Please choose another.');
    const id=crypto.randomUUID(),salt=hex(crypto.getRandomValues(new Uint8Array(16))),hash=await passwordHash(password,salt);
    try{await db.prepare('INSERT INTO users (id, username, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?)').bind(id,username,hash,salt,new Date().toISOString()).run();}catch{throw new ApiError(409,'That username is already taken. Please choose another.');}user={id,username};
   }else{const hash=await passwordHash(password,user?.salt||'unknown-account-dummy-salt');if(!user||!equal(hash,user.password_hash))throw new ApiError(401,'Username or password is incorrect.');}
   const old=cookieToken(request);if(old)await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha(old)).run();
   const token=hex(crypto.getRandomValues(new Uint8Array(32)));
   await db.batch([db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha(token),user.id,now+604800000),db.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now),db.prepare('DELETE FROM auth_limits WHERE reset_at < ?').bind(now)]);
   return json({user:{id:user.id,username:user.username}},200,{'Set-Cookie':sessionCookie(request,token)});
  }
  const user=await session(request,db);if(!user)throw new ApiError(401,'Please log in to continue.');
  if(request.headers.has('X-City-User')&&request.headers.get('X-City-User')!==user.id)throw new ApiError(409,'The account changed. Please log in again.');
  if(url.pathname==='/api/logout'&&request.method==='POST'){await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha(cookieToken(request))).run();return json({ok:true},200,{'Set-Cookie':sessionCookie(request,'',0)});}
  if(url.pathname==='/api/state'&&request.method==='GET'){
   const row=await db.prepare('SELECT id, payload, completed_at FROM trips WHERE user_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1').bind(user.id).first();
   const stamps=await db.prepare('SELECT city_id AS cityId, sight_id AS sightId, earned_at AS earnedAt FROM stamps WHERE user_id = ? ORDER BY earned_at, city_id, sight_id').bind(user.id).all();
   return json({user,trip:row?{...JSON.parse(row.payload),id:row.id,completedAt:row.completed_at}:null,stamps:stamps.results});
  }
  if(url.pathname==='/api/trips'&&request.method==='POST'){const trip=validTrip(await body(request),catalogue),id=crypto.randomUUID();await db.prepare('INSERT INTO trips (id, user_id, payload, created_at) VALUES (?, ?, ?, ?)').bind(id,user.id,JSON.stringify(trip),trip.createdAt).run();return json({trip:{...trip,id,completedAt:null}},201);}
  if(url.pathname==='/api/complete'&&request.method==='POST'){
   const {tripId}=await body(request);if(typeof tripId!=='string')throw new ApiError(400,'Choose a trip to complete.');
   const row=await db.prepare('SELECT id, payload, completed_at FROM trips WHERE id = ? AND user_id = ?').bind(tripId,user.id).first();if(!row)throw new ApiError(404,'This trip was not found in your account.');
   const trip=JSON.parse(row.payload),date=row.completed_at||new Date().toISOString();
   await db.batch([db.prepare('UPDATE trips SET completed_at = COALESCE(completed_at, ?) WHERE id = ? AND user_id = ?').bind(date,tripId,user.id),...trip.sights.map(s=>db.prepare('INSERT INTO stamps (user_id, city_id, sight_id, earned_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, city_id, sight_id) DO NOTHING').bind(user.id,trip.city.id,s.id,date))]);return json({completedAt:date});
  }
  throw new ApiError(404,'Page not found.');
 }catch(error){return json({error:error.status?error.message:'Something went wrong. Please try again.'},error.status||500);}
};}
export {session};
