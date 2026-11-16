(async function () {
  'use strict';
  const byId = id => document.getElementById(id);
  const escapeHtml = value => String(value).replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const model = window.TripPageModel, engine = window.TripEngine;
  const icons = {
    museum:'<path d="M2 8 12 3l10 5ZM3 21h18M4 18h16M6 10v8m4-8v8m4-8v8m4-8v8"/>',
    castle:'<path d="M3 21V6h3V3h3v3h3V3h3v3h3V3h3v18ZM3 10h18M9 21v-6a3 3 0 0 1 6 0v6"/>',
    hill:'<path d="m2 20 7-11 5 7 3-4 5 8ZM9 9l3-6 5 9"/><circle cx="18" cy="5" r="2"/>',
    church:'<path d="M4 21V11l4-4 4 4v10m0-8 4-5 4 5v8ZM8 3v4M6 5h4m2 16v-4"/>',
    clock:'<path d="M7 21V9l5-6 5 6v12ZM6 21h12"/><circle cx="12" cy="11" r="3"/><path d="M12 9v2l1 1"/>',
    wheel:'<circle cx="12" cy="10" r="8"/><path d="m8 22 4-12 4 12M12 2v16M4 10h16M6 4l12 12M6 16 18 4"/>',
    bridge:'<path d="M2 17h20M4 21V7h4v14m8 0V7h4v14M3 7l3-4 3 4m6 0 3-4 3 4M8 12c3 5 5 5 8 0"/>',
    street:'<path d="M3 21V7l4-4 4 4v14m0 0V10l5-4 5 4v11ZM5 9h4m-4 4h4m-4 4h4m5-5h4m-4 4h4"/>',
    train:'<rect x="5" y="3" width="14" height="15" rx="4"/><path d="M5 10h14M12 3v7m-4 8-3 4m11-4 3 4M7 21h10"/>',
    leaf:'<path d="M20 3C6 2 1 10 7 16s14 0 13-13ZM4 21 17 7m-6 11-1-7m0 1 6 1"/>',
    food:'<path d="M5 2v7m3-7v7m-6-7v7c0 3 6 3 6 0m-3 3v10M18 2c-4 5-5 9-1 10h2V2Zm1 10v10"/>',
    walk:'<circle cx="13" cy="4" r="2"/><path d="m8 21 4-9m0 0 4 9m-4-9 1-5 3 5 4 1m-7-6-4 4H5"/>'
  };
  const icon = name => '<svg viewBox="0 0 24 24" aria-hidden="true">' + (icons[name] || icons.museum) + '</svg>';
  const link = (url,label,className) => '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" class="' + (className || '') + '">' + label + '</a>';
  let account; try { account = await window.CityAccount.ready; } catch (_) { return; }
  const raw = account.trip;
  const trip = model.resolveTrip(raw,window.CITY_DATA);
  const announce = message => {byId('trip-announcement').textContent = message;};
  let routeController;

  function fillCredits() {
    const relevant = trip ? new Set([...window.CITY_MEDIA[trip.city.id].map(slide => slide.image),...trip.sights.map(place => window.SIGHT_IMAGES[trip.city.id][place.id]),...trip.food.map(place => window.FOOD_IMAGES[trip.city.id][place.id].image)]) : null;
    byId('trip-photo-credits').innerHTML = [...(window.IMAGE_CREDITS || []),...(window.FOOD_IMAGE_CREDITS || [])].filter(credit => !relevant || relevant.has(credit.file)).map(credit => '<p class="credit-entry">' + link(credit.source,escapeHtml(credit.title)) + ' — ' + escapeHtml(credit.artist) + ' · ' + link(credit.licenseUrl,escapeHtml(credit.license)) + '<br>' + escapeHtml(credit.changes) + '</p>').join('');
    byId('trip-place-credits').innerHTML = trip ? '<ul class="place-credit-list">' + [...trip.sights,...trip.food].map(place => '<li>' + link(place.source || place.website,escapeHtml(place.name)) + '</li>').join('') + '</ul>' : '<p>Build your trip on Home to see its sources.</p>';
    const dialog = byId('trip-credits-dialog');
    byId('trip-open-credits').addEventListener('click',() => dialog.showModal());
    byId('trip-close-credits').addEventListener('click',() => dialog.close());
    dialog.addEventListener('click',event => {if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();});
  }
  fillCredits();
  if (!trip) {byId('empty-trip').hidden = false; return;}

  document.title = trip.city.name + ' · My Trip — City Mystery';
  byId('trip-city-label').textContent = trip.city.name + ' · ' + trip.city.country;
  byId('trip-title').textContent = trip.city.name + ' trip';
  byId('trip-city-intro').textContent = window.CITY_TRIP_INTRO[trip.city.id] || trip.city.description;
  byId('trip-mode').textContent = trip.mode === 'trailblazer' ? 'Trailblazer' : 'Easygoing';
  byId('trip-sight-count').textContent = trip.sights.length + ' sights';
  const ordered = model.suggestedOrder(trip.sights,engine.distanceKm);
  function focusSight(id) {document.querySelectorAll('.trip-sight').forEach(element => element.classList.toggle('is-focused',element.dataset.sightId === id));}
  byId('trip-sights').innerHTML = ordered.map((place,index) => {
    const image = window.SIGHT_IMAGES[trip.city.id]?.[place.id];
    const visual = image ? '<img src="' + image + '" alt="' + escapeHtml(place.name) + '" loading="lazy">' : icon(place.icon);
    return '<li class="trip-sight" data-sight-id="' + place.id + '"><span class="stop-number">' + (index+1) + '</span><article class="trip-sight-card"><div class="trip-place-visual">' + visual + '</div><button type="button" class="trip-place-title" data-focus-sight="' + place.id + '" aria-label="Show ' + escapeHtml(place.name) + ' on the map">' + escapeHtml(place.name) + '</button><p class="trip-place-address">' + escapeHtml(place.address) + '</p><p class="trip-place-description">' + escapeHtml(place.description) + '</p></article>' + (index < ordered.length-1 ? '<p class="trip-leg" data-leg="' + index + '">' + icon('walk') + '<span>Next sight →</span></p>' : '') + '</li>';
  }).join('');
  byId('trip-food').innerHTML = trip.food.map(place => {
    const media = window.FOOD_IMAGES[trip.city.id][place.id];
    return '<li class="food-find"><article><div class="trip-place-visual food-place-visual"><img src="' + media.image + '" alt="' + escapeHtml(media.alt) + '" loading="lazy"></div><h4 class="trip-place-title">' + escapeHtml(place.name) + '</h4><p class="trip-place-address">' + escapeHtml(place.address) + '</p><p class="trip-place-description">' + escapeHtml(place.description) + '</p></article></li>';
  }).join('');

  byId('trip-sights').addEventListener('click',event => {const button = event.target.closest('[data-focus-sight]'); if (button) {focusSight(button.dataset.focusSight); routeController?.focusPlace(button.dataset.focusSight);}});
  const completeButton=byId('complete-trip');
  function showCompleted() {
    completeButton.disabled=true; completeButton.textContent='Trip completed ✓';
    byId('complete-status').textContent='';
    byId('view-passport').hidden=false;
  }
  if(raw.completedAt)showCompleted();
  completeButton.addEventListener('click',async()=>{
    completeButton.disabled=true;
    byId('complete-status').textContent='Collecting your stamps…';
    try {await window.CityAccount.complete();showCompleted();location.href='passport.html';}
    catch(error){byId('complete-status').textContent=error.message;completeButton.disabled=false;}
  });

  // City-specific three-image carousel. Pauses on hover, focus and hidden tabs.
  const media = window.CITY_MEDIA[trip.city.id];
  byId('trip-slides').innerHTML = media.map((slide,i) => '<figure class="slide' + (i === 0 ? ' is-active' : '') + '" aria-label="' + (i+1) + ' of 3: ' + escapeHtml(slide.caption) + '" aria-hidden="' + (i !== 0) + '"><img src="' + slide.image + '" width="1280" height="720" alt="' + escapeHtml(slide.alt) + '"' + (i === 0 ? ' fetchpriority="high"' : '') + '><figcaption>' + escapeHtml(slide.caption) + '</figcaption></figure>').join('');
  byId('trip-slide-dots').innerHTML = media.map((slide,i) => '<button type="button" class="dot' + (i === 0 ? ' is-active' : '') + '" data-trip-slide="' + i + '" aria-label="Show ' + escapeHtml(slide.caption) + '" aria-pressed="' + (i === 0) + '"></button>').join('');
  let index = 0, timer, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const carousel = document.querySelector('.trip-slideshow');
  const slides = [...byId('trip-slides').children], dots = [...byId('trip-slide-dots').children];
  function showSlide(next) {index = (next+3)%3; slides.forEach((slide,i) => {slide.classList.toggle('is-active',i === index); slide.setAttribute('aria-hidden',String(i !== index)); dots[i].classList.toggle('is-active',i === index); dots[i].setAttribute('aria-pressed',String(i === index));});}
  function stopCarousel() {clearInterval(timer);}
  function startCarousel() {stopCarousel(); if (!paused && !document.hidden && !carousel.matches(':hover') && !carousel.contains(document.activeElement)) timer = setInterval(() => showSlide(index+1),5500);}
  function updatePause() {const button = byId('trip-pause-slides'); button.textContent = paused ? '▷' : 'Ⅱ'; button.setAttribute('aria-label',paused ? 'Play city slideshow' : 'Pause city slideshow'); button.setAttribute('aria-pressed',String(paused));}
  byId('trip-previous-slide').addEventListener('click',() => {showSlide(index-1); startCarousel();});
  byId('trip-next-slide').addEventListener('click',() => {showSlide(index+1); startCarousel();});
  dots.forEach((dot,i) => dot.addEventListener('click',() => {showSlide(i); startCarousel();}));
  byId('trip-pause-slides').addEventListener('click',() => {paused = !paused; updatePause(); startCarousel();});
  carousel.addEventListener('mouseenter',stopCarousel); carousel.addEventListener('mouseleave',startCarousel);
  carousel.addEventListener('focusin',stopCarousel); carousel.addEventListener('focusout',() => setTimeout(startCarousel,0));
  document.addEventListener('visibilitychange',startCarousel); updatePause(); startCarousel();

  // Map status never substitutes a schematic line for a failed walking route.
  function mapStatus(event) {
    byId('map-loading').hidden = event.hasMap || ['map-error','route-error'].includes(event.state);
    byId('map-failure').hidden = event.state !== 'map-error';
    byId('route-retry').hidden = event.state !== 'route-error';
    const dot = byId('route-status-dot'); dot.classList.toggle('is-ready',['ready','markers-only'].includes(event.state)); dot.classList.toggle('is-error',event.state.includes('error'));
    if (event.state !== 'ready') {
      byId('route-totals').hidden = true;
    }
    const messages = {loading:'Loading your city map', 'map-ready':'Your selected sights, on the map','markers-only':'Your selected sights, on the map',routing:'Finding your walking route',ready:'Your walking route is ready','route-error':'Your sights are shown. Walking route unavailable.','map-error':'The map is unavailable right now.'};
    byId('route-status').textContent = ['markers-only','map-ready','ready','map-error'].includes(event.state) ? '' : (messages[event.state] || '');
    if (event.state === 'markers-only') byId('route-explanation').textContent = 'The numbered pins match your suggested sightseeing order. Your food finds are listed separately.';
    if (event.state === 'map-error') byId('map-failure-text').textContent = 'The map could not load. Check your connection and try again.';
    if (event.state === 'ready') {
      const route = event.route;
      const distance = model.formatDistance(route.distanceMeters), duration = model.formatDuration(route.durationMillis);
      byId('route-distance').textContent = distance; byId('route-duration').textContent = duration;
      byId('route-totals').hidden = !(distance && duration);
      byId('route-explanation').textContent = 'Walking time excludes visits and food stops. The order is suggested from the locations you selected.';
      ordered.slice(0,-1).forEach((_,i) => {
        const leg = route.legs?.[i]; if (!leg) return;
        const details = [model.formatDuration(leg.durationMillis),model.formatDistance(leg.distanceMeters)].filter(Boolean).join(' · ');
        if (!details) return;
        document.querySelector('[data-leg="' + i + '"] span').textContent = 'Walk ' + details;
      });
      const warningText = (route.warnings || []).map(text => new DOMParser().parseFromString(text,'text/html').body.textContent).join(' ');
      byId('route-warnings').textContent = [warningText,route.copyrights || ''].filter(Boolean).join(' '); byId('route-warnings').hidden = !byId('route-warnings').textContent;
    }
  }
  const retry = document.createElement('button'); retry.type = 'button'; retry.id = 'route-retry'; retry.className = 'text-button'; retry.textContent = 'Retry walking route'; retry.hidden = true;
  document.querySelector('.route-information').append(retry);
  routeController = window.CityTripMap.create({element:byId('trip-map'),sights:ordered,config:window.CITY_MAPS_CONFIG,onStatus:mapStatus,onFocus:focusSight});
  byId('retry-map').addEventListener('click',() => window.location.reload()); retry.addEventListener('click',() => routeController.loadRoute());
  byId('trip-content').hidden = false; routeController.init();
}());
