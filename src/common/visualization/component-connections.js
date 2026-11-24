'use strict';
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  class ComponentConnections {
    constructor(frames) {
      this.frames = frames;
      this.geometry = new Map();
      this.svg = document.querySelector('#component-connections');
      this.group = document.querySelector('#component-wire-paths');
      this.objects=window.ChipOpenboxDiagramObjects.wires({svg:this.svg,id:'components'});
      this.allowed = { scripts:['image-out'], board:['flash-in','flash-out'], chip:['program-io'] };
      this.resize = new ResizeObserver(() => this.draw());
      this.resize.observe(document.querySelector('#workspaces'));
      for (const frame of frames.values()) this.resize.observe(frame);
      window.addEventListener('resize', () => this.draw());
    }
    receive(component, payload) {
      const viewport = payload?.viewport;
      if (!viewport || !Number.isFinite(viewport.width) || !Number.isFinite(viewport.height) ||
          viewport.width < 0 || viewport.height < 0 || viewport.width > 100000 || viewport.height > 100000) return;
      const ports = {};
      for (const id of this.allowed[component] || []) {
        const p = payload.ports?.[id];
        if (p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.y >= 0 &&
            p.x <= viewport.width && p.y <= viewport.height) ports[id] = { x:p.x, y:p.y };
      }
      this.geometry.set(component, { ports });
      this.draw();
    }
    clear(component) { this.geometry.delete(component); this.draw(); }
    point(component, id) {
      const frame = this.frames.get(component), box = frame.getBoundingClientRect();
      const p = this.geometry.get(component)?.ports[id];
      if (!p || !box.width || !box.height || p.x > box.width || p.y > box.height) return null;
      return { x:box.left + p.x, y:box.top + p.y, owner:component, port:id };
    }
    line(id, from, to, lane, outward) {
      if (!from || !to) return;
      const line = document.createElementNS(NS, 'path');
      line.id = id;
      line.setAttribute('d', 'M ' + from.x + ' ' + from.y + ' H ' + (from.x + outward) +
        ' V ' + lane + ' H ' + (to.x - 8) + ' V ' + to.y + ' H ' + to.x);
      line.setAttribute('class','component-wire');
      this.group.append(line);
      const ports=[from,to].map((p,i)=>{
        const circle=document.createElementNS(NS,'circle');
        for(const [k,v] of Object.entries({cx:p.x,cy:p.y,r:2,class:'component-wire-port'}))circle.setAttribute(k,v);
        this.group.append(circle);
        return window.ChipOpenboxDiagramObjects.port(circle,{id:p.owner+'.'+p.port,owner:p.owner,direction:i?'input':'output',name:id});
      });
      this.objects.add(line,{id,label:id,ports});
    }
    draw() {
      this.objects.begin();
      this.group.replaceChildren();
      const top = document.querySelector('#workspaces').getBoundingClientRect().top;
      this.line('route-scripts-flash', this.point('scripts','image-out'), this.point('board','flash-in'), top + 31, 8);
      this.line('route-flash-chip', this.point('board','flash-out'), this.point('chip','program-io'), top + 36, 8);
      this.objects.finish();
    }
  }
  window.ChipOpenboxComponentConnections = { ComponentConnections };
})();
