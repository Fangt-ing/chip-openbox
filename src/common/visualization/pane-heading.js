'use strict';
(() => {
  // Components own controls and behavior. The host projects their checked state into
  // the same pane-heading type; switching layouts never resets the component.
  function connect({root,channel,description=()=>'',extra=()=>[],pageUrl=()=>null,onControl=()=>false}) {
    let pending=false;
    function snapshot() {
      const controls=[...extra()];
      for(const node of root.querySelectorAll('select[id],button[id]')) {
        if(node.matches('select'))controls.push({type:'select',id:node.id,label:node.getAttribute('aria-label')||node.id,
          value:node.value,disabled:node.disabled,title:node.title,options:[...node.options].map(o=>({value:o.value,label:o.textContent,disabled:o.disabled}))});
        else controls.push({type:'button',id:node.id,label:node.getAttribute('aria-label')||node.childNodes[0]?.textContent||node.id,
          text:node.dataset.workflow?node.childNodes[0].textContent.trim():node.textContent.trim(),
          title:node.title||node.querySelector('small')?.textContent||'',disabled:node.disabled,
          kind:node.closest('.zoom-controls')?'zoom':node.dataset.workflow?'workflow':'action',primary:node.classList.contains('primary')});
      }
      return {controls,description:description(),pageUrl:pageUrl()};
    }
    function publish(){channel.send('component:view',snapshot());}
    function queue(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;publish();});}
    root.addEventListener('change',queue);
    new MutationObserver(queue).observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['disabled','title']});
    channel.subscribe(message=>{
      if(message.type==='host:sync'||message.type==='host:state'){publish();return;}
      if(message.type!=='view:control')return;
      const {id,value}=message.payload;
      if(typeof id!=='string')return;
      if(onControl(id,value)){queue();return;}
      const node=[...root.querySelectorAll('select[id],button[id]')].find(node=>node.id===id);
      if(!node||node.disabled)return;
      if(node.matches('select')) {
        if(typeof value!=='string'||![...node.options].some(o=>o.value===value&&!o.disabled))return;
        node.value=value;node.dispatchEvent(new Event('change',{bubbles:true}));
      } else node.click();
      queue();
    });
    queue();return {publish};
  }
  function host({root,send}) {
    const panels=new Map();
    for(const section of root.querySelectorAll('[data-workspace]')) {
      const component=section.dataset.workspace,heading=section.querySelector('.pane-heading');
      panels.set(component,{heading,controls:heading.querySelector('.pane-controls'),items:new Map()});
    }
    function update(component,payload) {
      const panel=panels.get(component);
      if(!panel||!Array.isArray(payload.controls))return;
      const description=typeof payload.description==='string'?payload.description:'';
      panel.heading.querySelector('strong').title=description;
      if(payload.pageUrl){const url=new URL(payload.pageUrl,location.href);if(['file:','http:','https:'].includes(url.protocol)&&url.origin===location.origin)panel.heading.querySelector('.open-separately').href=url.href;}
      const valid=payload.controls.filter(c=>c&&typeof c.id==='string'&&['select','button','chipset','link'].includes(c.type));
      const live=new Set(valid.map(c=>c.id));
      for(const [id,item] of panel.items)if(!live.has(id)){item.node.remove();panel.items.delete(id);}
      for(const control of valid) {
        let item=panel.items.get(control.id);
        if(!item) {
          let node,field;
          if(control.type==='select') {
            node=document.createElement('label');node.className='pane-field';node.append(document.createTextNode(control.label+': '));
            field=document.createElement('select');field.id='host-'+component+'-'+control.id;field.setAttribute('aria-label',control.label);
            field.addEventListener('change',()=>send(component,'view:control',{id:control.id,value:field.value}));node.append(field);
          } else if(control.type==='button') {
            field=document.createElement('button');node=field;field.type='button';field.className='pane-action';
            field.id='host-'+component+'-'+control.id;
            field.addEventListener('click',()=>send(component,'view:control',{id:control.id}));
          } else if(control.type==='link') {
            field=document.createElement('a');node=field;field.className='pane-reference';
            field.id='host-'+component+'-'+control.id;field.target='_blank';field.rel='noopener';
          } else {
            node=document.createElement('div');node.className='chipset-picker';
            const inputId='host-'+component+'-'+control.id,listId=inputId+'-options';
            node.innerHTML='<div class="chipset-field"><input type="search" role="combobox" aria-label="Chipset" placeholder="Type to search" autocomplete="off" aria-autocomplete="list" aria-expanded="false"><button type="button" aria-label="Show chipsets">⌄</button></div><ul role="listbox" aria-label="Available chipset views" hidden></ul>';
            field=node.querySelector('input');field.id=inputId;field.setAttribute('aria-controls',listId);node.querySelector('ul').id=listId;
          }
          node.dataset.controlId=control.id;panel.controls.append(node);
          item={node,field,type:control.type};panel.items.set(control.id,item);
          if(control.type==='chipset')item.picker=window.ChipOpenboxChipsetSelector.attach({
            root:node,options:control.options,selected:control.value,onSelect:value=>send(component,'view:control',{id:control.id,value})
          });
        }
        if(control.type==='select') {
          const signature=JSON.stringify(control.options);
          if(signature!==item.signature) {
            item.field.replaceChildren(...control.options.map(o=>{
              const option=document.createElement('option');option.value=o.value;option.textContent=o.label;option.disabled=!!o.disabled;return option;
            }));item.signature=signature;
          }
          item.field.value=control.value;
        } else if(control.type==='button') {
          item.field.textContent=control.text;item.field.dataset.kind=control.kind;
          item.field.setAttribute('aria-label',control.label);item.field.classList.toggle('primary',!!control.primary);
        } else if(control.type==='link') {
          const url=new URL(control.href,location.href);
          if(!['https:','http:','file:'].includes(url.protocol)){item.node.hidden=true;continue;}
          item.node.hidden=false;item.field.href=url.href;item.field.textContent=control.label;
        } else item.picker.setSelected(control.value);
        item.field.disabled=!!control.disabled;item.field.title=control.title||control.label||'';
      }
    }
    return {update};
  }
  window.ChipOpenboxPaneHeading={connect,host};
})();
