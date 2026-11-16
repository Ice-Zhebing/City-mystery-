/* A small, framework-free state model. UI and persistence live in app.js. */
(function (root) {
  'use strict';
  const VERSION = 1;
  function createState() {
    return { version: VERSION, mode: 'trailblazer', cityId: null, sights: [null, null, null], food: [null, null, null] };
  }
  function cityFor(state, cities) { return cities.find(city => city.id === state.cityId) || null; }
  function sightCount(state) { return state.mode === 'easygoing' ? 2 : 3; }
  function randomItem(items, rng) { return items[Math.min(items.length - 1, Math.floor((rng || Math.random)() * items.length))]; }
  function drawCity(state, cities, rng) {
    const options = cities.filter(city => city.id !== state.cityId);
    const next = randomItem(options.length ? options : cities, rng);
    if (!next) return state;
    state.cityId = next.id;
    state.sights = [null, null, null];
    state.food = [null, null, null];
    return state;
  }
  function setMode(state, mode) {
    if (!['trailblazer', 'easygoing'].includes(mode)) return state;
    state.mode = mode;
    if (mode === 'easygoing') state.sights[2] = null;
    return state;
  }
  function distanceKm(a, b) {
    const rad = n => n * Math.PI / 180;
    const dLat = rad(a.lat - b.lat), dLng = rad(a.lng - b.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }
  function nearestSight(state, cities, venue) {
    const city = cityFor(state, cities);
    if (!city) return null;
    const selected = city.sights.filter(s => state.sights.includes(s.id));
    const pool = selected.length ? selected : city.sights;
    return pool.map(sight => ({ sight, distance: distanceKm(sight, venue) })).sort((a, b) => a.distance - b.distance)[0];
  }
  function drawPlace(state, cities, group, index, rng) {
    const city = cityFor(state, cities);
    if (!city || !['sights', 'food'].includes(group) || !Number.isInteger(index) || index < 0 || index > 2) return false;
    if (group === 'sights' && index >= sightCount(state)) return false;
    const used = new Set(state[group].filter(Boolean));
    let options = city[group].filter(place => !used.has(place.id));
    if (!options.length) return false;
    // Keep food suggestions in the vicinity of this trip, while retaining choice.
    if (group === 'food') {
      options.sort((a, b) => nearestSight(state, cities, a).distance - nearestSight(state, cities, b).distance);
      options = options.slice(0, Math.min(3, options.length));
    }
    state[group][index] = randomItem(options, rng).id;
    return true;
  }
  function isReady(state) {
    return Boolean(state.cityId && state.sights.slice(0, sightCount(state)).every(Boolean) && state.food.every(Boolean));
  }
  function restore(raw, cities) {
    const state = createState();
    if (!raw || raw.version !== VERSION) return state;
    setMode(state, raw.mode);
    const city = cities.find(c => c.id === raw.cityId);
    if (!city) return state;
    state.cityId = city.id;
    ['sights', 'food'].forEach(group => {
      const used = new Set();
      for (let i = 0; i < 3; i++) {
        const id = Array.isArray(raw[group]) ? raw[group][i] : null;
        if ((group !== 'sights' || i < sightCount(state)) && city[group].some(p => p.id === id) && !used.has(id)) {
          state[group][i] = id; used.add(id);
        }
      }
    });
    return state;
  }
  function buildTrip(state, cities) {
    if (!isReady(state)) return null;
    const city = cityFor(state, cities);
    return {
      version: VERSION, createdAt: new Date().toISOString(), mode: state.mode,
      city: { id: city.id, name: city.name, country: city.country, image: city.image },
      sights: state.sights.slice(0, sightCount(state)).map(id => city.sights.find(s => s.id === id)),
      food: state.food.map(id => city.food.find(s => s.id === id))
    };
  }
  root.TripEngine = { createState, cityFor, sightCount, drawCity, setMode, distanceKm, nearestSight, drawPlace, isReady, restore, buildTrip };
}(typeof window !== 'undefined' ? window : globalThis));
