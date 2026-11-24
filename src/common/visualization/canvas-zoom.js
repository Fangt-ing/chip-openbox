'use strict';
(() => {
  // Canvas navigation only; it does not change component/workflow data.
  function attach({ viewport, surface, minus, reset, plus, onChange = () => {} }) {
    const minimum = 0.25, maximum = 3;
    let scale = 1, offsetX = 0, offsetY = 0, drag = null;
    viewport.dataset.panCanvas = '';
    function sizeSurface() {
      const style = getComputedStyle(viewport);
      const width = Math.max(1, viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
      const value = width + 'px';
      if (surface.style.width !== value) surface.style.width = value;
    }
    function translate() { surface.style.transform = 'translate(' + offsetX + 'px,' + offsetY + 'px)'; }
    function placeOrigin(x, y) {
      // Account for native scrollbar clamping as the translated extent changes.
      for (let i = 0; i < 2; i++) {
        const box = surface.getBoundingClientRect();
        offsetX += (x - box.left) / scale;
        offsetY += (y - box.top) / scale;
        translate();
      }
    }
    function updateControls() {
      const percent = Math.round(scale * 100);
      reset.textContent = percent + '%';
      reset.setAttribute('aria-label', 'Zoom ' + percent + ' percent. Reset view to 100 percent');
      minus.disabled = scale <= minimum;
      plus.disabled = scale >= maximum;
    }
    function setScale(next, clientX, clientY) {
      next = Math.max(minimum, Math.min(maximum, next));
      if (Math.abs(next - scale) < 0.000001) return;
      const bounds = viewport.getBoundingClientRect();
      clientX ??= bounds.left + viewport.clientLeft + viewport.clientWidth / 2;
      clientY ??= bounds.top + viewport.clientTop + viewport.clientHeight / 2;
      const before = surface.getBoundingClientRect();
      const x = (clientX - before.left) / scale, y = (clientY - before.top) / scale;
      scale = next;
      surface.style.zoom = String(scale);
      placeOrigin(clientX - x * scale, clientY - y * scale);
      updateControls(); onChange();
    }
    function atScrollbar(element, x, y) {
      const style = getComputedStyle(element), box = element.getBoundingClientRect();
      if (!element.offsetWidth || !element.offsetHeight) return false;
      const sx = box.width / element.offsetWidth, sy = box.height / element.offsetHeight;
      const vertical = /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
      const horizontal = /(auto|scroll)/.test(style.overflowX) && element.scrollWidth > element.clientWidth + 1;
      // Include overlay scrollbar tracks, which do not reserve client space.
      const right = box.left + (element.clientLeft + element.clientWidth) * sx;
      const bottom = box.top + (element.clientTop + element.clientHeight) * sy;
      return (vertical && x >= Math.min(right, box.right - 12 * sx) && x <= box.right && y >= box.top && y <= box.bottom) ||
        (horizontal && y >= Math.min(bottom, box.bottom - 12 * sy) && y <= box.bottom && x >= box.left && x <= box.right);
    }
    function contentOwnsWheel(event) {
      if (event.target.closest('textarea,pre,[contenteditable]:not([contenteditable="false"])')) return true;
      for (let node = event.target; node instanceof Element; node = node.parentElement) {
        if (atScrollbar(node, event.clientX, event.clientY)) return true;
        if (node === viewport) break;
        const style = getComputedStyle(node);
        if ((/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1) ||
            (/(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 1)) return true;
      }
      return false;
    }
    viewport.addEventListener('wheel', event => {
      if (!event.deltaY || contentOwnsWheel(event)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
      const delta = Math.max(-240, Math.min(240, event.deltaY * unit));
      setScale(scale * Math.exp(-delta * 0.0015), event.clientX, event.clientY);
    }, { passive:false });
    function nativePointerAction(event) {
      if (event.target.closest('button,a,input,select,textarea,summary,pre,[contenteditable]:not([contenteditable="false"])')) return true;
      for (let node = event.target; node instanceof Element; node = node.parentElement) {
        if (atScrollbar(node, event.clientX, event.clientY)) return true;
        const resize = getComputedStyle(node).resize;
        if (resize !== 'none') {
          const box = node.getBoundingClientRect();
          const size = 18 * (node.offsetWidth ? box.width / node.offsetWidth : 1);
          if (event.clientX >= box.right - size && event.clientY >= box.bottom - size) return true;
        }
        if (node === viewport) break;
      }
      return false;
    }
    viewport.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.pointerType !== 'mouse' || nativePointerAction(event)) return;
      const box = surface.getBoundingClientRect();
      drag = { id:event.pointerId, x:event.clientX, y:event.clientY, left:box.left, top:box.top, active:false };
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return;
      if (!(event.buttons & 1)) { stop(); return; }
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.active && Math.hypot(dx,dy) < 4) return;
      if (!drag.active) { drag.active = true; viewport.classList.add('is-panning'); window.getSelection()?.removeAllRanges(); }
      event.preventDefault();
      placeOrigin(drag.left + dx, drag.top + dy);
      onChange();
    });
    function stop() {
      const id = drag?.id; drag = null;
      viewport.classList.remove('is-panning');
      if (id !== undefined && viewport.hasPointerCapture(id)) viewport.releasePointerCapture(id);
    }
    viewport.addEventListener('pointerup', stop);
    viewport.addEventListener('pointercancel', stop);
    viewport.addEventListener('lostpointercapture', stop);
    window.addEventListener('blur', stop);
    minus.addEventListener('click', () => setScale(scale - 0.1));
    plus.addEventListener('click', () => setScale(scale + 0.1));
    reset.addEventListener('click', () => {
      stop(); scale = 1; offsetX = 0; offsetY = 0;
      surface.style.zoom = '1'; surface.style.transform = '';
      viewport.scrollLeft = 0; viewport.scrollTop = 0;
      updateControls(); onChange();
    });
    const observer = new ResizeObserver(() => { sizeSurface(); onChange(); });
    observer.observe(viewport);
    sizeSurface(); updateControls();
    return { get scale() { return scale; } };
  }
  window.ChipOpenboxCanvasZoom = { attach };
})();
