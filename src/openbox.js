'use strict';
(() => {
  const root = document.querySelector('#workspaces');
  window.ChipOpenboxPaneResizer.attach(root);
  const buttons = [...document.querySelectorAll('button[data-layout]')];
  const channel = window.ChipOpenboxChannel;
  const frames = new Map(['scripts', 'chip', 'board'].map(name => [name, document.querySelector('#' + name + '-frame')]));
  const connections = new window.ChipOpenboxComponentConnections.ComponentConnections(frames);
  const flash = new window.ChipOpenboxFlash.Session();
  const workflows = new Map([
    ['flash', flash], ['standalone', window.ChipOpenboxStandalone], ['debug', window.ChipOpenboxDebug]
  ]);
  let activity = null;
  let chipPreview = null;

  function send(to, type, payload = {}) {
    frames.get(to).contentWindow.postMessage(channel.envelope('openbox', to, type, payload), '*');
  }
  const headings=window.ChipOpenboxPaneHeading.host({root,send});
  function state() { return { image: flash.current(), activity, chipPreview }; }
  function sync(name) { send(name, 'host:sync', state()); }
  function notify() {
    send('board', 'host:state', state());
    send('chip', 'host:state', state());
  }
  for (const button of buttons) button.addEventListener('click', () => {
    root.dataset.layout = button.dataset.layout;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    connections.draw();
    for (const name of frames.keys()) send(name, 'view:refresh');
  });
  window.addEventListener('message', event => {
    const message = event.data;
    if (event.origin !== channel.origin() || !channel.isMessage(message) ||
        message.to !== 'openbox' || !frames.has(message.from) ||
        event.source !== frames.get(message.from).contentWindow) return;
    if(message.type==='component:view'){headings.update(message.from,message.payload);return;}
    if (message.type === 'view:ports') { connections.receive(message.from, message.payload); return; }
    if (message.type === 'component:ready') { connections.clear(message.from); sync(message.from); return; }
    if (message.from === 'scripts' && message.type === 'scripts:image') {
      try {
        flash.select(message.payload.image);
        activity = null;
        chipPreview = null;
      } catch (error) {
        flash.select(null);
        chipPreview = null;
        activity = { workflow: 'flash', status: 'invalid', message: error.message };
      }
      notify();
      return;
    }
    if (message.from === 'board' && message.type === 'workflow:request' &&
        workflows.has(message.payload.workflow)) {
      const outcome = workflows.get(message.payload.workflow).request();
      activity = { workflow: outcome.workflow, status: outcome.status, message: outcome.message };
      if (outcome.workflow === 'flash' && outcome.image) chipPreview = outcome.image;
      notify();
    }
  });
  for (const [name, frame] of frames) {
    frame.addEventListener('load', () => { connections.clear(name); sync(name); });
    sync(name);
  }
})();
