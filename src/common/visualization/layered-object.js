'use strict';
// One recursive interaction/state type. Renderers supply geometry, not gestures.
(() => {
  class LayeredObject {
    constructor(scene, {id, role, name, element, parent = null, expanded = true}) {
      if (scene.objects.has(id)) throw new Error('Duplicate diagram object: ' + id);
      this.scene = scene;
      this.id = id;
      this.role = role;
      this.name = name;
      this.element = element;
      this.parent = null;
      this.children = new Set();
      this.capabilities = Object.freeze({expand: role !== 'box', move: true, resize: role !== 'box'});
      this.expanded = this.capabilities.expand ? !!expanded : true;
      this.view = {};
      this.controls = [];
      scene.objects.set(id, this);
      element.diagramNode = this;
      element.dataset.diagramRole = role;
      element.classList.add('diagram-node');
      this.setParent(parent);
      element.dataset.expanded = String(this.expanded);
      element.toggleAttribute('hidden', !this.visible);
    }

    setParent(parent) {
      for (let node = parent; node; node = node.parent) {
        if (node === this) throw new Error('Cyclic diagram ownership');
      }
      this.parent?.children.delete(this);
      this.parent = parent;
      parent?.children.add(this);
    }

    get visible() { return !this.parent || (this.parent.visible && this.parent.expanded); }

    representative() {
      let result = this;
      for (let parent = this.parent; parent; parent = parent.parent) {
        if (!parent.expanded) result = parent;
      }
      return result;
    }

    *descendants() {
      for (const child of this.children) { yield child; yield* child.descendants(); }
    }

    setExpanded(value) {
      if (!this.capabilities.expand || this.expanded === !!value) return;
      this.expanded = !!value;
      this.view.expanded?.(this.expanded);
      this.layoutChanged();
      this.scene.changed();
    }

    // One child-geometry notification contract at every hierarchy layer.
    layoutChanged() {
      for (let parent = this.parent; parent; parent = parent.parent) {
        parent.view.contentChanged?.(this);
      }
    }

    toggle() { this.setExpanded(!this.expanded); }

    get hasExpandableDescendants() {
      for (const child of this.descendants()) if (child.capabilities.expand) return true;
      return false;
    }

    get allExpanded() {
      for (const child of this.descendants()) {
        if (child.capabilities.expand && !child.expanded) return false;
      }
      return true;
    }

    toggleAll() { this.allExpanded ? this.collapseAll() : this.expandAll(); }

    expandAll() {
      this.scene.batch(() => {
        for (const child of this.descendants()) child.setExpanded(true);
      });
    }

    collapseAll() {
      // The double chevron changes descendants, never this object's own state.
      this.scene.batch(() => {
        for (const child of this.descendants()) child.setExpanded(false);
        this.view.resetChildren?.();
        this.layoutChanged();
      });
    }

    moveTo(position) {
      if (!this.capabilities.move) return;
      this.view.move?.(position);
      this.layoutChanged();
      this.scene.changed();
    }

    resize(size) {
      if (!this.capabilities.resize || !this.expanded) return;
      this.view.resize?.(size);
      this.layoutChanged();
      this.scene.changed();
    }

    select() {
      this.scene.selected?.element.classList.remove('diagram-object-selected');
      this.scene.selected = this;
      this.element.classList.add('diagram-object-selected');
    }

    bindGesture(handle, action, options = {}) {
      let active = null, suppressClick = false;
      handle.classList.add(action === 'move' ? 'diagram-unit-movable' : 'diagram-resize-handle');
      handle.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.pointerType !== 'mouse') return;
        if (action === 'move' && event.target.closest('a,button,input,select,textarea')) return;
        if (!this.capabilities[action] || (action === 'resize' && !this.expanded)) return;
        event.preventDefault();
        event.stopPropagation();
        this.select();
        const point = options.point || this.view.point || (e => {
          const scale = this.scene.scale();
          return {x: e.clientX / scale, y: e.clientY / scale};
        });
        active = {pointer: event.pointerId, start: point(event), bounds: {...this.view.bounds()},
          clientX: event.clientX, clientY: event.clientY, moved: false, point};
        this.scene.activeGesture = {node: this, action};
        this.view.start?.(action);
        handle.setPointerCapture(event.pointerId);
      });
      handle.addEventListener('pointermove', event => {
        if (!active || active.pointer !== event.pointerId) return;
        if (!(event.buttons & 1)) { stop(); return; }
        if (!active.moved && Math.hypot(event.clientX - active.clientX, event.clientY - active.clientY) < 4) return;
        event.preventDefault();
        event.stopPropagation();
        active.moved = true;
        handle.classList.add('is-moving');
        const point = active.point(event), dx = point.x - active.start.x, dy = point.y - active.start.y;
        if (action === 'move') this.moveTo({x: active.bounds.x + dx, y: active.bounds.y + dy});
        else this.resize({w: active.bounds.w + dx, h: active.bounds.h + dy});
      });
      const stop = () => {
        if (!active) return;
        const {pointer, moved} = active;
        active = null;
        suppressClick = moved;
        this.scene.activeGesture = null;
        handle.classList.remove('is-moving');
        this.view.end?.(action);
        if (handle.hasPointerCapture(pointer)) handle.releasePointerCapture(pointer);
        this.scene.changed();
        if (moved) setTimeout(() => { suppressClick = false; }, 0);
      };
      handle.addEventListener('pointerup', stop);
      handle.addEventListener('pointercancel', stop);
      handle.addEventListener('lostpointercapture', stop);
      window.addEventListener('blur', stop);
      handle.addEventListener('click', event => {
        if (suppressClick || (this.role === 'box' && !event.target.closest('a'))) {
          event.preventDefault(); event.stopPropagation(); suppressClick = false;
        }
      }, true);
    }

    heading(element, {native = false} = {}) {
      element.classList.add('diagram-object-heading');
      if (native) this.element.addEventListener('toggle', () => {
        this.setExpanded(this.element.open);
      });
      const button = (action, label, run) => {
        const control = document.createElement('button');
        control.type = 'button';
        control.className = 'diagram-object-control diagram-' + action;
        control.dataset.action = action;
        control.title = label;
        control.setAttribute('aria-label', label + ' ' + this.name);
        control.addEventListener('pointerdown', e => e.stopPropagation());
        control.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.select(); run(); });
        element.append(control);
        return control;
      };
      if (this.capabilities.expand) {
        const fold = button('fold', 'Expand or collapse', () => this.toggle());
        this.controls.push(fold);
        const all = button('toggle-all', 'Expand all in', () => this.toggleAll());
        all.hidden = !this.hasExpandableDescendants;
        this.controls.push(all);
      }
      if (!native) element.addEventListener('click', event => {
        if (!event.defaultPrevented && !event.target.closest('a,button')) this.toggle();
      });
      this.bindGesture(element, 'move');
    }

    resizeHandle(container) {
      if (!this.capabilities.resize) return null;
      const handle = document.createElement('button');
      handle.type = 'button'; handle.className = 'diagram-resize-handle';
      handle.title = 'Resize ' + this.name; handle.setAttribute('aria-label', handle.title);
      container.append(handle);
      this.bindGesture(handle, 'resize');
      this.resizer = handle;
      return handle;
    }
  }

  function createScene({scale, onChange}) {
    const scene = {objects: new Map(), selected: null, activeGesture: null, depth: 0, scale,
      add(options) { return new LayeredObject(scene, options); },
      batch(action) { scene.depth++; try { action(); } finally { if (!--scene.depth) scene.changed(); } },
      changed() {
        if (scene.depth) return;
        for (const node of scene.objects.values()) {
          const wasVisible=!node.element.hasAttribute('hidden');
          node.element.toggleAttribute('hidden', !node.visible);
          if(wasVisible!==node.visible)node.element.dispatchEvent(new CustomEvent('diagram-visibility',{detail:node.visible}));
          node.element.dataset.expanded = String(node.expanded);
          for (const control of node.controls) {
            const bulk = control.dataset.action === 'toggle-all';
            const expanded = bulk ? node.allExpanded : node.expanded;
            const label = (expanded ? 'Collapse ' : 'Expand ') + (bulk ? 'all children in ' : '') + node.name;
            if (bulk) control.hidden = !node.hasExpandableDescendants;
            control.setAttribute('aria-expanded', String(expanded));
            control.setAttribute('aria-label', label);
            control.title = label;
          }
          if (node.resizer) node.resizer.hidden = !node.visible || !node.expanded;
          node.view.visibility?.(node.visible);
        }
        onChange();
      }
    };
    return scene;
  }
  window.ChipOpenboxLayeredObject = LayeredObject;
  window.ChipOpenboxLayeredObjects = Object.freeze({createScene});
})();
