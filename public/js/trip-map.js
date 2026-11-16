/* Geoapify maps and walking routes rendered with MapLibre. */
(function (root) {
  'use strict';
  const libraryUrl = 'https://unpkg.com/maplibre-gl@6.17.0/dist/maplibre-gl.mjs';
  let libraryPromise;

  function bounded(promise, milliseconds, code) {
    let timer;
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(code)), milliseconds);
    });
    return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
  }

  function loadMapLibre() {
    libraryPromise ??= import(libraryUrl).catch(() => { throw new Error('MAP_NETWORK_ERROR'); });
    return bounded(libraryPromise, 15000, 'MAP_SCRIPT_TIMEOUT');
  }

  function create(options) {
    const {element, sights, config} = options;
    const status = options.onStatus || (() => {});
    const coordinates = sights.map(sight => [sight.lng, sight.lat]);
    let map, maps, popup, bounds, resizeObserver, routeController;
    let markers = [], loaded = false, disposed = false;

    function reportError(error, hasMap) {
      const message = String(error?.message || 'MAP_ERROR').replaceAll(config?.apiKey || '\u0000', '[redacted]');
      console.warn('City Mystery map: ' + message);
      status({state: hasMap ? 'route-error' : 'map-error', message, hasMap});
    }

    function focusPlace(id, pan) {
      const index = sights.findIndex(sight => sight.id === id);
      if (!loaded || index < 0) return;
      markers.forEach((marker, i) => {
        const button = marker.getElement().querySelector('.route-marker');
        button.classList.toggle('is-highlighted', i === index);
      });
      const sight = sights[index];
      if (pan !== false) map.panTo(coordinates[index]);

      const content = document.createElement('div'); content.className = 'map-popup';
      const title = document.createElement('strong'); title.textContent = (index+1) + ' · ' + sight.name;
      const address = document.createElement('p'); address.textContent = sight.address;
      const link = document.createElement('a'); link.href = sight.website; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Official website ↗';
      content.append(title, address, link);
      popup.setDOMContent(content).setLngLat(coordinates[index]).addTo(map);
      options.onFocus?.(id);
    }

    function makeMarker(sight, index) {
      const wrapper = document.createElement('div');
      const button = document.createElement('button'); button.type = 'button'; button.className = 'route-marker';
      button.setAttribute('aria-label', 'Stop ' + (index+1) + ': ' + sight.name);
      const number = document.createElement('span'); number.className = 'route-marker-number';
      const numberText = document.createElement('span'); numberText.textContent = String(index+1); number.append(numberText);
      const label = document.createElement('span'); label.className = 'route-marker-name'; label.textContent = sight.name;
      button.append(number, label);
      button.addEventListener('click', event => {
        event.stopPropagation();
        focusPlace(sight.id, false);
      });
      wrapper.append(button);
      return new maps.Marker({element: wrapper, anchor: 'bottom-left', offset: [-15, 0]})
        .setLngLat(coordinates[index]).addTo(map);
    }

    async function loadRoute() {
      if (!loaded || routeController || disposed || !config.enableRouting) return;
      routeController = new AbortController();
      const request = root.TripPageModel.requestFor(sights);
      const query = new URLSearchParams({...request, apiKey: config.apiKey});
      status({state: 'routing', hasMap: true});
      try {
        const signal = AbortSignal.any([routeController.signal, AbortSignal.timeout(15000)]);
        const response = await fetch('https://api.geoapify.com/v1/routing?' + query, {signal});
        if (!response.ok) throw new Error('ROUTE_HTTP_' + response.status);
        const feature = (await response.json()).features?.[0];
        if (disposed) return;
        const geometry = feature?.geometry;
        const paths = geometry?.type === 'MultiLineString' ? geometry.coordinates : [geometry?.coordinates];
        if (!paths.some(path => path?.length)) throw new Error('NO_WALKING_ROUTE');

        if (map.getSource('walking-route')) {
          map.getSource('walking-route').setData(feature);
        } else {
          map.addSource('walking-route', {type: 'geojson', data: feature});
          map.addLayer({
            id: 'walking-route', type: 'line', source: 'walking-route',
            layout: {'line-join': 'round', 'line-cap': 'round'},
            paint: {'line-color': '#ce4b28', 'line-opacity': .95, 'line-width': 5}
          });
        }
        bounds = new maps.LngLatBounds();
        [...coordinates, ...paths.flat()].forEach(point => bounds.extend(point));
        map.fitBounds(bounds, {padding: 50, maxZoom: 16});
        const {distance, time, legs = []} = feature.properties;
        status({state: 'ready', hasMap: true, route: {
          distanceMeters: distance,
          durationMillis: time * 1000,
          legs: legs.map(leg => ({distanceMeters: leg.distance, durationMillis: leg.time * 1000})),
          copyrights: 'Routing by Geoapify'
        }});
      } catch (error) {
        if (!disposed) reportError(error, true);
      } finally {
        routeController = null;
      }
    }

    async function init() {
      if (disposed || map) return;
      status({state: 'loading', hasMap: false});
      try {
        if (!config?.apiKey) throw new Error('MAP_KEY_MISSING');
        maps = await loadMapLibre();
        if (disposed) return;
        const style = 'https://maps.geoapify.com/v1/styles/osm-bright/style.json?'
          + new URLSearchParams({apiKey: config.apiKey});
        bounds = new maps.LngLatBounds();
        coordinates.forEach(point => bounds.extend(point));
        map = new maps.Map({
          container: element, style, center: coordinates[0], zoom: 14,
          bounds, fitBoundsOptions: {padding: 55, maxZoom: 16},
          cooperativeGestures: true, dragRotate: false, pitchWithRotate: false
        });
        let loadError;
        map.on('error', event => {
          if (!loaded) loadError = event.error;
        });
        await bounded(map.once('load'), 15000, 'MAP_TILES_TIMEOUT').catch(error => {
          throw loadError || error;
        });
        if (disposed) return;
        popup = new maps.Popup({maxWidth: '250px', offset: 12, focusAfterOpen: false});
        markers = sights.map(makeMarker);
        map.addControl(new maps.NavigationControl({showCompass: false}), 'top-left');
        map.addControl(new maps.FullscreenControl());
        resizeObserver = new ResizeObserver(() => {
          map.resize();
          map.fitBounds(bounds, {padding: 50, maxZoom: 16, duration: 0});
        });
        resizeObserver.observe(element);
        loaded = true;
        status({state: config.enableRouting ? 'map-ready' : 'markers-only', hasMap: true});
        if (config.enableRouting) await loadRoute();
      } catch (error) {
        if (!disposed) {
          dispose();
          reportError(error, false);
        }
      }
    }

    function dispose() {
      disposed = true;
      routeController?.abort();
      resizeObserver?.disconnect();
      popup?.remove();
      markers.forEach(marker => marker.remove());
      map?.remove();
    }

    return {init, loadRoute, focusPlace, dispose};
  }
  root.CityTripMap = {create};
}(window));
