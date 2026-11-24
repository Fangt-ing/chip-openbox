'use strict';
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const overlap = (a,b,gap=0) => a.x < b.x+b.w+gap && a.x+a.w+gap > b.x && a.y < b.y+b.h+gap && a.y+a.h+gap > b.y;
  const union = rects => { const x=Math.min(...rects.map(r=>r.x)), y=Math.min(...rects.map(r=>r.y)); return {x,y,w:Math.max(...rects.map(r=>r.x+r.w))-x,h:Math.max(...rects.map(r=>r.y+r.h))-y}; };
  function attach({packageElement, svg, blocks, architecture, example, scene, root, onChange}) {
    const records=new Map(),groups=[],groupById=new Map(),memberships=new Map();
    const groupLayer=document.querySelector('#chip-group-outlines');
    const labelLayer=document.querySelector('#chip-group-labels');
    const processorInset=example.view.processorOffsetX||0;
    const finiteUnion=rects=>rects.length?union(rects):{x:40,y:90,w:100,h:40};
    function build(node,parent=root,ancestors=[]) {
      if(typeof node==='string') {
        memberships.set(node,ancestors);scene.objects.get('chip.'+node).setParent(parent);
        return {block:node,members:new Set([node])};
      }
      const element=document.createElementNS(NS,'g');
      element.id=node.id==='processor'?'processor-boundary':'group-'+node.id;
      element.setAttribute('class',node.id==='processor'?'processor-boundary':'architecture-group');
      element.dataset.group=node.id;element.setAttribute('role','group');element.setAttribute('aria-label',node.name);
      const shape=document.createElementNS(NS,'path');shape.setAttribute('class','group-shape');shape.setAttribute('fill-rule','evenodd');element.append(shape);groupLayer.append(element);
      const model=scene.add({id:'chip.group.'+node.id,role:'group',name:node.name,element,parent});
      window.ChipOpenboxDiagramObjects.unit(element,{id:model.id,name:node.name});
      const group={...node,model,node:element,shape,children:[],members:new Set(),bounds:null,anchor:null,preferredAnchor:null,preferredBounds:null,manualSize:null};
      group.children=node.children.map(child=>build(child,model,[...ancestors,node.id]));
      for(const child of group.children)for(const id of child.members)group.members.add(id);
      element.dataset.members=[...group.members].join(' ');
      element.setAttribute('aria-owns',group.children.map(child=>child.block?'block-'+child.block:(child.id==='processor'?'processor-boundary':'group-'+child.id)).join(' '));
      groups.push(group);groupById.set(group.id,group);return group;
    }
    const processor=build({id:'processor',name:architecture.label,note:architecture.hierarchyReference,children:architecture.groups});
    const processorIds=processor.members;
    for(const node of example.groups||[])build(node);
    const visible=r=>r.element.diagramNode.visible;
    const rect=r=>({x:r.x,y:r.y,w:r.element.hidden?(r.w||160):r.element.offsetWidth,h:r.element.hidden?(r.h||40):r.element.offsetHeight});
    const closed=()=>groups.filter(g=>g.model.visible&&!g.model.expanded&&g.bounds);
    function position(r){r.element.style.left=r.x+'px';r.element.style.top=r.y+'px';}
    function minimum(id){const levels=(memberships.get(id)||[]).length;return processorIds.has(id)?{x:processorInset+24+levels*18,y:28+levels*34}:{x:40,y:90};}
    function nearest(target,obstacles,min) {
      if(!obstacles.some(r=>overlap(target,r,10)))return target;
      const xs=[...new Set([target.x,...obstacles.flatMap(r=>[r.x-target.w-10,r.x+r.w+10])].map(x=>Math.max(min.x,x)))];
      const ys=[...new Set([target.y,...obstacles.flatMap(r=>[r.y-target.h-10,r.y+r.h+10])].map(y=>Math.max(min.y,y)))];
      let best=null,cost=Infinity;
      for(const x of xs)for(const y of ys){const score=(x-target.x)**2+(y-target.y)**2;if(score>=cost)continue;const candidate={...target,x,y};if(!obstacles.some(r=>overlap(candidate,r,9.9))){best=candidate;cost=score;}}
      return best||{...target,x:Math.max(min.x,...obstacles.map(r=>r.x+r.w+10))};
    }
    for(const [id,element]of blocks){
      const p=example.view.positions[id],record={id,element,x:p[0],y:p[1],home:{x:p[0],y:p[1]},w:0,h:0};records.set(id,record);
      element.dataset.groups=(memberships.get(id)||[]).join(' ');position(record);
      const model=element.diagramNode;
      Object.assign(model.view,{
        bounds:()=>rect(record),
        move:target=>{const min=minimum(id),obstacles=[...records.values()].filter(r=>r!==record&&visible(r)).map(rect).concat(closed().map(g=>g.bounds));const next=nearest({...rect(record),x:Math.max(min.x,target.x),y:Math.max(min.y,target.y)},obstacles,min);record.x=next.x;record.y=next.y;record.home={x:next.x,y:next.y};position(record);},
        resize:size=>{element.style.width=Math.max(210,size.w)+'px';element.style.height=Math.max(130,size.h)+'px';}
      });
      model.heading(element.querySelector('summary'),{native:true});model.resizeHandle(element);
      element.addEventListener('toggle',onChange);
    }
    function snapshot(g){
      return {starts:new Map([...g.members].map(id=>{const r=records.get(id);return[id,{x:r.x,y:r.y}];})),
        groups:new Map(groups.filter(child=>[...child.members].every(id=>g.members.has(id))).map(child=>[child,{...(child.bounds||{x:40,y:90})}])),
        origin:{...g.bounds},delta:{x:0,y:0}};
    }
    function moveGroup(g,target){
      const state=g.dragState||snapshot(g),desired={x:target.x-state.origin.x,y:target.y-state.origin.y};
      const minX=Math.max(...[...state.starts].map(([id,p])=>minimum(id).x-p.x));
      const minY=Math.max(...[...state.starts].map(([id,p])=>minimum(id).y-p.y));
      const wanted={x:Math.max(minX,desired.x),y:Math.max(minY,desired.y)};
      const members=[...g.members].map(id=>({...rect(records.get(id)),...state.starts.get(id)}));
      const outsiders=[...records.values()].filter(r=>visible(r)&&!g.members.has(r.id)).map(rect).concat(closed().filter(c=>c!==g&&![...c.members].every(id=>g.members.has(id))).map(c=>c.bounds));
      const zones=members.flatMap(r=>outsiders.map(o=>({left:o.x-r.x-r.w-10,right:o.x+o.w-r.x+10,top:o.y-r.y-r.h-10,bottom:o.y+o.h-r.y+10})));
      function sweep(start,end){const dx=end.x-start.x,dy=end.y-start.y;let fraction=1;for(const z of zones){let enter=-Infinity,exit=Infinity,miss=false;for(const[at,delta,lo,hi]of [[start.x,dx,z.left,z.right],[start.y,dy,z.top,z.bottom]]){if(Math.abs(delta)<1e-8){if(at<=lo||at>=hi){miss=true;break;}}else{const a=(lo-at)/delta,b=(hi-at)/delta;enter=Math.max(enter,Math.min(a,b));exit=Math.min(exit,Math.max(a,b));}}if(!miss&&enter<exit&&exit>0&&enter>=-1e-7&&enter<fraction)fraction=Math.max(0,enter-1e-6);}return{x:start.x+dx*fraction,y:start.y+dy*fraction};}
      const direct=sweep(state.delta,wanted),a=sweep(sweep(direct,{x:wanted.x,y:direct.y}),wanted),b=sweep(sweep(direct,{x:direct.x,y:wanted.y}),wanted);
      const distance=p=>(p.x-wanted.x)**2+(p.y-wanted.y)**2;const delta=distance(a)<distance(b)?a:b;state.delta=delta;
      for(const[id,start]of state.starts){const r=records.get(id);r.x=start.x+delta.x;r.y=start.y+delta.y;r.home={x:r.x,y:r.y};position(r);}
      for(const[child,start]of state.groups){
        const position={x:start.x+delta.x,y:start.y+delta.y};
        if(child.bounds)Object.assign(child.bounds,position);
        if(child.anchor)child.anchor=position;
        child.preferredAnchor=position;
      }
    }
    for(const g of groups){
      const header=document.createElement('div');header.className='diagram-group-heading group-drag-handle';header.id='group-label-'+g.id;header.dataset.group=g.id;
      const name=document.createElement('span');name.textContent=g.name;header.append(name);packageElement.append(header);g.header=header;
      const grip=document.createElement('div');grip.className='diagram-group-resize';packageElement.append(grip);g.grip=grip;
      Object.assign(g.model.view,{
        bounds:()=>g.bounds||{x:40,y:90,w:200,h:40},
        expanded:value=>{if(!value){const b=g.preferredBounds||g.bounds;if(b)g.preferredAnchor={x:b.x,y:b.y};}else g.anchor=null;},
        visibility:shown=>{header.hidden=!shown;grip.hidden=!shown||!g.model.expanded;},
        start:action=>{if(action==='move')g.dragState=snapshot(g);},
        end:()=>{g.dragState=null;},move:target=>moveGroup(g,target),
        resize:size=>{g.manualSize={w:Math.max(140,size.w),h:Math.max(55,size.h)};},
        contentChanged:()=>{g.manualSize=null;},resetChildren:()=>resetChildren(g.model)
      });
      g.model.heading(header);g.model.bindGesture(g.shape,'move');g.model.resizeHandle(grip);
    }
    const groupOf=model=>groups.find(g=>g.model===model);
    const inside=(node,parent)=>{for(let n=node;n;n=n.parent)if(n===parent)return true;return false;};
    function resetChildren(model){
      for(const child of groups)if(inside(child.model,model))child.manualSize=null;
      if(model===root)packageSize=null;
    }
    function preferred(model){
      const g=groupOf(model);return g?(g.preferredBounds||g.bounds):records.get(model.element.id.slice(6)).home;
    }
    function modelBounds(model){const g=groupOf(model);return g?g.bounds:rect(records.get(model.element.id.slice(6)));}
    function shiftModel(model,dx,dy){
      if(Math.abs(dx)+Math.abs(dy)<.001)return;
      const g=groupOf(model),members=g?g.members:[model.element.id.slice(6)];
      for(const id of members){const r=records.get(id);r.x+=dx;r.y+=dy;position(r);}
      if(g)for(const child of groups)if(inside(child.model,model)){
        if(child.bounds){child.bounds.x+=dx;child.bounds.y+=dy;}
        if(child.anchor){child.anchor.x+=dx;child.anchor.y+=dy;}
      }
    }
    function separate(model){
      if(!model.expanded||!model.visible)return;
      const children=[...model.children].filter(n=>n.visible&&(n.role==='group'||n.role==='block'));
      for(const child of children)if(child.role==='group')separate(child);
      bounds();
      const selected=scene.activeGesture?.node;
      const rank=n=>selected&&inside(selected,n)?0:1;
      children.sort((a,b)=>rank(a)-rank(b)||(model===root?(preferred(a).x-preferred(b).x||preferred(a).y-preferred(b).y):(preferred(a).y-preferred(b).y||preferred(a).x-preferred(b).x)));
      const placed=[];
      for(const child of children){
        const start={...modelBounds(child)},target={...start};let attempts=0;
        while(attempts++<children.length*4){
          const hits=placed.filter(p=>overlap(target,p.rect,16));if(!hits.length)break;
          const hit=hits[0],a=preferred(child),b=preferred(hit.node);
          // Keep MCU source columns left-to-right, and stack regions sharing a column.
          // The choice depends on intended positions, not current expanded dimensions.
          const across=model===root?Math.abs(a.x-b.x)>48:Math.abs(a.x-b.x)>=Math.abs(a.y-b.y);
          if(across)target.x=Math.max(...hits.map(p=>p.rect.x+p.rect.w))+16;
          else target.y=Math.max(...hits.map(p=>p.rect.y+p.rect.h))+16;
        }
        if(placed.some(p=>overlap(target,p.rect,16)))target.x=Math.max(...placed.map(p=>p.rect.x+p.rect.w))+16;
        shiftModel(child,target.x-start.x,target.y-start.y);placed.push({node:child,rect:target});
      }
      bounds();
    }
    function bounds(){
      for(const g of groups){
        if(!g.model.visible)continue;
        const width=Math.max(145,g.header.offsetWidth+20);
        if(!g.model.expanded){const anchor=g.anchor||g.bounds||finiteUnion([...g.members].map(id=>rect(records.get(id))));g.bounds={x:anchor.x,y:anchor.y,w:width,h:42};continue;}
        const boxes=g.children.map(child=>child.block?rect(records.get(child.block)):child.bounds).filter(Boolean),b=finiteUnion(boxes),pad=g.id==='processor'?24:16,top=g.id==='processor'?38:34;
        g.bounds={x:b.x-pad,y:b.y-top,w:Math.max(width,b.w+pad*2,g.manualSize?.w||0),h:Math.max(b.h+top+pad,g.manualSize?.h||0)};
      }
    }
    let packageSize=null;
    Object.assign(root.view,{
      bounds:()=>({x:parseFloat(packageElement.style.left)||0,y:parseFloat(packageElement.style.top)||0,w:packageElement.offsetWidth,h:packageElement.offsetHeight}),
      move:p=>{packageElement.style.left=Math.max(0,p.x)+'px';packageElement.style.top=Math.max(0,p.y)+'px';},
      resize:size=>{packageSize={w:size.w,h:size.h};},
      contentChanged:()=>{packageSize=null;},resetChildren:()=>resetChildren(root)
    });
    root.heading(document.querySelector('.package-label'));root.resizeHandle(packageElement);
    function update(){
      // Reflow from intended locations, never yesterday's collision displacements.
      // A manual move updates home; automatic separation only updates displayed positions.
      for(const r of records.values()){
        if(visible(r)){
          const w=r.element.offsetWidth,h=r.element.offsetHeight;
          if(r.w&&(r.w!==w||r.h!==h))r.element.diagramNode.layoutChanged();
          r.w=w;r.h=h;
        }
        r.x=r.home.x;r.y=r.home.y;position(r);
      }
      for(const g of groups)if(!g.model.expanded)g.anchor=g.preferredAnchor?{...g.preferredAnchor}:null;
      bounds();
      for(const g of groups)if(g.model.visible){
        g.preferredBounds={...g.bounds};
        if(!g.preferredAnchor)g.preferredAnchor={x:g.bounds.x,y:g.bounds.y};
      }
      separate(root);bounds();
      const all=[...records.values()].filter(visible).map(rect).concat(closed().map(g=>g.bounds));
      for(const g of groups){
        if(!g.model.visible)continue;
        const r=g.bounds;g.shape.setAttribute('d','M '+r.x+' '+r.y+' H '+(r.x+r.w)+' V '+(r.y+r.h)+' H '+r.x+' Z');
        const label={x:g.bounds.x+8,y:g.bounds.y+5};
        g.header.style.left=label.x+'px';g.header.style.top=label.y+'px';g.grip.style.left=(g.bounds.x+g.bounds.w)+'px';g.grip.style.top=(g.bounds.y+g.bounds.h)+'px';
      }
      const extents=finiteUnion([...all,...groups.filter(g=>g.model.visible&&g.bounds).map(g=>g.bounds)]);
      const pinBottom=Math.max(180,...example.pins.map(p=>116+p.offset*48+(p.side==='right'?70:0)+40));
      const w=root.expanded?Math.max(240,extents.x+extents.w+45,packageSize?.w||0):Math.max(160,document.querySelector('.package-label').offsetWidth+45);
      const h=root.expanded?Math.max(pinBottom,extents.y+extents.h+45,packageSize?.h||0):pinBottom;
      if(packageElement.style.width!==w+'px')packageElement.style.width=w+'px';if(packageElement.style.height!==h+'px')packageElement.style.height=h+'px';
    }
    function display(owner){
      const model=owner.startsWith('domain:')?groupById.get(owner.slice(7))?.model:scene.objects.get('chip.'+owner);
      if(!model)return null;const representative=model.representative();
      const g=groups.find(g=>g.model===representative);
      return {id:representative.id,element:g?g.shape:representative.element,model:representative};
    }
    scene.changed();
    return {update,display,same:(a,b)=>{const x=display(a),y=display(b);return x&&y&&x.id===y.id;}};
  }
  window.ChipOpenboxArchitectureLayout={attach};
})();
