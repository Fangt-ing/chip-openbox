'use strict';
(() => {
  const NS='http://www.w3.org/2000/svg';
  function attach({svg,group,blocks,viewport,port=()=>null,display=()=>null}) {
    let slots=new Map(),records=[],obstacles=[];
    const objects=window.ChipOpenboxDiagramObjects.wires({svg,id:'chip-connections'});
    function element(owner) {
      const shown=display(owner);if(shown)return shown.element;
      if(owner.startsWith('domain:'))return document.querySelector((owner==='domain:processor'?'#processor-boundary':'#group-'+owner.slice(7))+' .group-shape');
      return display(owner)?.element||blocks.get(owner);
    }
    function begin() {
      objects.begin();
      slots=new Map();records=[];
      const inverse=svg.getScreenCTM().inverse();
      const representatives=new Map([...blocks].map(([id,e])=>{const shown=display(id);return [shown?.id||id,shown?.element||e];}));
      obstacles=[...representatives].map(([id,e])=>{const r=e.getBoundingClientRect(),a=new DOMPoint(r.left,r.top).matrixTransform(inverse),b=new DOMPoint(r.right,r.bottom).matrixTransform(inverse);return {owner:id,x:a.x-3,y:a.y-3,w:b.x-a.x+6,h:b.y-a.y+6};});
    }
    function reserve(owner,side,key) {
      const id=(display(owner)?.id||owner)+'|'+side;
      if(!slots.has(id))slots.set(id,[]);
      if(!slots.get(id).includes(key))slots.get(id).push(key);
    }
    function side(owner,key,fallback){return port(owner,key)?.side||fallback;}
    function point(owner,side,key) {
      const anchor=port(owner,key);
      if(anchor){const r=anchor.element.getBoundingClientRect();return new DOMPoint(r.left+r.width/2,r.top+r.height/2).matrixTransform(svg.getScreenCTM().inverse());}
      const target=element(owner),bounds=target.getBoundingClientRect();
      const shown=display(owner);const header=(!shown||shown.model.role==='block')&&blocks.has(owner)?target.querySelector('summary').getBoundingClientRect():bounds;
      const list=(slots.get((shown?.id||owner)+'|'+side)||[]).slice().sort(),index=list.indexOf(key);
      const fraction=index<0?.5:.08+.84*(index+.5)/list.length;
      const x=side==='left'?bounds.left:side==='right'?bounds.right:bounds.left+bounds.width*fraction;
      const y=side==='top'?bounds.top:side==='bottom'?bounds.bottom:header.top+header.height*fraction;
      return new DOMPoint(x,y).matrixTransform(svg.getScreenCTM().inverse());
    }
    function sides(a,b) {
      const visible=e=>e.closest('[data-diagram-role]')?.diagramNode?.representative().element||e;
      const ar=visible(a).getBoundingClientRect(),br=visible(b).getBoundingClientRect();
      const dx=(br.left+br.right-ar.left-ar.right)/2,dy=(br.top+br.bottom-ar.top-ar.bottom)/2;
      return dy>Math.abs(dx)?['bottom','top']:['right','left'];
    }
    function route(a,aSide,b,bSide,aOwner,bOwner){return window.ChipOpenboxOrthogonalRouting.route(a,aSide,b,bSide,display(aOwner)?.id||aOwner,display(bOwner)?.id||bOwner,obstacles);}
    function wire(path,key,from,to) {
      path.dataset.connectionId=key;
      records.push({path,key,from,to});
      return path;
    }
    function finish() {
      const ownerName=owner=>{
        if(owner.startsWith('pin:'))return document.querySelector('#pin-'+owner.slice(4))?.textContent||owner;
        if(owner.startsWith('interface:'))return document.querySelector('#interface-'+owner.slice(10))?.textContent||owner;
        if(owner.startsWith('domain:'))return document.querySelector('[data-group="'+owner.slice(7)+'"]')?.getAttribute('aria-label')||owner.slice(7);
        return blocks.get(owner)?.querySelector('summary').textContent||owner;
      };
      for(const {path,key,from,to} of records) {
        const node=document.createElementNS(NS,'g');node.classList.add('chip-connection');
        const label=path.querySelector('title')?.textContent||'Connection';
        const both=path.classList.contains('bidirectional');
        const description=label+' · '+ownerName(from.owner)+(both?' ↔ ':' → ')+ownerName(to.owner);
        const contacts=[];
        for(const [end,endpoint] of [['from',from],['to',to]]) {
          const at=path.getPointAtLength(end==='from'?0:path.getTotalLength()),dot=document.createElementNS(NS,'circle');
          for(const [k,v] of Object.entries({cx:at.x,cy:at.y,r:1.7,class:'chip-connection-point'}))dot.setAttribute(k,v);
          dot.dataset.connectionId=key;dot.dataset.endpoint=end;dot.dataset.displayOwner=display(endpoint.owner)?.id||endpoint.owner;dot.dataset.side=endpoint.side;
          dot.dataset.flow=both?'bidirectional':end==='from'?'output':'input';
          window.ChipOpenboxDiagramObjects.port(dot,{id:key+':'+end,owner:endpoint.owner,direction:dot.dataset.flow,name:endpoint.name||label});
          if(endpoint.name){dot.dataset.portName=endpoint.name;const title=document.createElementNS(NS,'title');title.textContent=ownerName(endpoint.owner)+' · '+endpoint.name;dot.append(title);}
          contacts.push(dot);
        }
        path.querySelector('title').textContent=description;
        path.replaceWith(node);node.append(path,...contacts);
        const net=path.dataset.diagramNet||(path.dataset.memoryId?'chip.'+path.dataset.memoryId+'.'+path.dataset.net:null);
        objects.add(path,{id:key,net,label:description,ports:contacts,wrapper:node,hitClass:'chip-wire-hit',both});
      }
      objects.finish();
    }
    return {begin,reserve,point,side,sides,route,wire,finish};
  }
  window.ChipOpenboxConnections={attach};
})();
