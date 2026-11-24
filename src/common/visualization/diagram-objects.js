'use strict';
(() => {
  const NS='http://www.w3.org/2000/svg',scopes=new Set();
  let selected=null,pointer=null,serial=0,lastPorts=new Set();
  function resolved(record){return typeof record.ports==='function'?record.ports():record.ports;}
  function apply() {
    const activePorts=new Set(),allPorts=new Set(lastPorts);
    for(const scope of scopes)for(const r of scope.records) {
      const active=r.key===selected;
      r.path.classList.toggle('is-selected',active);r.node.classList.toggle('is-selected',active);
      r.hit.setAttribute('aria-pressed',String(active));
      for(const p of resolved(r)||[])if(p){allPorts.add(p);if(active)activePorts.add(p);}
      const decorations=typeof r.decorations==='function'?r.decorations():r.decorations;
      for(const p of decorations||[])if(p){allPorts.add(p);if(active)activePorts.add(p);}
    }
    for(const p of allPorts)p.classList.toggle('is-selected',activePorts.has(p));
    lastPorts=allPorts;
    // Detached ports must not be retained after component redraws.
    lastPorts=new Set([...lastPorts].filter(p=>p.isConnected));
  }
  function clear(){selected=null;apply();if(document.activeElement?.matches('.diagram-wire-hit'))document.activeElement.blur();}
  document.addEventListener('pointerdown',e=>{if(e.button===0)pointer={x:e.clientX,y:e.clientY};},true);
  document.addEventListener('click',e=>{
    if(e.target.closest?.('.diagram-wire-hit'))return;
    if(pointer&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)<4)clear();
    pointer=null;
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')clear();});
  function object(element,definition) {
    const value=Object.freeze(Object.defineProperties({},Object.getOwnPropertyDescriptors(definition)));
    element.diagramObject=value;element.dataset.objectType=value.type;
    if(value.id)element.dataset.diagramId=value.id;
    return value;
  }
  function port(element,{id,owner,direction,name}) {
    object(element,{type:'port',id,owner,direction,name});
    element.classList.add('diagram-port');element.dataset.owner=owner;element.dataset.direction=direction;
    return element;
  }
  function unit(element,{id,name,reference=null,label=null}) {
    if(reference)reference=window.ChipOpenboxSourceDocuments?.resolve(reference)||reference;
    object(element,{type:'unit',id,name,reference});
    if(!label||!reference?.href)return null;
    const url=new URL(reference.href,document.baseURI);
    if(!['https:','http:','file:'].includes(url.protocol))throw new TypeError('Unsupported reference URL');
    const svg=label.namespaceURI===NS;
    const link=svg?document.createElementNS(NS,'a'):document.createElement('a');
    link.setAttribute('href',reference.href);link.setAttribute('target','_blank');link.setAttribute('rel','noopener');
    link.setAttribute('class','diagram-unit-link');
    link.setAttribute('aria-label',name+' · '+(reference.section||'Source documentation'));
    const title=id+' · '+(reference.section||'Source documentation');
    if(svg){const t=document.createElementNS(NS,'title');t.textContent=title;link.append(t);}
    else link.title=title;
    label.replaceWith(link);link.append(label);
    link.addEventListener('pointerdown',e=>e.stopPropagation());
    link.addEventListener('click',e=>e.stopPropagation());
    return link;
  }
  function wires({svg,id}) {
    const scope={id,records:[],focused:null};scopes.add(scope);
    const markerId='diagram-selected-arrow-'+(++serial);
    function marker() {
      if(svg.querySelector('#'+markerId))return;
      let defs=svg.querySelector('defs');
      if(!defs){defs=document.createElementNS(NS,'defs');svg.prepend(defs);}
      const m=document.createElementNS(NS,'marker');
      for(const [k,v] of Object.entries({id:markerId,markerWidth:6,markerHeight:6,refX:5,refY:3,orient:'auto-start-reverse'}))m.setAttribute(k,v);
      const p=document.createElementNS(NS,'path');p.setAttribute('d','M0 0 L6 3 L0 6 Z');p.setAttribute('fill','#d97706');
      m.append(p);defs.append(m);
    }
    function begin() {
      scope.focused=svg.contains(document.activeElement)?document.activeElement.dataset.wireInstance:null;
      scope.records=[];marker();
    }
    function add(path,{id:key,net=null,label=key,ports=[],decorations=[],wrapper=null,hitClass='',both=false}) {
      marker();
      const node=wrapper||document.createElementNS(NS,'g');
      if(!wrapper){path.replaceWith(node);node.append(path);}
      node.classList.add('diagram-connection');node.dataset.connectionId=key;
      const hit=document.createElementNS(NS,'path');
      hit.setAttribute('d',path.getAttribute('d')||'');hit.setAttribute('class','diagram-wire-hit '+hitClass);
      hit.setAttribute('tabindex','0');hit.setAttribute('role','button');hit.setAttribute('aria-label',label);
      hit.dataset.connectionId=key;hit.dataset.wireInstance=scope.id+':'+key;
      path.classList.add('diagram-wire');
      const end=path.getAttribute('marker-end')||getComputedStyle(path).markerEnd;
      const start=both||(path.getAttribute('marker-start')||getComputedStyle(path).markerStart||'none')!=='none';
      path.style.setProperty('--diagram-selected-end',end&&end!=='none'?'url(#'+markerId+')':'none');
      path.style.setProperty('--diagram-selected-start',start?'url(#'+markerId+')':'none');
      node.insertBefore(hit,path);
      const record={id:key,key:net||scope.id+':'+key,path,node,hit,ports,decorations};
      path.dataset.netId=record.key;hit.dataset.netId=record.key;
      object(path,{type:'wire',id:scope.id+':'+key,net:record.key,name:label,get ports(){return (resolved(record)||[]).filter(Boolean).map(p=>p.diagramObject?.id).filter(Boolean);}});
      hit.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.stopPropagation();e.preventDefault();hit.focus({preventScroll:true});});
      function toggle(){selected=selected===record.key?null:record.key;apply();}
      hit.addEventListener('click',e=>{e.stopPropagation();toggle();});
      hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();toggle();}});
      scope.records.push(record);
      return record;
    }
    function update(path) {const r=scope.records.find(r=>r.path===path);if(r)r.hit.setAttribute('d',path.getAttribute('d')||'');}
    function finish() {
      for(const r of scope.records) {
        const end=r.path.getAttribute('marker-end')||getComputedStyle(r.path).markerEnd||'none';
        const start=r.path.getAttribute('marker-start')||getComputedStyle(r.path).markerStart||'none';
        r.path.style.setProperty('--diagram-selected-end',end!=='none'?'url(#'+markerId+')':'none');
        r.path.style.setProperty('--diagram-selected-start',start!=='none'?'url(#'+markerId+')':'none');
      }
      if(selected&&![...scopes].some(s=>s.records.some(r=>r.key===selected)))selected=null;
      apply();
      if(scope.focused)scope.records.find(r=>r.hit.dataset.wireInstance===scope.focused)?.hit.focus({preventScroll:true});
    }
    return {begin,add,update,finish};
  }
  window.ChipOpenboxDiagramObjects=Object.freeze({object,port,unit,wires,clear});
})();
