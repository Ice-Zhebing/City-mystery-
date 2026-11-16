/* Embed static assets into a dependency-free JavaScript Worker. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),base=path.join(root,'public'),out=path.join(root,'dist'),assets={};
const cloudflare=process.argv.includes('--cloudflare');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['server','.openai','.assetsignore'].includes(e.name))continue;const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else assets['/'+path.relative(base,file).replaceAll('\\','/')]={type:types[path.extname(file)]||'application/octet-stream',data:fs.readFileSync(file).toString('base64')};}}
if(!cloudflare)walk(base);
// New HTML always references the matching CSS/JS, even when a browser cached a previous release.
const {createHash}=require('node:crypto');
for(const [name,asset] of Object.entries(assets))if(name.endsWith('.html')){
 const html=Buffer.from(asset.data,'base64').toString('utf8').replace(/(src|href)="([^"?]+\.(?:js|css))"/g,(match,attribute,file)=>{
  const target=assets['/'+file];if(!target)return match;
  const version=createHash('sha256').update(target.data).digest('hex').slice(0,12);
  return attribute+'="'+file+'?v='+version+'"';
 });asset.data=Buffer.from(html).toString('base64');
}
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(base,'js/data.js'),'utf8'),context);
const api=fs.readFileSync(path.join(root,'server/api.js'),'utf8').replace('export function createApi','function createApi').replace('export {session};','');
const worker=api+'\nconst catalogue='+JSON.stringify(context.window.CITY_DATA)+';\nconst assets='+JSON.stringify(assets)+';\n'+fs.readFileSync(path.join(root,'server/index.js'),'utf8');
if(cloudflare){
 fs.mkdirSync(path.join(out,'cloudflare'),{recursive:true});
 fs.writeFileSync(path.join(out,'cloudflare/index.mjs'),worker);
 console.log('Built Cloudflare Worker with a separate Static Assets binding.');
}else{
 fs.mkdirSync(path.join(out,'server'),{recursive:true});
 fs.writeFileSync(path.join(out,'server/index.js'),worker);
 const manifest=path.join(root,'.openai/hosting.json');
 if(fs.existsSync(manifest)){
  fs.mkdirSync(path.join(out,'.openai'),{recursive:true});
  fs.copyFileSync(manifest,path.join(out,'.openai/hosting.json'));
 }
 console.log('Built framework-free Worker: '+Object.keys(assets).length+' embedded assets.');
}

fs.cpSync(path.join(root,'database/migrations'),path.join(root,'drizzle'),{recursive:true});
