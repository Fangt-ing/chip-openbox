'use strict';
(() => {
  function attach({root,options,selected,onSelect}) {
    const input=root.querySelector('[role="combobox"]'),button=root.querySelector('button');
    const list=root.querySelector('[role="listbox"]');
    let chosen=options.find(item=>item.id===selected)||options[0],matches=[],active=-1;
    input.value=chosen.label;
    function close(restore=true) {
      list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');
      if(restore)input.value=chosen.label;
    }
    function paint() {
      [...list.querySelectorAll('[role="option"]')].forEach((node,i)=>{
        node.classList.toggle('is-active',i===active);
        node.setAttribute('aria-selected',String(matches[i].id===chosen.id));
      });
      if(active>=0)input.setAttribute('aria-activedescendant',list.querySelectorAll('[role="option"]')[active].id);
      else input.removeAttribute('aria-activedescendant');
    }
    function choose(item) {
      chosen=item;close();onSelect(item.id);input.focus({preventScroll:true});close();
    }
    function position() {
      if(list.hidden)return;
      const r=input.getBoundingClientRect(),width=Math.max(r.width,230);
      list.style.position='fixed';list.style.left=Math.max(8,Math.min(r.left,innerWidth-width-8))+'px';
      list.style.top=(r.bottom+4)+'px';list.style.width=Math.min(width,innerWidth-16)+'px';list.style.right='auto';list.style.margin='0';list.style.zIndex='30';
    }
    function open(all=false) {
      const query=all?'':input.value.trim().toLocaleLowerCase();
      matches=options.filter(item=>(item.label+' '+(item.keywords||'')).toLocaleLowerCase().includes(query));
      list.replaceChildren();active=matches.length?0:-1;
      for(const item of matches) {
        const node=document.createElement('li');node.id='chipset-option-'+item.id;node.setAttribute('role','option');
        node.textContent=item.label;
        node.addEventListener('pointerdown',e=>e.preventDefault());
        node.addEventListener('click',()=>choose(item));
        list.append(node);
      }
      if(!matches.length){const node=document.createElement('li');node.className='chipset-empty';node.textContent='No matching chipsets';node.setAttribute('role','status');list.append(node);}
      list.hidden=false;input.setAttribute('aria-expanded','true');paint();position();
    }
    input.addEventListener('focus',()=>{input.select();open(true);});
    input.addEventListener('input',()=>open());
    input.addEventListener('keydown',e=>{
      if(e.key==='Escape'){e.preventDefault();close();return;}
      if(e.key==='Tab'){close();return;}
      if(e.key==='ArrowDown'||e.key==='ArrowUp') {
        e.preventDefault();
        if(list.hidden){open(true);return;}
        if(matches.length){active=(active+(e.key==='ArrowDown'?1:-1)+matches.length)%matches.length;paint();}
      } else if(e.key==='Enter'&&!list.hidden) {
        e.preventDefault();if(matches[active])choose(matches[active]);
      }
    });
    button.addEventListener('pointerdown',e=>e.preventDefault());
    button.addEventListener('click',()=>{
      const wasOpen=!list.hidden;input.focus({preventScroll:true});
      if(wasOpen)close();else open(true);
    });
    document.addEventListener('pointerdown',e=>{if(!root.contains(e.target))close();});
    root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))close();});
    window.addEventListener('resize',position);
    document.addEventListener('scroll',position,true);
    onSelect(chosen.id);
    return {setSelected(id){const item=options.find(item=>item.id===id);if(!item)return;chosen=item;if(list.hidden)input.value=item.label;else paint();}};
  }
  window.ChipOpenboxChipsetSelector={attach};
})();
