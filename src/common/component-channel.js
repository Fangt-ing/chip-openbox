'use strict';
(() => {
  const channel = 'chip-openbox-components';
  const version = 1;
  const origin = () => location.protocol === 'file:' ? 'null' : location.origin;
  const isMessage = data => !!data && typeof data === 'object' && data.channel === channel &&
    data.version === version && typeof data.from === 'string' && typeof data.to === 'string' &&
    typeof data.type === 'string' && !!data.payload && typeof data.payload === 'object';
  const envelope = (from, to, type, payload = {}) => ({ channel, version, from, to, type, payload });
  function connect(component) {
    const listeners = new Set();
    let connected = false;
    const embedded = window.parent !== window;
    window.addEventListener('message', event => {
      // File pages have opaque origins: also require the exact parent window and envelope.
      if (!embedded || event.source !== window.parent || event.origin !== origin() ||
          !isMessage(event.data) || event.data.from !== 'openbox' || event.data.to !== component) return;
      if (event.data.type === 'host:sync') connected = true;
      for (const listener of listeners) listener(event.data);
    });
    const api = {
      get connected() { return connected; },
      subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
      send(type, payload = {}) {
        if (!connected) return false;
        window.parent.postMessage(envelope(component, 'openbox', type, payload), '*');
        return true;
      }
    };
    if (embedded) window.parent.postMessage(envelope(component, 'openbox', 'component:ready'), '*');
    return api;
  }
  window.ChipOpenboxChannel = { connect, isMessage, envelope, origin };
})();
