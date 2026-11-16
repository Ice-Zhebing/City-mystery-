/* Local server: plain JavaScript, built-in SQLite, no framework. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {openDatabase}=require('./local-db.cjs');
const root=path.resolve(__dirname,'..'),base=path.join(root,'public');fs.mkdirSync(path.join(root,'database'),{recursive:true});
const db=openDatabase(path.join(root,'database/city-mystery.sqlite'));
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(base,'js/data.js'),'utf8'),context);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
(async()=>{
 const module=await import('data:text/javascript;base64,'+fs.readFileSync(path.join(root,'server/api.js')).toString('base64')),api=module.createApi(context.window.CITY_DATA);
 const server=http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://127.0.0.1:4173');let pathname=decodeURIComponent(url.pathname);const headers=new Headers();for(const [key,value]of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value);
  const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);
  const request=new Request(url,{method:req.method,headers,...(['GET','HEAD'].includes(req.method)?{}:{body})});
  if(pathname.startsWith('/api/')){const response=await api(request,{DB:db});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;}
  const aliases={'/':'/index.html','/index':'/index.html','/my-trip':'/my-trip.html','/passport':'/passport.html','/login':'/login.html'};pathname=aliases[pathname]||pathname;
  if(pathname.startsWith('/server/')||pathname.startsWith('/.openai/')){res.writeHead(404);res.end();return;}
  const requested=path.resolve(base,'.'+pathname);if(!requested.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}
  if(pathname.endsWith('.html')&&pathname!=='/login.html'&&!await module.session(request,db)){res.writeHead(302,{Location:'/login.html','Cache-Control':'no-store'});res.end();return;}
  fs.readFile(requested,(error,content)=>{if(error){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(requested)]||'application/octet-stream','Cache-Control':'no-store'});res.end(content);});
 }catch{res.writeHead(500);res.end('Unable to load this page.');}});
 server.on('error',error=>{db.close();if(error.code==='EADDRINUSE'){console.log('City Mystery is already running. Open http://127.0.0.1:4173/login.html');process.exit(0);}console.error('Unable to start City Mystery: '+error.message);process.exit(1);});
 server.listen(4173,'127.0.0.1',()=>console.log('City Mystery: http://127.0.0.1:4173/login.html'));
 process.on('SIGINT',()=>server.close(()=>{db.close();process.exit();}));
})();
