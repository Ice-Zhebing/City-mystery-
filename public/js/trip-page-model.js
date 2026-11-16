/* A saved trip is validated against the local catalogue, never replaced by a demo. */
(function (root) {
  'use strict';
  function resolveTrip(raw, cities) {
    if (!raw || raw.version !== 1 || !['trailblazer','easygoing'].includes(raw.mode)) return null;
    const city = cities.find(item => item.id === raw.city?.id);
    const count = raw.mode === 'easygoing' ? 2 : 3;
    if (!city || !Array.isArray(raw.sights) || raw.sights.length !== count || !Array.isArray(raw.food) || raw.food.length !== 3) return null;
    const groups = {};
    for (const group of ['sights','food']) {
      const ids = raw[group].map(place => place?.id);
      if (new Set(ids).size !== ids.length) return null;
      groups[group] = ids.map(id => city[group].find(place => place.id === id));
      if (groups[group].some(place => !place)) return null;
    }
    return {city,mode:raw.mode,sights:groups.sights,food:groups.food,createdAt:typeof raw.createdAt === 'string' ? raw.createdAt : ''};
  }
  function permutations(items) {
    if (items.length < 2) return [items.slice()];
    return items.flatMap((item,index) => permutations(items.filter((_,i) => i !== index)).map(tail => [item,...tail]));
  }
  function suggestedOrder(sights, distance) {
    const options = permutations(sights);
    const length = route => route.reduce((sum,place,i) => sum + (i ? distance(route[i-1],place) : 0),0);
    return options.reduce((best,route) => length(route) < length(best) - .000001 ? route : best,options[0]);
  }
  function requestFor(sights) {
    if (!Array.isArray(sights) || sights.length < 2 || sights.length > 3) throw new Error('A trip needs two or three sights.');
    return {waypoints:sights.map(place => place.lat + ',' + place.lng).join('|'),mode:'walk'};
  }
  function formatDuration(milliseconds) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) return '';
    const minutes = Math.max(1,Math.round(milliseconds / 60000));
    if (minutes < 60) return minutes + ' min';
    return Math.floor(minutes / 60) + ' hr' + (minutes % 60 ? ' ' + minutes % 60 + ' min' : '');
  }
  function formatDistance(meters) {
    if (!Number.isFinite(meters) || meters < 0) return '';
    return meters < 1000 ? Math.round(meters / 10) * 10 + ' m' : (meters / 1000).toFixed(1) + ' km';
  }
  root.TripPageModel = {resolveTrip,suggestedOrder,requestFor,formatDuration,formatDistance};
}(typeof window !== 'undefined' ? window : globalThis));
