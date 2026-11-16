(async function () {
  'use strict';
  const cities = window.CITY_DATA;
  const engine = window.TripEngine;
  try { await window.CityAccount.ready; } catch (_) { return; }
  const STORAGE_KEY = window.CityAccount.draftKey();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const byId = id => document.getElementById(id);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let storageWorks = true;
  let state;
  try { state = engine.restore(JSON.parse(sessionStorage.getItem(STORAGE_KEY)), cities); }
  catch (_) { state = engine.createState(); }
  const timers = new Map();
  let toastTimer;
  const paths = {
    pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 7a7 7 0 0 1 11-2l3 3M4 16l3 3a7 7 0 0 0 11-2"/>',
    check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    lock:'<rect x="6" y="10" width="12" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    castle:'<path d="M3 21V6h3V3h3v3h3V3h3v3h3V3h3v18ZM3 10h18M9 21v-6a3 3 0 0 1 6 0v6M6 12v2m12-2v2"/>',
    museum:'<path d="M2 8 12 3l10 5ZM3 21h18M4 18h16M6 10v8m4-8v8m4-8v8m4-8v8"/>',
    hill:'<path d="m2 20 7-11 5 7 3-4 5 8ZM9 9l3-6 5 9"/><circle cx="18" cy="5" r="2"/>',
    church:'<path d="M4 21V11l4-4 4 4v10m0-8 4-5 4 5v8ZM8 3v4M6 5h4m-4 9h4m-2 7v-4m8 4v-4"/>',
    clock:'<path d="M7 21V9l5-6 5 6v12ZM6 21h12M10 3h4m-2-3v3"/><circle cx="12" cy="11" r="3"/><path d="M12 9v2l1 1m-3 5h4m-4 2h4"/>',
    wheel:'<circle cx="12" cy="10" r="8"/><path d="m8 22 4-12 4 12M12 2v16M4 10h16M6 4l12 12M6 16 18 4M6 22h12"/>',
    bridge:'<path d="M2 17h20M4 21V7h4v14m8 0V7h4v14M3 7l3-4 3 4m6 0 3-4 3 4M8 12c3 5 5 5 8 0M1 12l3 3m16 0 3-3"/>',
    street:'<path d="M3 21V7l4-4 4 4v14m0 0V10l5-4 5 4v11ZM5 9h4m-4 4h4m-4 4h4m5-5h4m-4 4h4m-3 5v-3"/>',
    train:'<rect x="5" y="3" width="14" height="15" rx="4"/><path d="M5 10h14M12 3v7m-4 8-3 4m11-4 3 4M7 21h10"/><circle cx="9" cy="14" r=".8"/><circle cx="15" cy="14" r=".8"/>',
    leaf:'<path d="M20 3C6 2 1 10 7 16s14 0 13-13ZM4 21 17 7m-6 11-1-7m0 1 6 1"/>',
    food:'<path d="M5 2v7m3-7v7m-6-7v7c0 3 6 3 6 0m-3 3v10M18 2c-4 5-5 9-1 10h2V2Zm1 10v10"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="M12 0v5m0 14v5M0 12h5m14 0h5m-7-17 5 5m-5 5 5-5M7 7l3 7 7 3-3-7Z"/>'
  };
  function icon(name, className) { return '<svg class="' + (className || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (paths[name] || paths.compass) + '</svg>'; }
  const cornerDots = '<span class="card-corner top-left"></span><span class="card-corner bottom-right"></span>';
  function announce(message) { byId('status-message').textContent = message; }
  function toast(message) {
    const element = byId('toast'); element.textContent = message; element.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { element.hidden = true; }, 4200);
  }
  function persist() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { if (storageWorks) toast('Your browser cannot save this session. You can still explore.'); storageWorks = false; }
  }
  function safeLink(url, label, className) {
    return '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" class="' + (className || '') + '">' + label + '</a>';
  }
  function placeAt(group, index) {
    const city = engine.cityFor(state, cities);
    return city ? city[group].find(place => place.id === state[group][index]) : null;
  }
  function cardActions(group, index, place) {
    return '<div class="card-actions"><button type="button" class="draw-again" data-action="place" data-group="' + group + '" data-index="' + index + '" aria-label="Draw a different ' + (group === 'food' ? 'food stop' : 'sight') + ' instead of ' + escapeHtml(place.name) + '">Draw again ' + icon('refresh') + '</button>' + '</div>';
  }
  function cityMarkup() {
    const city = engine.cityFor(state, cities);
    const mystery = '<button type="button" class="card-face card-mystery" data-action="city" aria-label="Reveal your mystery UK city"' + (city ? ' disabled tabindex="-1" aria-hidden="true"' : '') + '><span class="city-topline">City Mystery · The United Kingdom</span><span class="mystery-center"><span class="city-mystery-art">' + icon('compass') + '</span><span><h4>A whole city.<br>Just for today.</h4><span class="mystery-copy">Somewhere new is waiting.<br>Where will your day begin?</span></span></span><span><span class="reveal-prompt">Reveal my city ' + icon('arrow') + '</span><span class="city-bottomline">ONE REVEAL. A NEW POSSIBILITY.</span></span></button>';
    const revealed = city ? '<div class="card-face card-reveal"><div class="city-photo"><img src="' + city.image + '" alt="' + city.name + ' city view"></div><div class="city-info"><span class="country-label">' + city.country + ' · United Kingdom</span><h4>' + city.name + '</h4><p class="city-description">' + escapeHtml(city.description) + '</p><div class="card-actions"><span class="city-status">' + icon('pin') + ' Your city, revealed</span><button class="draw-again" type="button" data-action="city" aria-label="Draw a different city">Draw another city ' + icon('refresh') + '</button></div></div></div>' : '<div class="card-face card-reveal" inert aria-hidden="true"></div>';
    return { html: '<div class="flipper">' + mystery + revealed + '</div>', revealed: Boolean(city) };
  }
  function placeMarkup(group, index) {
    const city = engine.cityFor(state, cities), place = placeAt(group, index);
    const isFood = group === 'food';
    const locked = group === 'sights' && index >= engine.sightCount(state);
    const waiting = !city;
    const category = isFood ? 'FOOD' : 'SIGHT';
    const title = locked ? 'A little breathing room.' : isFood ? ['Something delicious.', 'A local favourite.', 'A tasty little detour.'][index] : ['A place with a story.', 'A different perspective.', 'One more discovery.'][index];
    const copy = locked ? 'Easygoing leaves this stop open. Take your time.' : waiting ? 'Your city comes first. Then the discoveries begin.' : isFood ? 'Find a flavour in ' + city.name + '.' : 'A sight waiting for you in ' + city.name + '.';
    const enabled = !locked && !waiting && !place;
    const mystery = '<button type="button" class="card-face card-mystery" data-action="place" data-group="' + group + '" data-index="' + index + '" aria-label="' + escapeHtml(locked ? 'Third sight locked in Easygoing mode' : waiting ? 'Reveal a city to unlock this ' + category.toLowerCase() + ' card' : 'Reveal ' + category.toLowerCase() + ' ' + (index + 1)) + '"' + (enabled ? '' : ' disabled tabindex="-1"') + (place ? ' aria-hidden="true"' : '') + '>' + cornerDots + '<span class="mystery-center">' + icon(locked ? 'lock' : isFood ? 'food' : ['museum','hill','castle'][index], 'mystery-icon') + '<h4>' + title + '</h4><span class="mystery-copy">' + copy + '</span></span>' + (locked ? '<span class="locked-tag">Easygoing · rest stop</span>' : '<span class="reveal-prompt">' + (waiting ? 'Waiting for your city' : 'Reveal ' + (isFood ? 'food stop' : 'sight') + ' ' + icon('arrow')) + '</span>') + '</button>';
    let front = '<div class="card-face card-reveal" inert aria-hidden="true"></div>';
    if (place) {
      const media = isFood ? window.FOOD_IMAGES[city.id][place.id] : {image:window.SIGHT_IMAGES[city.id][place.id],alt:place.name};
      const photo = '<div class="discovery-photo"><img src="' + media.image + '" alt="' + escapeHtml(media.alt) + '" loading="lazy">' + '</div>';
      front = '<div class="card-face card-reveal has-photo">' + photo + '<div class="place-title-row' + (isFood ? ' food-title-row' : '') + '"><h4' + (isFood ? ' class="food-title"' : '') + '>' + escapeHtml(place.name) + '</h4>' + icon(isFood ? 'food' : place.icon, 'place-glyph') + '</div>' + '<p class="place-address">' + icon('pin') + '<span>' + escapeHtml(place.address) + '</span></p><p class="place-description">' + escapeHtml(place.description) + '</p>' + cardActions(group, index, place) + '</div>';
    }
    return { html: '<div class="flipper">' + mystery + front + '</div>', revealed: Boolean(place), locked, waiting };
  }
  function paintCard(element, markup, animate) {
    const key = element.id;
    if (timers.has(key)) clearTimeout(timers.get(key));
    const wasRevealed = element.classList.contains('is-flipped');
    element.classList.toggle('is-locked', Boolean(markup.locked));
    element.classList.toggle('is-waiting', Boolean(markup.waiting && !markup.locked));
    const install = () => {
      element.innerHTML = markup.html;
      element.classList.toggle('is-flipped', markup.revealed && !animate);
      element.classList.toggle('is-busy', Boolean(animate));
      if (animate && markup.revealed) {
        const revealFace = element.querySelector('.card-reveal');
        revealFace.inert = true;
        timers.set(key, setTimeout(() => {
          element.classList.add('is-flipped');
          timers.set(key, setTimeout(() => {
            element.classList.remove('is-busy'); revealFace.inert = false; timers.delete(key);
            const button = revealFace.querySelector('button');
            if (button && (document.activeElement === document.body || element.contains(document.activeElement))) button.focus({ preventScroll:true });
          }, reducedMotion ? 10 : 700));
        }, reducedMotion ? 5 : 35));
      } else { element.classList.remove('is-busy'); timers.delete(key); }
    };
    if (animate && wasRevealed && !reducedMotion) {
      element.classList.remove('is-flipped'); element.classList.add('is-busy');
      timers.set(key, setTimeout(install, 350));
    } else install();
  }
  function updateMode() {
    document.querySelectorAll('[data-mode]').forEach(button => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle('is-selected', active); button.setAttribute('aria-checked', String(active));
      button.tabIndex = active ? 0 : -1;
      button.querySelector('.radio-mark').textContent = active ? '✓' : '';
    });
    const count = engine.sightCount(state);
    byId('sights-count').textContent = state.cityId ? count + ' discoveries in ' + engine.cityFor(state, cities).name : 'Reveal your city first';
  }
  function updateProgress() {
    const ready = engine.isReady(state), city = engine.cityFor(state, cities);
    const found = state.sights.slice(0,engine.sightCount(state)).filter(Boolean).length + state.food.filter(Boolean).length;
    const total = engine.sightCount(state) + 3;
    byId('build-trip').disabled = !ready;
    byId('progress-text').hidden=ready||!city;
    byId('progress-text').innerHTML = '<span class="progress-dot' + (ready ? ' is-ready' : '') + '" aria-hidden="true"></span>' + (!city ? 'Your next adventure starts with a city.' : ready ? '' : found + ' of ' + total + ' discoveries revealed in ' + city.name + '.');
  }
  function renderBoard(animateCity) {
    timers.forEach(timer => clearTimeout(timer)); timers.clear();
    paintCard(byId('city-card'), cityMarkup(), Boolean(animateCity));
    ['sights', 'food'].forEach(group => {
      const container = byId(group === 'sights' ? 'sight-cards' : 'food-cards');
      if (!container.children.length) {
        for (let index = 0; index < 3; index++) {
          const card = document.createElement('div'); card.className = 'flip-card ' + (group === 'sights' ? 'sight-card' : 'food-card'); card.id = group + '-card-' + index; container.append(card);
        }
      }
      for (let index = 0; index < 3; index++) paintCard(byId(group + '-card-' + index), placeMarkup(group,index), false);
    });
    updateMode(); updateProgress();
  }
  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action]');
    if (!action || action.disabled || action.closest('.is-busy')) return;
    if (action.dataset.action === 'city') {
      engine.drawCity(state,cities); persist(); renderBoard(true);
      announce('Your city is ' + engine.cityFor(state,cities).name + '. Your sight and food cards are ready to reveal.');
    } else {
      const group = action.dataset.group, index = Number(action.dataset.index);
      if (!engine.drawPlace(state,cities,group,index)) return;
      persist(); paintCard(byId(group + '-card-' + index),placeMarkup(group,index),true); updateProgress();
      announce((group === 'sights' ? 'Sight' : 'Food stop') + ' revealed: ' + placeAt(group,index).name + '.');
    }
  });
  document.querySelectorAll('[data-mode]').forEach(button => {
    button.addEventListener('click', () => {
      if (state.mode === button.dataset.mode) return;
      engine.setMode(state,button.dataset.mode); persist(); renderBoard(false);
      announce((state.mode === 'trailblazer' ? 'Trailblazer: three sights' : 'Easygoing: two sights; third sight locked') + ' and three food stops.');
    });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...document.querySelectorAll('[data-mode]')];
      const target = event.key === 'Home' ? buttons[0] : event.key === 'End' ? buttons[1] : buttons.find(other => other !== button);
      target.click(); target.focus();
    });
  });
  byId('build-trip').addEventListener('click', async () => {
    const trip = engine.buildTrip(state,cities); if (!trip) return;
    byId('build-trip').disabled = true;
    try { await window.CityAccount.saveTrip(trip); }
    catch (error) { toast(error.message); byId('build-trip').disabled = false; return; }
    window.location.href = 'my-trip.html';
  });

  // The carousel stops while the user interacts or the document is hidden.
  let slideIndex = 0, paused = reducedMotion, carouselTimer;
  const slideshow = document.querySelector('.slideshow');
  function showSlide(index) {
    slideIndex = (index + 3) % 3;
    document.querySelectorAll('.slide').forEach((slide,i) => { slide.classList.toggle('is-active',i === slideIndex); slide.setAttribute('aria-hidden',String(i !== slideIndex)); });
    document.querySelectorAll('[data-go-slide]').forEach((dot,i) => { dot.classList.toggle('is-active',i === slideIndex); dot.setAttribute('aria-pressed',String(i === slideIndex)); });
  }
  function stopCarousel() { clearInterval(carouselTimer); }
  function startCarousel() { stopCarousel(); if (!paused && !document.hidden && !slideshow.matches(':hover') && !slideshow.contains(document.activeElement)) carouselTimer = setInterval(() => showSlide(slideIndex+1),5500); }
  function updatePause() { const button = byId('pause-slides'); button.textContent = paused ? '▷' : 'Ⅱ'; button.setAttribute('aria-label',paused ? 'Play slideshow' : 'Pause slideshow'); button.setAttribute('aria-pressed',String(paused)); }
  byId('previous-slide').addEventListener('click',() => { showSlide(slideIndex-1); startCarousel(); });
  byId('next-slide').addEventListener('click',() => { showSlide(slideIndex+1); startCarousel(); });
  document.querySelectorAll('[data-go-slide]').forEach(dot => dot.addEventListener('click',() => { showSlide(Number(dot.dataset.goSlide)); startCarousel(); }));
  byId('pause-slides').addEventListener('click',() => { paused = !paused; updatePause(); startCarousel(); });
  slideshow.addEventListener('mouseenter',stopCarousel); slideshow.addEventListener('mouseleave',startCarousel);
  slideshow.addEventListener('focusin',stopCarousel); slideshow.addEventListener('focusout',() => setTimeout(startCarousel,0));
  document.addEventListener('visibilitychange',startCarousel);

  const dialog = byId('credits-dialog');
  byId('photo-credits').innerHTML = [...(window.IMAGE_CREDITS || []),...(window.FOOD_IMAGE_CREDITS || [])].map(credit => '<p class="credit-entry">' + safeLink(credit.source,escapeHtml(credit.title)) + ' — ' + escapeHtml(credit.artist) + ' · ' + safeLink(credit.licenseUrl,escapeHtml(credit.license)) + '<br>' + escapeHtml(credit.changes) + '</p>').join('');
  byId('place-credits').innerHTML = cities.map(city => '<span class="place-credit-city">' + city.name + '</span><ul class="place-credit-list">' + [...city.sights,...city.food].map(place => '<li>' + safeLink(place.source || place.website,escapeHtml(place.name)) + '</li>').join('') + '</ul>').join('');
  byId('open-credits').addEventListener('click',() => dialog.showModal());
  byId('close-credits').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click',event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  renderBoard(false); updatePause(); startCarousel();
}());
