(function(){
 'use strict';
 const loginPage=location.pathname.replace(/\/$/,'').match(/\/login(?:\.html)?$/);
 const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('city-mystery:account'):null;
 let state=null;
 function clearSession(){for(const key of Object.keys(sessionStorage))if(key.startsWith('city-mystery:'))sessionStorage.removeItem(key);}
 async function request(path,data){
  const response=await fetch(path,{method:data===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',...(state?{'X-City-User':state.user.id}:{})},...(data===undefined?{}:{body:JSON.stringify(data)})});
  let result;try{result=await response.json();}catch{throw new Error('Unable to connect. Please try again.');}
  if(!response.ok){if(!loginPage&&[401,409].includes(response.status)&&path!=='/api/register'){clearSession();location.replace('login.html');}throw new Error(result.error||'Please try again.');}return result;
 }
 function accountWindow(){
  const marker=document.querySelector('.team-mark');if(!marker)return;
  const button=document.createElement('button');button.type='button';button.className='team-mark account-button';button.setAttribute('aria-label','Open my account');button.innerHTML='<svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></svg><span class="account-button-name"></span>';
  button.querySelector('.account-button-name').textContent=state.user.username;marker.replaceWith(button);
  const dialog=document.createElement('dialog');dialog.className='account-dialog';dialog.setAttribute('aria-labelledby','account-title');
  dialog.innerHTML='<button class="dialog-close" type="button" aria-label="Close account">×</button><p class="eyebrow">YOUR LITTLE CORNER</p><h2 id="account-title">My account</h2><dl class="account-details"><dt>Username</dt><dd id="account-name"></dd><dt>Password</dt><dd id="account-password"></dd></dl><p class="account-error" role="status"></p><button type="button" class="button button-primary logout-button">Log out <span aria-hidden="true">↗</span></button>';
  document.body.append(dialog);
  button.addEventListener('click',()=>{dialog.querySelector('#account-name').textContent=state.user.username;let secret;try{secret=JSON.parse(sessionStorage.getItem('city-mystery:credentials'));}catch{}dialog.querySelector('#account-password').textContent=secret?.userId===state.user.id?secret.password:(window.CityLanguage?.translate('Log in again to display your password.') || 'Log in again to display your password.');dialog.showModal();});
  dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.querySelector('.logout-button').onclick=async()=>{const btn=dialog.querySelector('.logout-button');btn.disabled=true;try{await request('/api/logout',{});clearSession();channel?.postMessage('changed');location.replace('login.html');}catch(error){dialog.querySelector('.account-error').textContent=error.message;btn.disabled=false;}};
 }
 channel?.addEventListener('message',()=>{clearSession();location.replace('login.html');});
 window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
 const ready=loginPage?Promise.resolve(null):request('/api/state').then(result=>{state=result;
  const previous=sessionStorage.getItem('city-mystery:active-user');if(previous!==state.user.id){clearSession();sessionStorage.setItem('city-mystery:active-user',state.user.id);}
  accountWindow();document.documentElement.classList.remove('auth-pending');return state;
 }).catch(error=>{if(!document.querySelector('.connection-error')){const section=document.createElement('section');section.className='connection-error';section.innerHTML='<h1>One small detour.</h1><p>We could not load your account. Please refresh to try again.</p><a class="button button-primary" href="login.html">Back to log in</a>';document.body.append(section);}throw error;});
 ready.catch(()=>{});
 window.CityAccount={ready,request,get state(){return state;},draftKey:()=> 'city-mystery:draft:'+state.user.id,async saveTrip(trip){const result=await request('/api/trips',trip);state.trip=result.trip;return result.trip;},async complete(){const result=await request('/api/complete',{tripId:state.trip.id});state.trip.completedAt=result.completedAt;return result;},signedIn(user,password){clearSession();state={user};sessionStorage.setItem('city-mystery:active-user',user.id);sessionStorage.setItem('city-mystery:credentials',JSON.stringify({userId:user.id,password}));channel?.postMessage('changed');},clearSession};
}());
