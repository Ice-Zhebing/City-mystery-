const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const {openDatabase}=require('../server/local-db.cjs');
(async()=>{
 const file=path.resolve(__dirname,'../dist/server/index.js');const {default:worker}=await import('data:text/javascript;base64,'+fs.readFileSync(file).toString('base64'));assert.equal(typeof worker.fetch,'function');
 const db=openDatabase(':memory:');const call=pathname=>worker.fetch(new Request('https://test.example'+pathname),{DB:db});
 for(const page of ['/','/index.html','/my-trip','/my-trip.html','/passport.html']){const result=await call(page);assert.equal(result.status,302);assert.equal(result.headers.get('location'),'/login.html');}
 const login=await call('/login.html');assert.equal(login.status,200);const loginHtml=await login.text();assert.ok(loginHtml.includes('account-form'));assert.match(loginHtml,/js\/account\.js\?v=[a-f0-9]{12}/);
 assert.equal((await call('/api/state')).status,401);assert.equal((await call('/server/index.js')).status,404);
 const stamp=await call('/assets/stamps/london-bigben.webp');assert.equal(stamp.status,200);assert.equal(stamp.headers.get('content-type'),'image/webp');
 db.close();console.log('Passed: Worker ESM, embedded assets, private page redirects, account API protection and stamp serving.');
})().catch(error=>{console.error(error);process.exitCode=1;});
