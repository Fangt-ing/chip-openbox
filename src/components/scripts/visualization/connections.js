'use strict';
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  class SourceConnections {
    constructor() {
      this.root = document.querySelector('#workspace');
      this.svg = document.querySelector('#connections');
      this.group = document.querySelector('#wire-paths');
      this.active = null;
      this.objects=window.ChipOpenboxDiagramObjects.wires({svg:this.svg,id:'scripts'});
      this.windows = new Set();
      this.observer = new ResizeObserver(() => this.rebuild());
      // Either column can resize without changing the total canvas height.
      for (const element of [this.root, document.querySelector('#editors'), document.querySelector('.process-list')]) {
        this.observer.observe(element);
      }
      window.addEventListener('resize', () => this.rebuild());
    }
    point(element, side) {
      const box = element.getBoundingClientRect(), matrix = this.svg.getScreenCTM();
      if (!matrix) return { x:0, y:0 };
      const point = new DOMPoint(side === 'left' ? box.left : side === 'right' ? box.right : box.left + box.width / 2,
        side === 'top' ? box.top : side === 'bottom' ? box.bottom : box.top + box.height / 2).matrixTransform(matrix.inverse());
      point.owner=element.closest('.file-card')?.dataset.file?'scripts.file.'+element.closest('.file-card').dataset.file:'scripting.'+(element.closest('.process-card')?.dataset.stage||element.id);
      return point;
    }
    path(id, stage, d, from, to) {
      const path = document.createElementNS(NS, 'path');
      path.id = 'wire-' + id;
      path.dataset.stage = stage;
      path.setAttribute('d', d);
      path.setAttribute('class', 'wire' + (stage === this.active ? ' active' : ''));
      this.group.append(path);
      const ports=[from,to].map((p,i)=>{
        const circle=document.createElementNS(NS,'circle');
        for(const [k,v] of Object.entries({cx:p.x,cy:p.y,r:2,class:'source-wire-port'}))circle.setAttribute(k,v);
        this.group.append(circle);
        return window.ChipOpenboxDiagramObjects.port(circle,{id:'scripts.'+id+'.'+i,owner:p.owner,direction:i?'input':'output',name:id});
      });
      this.objects.add(path,{id,label:id+' → '+stage,ports});
    }
    updateWindowSizes() {
      const cards = [...document.querySelectorAll('.file-card,.process-card')];
      for (const card of this.windows) {
        if (!card.isConnected) { this.observer.unobserve(card); this.windows.delete(card); }
      }
      for (const card of cards) {
        if (!this.windows.has(card)) { this.observer.observe(card); this.windows.add(card); }
      }
      // Explicit native-resize widths grow the canvas rather than covering neighbors.
      // Collapsed windows fit their headers; reopening retains their expanded size.
      for (const [kind, selector] of [['source', '.file-card:not(.minimized)'], ['process', '.process-card[open]']]) {
        const width = Math.max(0, ...cards.filter(card => card.matches(selector))
          .map(card => parseFloat(card.style.width) || 0));
        this.root.style.setProperty('--' + kind + '-window-width', width + 'px');
      }
    }
    rebuild() {
      this.updateWindowSizes();
      const cards = [...document.querySelectorAll('.file-card')];
      if (!cards.length) return;
      this.objects.begin();
      this.group.replaceChildren();
      const editorEdge = this.point(document.querySelector('#editors'), 'right').x;
      const workflowEdge = this.point(document.querySelector('.process-list'), 'left').x;
      const gap = Math.max(24, workflowEdge - editorEdge);
      cards.forEach((card, index) => {
        const key = card.dataset.file === 'linker.ld' ? 'link' : 'preprocess';
        const from = this.point(card, 'right');
        const to = this.point(document.querySelector('#stage-' + key + ' summary'), 'left');
        const bus = editorEdge + gap * (index + 1) / (cards.length + 1);
        this.path('source-' + index, key, 'M ' + from.x + ' ' + from.y + ' H ' + bus + ' V ' + to.y + ' H ' + to.x,from,to);
      });
      const keys = ['preprocess', 'compile', 'assemble', 'link', 'export'];
      keys.slice(0, -1).forEach((key, index) => {
        const from = this.point(document.querySelector('#stage-' + key), 'bottom');
        const next = document.querySelector('#stage-' + keys[index + 1] + ' summary');
        const to = this.point(next, 'top');
        this.path(key + '-next', keys[index + 1], 'M ' + from.x + ' ' + from.y + ' V ' + ((from.y+to.y)/2) + ' H ' + to.x + ' V ' + to.y,from,to);
      });
      this.objects.finish();
    }
    select(key) {
      this.active = key;
      this.group.querySelectorAll('.wire').forEach(path => path.classList.toggle('active', path.dataset.stage === key));
    }
  }
  window.ChipOpenboxConnections = { SourceConnections };
})();
