const api=createApi(catalogue);
const pages=new Map([['/','/index.html'],['/index','/index.html'],['/my-trip','/my-trip.html'],['/passport','/passport.html'],['/login','/login.html']]);
export default{async fetch(request,env){
 const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return api(request,env);
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const pathname=pages.get(url.pathname)||url.pathname,asset=assets[pathname];if(!asset)return new Response('Not found',{status:404});
 if(pathname.endsWith('.html')&&pathname!=='/login.html'){
  if(!env.DB)return new Response('Account storage is temporarily unavailable.',{status:503});
  if(!await session(request,env.DB))return new Response(null,{status:302,headers:{Location:'/login.html','Cache-Control':'no-store'}});
 }
 const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':pathname.endsWith('.html')?'no-store':'public, max-age=300','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"frame-ancestors 'self' https://*.chatgpt.com https://chatgpt.com"}});
}};
