(function(){
 'use strict';
 const form=document.getElementById('account-form'),user=document.getElementById('username'),password=document.getElementById('password'),submit=document.getElementById('submit-account'),error=document.getElementById('login-error');let mode='login';
 function select(next){mode=next;error.textContent='';document.querySelectorAll('[data-auth-mode]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.authMode===mode)));document.getElementById('form-title').textContent=mode==='login'?'Welcome back.':'A new adventure awaits.';submit.querySelector('span').textContent=mode==='login'?'Log in':'Create account';password.autocomplete=mode==='login'?'current-password':'new-password';}
 document.querySelectorAll('[data-auth-mode]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.authMode)));
 document.getElementById('toggle-password').onclick=()=>{const visible=password.type==='password';password.type=visible?'text':'password';document.getElementById('toggle-password').textContent=visible?'Hide':'Show';};
 form.addEventListener('submit',async event=>{event.preventDefault();error.textContent='';if(!form.reportValidity())return;submit.disabled=true;try{const result=await CityAccount.request('/api/'+mode,{username:user.value,password:password.value});CityAccount.signedIn(result.user,password.value);password.value='';location.replace('index.html');}catch(problem){error.textContent=problem.message;}finally{submit.disabled=false;}});
}());
