/* Exercise the map loader's network and timeout handling without a real API key. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.resolve(__dirname, '../public/js/trip-map.js'), 'utf8')
  .replace('import(libraryUrl)', 'importMapLibre(libraryUrl)');

async function check(importMapLibre, expected) {
  const reports = [];
  const root = {};
  const context = {
    window: root, importMapLibre, console: {warn() {}},
    setTimeout: (fn, ms) => setTimeout(fn, Math.max(1, ms / 1000)),
    clearTimeout
  };
  vm.runInNewContext(source, context);
  const controller = root.CityTripMap.create({
    element: {}, sights: [{id: 'one', name: 'One', lat: 1, lng: 1}],
    config: {apiKey: 'test', enableRouting: false},
    onStatus: event => reports.push(event)
  });
  await controller.init();
  assert.deepEqual(reports.map(event => event.state), ['loading', 'map-error']);
  assert.equal(reports.at(-1).message, expected);
}

(async () => {
  await check(() => Promise.reject(new Error('network')), 'MAP_NETWORK_ERROR');
  await check(() => new Promise(() => {}), 'MAP_SCRIPT_TIMEOUT');
  console.log('Passed: MapLibre network failures and timeouts exit loading with a retryable map error.');
})().catch(error => { console.error(error); process.exitCode = 1; });
