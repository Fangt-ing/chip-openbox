'use strict';
(() => {
  // Geometry only: no workflow, signal or storage operations.
  function observe(channel, definitions) {
    let pending = false, previous = '';
    function report() {
      pending = false;
      const width = document.documentElement.clientWidth, height = window.innerHeight;
      const ports = {};
      for (const [id, definition] of Object.entries(definitions)) {
        const element = document.querySelector(definition.selector);
        if (!element || !element.getClientRects().length) continue;
        const box = element.getBoundingClientRect();
        const x = definition.side === 'left' ? box.left : box.right;
        const y = box.top + box.height / 2;
        // Do not draw connections to endpoints outside their visible frame/scroll area.
        let visible = x >= 0 && x <= width && y >= 0 && y <= height;
        for (let parent = element.parentElement; visible && parent; parent = parent.parentElement) {
          const style = getComputedStyle(parent), rect = parent.getBoundingClientRect();
          if (/(auto|scroll|hidden|clip)/.test(style.overflowX) && (x < rect.left || x > rect.right)) visible = false;
          if (/(auto|scroll|hidden|clip)/.test(style.overflowY) && (y < rect.top || y > rect.bottom)) visible = false;
        }
        if (visible) ports[id] = { x, y };
      }
      const payload = { viewport:{ width, height }, ports };
      const signature = JSON.stringify(payload);
      if (signature !== previous && channel.send('view:ports', payload)) previous = signature;
    }
    function schedule() {
      if (pending) return;
      pending = true; requestAnimationFrame(report);
    }
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    for (const definition of Object.values(definitions)) {
      const element = document.querySelector(definition.selector);
      if (element) resize.observe(element);
    }
    const mutation = new MutationObserver(schedule);
    mutation.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:['class','style','open','hidden'] });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    channel.subscribe(message => {
      if (message.type === 'host:sync' || message.type === 'view:refresh') { previous = ''; schedule(); }
    });
    schedule();
    return { refresh:schedule };
  }
  window.ChipOpenboxPorts = { observe };
})();
