const api=createApi(catalogue);
const pages=new Map([['/','/index.html'],['/index','/index.html'],['/my-trip','/my-trip.html'],['/passport','/passport.html'],['/login','/login.html']]);

function assetHeaders(pathname) {
 return {
  'Cache-Control':pathname.endsWith('.html')?'no-store':'public, max-age=300',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'Content-Security-Policy':"frame-ancestors 'self' https://*.chatgpt.com https://chatgpt.com"
 };
}

export default{async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/'))return api(request,env);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const pathname=pages.get(url.pathname)||url.pathname;

 if(env.ASSETS && pathname==='/js/maps-config.js'){
  const browserConfig=JSON.stringify({apiKey:env.GEOAPIFY_BROWSER_KEY||'',enableRouting:true});
  return new Response(request.method==='HEAD'?null:'window.CITY_MAPS_CONFIG = '+browserConfig+';',{
   headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
  });
 }

 if((env.ASSETS ? [...pages.values()].includes(pathname) : assets[pathname]) && pathname.endsWith('.html') && pathname!=='/login.html'){
  if(!env.DB)return new Response('Account storage is temporarily unavailable.',{status:503});
  if(!await session(request,env.DB))return new Response(null,{status:302,headers:{Location:'/login.html','Cache-Control':'no-store'}});
 }

 const headers=assetHeaders(pathname);
 if(env.ASSETS){
  const assetUrl=new URL(request.url);
  assetUrl.pathname=pathname;
  const asset=await env.ASSETS.fetch(new Request(assetUrl,{method:request.method,headers:request.headers}));
  const responseHeaders=new Headers(asset.headers);
  for(const [name,value] of Object.entries(headers))responseHeaders.set(name,value);
  return new Response(asset.body,{status:asset.status,headers:responseHeaders});
 }
 const asset=assets[pathname];
 if(!asset)return new Response('Not found',{status:404});
 const bytes=request.method==='HEAD'?null:Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 return new Response(bytes,{headers:{...headers,'Content-Type':asset.type}});
}};
