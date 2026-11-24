'use strict';
(() => {
  function attach(root) {
    const names = ['scripts','chip','board'];
    const panes = names.map(name => root.querySelector('[data-workspace="' + name + '"]'));
    const dividers = [...root.querySelectorAll('.pane-divider')];
    let drag = null;
    const visible = () => root.dataset.layout === 'all' && !!dividers[0].getClientRects().length;
    function sizes() { return panes.map(pane => pane.getBoundingClientRect().width); }
    function limits(pair) { const min = Math.min(180,pair / 2); return { min, max:pair-min }; }
    function updateValues() {
      if (!visible()) return;
      const widths = sizes();
      dividers.forEach((divider,index) => {
        const pair = widths[index] + widths[index+1], range = limits(pair);
        if (!pair) return;
        divider.setAttribute('aria-valuemin', Math.round(range.min/pair*100));
        divider.setAttribute('aria-valuemax', Math.round(range.max/pair*100));
        divider.setAttribute('aria-valuenow', Math.round(widths[index]/pair*100));
        divider.setAttribute('aria-valuetext', Math.round(widths[index]) + ' pixels / ' + Math.round(widths[index+1]) + ' pixels');
      });
    }
    function resize(index, wanted, widths) {
      const pair = widths[index] + widths[index+1], range = limits(pair);
      const first = Math.max(range.min,Math.min(range.max,wanted));
      const next = [...widths]; next[index] = first; next[index+1] = pair-first;
      const total = next.reduce((sum,width) => sum+width,0);
      names.forEach((name,i) => root.style.setProperty('--pane-' + name,next[i]/total + 'fr'));
      requestAnimationFrame(updateValues);
    }
    function stop() {
      const current = drag; drag = null;
      document.body.classList.remove('resizing-panes');
      if (current?.divider.hasPointerCapture(current.id)) current.divider.releasePointerCapture(current.id);
    }
    dividers.forEach((divider,index) => {
      divider.addEventListener('pointerdown', event => {
        if (event.button !== 0 || !visible()) return;
        event.preventDefault();
        drag = { divider, index, id:event.pointerId, x:event.clientX, widths:sizes() };
        divider.focus({ preventScroll:true });
        divider.setPointerCapture(event.pointerId);
        // Keep the pointer in the parent document while crossing iframe content.
        document.body.classList.add('resizing-panes');
      });
      divider.addEventListener('pointermove', event => {
        if (!drag || drag.id !== event.pointerId) return;
        if (!(event.buttons & 1)) { stop(); return; }
        event.preventDefault();
        resize(drag.index,drag.widths[drag.index]+event.clientX-drag.x,drag.widths);
      });
      divider.addEventListener('pointerup',stop);
      divider.addEventListener('pointercancel',stop);
      divider.addEventListener('lostpointercapture',stop);
      divider.addEventListener('keydown',event => {
        if (!visible()) return;
        const widths = sizes(), range = limits(widths[index]+widths[index+1]);
        const step = event.shiftKey ? 50 : 16;
        const value = event.key === 'ArrowLeft' ? widths[index]-step : event.key === 'ArrowRight' ? widths[index]+step :
          event.key === 'Home' ? range.min : event.key === 'End' ? range.max : null;
        if (value === null) return;
        event.preventDefault(); resize(index,value,widths);
      });
    });
    const observer = new ResizeObserver(updateValues); observer.observe(root);
    const layout = new MutationObserver(() => { stop(); requestAnimationFrame(updateValues); });
    layout.observe(root,{ attributes:true, attributeFilter:['data-layout'] });
    window.addEventListener('resize',stop);
    window.addEventListener('blur',stop);
    updateValues();
  }
  window.ChipOpenboxPaneResizer = { attach };
})();
