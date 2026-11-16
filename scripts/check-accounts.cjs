const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {openDatabase}=require('../server/local-db.cjs');
(async()=>{
 const root=path.resolve(__dirname,'..'),db=openDatabase(':memory:'),context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'public/js/data.js'),'utf8'),context);
 const {createApi}=await import('data:text/javascript;base64,'+fs.readFileSync(path.join(root,'server/api.js')).toString('base64')),api=createApi(context.window.CITY_DATA);
 async function call(route,data,cookie,extra={}){const response=await api(new Request('https://test.example'+route,{method:data===undefined?'GET':'POST',headers:{Origin:'https://test.example','Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...extra},...(data===undefined?{}:{body:JSON.stringify(data)})}),{DB:db});const value=await response.json();return {status:response.status,value,cookie:response.headers.get('set-cookie')?.split(';')[0]};}
 assert.equal((await call('/api/state')).status,401);
 for(const data of [{username:'',password:'a'},{username:'a',password:''},{username:'a!',password:'b'},{username:'a',password:'b b'}])assert.equal((await call('/api/register',data)).status,400);
 const first=await call('/api/register',{username:'TravellerA',password:'PassA123'});assert.equal(first.status,200);const a=first.cookie;
 assert.equal((await call('/api/register',{username:'travellera',password:'Other123'})).status,409);
 assert.equal((await call('/api/login',{username:'TravellerA',password:'Wrong123'})).status,401);
 const record=db.sqlite.prepare('SELECT * FROM users').get();assert.notEqual(record.password_hash,'PassA123');assert.equal(record.password_hash.length,64);assert.ok(record.salt);assert.ok(!JSON.stringify(record).includes('PassA123'));
 const city=context.window.CITY_DATA[0],sample={version:1,mode:'trailblazer',city:{id:city.id},sights:city.sights.slice(0,3),food:city.food.slice(0,3)};
 assert.equal((await call('/api/trips',sample,a,{Origin:'https://other.example'})).status,403);
 const saved=await call('/api/trips',sample,a);assert.equal(saved.status,201);const id=saved.value.trip.id;
 const bad=structuredClone(sample);bad.sights[0].id='bigben';assert.equal((await call('/api/trips',bad,a)).status,400);
 assert.equal((await call('/api/complete',{tripId:id},a)).status,200);const state=await call('/api/state',undefined,a);assert.equal(state.value.stamps.length,3);assert.ok(state.value.trip.completedAt);
 await call('/api/complete',{tripId:id},a);assert.equal((await call('/api/state',undefined,a)).value.stamps.length,3);
 const second=await call('/api/register',{username:'TravellerB',password:'PassB123'});const b=second.cookie;assert.equal(second.status,200);
 const empty=await call('/api/state',undefined,b);assert.equal(empty.value.trip,null);assert.equal(empty.value.stamps.length,0);
 assert.equal((await call('/api/complete',{tripId:id},b)).status,404);
 assert.equal((await call('/api/trips',sample,b,{'X-City-User':first.value.user.id})).status,409);
 await call('/api/logout',{},a);assert.equal((await call('/api/state',undefined,a)).status,401);
 const again=await call('/api/login',{username:'travellera',password:'PassA123'});assert.equal(again.status,200);assert.equal((await call('/api/state',undefined,again.cookie)).value.stamps.length,3);
 const next={...sample,mode:'easygoing',sights:city.sights.slice(3,5)};const nextSaved=await call('/api/trips',next,again.cookie);assert.equal(nextSaved.status,201);assert.equal((await call('/api/state',undefined,again.cookie)).value.trip.id,nextSaved.value.trip.id);await call('/api/complete',{tripId:nextSaved.value.trip.id},again.cookie);assert.equal((await call('/api/state',undefined,again.cookie)).value.stamps.length,5);
 for(const item of context.window.CITY_DATA)for(const sight of item.sights){const image=fs.readFileSync(path.join(root,'public/assets/stamps',item.id+'-'+sight.id+'.webp'));assert.equal(image.toString('ascii',8,12),'WEBP');}
 db.close();console.log('Passed: SQL migrations, input validation, password hashing, login/logout, session revocation, cross-account isolation, CSRF, canonical trips, latest-trip restore, duplicate completion and all catalogue stamps.');
})().catch(error=>{console.error(error);process.exitCode=1;});
