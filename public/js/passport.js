(async function(){
 'use strict';let account;try{account=await CityAccount.ready;}catch{return;}
 const byId=id=>document.getElementById(id),escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const format=date=>new Intl.DateTimeFormat(window.CityLanguage?.locale || 'en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(date));
 const spreads=[];
 const preloadedStamps = new Set();
 for(const city of CITY_DATA){const collected=account.stamps.filter(stamp=>stamp.cityId===city.id).map(stamp=>({...stamp,place:city.sights.find(s=>s.id===stamp.sightId)})).filter(s=>s.place);for(let i=0;i<collected.length;i+=4)spreads.push({city,stamps:collected.slice(i,i+4),total:collected.length});}
 let index=0,busy=false;
 function stampMarkup(stamp){return '<figure class="passport-stamp"><img src="assets/stamps/'+stamp.cityId+'-'+stamp.sightId+'.webp" alt="'+escape(stamp.place.name)+' travel stamp"><figcaption><strong>'+escape(stamp.place.name)+'</strong><span>VISITED · '+escape(format(stamp.earnedAt))+'</span></figcaption></figure>';}
 function render(){
  const spread=spreads[index];
  byId('passport-count').textContent=account.stamps.length+' of '+CITY_DATA.reduce((count,city)=>count+city.sights.length,0)+' sight stamps collected';
  byId('page-prev').disabled=index===0;byId('page-next').disabled=index>=spreads.length-1;
  byId('page-position').textContent=spreads.length?(index+1)+' / '+spreads.length:'Your first chapter';
  if(!spread){byId('left-page').innerHTML='<div class="passport-page-heading">TRAVEL PASSPORT</div><div class="empty-passport-message"><h2>No stamps yet.</h2><p>Complete a trip to collect your sightseeing stamps.</p><a href="index.html" class="button button-primary">Explore cities →</a></div><span class="page-number">01</span>';byId('right-page').innerHTML='<div class="passport-page-heading">UNITED KINGDOM</div><span class="page-number">02</span>';return;}
  byId('left-page').innerHTML = pageMarkup(index, 'left');
  byId('right-page').innerHTML = pageMarkup(index, 'right');
  byId('passport-live').textContent=spread.city.name+', spread '+(index+1)+' of '+spreads.length;
  preloadNextSpread();
 }

 function preloadNextSpread() {
  const nextSpread = spreads[index + 1];
  nextSpread?.stamps.forEach(stamp => {
   const url = 'assets/stamps/' + stamp.cityId + '-' + stamp.sightId + '.webp';
   if (preloadedStamps.has(url)) return;
   const photo = new Image();
   photo.src = url;
   preloadedStamps.add(url);
   photo.decode?.().catch(() => {});
  });
 }

 function pageMarkup(spreadIndex, side) {
  const {city, stamps} = spreads[spreadIndex];
  const split = Math.ceil(stamps.length / 2);
  const left = side === 'left';
  const pageStamps = left ? stamps.slice(0, split) : stamps.slice(split);
  const pageNumber = String(spreadIndex * 2 + (left ? 1 : 2)).padStart(2, '0');
  return '<div class="passport-page-heading">' + escape(city.name) + ' · ' + escape(city.country)
   + '</div>' + pageStamps.map(stampMarkup).join('')
   + '<span class="page-number">' + pageNumber + '</span>';
 }

 async function turn(direction) {
  const next = index + direction;
  if (busy || next < 0 || next >= spreads.length) return;

  const leaf = byId('turning-leaf');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !leaf.animate) {
   index = next;
   render();
   return;
  }

  busy = true;
  const forward = direction > 0;
  const from = forward ? 'right' : 'left';
  const to = forward ? 'left' : 'right';
  const exposedPage = byId(from + '-page');
  const front = document.createElement('div');
  front.className = 'passport-page ' + from + '-page';
  front.innerHTML = exposedPage.innerHTML;
  const reverse = document.createElement('div');
  reverse.className = 'passport-page ' + to + '-page leaf-reverse';
  reverse.innerHTML = pageMarkup(next, to);
  leaf.className = 'turning-leaf ' + (forward ? 'turn-forward' : 'turn-back');
  leaf.replaceChildren(front, reverse);
  exposedPage.innerHTML = pageMarkup(next, from);
  leaf.hidden = false;

  let animation;
  try {
   animation = leaf.animate([
    {transform: 'rotateY(0deg)'},
    {transform: 'rotateY(' + (-180 * direction) + 'deg)'}
   ], {duration: 760, easing: 'cubic-bezier(.45, .05, .55, .95)', fill: 'forwards'});
   await animation.finished;
  } finally {
   index = next;
   render();
   leaf.hidden = true;
   animation?.cancel();
   leaf.replaceChildren();
   busy = false;
  }
 }
 byId('page-prev').onclick=()=>turn(-1);byId('page-next').onclick=()=>turn(1);
 byId('passport-book').addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();turn(1);}if(event.key==='ArrowLeft'){event.preventDefault();turn(-1);}});
 render();
}());
