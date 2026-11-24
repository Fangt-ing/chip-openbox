'use strict';
(() => {
  const entries=new Map();
  const ids=nodes=>nodes.flatMap(node=>typeof node==='string'?[node]:ids(node.children));
  function register({architecture,instance,keywords=''}) {
    if(instance.architecture!==architecture.id)throw new Error('Instance architecture does not match');
    if(!instance.id||entries.has(instance.id))throw new Error('Duplicate or missing chipset ID');
    const units=[...architecture.blocks,...architecture.mcuBlocks,...instance.blocks];
    const known=new Set(units.map(u=>u.id));
    if(known.size!==units.length)throw new Error('Duplicate unit ID in '+instance.id);
    for(const unit of units)if(!instance.view.positions[unit.id]?.every(Number.isFinite)||!unit.fullName)throw new Error('Missing unit metadata: '+unit.id);
    const groupIds=new Set(['processor']);
    function checkGroups(nodes){for(const node of nodes)if(typeof node!=='string'){if(groupIds.has(node.id))throw new Error('Duplicate group ID');groupIds.add(node.id);checkGroups(node.children);}}
    checkGroups([...architecture.groups,...(instance.groups||[])]);
    const members=ids([...architecture.groups,...(instance.groups||[])]);
    if(new Set(members).size!==members.length||members.some(id=>!known.has(id)))throw new Error('Invalid group membership in '+instance.id);
    for(const link of [...architecture.links,...instance.links])if(!known.has(link[0])||!known.has(link[1]))throw new Error('Unknown connection endpoint');
    for(const pin of instance.pins)for(const target of pin.targets||[pin.target])if(target&&!known.has(target))throw new Error('Unknown pin target');
    if(new Set(instance.pins.map(pin=>pin.id)).size!==instance.pins.length)throw new Error('Duplicate package contact');
    for(const memory of Object.values({...(instance.ramPreview?{ram:instance.ramPreview}:{}),...instance.memoryPreviews})) {
      const peers=[memory.peer,...Object.values(memory.netPeers||{}).flatMap(v=>typeof v==='string'?[v]:Object.values(v))];
      if(peers.some(id=>!known.has(id)))throw new Error('Unknown memory peer');
    }
    entries.set(instance.id,Object.freeze({architecture,instance,keywords}));
  }
  register({architecture:window.ChipOpenboxM85Architecture,instance:window.ChipOpenboxGenericM85,keywords:'Arm Cortex M85 generic MCU'});
  register(window.ChipOpenboxC8051F500);
  window.ChipOpenboxUnitViews=Object.freeze({'functional':{attach:options=>window.ChipOpenboxUnitDiagram.attach(options)},'cmsdk-timer':{attach:options=>window.ChipOpenboxTimerView.attach(options)}});
  window.ChipOpenboxChipsets=Object.freeze({defaultId:'c8051f500',get:id=>entries.get(id),list:()=>[...entries.values()].map(({instance,keywords})=>({id:instance.id,label:instance.label,keywords}))});
})();
