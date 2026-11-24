'use strict';
// Shared geometry/inspection engine. Architecture and device content are supplied by a registry entry.
(() => {
 function attach({architecture,instance:example,channel}) {
  const packageElement = document.querySelector('#chip-package');
  const scene=window.ChipOpenboxLayeredObjects.createScene({scale:()=>packageElement.getBoundingClientRect().width/packageElement.offsetWidth,onChange:schedule});
  window.ChipOpenboxDiagram=scene;
  const root=scene.add({id:'chip',role:'mcu',name:example.label,element:packageElement});
  packageElement.dataset.chipset=example.id;
  document.querySelector('.chip-canvas').dataset.chipset=example.id;
  const packageLabel=document.querySelector('.package-label');
  const packageName=document.createElement('span');packageName.textContent=example.label;
  packageLabel.replaceChildren(packageName);
  window.ChipOpenboxDiagramObjects.unit(packageElement,{id:'chip',name:example.label,
    reference:architecture.reference?{href:architecture.reference,section:example.referenceLabel||architecture.referenceLabel||'Source documentation'}:null,
    label:packageName});
  document.querySelector('.scope-note').textContent=example.scope;
  const wireGroup = document.querySelector('#chip-wire-paths');
  const svg = document.querySelector('#chip-connections');
  const NS = 'http://www.w3.org/2000/svg';
  const blocks = new Map();
  const memoryDefinitions={...(example.ramPreview?{ram:example.ramPreview}:{}),...example.memoryPreviews};
  const pinRoutes=example.pins.flatMap(pin=>(pin.targets||[pin.target]).map((target,index)=>({...pin,target,detailPort:pin.detailPorts?.[target]||pin.detailPort,routeId:index?pin.id+':'+target:pin.id})));
  const memoryViews=new Map();
  const unitViews=new Map();
  function unitPort(owner,key) {
    const node=scene.objects.get('chip.'+owner);if(node&&!node.visible)return null;
    const memory=/^memory:([^:]+):([^:]+):/.exec(key);
    if(memory&&owner===memory[1]&&blocks.get(owner)?.open){const element=blocks.get(owner).querySelector('[data-port="'+memory[2]+'"]');if(element)return {element,side:memory[2]==='output'?'right':'left'};}
    const view=unitViews.get(owner);if(!view)return null;
    const link=/^(architecture|integration):(\d+):(from|to)$/.exec(key);
    let name;
    if(link) {
      const hint=example.connectionPorts?.[link[1]+':'+link[2]];
      name=hint?.[link[3]+'Detail']||hint?.[link[3]];
      if(!name&&link[1]==='integration')name=example.links[Number(link[2])][5];
    } else if(/^memory:/.test(key)){const match=/^memory:([^:]+):([^:]+):/.exec(key);name=match?match[1]+'.'+match[2]:null;}
    else name=pinRoutes.find(pin=>key==='pin:'+pin.routeId+':block')?.detailPort||(example.interfaceLinks||[]).find(route=>key===interfaceKey(route)+":block")?.detailPort;
    return name?view.port(name):null;
  }
  function interfaceKey(route){return "interface-link:"+(route.id||route.source+":"+route.interface);}
  window.ChipOpenboxMemoryPreviews=Object.create(null);
  let scheduled = false;
  let sceneLayout;
  const connections=window.ChipOpenboxConnections.attach({svg,group:wireGroup,blocks,viewport:document.querySelector(".chip-canvas"),port:unitPort,display:owner=>sceneLayout?.display(owner)});
  const observer = new ResizeObserver(schedule);
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; redraw(); });
  }
  function renderBlock(definition, container) {
    const memory=memoryDefinitions[definition.id];
    const detail=definition.detailView?window.ChipOpenboxUnitViews[definition.detailView]:null;
    if(definition.detailView&&!detail)throw new Error('Unknown detail renderer: '+definition.detailView);
    const card = document.createElement('details');
    card.className = 'block-window';
    card.id = 'block-' + definition.id;
    card.dataset.kind = definition.kind;
    card.open = memory?false:!!definition.open;
    const model=scene.add({id:'chip.'+definition.id,role:'block',name:definition.name,element:card,parent:root,expanded:card.open});
    model.view.expanded=value=>{card.open=value;};
    const summary = document.createElement('summary');
    const name=document.createElement('span');
    name.textContent=definition.name+(definition.optional&&!definition.name.includes('optional')?' · optional':'');
    summary.append(name);
    window.ChipOpenboxDiagramObjects.unit(card,{id:'chip.'+definition.id,name:definition.fullName,
      reference:definition.reference?{href:definition.referenceHref||architecture.reference,section:definition.reference}:null,label:name});
    card.dataset.scope = definition.kind === 'processor' ? 'processor' : definition.kind === 'integration' ? 'example' : 'reference';
    if (definition.reference) card.dataset.reference = definition.reference;
    summary.title = 'Expand or collapse ' + definition.name + '; drag the lower-right corner when expanded to resize';
    const body = document.createElement('div');
    body.className = 'block-content';
    const fullName = document.createElement('p');
    fullName.className = 'block-full-name';
    fullName.textContent = definition.fullName;
    if (!memory&&!detail) body.append(fullName);
    const description = document.createElement('p');
    description.textContent = definition.text;
    if (!memory&&!detail) body.append(description);
    if (!memory && !detail && definition.reference) {
      const reference = document.createElement('a');
      reference.className = 'block-reference'; reference.href = window.ChipOpenboxSourceDocuments.resolve({href:definition.referenceHref || architecture.reference}).href;
      reference.target = '_blank'; reference.rel = 'noopener';
      reference.textContent = definition.kind === 'integration' ? definition.reference : (architecture.referenceLabel || architecture.label) + ' · ' + definition.reference;
      body.append(reference);
    }
    if (!memory && !detail && definition.parts.length) {
      const parts = document.createElement('div');
      parts.className = 'block-parts';
      for (const label of definition.parts) {
        const item = document.createElement('span'); item.textContent = label; parts.append(item);
      }
      body.append(parts);
    }
    if (definition.id === (example.programUnit || 'program')) {
      const preview = document.createElement('div');
      preview.id = 'chip-image-preview'; preview.hidden = true;
      preview.innerHTML = '<h3>Flash request · image preview</h3><p id="chip-image-metadata"></p><pre id="chip-image-bytes"></pre>';
      body.append(preview);
    }
    if (memory) {
      card.classList.add('ram-window','memory-window');
      card.dataset.wordBytes=memory.wordBytes||4;
      const model=window.ChipOpenboxByteStore.create(memory);
      const view=window.ChipOpenboxMemoryView.attach({
        container:body,card,model,id:definition.id,name:definition.fullName,kind:memory.kind||'ram',cacheLineBytes:memory.cacheLineBytes||32,
        wordBytes:memory.wordBytes||4,addressDigits:memory.addressDigits||8,
        addressLabel:memory.addressLabel||'Address',addressMeaning:memory.addressMeaning,onChange:schedule
      });
      memoryViews.set(definition.id,{view,definition:memory});
      window.ChipOpenboxMemoryPreviews[definition.id]=view;
      if(definition.id==='ram')window.ChipOpenboxRamPreview=view;
    }
    if(detail){
      let mounted=null;
      const ensure=()=>{if(card.open&&model.visible&&!mounted)mounted=detail.attach({container:body,card,definition,onChange:schedule});return mounted;};
      unitViews.set(definition.id,{updateEdges:()=>{if(model.visible&&card.open)ensure()?.updateEdges();},port:name=>model.visible&&card.open?ensure()?.port(name):null});
      card.addEventListener('toggle',()=>{ensure();schedule();});
    }
    card.append(summary, body);
    container.append(card);
    blocks.set(definition.id, card);
    card.addEventListener('toggle', schedule);
    observer.observe(card);
  }
  const layer = document.querySelector('#chip-block-layer');
  for (const definition of [...architecture.blocks,...architecture.mcuBlocks,...example.blocks]) renderBlock(definition,layer);
  sceneLayout = window.ChipOpenboxArchitectureLayout.attach({
    packageElement,svg,blocks,architecture,example,scene,root,onChange:schedule
  });
  for(const definition of [...architecture.blocks,...example.blocks])if(memoryDefinitions[definition.id]) {
    blocks.get(definition.id).querySelector('summary').title=definition.fullName+'. '+definition.text+' Drag the header to move; click to expand or collapse.';
  }
  for (const pin of example.pins) {
    const item = document.createElement('div');
    item.className = 'pin-group ' + pin.side;
    item.id = 'pin-' + pin.id;
    item.dataset.direction = pin.both ? 'bidirectional' : pin.direction || 'input';
    item.style.top = (116 + pin.offset * 48 + (pin.side === 'right' ? 70 : 0)) + 'px';
    item.title = pin.description || 'Logical ' + pin.label + ' connection; no device pin assignment or physical supply pin is implied';
    const contact = document.createElement('span'); contact.className = 'pin-contact';
    const label = document.createElement('span'); label.textContent = pin.label;
    item.append(contact, label);
    document.querySelector('#package-pins').append(item);
  }
  for (const port of architecture.interfaces || []) {
    const item = document.createElement('div');
    item.id = 'interface-' + port.id; item.className = 'architecture-port';
    item.title = port.description + ' · ' + (architecture.referenceLabel || architecture.label) + ' ' + port.reference;
    item.dataset.interface = port.name;
    const contact = document.createElement('span'); contact.className = 'interface-contact';
    const label = document.createElement('span'); label.className = 'interface-label'; label.textContent = port.name;
    item.append(contact,label); document.querySelector('#package-pins').append(item);
  }
  function point(element, side) {
    const box = element.getBoundingClientRect();
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x:0, y:0 };
    // Map viewport coordinates back into SVG space at any canvas zoom.
    return new DOMPoint(side === 'left' ? box.left : box.right, box.top + box.height / 2)
      .matrixTransform(matrix.inverse());
  }
  function owner(element) {return element.closest?.('.block-window')?.id.slice(6)||'domain:'+(element.closest('[data-group]')?.dataset.group||'processor');}
  function path(from,to,both,kind,index,label,key) {
    const aOwner=owner(from),bOwner=owner(to);if(sceneLayout.same(aOwner,bOwner))return null;
    const [aDefault,bDefault]=connections.sides(from,to);
    const hint=example.connectionPorts?.[key]||{};
    const aSide=connections.side(aOwner,key+':from',hint.fromSide||aDefault),bSide=connections.side(bOwner,key+':to',hint.toSide||bDefault);
    const a=connections.point(aOwner,aSide,key+':from'),b=connections.point(bOwner,bSide,key+':to');
    const wire=addPath(connections.route(a,aSide,b,bSide,aOwner,bOwner),both,kind,label);
    if(hint.net)wire.dataset.diagramNet=hint.net;
    const integration=/^integration:(\d+)$/.exec(key);
    if(integration){const link=example.links[Number(integration[1])];if(link[6])wire.dataset.diagramNet=link[6];}
    return connections.wire(wire,key,{owner:aOwner,side:aSide,name:hint.from},{owner:bOwner,side:bSide,name:hint.to});
  }
  function reserveLink(from,to,key) {
    if(sceneLayout.same(owner(from),owner(to)))return;
    const [aDefault,bDefault]=connections.sides(from,to);
    const hint=example.connectionPorts?.[key]||{};
    const aSide=connections.side(owner(from),key+':from',hint.fromSide||aDefault),bSide=connections.side(owner(to),key+':to',hint.toSide||bDefault);
    connections.reserve(owner(from),aSide,key+':from');connections.reserve(owner(to),bSide,key+':to');
  }
  function addPath(d, both, kind, label) {
    const line = document.createElementNS(NS, 'path');
    line.setAttribute('d', d);
    line.setAttribute('class', 'chip-wire ' + kind + (both ? ' bidirectional' : ''));
    const title = document.createElementNS(NS, 'title'); title.textContent = label;
    line.append(title); wireGroup.append(line); return line;
  }
  function memoryPeer(definition,view,netId) {
    const rule=definition.netPeers?.[netId]??definition.peer;
    return typeof rule==='string'?rule:rule[view.signals.operation]||definition.peer;
  }
  function memoryPeers(definition) {
    return new Set([definition.peer,...Object.values(definition.netPeers||{}).flatMap(rule=>typeof rule==='string'?[rule]:Object.values(rule))]);
  }
  function memoryConnections(memoryId,definition,view) {
    for(const net of view.nets){
      const peer=memoryPeer(definition,view,net.id);if(sceneLayout.same(memoryId,peer))continue;
      const outgoing=net.id==='output',from=outgoing?memoryId:peer,to=outgoing?peer:memoryId,key='memory:'+memoryId+':'+net.id;
      const a=connections.point(from,'right',key+':from'),b=connections.point(to,'left',key+':to');
      const wire=addPath(connections.route(a,'right',b,'left',from,to),false,'chip-memory-wire'+(memoryId==='ram'?' chip-ram-wire':'')+' ram-net-'+net.id,net.label);
      wire.id=memoryId+'-wire-'+net.id;wire.style.stroke=net.color;
      wire.dataset.net=net.id;wire.dataset.memoryId=memoryId;wire.dataset.from=from;wire.dataset.to=to;
      connections.wire(wire,key,{owner:from,side:'right'},{owner:to,side:'left'});
    }
  }
  function redraw() {
    for(const view of unitViews.values())view.updateEdges();
    sceneLayout?.update();
    connections.begin();
    wireGroup.replaceChildren();
    const expandedMemoryLink=([a,b])=>[...memoryViews].some(([id,item])=>
      (a===id&&memoryPeers(item.definition).has(b))||(b===id&&memoryPeers(item.definition).has(a)));
    architecture.links.forEach((link,i)=>{if(!expandedMemoryLink(link))reserveLink(blocks.get(link[0]).querySelector('summary'),blocks.get(link[1]).querySelector('summary'),'architecture:'+i);});
    example.links.forEach((link,i)=>{if(!expandedMemoryLink(link))reserveLink(blocks.get(link[0]).querySelector('summary'),blocks.get(link[1]).querySelector('summary'),'integration:'+i);});
    for(const [id,item] of memoryViews)for(const net of item.view.nets) {
      const key='memory:'+id+':'+net.id,peer=memoryPeer(item.definition,item.view,net.id),out=net.id==='output';if(sceneLayout.same(id,peer))continue;
      connections.reserve(peer,out?'left':'right',key+(out?':to':':from'));
      connections.reserve(id,out?'right':'left',key+(out?':from':':to'));
    }
    for(const route of example.domainLinks||[])reserveLink(blocks.get(route.source).querySelector('summary'),document.querySelector((route.target==='processor'?'#processor-boundary':'#group-'+route.target)+' .group-shape'),'domain:'+route.source+':'+route.target);
    for(const port of architecture.interfaces||[])connections.reserve(port.source,port.side,'interface:'+port.id+':block');
    for(const pin of pinRoutes)if(pin.target)connections.reserve(pin.target,pin.direction==='output'?'right':'left','pin:'+pin.routeId+':block');
    for(const route of example.interfaceLinks||[])connections.reserve(route.source,route.blockSide,interfaceKey(route)+':block');
    architecture.links.forEach((link,i)=>{
      if(!expandedMemoryLink(link)){const [a,b,both,label,signalKind]=link;const wire=path(blocks.get(a).querySelector('summary'),blocks.get(b).querySelector('summary'),both,'processor'+(signalKind?' signal-'+signalKind:''),i,label,'architecture:'+i);if(!wire)return;wire.dataset.from=a;wire.dataset.to=b;if(signalKind)wire.dataset.signalKind=signalKind;}
    });
    example.links.forEach((link,i)=>{
      if(!expandedMemoryLink(link)){const [a,b,both,label,signalKind]=link;const wire=path(blocks.get(a).querySelector('summary'),blocks.get(b).querySelector('summary'),both,'integration'+(signalKind?' signal-'+signalKind:''),i,label,'integration:'+i);if(!wire)return;wire.dataset.from=a;wire.dataset.to=b;if(signalKind)wire.dataset.signalKind=signalKind;}
    });
    for(const [id,item] of memoryViews)memoryConnections(id,item.definition,item.view);
    for (const route of example.domainLinks || []) {
      const source=blocks.get(route.source).querySelector('summary');
      const target=document.querySelector((route.target==='processor'?'#processor-boundary':'#group-'+route.target)+' .group-shape');
      const wire=path(source,target,false,'signal-'+route.kind,0,route.label,'domain:'+route.source+':'+route.target);
      if(!wire)continue;wire.dataset.from=route.source;wire.dataset.to='domain:'+route.target;wire.dataset.signalKind=route.kind;
    }
    for (const port of architecture.interfaces || []) {
      document.querySelector('#interface-'+port.id).hidden=!root.expanded;if(!root.expanded)continue;
      const source=blocks.get(port.source).querySelector('summary');
      const edge=point(document.querySelector('#processor-boundary .group-shape'),port.side);
      const inside=connections.point(port.source,port.side,'interface:'+port.id+':block'),item=document.querySelector('#interface-'+port.id);
      item.style.left=(edge.x-6)+'px';item.style.top=(inside.y-6)+'px';
      item.classList.toggle('left',port.side==='left');
      const contact=point(item.querySelector('.interface-contact'),port.side==='left'?'right':'left');
      const input=port.direction==='input',from=input?contact:inside,to=input?inside:contact;
      const wire=addPath(connections.route(from,input?'right':port.side,to,input?port.side:'left',input?'interface:'+port.id:port.source,input?port.source:'interface:'+port.id),!!port.both,'processor',port.name+': '+port.description);
      wire.dataset.interface=port.id;
      if(port.net)wire.dataset.diagramNet=port.net;
      connections.wire(wire,'interface:'+port.id,input?{owner:'interface:'+port.id,side:port.side}:{owner:port.source,side:port.side},input?{owner:port.source,side:port.side}:{owner:'interface:'+port.id,side:port.side});
    }
    for(const route of example.interfaceLinks||[]) {
      const port=architecture.interfaces.find(item=>item.id===route.interface);
      const key=interfaceKey(route);
      const blockPoint=connections.point(route.source,route.blockSide,key+':block');
      const outerPoint=point(document.querySelector('#interface-'+port.id+' .interface-contact'),port.side);
      const incoming=route.direction?route.direction==='from-block':port.direction==='input',from=incoming?blockPoint:outerPoint,to=incoming?outerPoint:blockPoint;
      const wire=addPath(connections.route(from,incoming?route.blockSide:port.side,to,incoming?port.side:route.blockSide,incoming?route.source:'interface:'+port.id,incoming?'interface:'+port.id:route.source),!!route.both,'integration signal-'+route.kind,route.label);
      wire.dataset.interfaceLink=port.id;wire.dataset.block=route.source;wire.dataset.signalKind=route.kind;
      if(route.net)wire.dataset.diagramNet=route.net;
      wire.dataset.from=incoming?route.source:'interface:'+port.id;wire.dataset.to=incoming?'interface:'+port.id:route.source;
      connections.wire(wire,key,incoming?{owner:route.source,side:route.blockSide}:{owner:'interface:'+port.id,side:port.side},incoming?{owner:'interface:'+port.id,side:port.side}:{owner:route.source,side:route.blockSide});
    }
    for (const pin of pinRoutes) {
      if (!pin.target) continue;
      const contact=document.querySelector('#pin-'+pin.id+' .pin-contact');
      const target=blocks.get(pin.target).querySelector('summary');
      const blockSide=connections.side(pin.target,'pin:'+pin.routeId+':block',pin.direction==='output'?'right':'left');
      if(!root.expanded)document.querySelector('#pin-'+pin.id).style.top=(116+pin.offset*48+(pin.side==='right'?70:0))+'px';
      if(root.expanded&&pin.alignTarget)document.querySelector('#pin-'+pin.id).style.top=(connections.point(pin.target,blockSide,'pin:'+pin.routeId+':block').y-14)+'px';
      const incoming=point(contact,root.expanded?(pin.side==='left'?'right':'left'):pin.side),internal=root.expanded?connections.point(pin.target,blockSide,'pin:'+pin.routeId+':block'):{x:pin.side==='left'?0:packageElement.clientWidth,y:incoming.y};
      const outgoing=pin.direction==='output',start=outgoing?internal:incoming,end=outgoing?incoming:internal;
      const pinSide=pin.side==='left'?'right':'left';
      const wire=addPath(connections.route(start,outgoing?blockSide:pinSide,end,outgoing?pinSide:blockSide,outgoing?pin.target:'pin:'+pin.id,outgoing?'pin:'+pin.id:pin.target),
        !!pin.both,'pin'+(pin.signalKind?' signal-'+pin.signalKind:''),pin.label+(pin.both?' ↔ ':' → ')+pin.target);
      if(pin.net)wire.dataset.diagramNet=pin.net;
      wire.dataset.pin=pin.id;wire.dataset.to=pin.target;wire.dataset.direction=pin.both?'bidirectional':pin.direction||'input';
      wire.dataset.from=outgoing?pin.target:'pin:'+pin.id;wire.dataset.to=outgoing?'pin:'+pin.id:pin.target;
      connections.wire(wire,'pin:'+pin.routeId,outgoing?{owner:pin.target,side:blockSide}:{owner:'pin:'+pin.id,side:pin.side},outgoing?{owner:'pin:'+pin.id,side:pin.side}:{owner:pin.target,side:blockSide});
    }
    connections.finish();
  }
  observer.observe(packageElement);
  window.addEventListener('resize', schedule);
  channel.subscribe(message => {
    if (!['host:sync', 'host:state'].includes(message.type)) return;
    const image = message.payload.chipPreview;
    const preview = document.querySelector('#chip-image-preview');
    if(!preview)return;
    preview.hidden = !image;
    preview.dataset.imageId = image?.imageId || '';
    document.querySelector('#chip-preview-status').textContent = image
      ? 'Preview only: target compatibility unchecked; no program storage written or code executed.'
      : 'No program image preview received. Program storage is unchanged.';
    if (image) {
      document.querySelector('#chip-image-metadata').textContent = image.target + ' · ' + image.compiler + ' · ' + image.byteCount + ' bytes';
      document.querySelector('#chip-image-bytes').textContent = image.bytes.slice(0,16).map(byte => byte.value.toString(16).toUpperCase().padStart(2,'0')).join(' ');
    }
    schedule();
  });
  schedule();
  return {schedule,scene};
 }
 window.ChipOpenboxBaseDiagram={attach};
})();
