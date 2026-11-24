'use strict';
(() => {
  if(window.self!==window.top)document.documentElement.classList.add('embedded');
  const registry=window.ChipOpenboxChipsets;
  const selected=registry.get(new URLSearchParams(location.search).get('chipset'))||registry.get(registry.defaultId);
  const {architecture,instance}=selected;
  const channel=window.ChipOpenboxChannel.connect('chip');
  const scene=window.ChipOpenboxBaseDiagram.attach({architecture,instance,channel});
  const options=registry.list();
  function selectChip(id) {
    if(id===instance.id||!registry.get(id))return;
    // Reload only this component to isolate diagram fixtures, observers and selection scopes.
    // Scripts, board and their working state remain in the parent workspace.
    const url=new URL(location.href);url.searchParams.set('chipset',id);location.replace(url.href);
  }
  window.ChipOpenboxCanvasZoom.attach({
    viewport:document.querySelector('.chip-canvas'),surface:document.querySelector('#chip-zoom-surface'),
    minus:document.querySelector('#zoom-out'),reset:document.querySelector('#zoom-reset'),
    plus:document.querySelector('#zoom-in'),onChange:scene.schedule
  });
  window.ChipOpenboxPorts.observe(channel,{'program-io':{selector:'#pin-program .pin-contact',side:'left'}});
  window.ChipOpenboxChipsetSelector.attach({root:document.querySelector('#chipset-picker'),options,selected:instance.id,onSelect:selectChip});
  window.ChipOpenboxPaneHeading.connect({root:document.querySelector('.chip-caption'),channel,pageUrl:()=>location.href,
    description:()=>instance.label+'. '+instance.scope+' '+document.querySelector('#chip-preview-status').textContent,
    extra:()=>[
      {type:'chipset',id:'chipset',label:'Chipset',value:instance.id,options}
    ],onControl:(id,value)=>{if(id!=='chipset')return false;selectChip(value);return true;}
  });
})();
