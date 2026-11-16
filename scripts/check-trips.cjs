/* Behaviour checks for the card rules. Run: node checks.cjs */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const projectRoot=path.resolve(__dirname,'..');
const assert = require('node:assert/strict');
const context = {window:{}}; vm.createContext(context);
for (const filename of ['data.js','trip-engine.js']) vm.runInContext(fs.readFileSync(path.join(projectRoot,'public','js',filename),'utf8'),context);
const cities = context.window.CITY_DATA, engine = context.window.TripEngine;
assert.equal(cities.length,8);
for (const city of cities) {
  assert.equal(city.sights.length,7); assert.equal(city.food.length,5);
  for (const group of ['sights','food']) assert.equal(new Set(city[group].map(p=>p.id)).size,city[group].length);
}
for (let iteration=0;iteration<100;iteration++) {
  const state = engine.createState();
  assert.equal(engine.isReady(state),false);
  assert.equal(engine.drawPlace(state,cities,'sights',0),false);
  engine.drawCity(state,cities);
  const firstCity=state.cityId;
  for (const group of ['sights','food']) for(let i=0;i<3;i++) assert.equal(engine.drawPlace(state,cities,group,i),true);
  assert.equal(engine.isReady(state),true);
  for (let round=0;round<20;round++) {
    for (const group of ['sights','food']) {
      const i=round%3, old=state[group][i]; engine.drawPlace(state,cities,group,i);
      assert.notEqual(state[group][i],old); assert.equal(new Set(state[group]).size,3);
      assert.ok(state[group].every(id=>engine.cityFor(state,cities)[group].some(p=>p.id===id)));
    }
  }
  engine.setMode(state,'easygoing');
  assert.equal(state.sights[2],null); assert.equal(engine.drawPlace(state,cities,'sights',2),false);
  assert.equal(engine.isReady(state),true);
  const easyTrip=engine.buildTrip(state,cities); assert.equal(easyTrip.sights.length,2); assert.equal(easyTrip.food.length,3);
  engine.setMode(state,'trailblazer'); assert.equal(engine.isReady(state),false);
  engine.drawPlace(state,cities,'sights',2); assert.equal(engine.isReady(state),true);
  const trip=engine.buildTrip(state,cities); assert.equal(trip.sights.length,3); assert.equal(trip.food.length,3);
  const restored=engine.restore(JSON.parse(JSON.stringify(state)),cities); assert.equal(engine.isReady(restored),true);
  engine.drawCity(state,cities); assert.notEqual(state.cityId,firstCity);
  assert.ok(state.sights.every(p=>p===null)); assert.ok(state.food.every(p=>p===null));
}
const malformed={version:1,cityId:'edinburgh',mode:'easygoing',sights:['castle','castle','museum'],food:['unknown',null,null]};
const restored=engine.restore(malformed,cities);
assert.equal(restored.sights[1],null); assert.equal(restored.sights[2],null); assert.equal(restored.food[0],null);
assert.equal(engine.restore({version:999},cities).cityId,null);
assert.ok(engine.distanceKm({lat:51,lng:0},{lat:51,lng:0})<.001);
console.log('Passed: city isolation, unique redraws, both modes, locked third sight, complete-trip validation, persistence validation and 100 random trips.');
vm.runInContext(fs.readFileSync(path.join(projectRoot,'public','js','trip-page-model.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(projectRoot,'public','js','city-media.js'),'utf8'),context);
const model = context.window.TripPageModel;
for (const city of cities) {
  const media = context.window.CITY_MEDIA[city.id];
  assert.equal(media.length,3); assert.equal(new Set(media.map(item=>item.image)).size,3);
  media.forEach(item=>assert.ok(fs.existsSync(path.join(projectRoot,'public',item.image))));
  for (const mode of ['trailblazer','easygoing']) {
    const count=mode==='easygoing'?2:3;
    const raw={version:1,mode,city:{id:city.id},sights:city.sights.slice(0,count),food:city.food.slice(0,3)};
    const resolved=model.resolveTrip(JSON.parse(JSON.stringify(raw)),cities);
    assert.equal(resolved.city.id,city.id); assert.equal(resolved.sights.length,count); assert.equal(resolved.food.length,3);
    assert.deepEqual(Array.from(resolved.sights,p=>p.id),Array.from(raw.sights,p=>p.id));
    const ordered=model.suggestedOrder(resolved.sights,engine.distanceKm);
    assert.deepEqual(Array.from(ordered,p=>p.id).sort(),Array.from(raw.sights,p=>p.id).sort());
    assert.notEqual(ordered,resolved.sights);
    const request=model.requestFor(ordered);
    assert.equal(request.mode,'walk');
    assert.equal(request.waypoints,Array.from(ordered,place => place.lat + ',' + place.lng).join('|'));
    const tampered=JSON.parse(JSON.stringify(raw)); tampered.sights[0].website='https://untrusted.example/';
    assert.equal(model.resolveTrip(tampered,cities).sights[0].website,city.sights[0].website);
    const bad=JSON.parse(JSON.stringify(raw)); bad.sights[0].id='not-a-sight'; assert.equal(model.resolveTrip(bad,cities),null);
    bad.sights[0]=bad.sights[1]; assert.equal(model.resolveTrip(bad,cities),null);
  }
}
assert.equal(model.resolveTrip(null,cities),null);
assert.equal(model.resolveTrip({version:1,mode:'trailblazer',city:{id:'london'},sights:[],food:[]},cities),null);
assert.equal(model.formatDuration(3660000),'1 hr 1 min'); assert.equal(model.formatDistance(1250),'1.3 km');
console.log('Passed: exact Home-to-My-Trip selections, all eight city carousels, canonical source validation, both modes, route membership and food exclusion.');
vm.runInContext(fs.readFileSync(path.join(projectRoot,'public','js','food-media.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(projectRoot,'public','assets','image-credits.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(projectRoot,'public','assets','food-image-credits.js'),'utf8'),context);
const usedFoodImages = new Set();
const credits=[...context.window.IMAGE_CREDITS,...context.window.FOOD_IMAGE_CREDITS];
for(const city of cities) {
  for(const sight of city.sights) {
    const image=context.window.SIGHT_IMAGES[city.id][sight.id];
    assert.ok(image,'Missing photograph for '+sight.name);
    assert.ok(fs.existsSync(path.join(projectRoot,'public',image)));
    assert.ok(credits.some(credit=>credit.file===image),'Missing credit for '+image);
  }
  for(const place of city.food) {
    const media=context.window.FOOD_IMAGES[city.id][place.id];
    assert.ok(media,'Missing food image for '+place.name);
    assert.ok(!usedFoodImages.has(media.image), 'Repeated food photo for '+place.name);
    usedFoodImages.add(media.image);
    assert.ok(fs.existsSync(path.join(projectRoot,'public',media.image)));
    assert.ok(media.alt.startsWith('Representative dish:'));
    assert.ok(credits.some(credit=>credit.file===media.image),'Missing food credit for '+media.image);
  }
}
console.log('Passed: all 56 sights and 40 food finds have local, credited photographs; dish imagery is labelled representative.');
