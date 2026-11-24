'use strict';
// One compact, movable symbol implementation for every internal functional diagram.
(() => {
 const NS='http://www.w3.org/2000/svg',opposite={left:'right',right:'left',top:'bottom',bottom:'top'};
 function attach({container,card,definition,onChange=()=>{}}) {
  const diagram={...definition.diagram},prefix='chip.'+definition.id;
  if(!diagram)throw new Error('Missing functional diagram: '+definition.id);
  card.classList.add('functional-window');card.style.setProperty('--detail-width',(diagram.width+20)+'px');card.style.setProperty('--detail-height',(diagram.height+72)+'px');
  const root=document.createElement('section');root.className='functional-view';container.append(root);
  const svg=document.createElementNS(NS,'svg');svg.classList.add('functional-diagram');svg.setAttribute('viewBox','0 0 '+diagram.width+' '+diagram.height);svg.setAttribute('role','group');svg.setAttribute('aria-label',definition.fullName+' · internal functional diagram');root.append(svg);
  const objects=window.ChipOpenboxDiagramObjects.wires({svg,id:prefix+'.detail'}),terminals=new Map(),boundary=new Map(),records=new Map(),routes=[],junctions=new Map();let fitted=false,compacted=false,signature='';
  function node(tag,attrs={},value,parent=svg){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));if(value!==undefined)e.textContent=value;parent.append(e);return e;}
  const defs=node('defs'),markerId=definition.id+'-detail-arrow';const marker=node('marker',{id:markerId,markerWidth:5,markerHeight:5,refX:4,refY:2.5,orient:'auto-start-reverse'},undefined,defs);node('path',{d:'M0 0 L5 2.5 L0 5 Z',fill:'context-stroke'},undefined,marker);
  const wireLayer=node('g',{class:'functional-wires'}),junctionLayer=node('g',{class:'functional-junctions'}),unitLayer=node('g',{class:'functional-units'}),edgeLayer=node('g',{class:'functional-edges'});
  function terminal(parent,key,owner,spec){const element=node('circle',{r:2.1,class:'functional-port','data-port':spec.id,'data-side':spec.side},undefined,parent);window.ChipOpenboxDiagramObjects.port(element,{id:prefix+'.'+key,owner,direction:spec.direction,name:spec.name||spec.id});node('title',{},spec.name||spec.id,element);const item={...spec,element,x:0,y:0,owner};terminals.set(key,item);return item;}
  function place(r){
   const {x,y,w,h}=r,bevel=r.muxMetrics?.bevel||Math.min(8,h/4);
   if(r.spec.shape==='mux')r.shape.setAttribute('d','M'+x+' '+y+' L'+(x+w)+' '+(y+bevel)+' V'+(y+h-bevel)+' L'+x+' '+(y+h)+' Z');
   else if(r.spec.shape==='and')r.shape.setAttribute('d','M'+x+' '+y+' H'+(x+w/2)+' A'+w/2+' '+h/2+' 0 0 1 '+(x+w/2)+' '+(y+h)+' H'+x+' Z');
   else for(const[k,v]of Object.entries({x,y,width:w,height:h}))r.shape.setAttribute(k,v);
   if(r.spec.shape==='mux') {
    r.label.setAttribute('x',x+w/2);r.label.setAttribute('y',y-6);
    for(let i=0;i<r.captions.length;i++) {
     const row=r.muxMetrics?.rows[i];
     r.captions[i].setAttribute('x',row?x+r.muxMetrics.paddingX:x+r.spec.captions[i].x/r.spec.w*w);
     r.captions[i].setAttribute('y',row?y+r.muxMetrics.paddingY+r.muxMetrics.rowHeight/2+i*(r.muxMetrics.rowHeight+r.muxMetrics.gap)-row.height/2-row.offset:y+r.spec.captions[i].y/r.spec.h*h);
    }
   }
   else if(r.metrics){let cursor=y+(h-r.metrics.h)/2+r.metrics.paddingY;for(const row of r.metrics.rows){row.element.setAttribute('x',x+w/2);row.element.setAttribute('y',cursor-row.offset);cursor+=row.height+r.metrics.gap;}}
   else {r.label.setAttribute('x',x+w/2);r.label.setAttribute('y',y+13);if(r.value){r.value.setAttribute('x',x+w/2);r.value.setAttribute('y',y+27);}}
   for(const item of r.ports){const at=item.at??.5;item.x=item.side==='left'?x:item.side==='right'?x+w:x+w*at;item.y=item.side==='top'?y+(r.spec.shape==='mux'?bevel*at:0):item.side==='bottom'?y+h-(r.spec.shape==='mux'?bevel*at:0):y+h*at;item.element.setAttribute('cx',item.x);item.element.setAttribute('cy',item.y);}
   r.group.dataset.x=x;r.group.dataset.y=y;r.group.dataset.width=w;r.group.dataset.height=h;
  }
  function overlaps(a,b,gap=7){return a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;}
  function move(r,target){
   const others=[...records.values()].filter(o=>o!==r);let best={...target,w:r.w,h:r.h};best.x=Math.max(20,best.x);best.y=Math.max(r.spec.shape==='mux'?28:20,best.y);
   if(others.some(o=>overlaps(best,o))){const xs=[best.x,...others.flatMap(o=>[o.x-r.w-8,o.x+o.w+8])],ys=[best.y,...others.flatMap(o=>[o.y-r.h-8,o.y+o.h+8])];let score=Infinity,candidate=null;for(const x of xs)for(const y of ys){if(x<20||y<28)continue;const box={x,y,w:r.w,h:r.h},cost=(x-best.x)**2+(y-best.y)**2;if(cost<score&&!others.some(o=>overlaps(box,o))){candidate=box;score=cost;}}if(!candidate)return;best=candidate;}
   r.x=best.x;r.y=best.y;place(r);signature='';updateEdges();onChange();
  }
  for(const spec of diagram.units){const group=node('g',{class:'functional-unit','data-unit':spec.id},undefined,unitLayer),shape=node(spec.shape==='mux'||spec.shape==='and'?'path':'rect',{rx:2},undefined,group),label=node('text',{x:0,y:0,class:'functional-name'},spec.name,group);window.ChipOpenboxDiagramObjects.unit(group,{id:prefix+'.'+spec.id,name:spec.fullName||spec.name,reference:spec.reference||diagram.reference,label});node('title',{},(spec.description||spec.name)+'. Drag the box body to move.',group);const value=spec.value?node('text',{x:0,y:0,class:'functional-value'},spec.value,group):null;const r={spec,group,shape,label,value,ports:[],captions:[],x:spec.x,y:spec.y,w:spec.w,h:spec.h};for(const c of spec.captions||[])r.captions.push(node('text',{class:'functional-caption'},c.text,group));for(const port of spec.ports||[])r.ports.push(terminal(group,spec.id+'.'+port.id,spec.id,port));records.set(spec.id,r);place(r);const scene=window.ChipOpenboxDiagram;const model=scene.add({id:prefix+'.'+spec.id,role:'box',name:spec.name,element:group,parent:scene.objects.get(prefix)});model.view={bounds:()=>({x:r.x,y:r.y,w:r.w,h:r.h}),point:e=>new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse()),move:target=>move(r,target)};model.bindGesture(group,'move');}
  for(const spec of diagram.ports){const item=terminal(edgeLayer,'boundary.'+spec.id,'boundary:'+spec.id,spec);item.boundary=true;item.x=spec.side==='left'?0:diagram.width;item.y=spec.y;item.element.setAttribute('cx',item.x);item.element.setAttribute('cy',item.y);item.label=node('text',{x:item.x+(spec.side==='left'?8:-8),y:item.y-8,class:'functional-boundary-label','text-anchor':spec.side==='left'?'start':'end'},spec.label,edgeLayer);boundary.set(spec.id,item);}
  const annotations=(diagram.labels||[]).map(label=>node('text',{x:label.x,y:label.y,class:'functional-note','text-anchor':label.anchor||'start'},label.text,unitLayer));
  function blocked(a,b,rect){return Math.abs(a.y-b.y)<.01?a.y>rect.y+.01&&a.y<rect.y+rect.h-.01&&Math.max(a.x,b.x)>rect.x+.01&&Math.min(a.x,b.x)<rect.x+rect.w-.01:a.x>rect.x+.01&&a.x<rect.x+rect.w-.01&&Math.max(a.y,b.y)>rect.y+.01&&Math.min(a.y,b.y)<rect.y+rect.h-.01;}
  function side(p){return p.boundary?opposite[p.side]:p.side;}
  function points(d){return[...d.matchAll(/[ML]\s*([-\d.e+]+)[ ,]+([-\d.e+]+)/gi)].map(m=>({x:+m[1],y:+m[2]}));}
  function drawRoute(route){const a=terminals.get(route.spec.from),b=terminals.get(route.spec.to),raw=[a,...(route.spec.via||[]).map(([x,y])=>({x,y})),b],preferred=[raw[0]];
   for(let i=1;i<raw.length;i++){const last=preferred.at(-1),next=raw[i];if(Math.abs(last.x-next.x)>.001&&Math.abs(last.y-next.y)>.001)preferred.push(i===raw.length-1&&['left','right'].includes(next.side)?{x:last.x,y:next.y}:{x:next.x,y:last.y});preferred.push(next);}
   const clean=[];
   for(const point of preferred){
    if(clean.length&&Math.hypot(point.x-clean.at(-1).x,point.y-clean.at(-1).y)<.001)continue;
    while(clean.length>1){const a=clean.at(-2),b=clean.at(-1);if((Math.abs(a.x-b.x)<.001&&Math.abs(b.x-point.x)<.001)||(Math.abs(a.y-b.y)<.001&&Math.abs(b.y-point.y)<.001))clean.pop();else break;}
    clean.push(point);
   }
   const normals={left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]};
   const normal=(p,q,s)=>{const[dX,dY]=normals[s];return dX?(q.x-p.x)*dX>0&&Math.abs(q.y-p.y)<.01:(q.y-p.y)*dY>0&&Math.abs(q.x-p.x)<.01;};
   const usable=!compacted&&route.spec.via&&clean.length>1&&normal(clean[0],clean[1],side(a))&&normal(clean.at(-1),clean.at(-2),side(b))&&!clean.slice(1).some((p,i)=>[...records.values()].some(r=>blocked(clean[i],p,r)));
   const obstacles=[...records.values()].map(r=>({owner:r.spec.id,x:r.x-1,y:r.y-1,w:r.w+2,h:r.h+2}));
   const d=usable?'M '+clean.map(p=>p.x+' '+p.y).join(' L '):window.ChipOpenboxOrthogonalRouting.route(a,side(a),b,side(b),a.owner,b.owner,obstacles);
   route.path.setAttribute('d',d);route.points=points(d);objects.update(route.path);
  }
  objects.begin();
  for(const spec of diagram.wires){if(!terminals.has(spec.from)||!terminals.has(spec.to))throw new Error('Unknown functional terminal in '+spec.id);const path=node('path',{class:'functional-wire '+(spec.kind||''),'marker-end':'url(#'+markerId+')'},undefined,wireLayer);if(spec.both)path.setAttribute('marker-start','url(#'+markerId+')');const route={spec,path,net:spec.net||prefix+'.'+spec.id};routes.push(route);node('title',{},spec.label,path);drawRoute(route);objects.add(path,{id:spec.id,net:route.net,label:spec.label,ports:[terminals.get(spec.from).element,terminals.get(spec.to).element],both:spec.both,decorations:()=>junctions.get(route.net)||[]});}
  function updateJunctions(){junctionLayer.replaceChildren();junctions.clear();const nets=new Map();for(const route of routes){if(!nets.has(route.net))nets.set(route.net,[]);const parts=nets.get(route.net);for(let i=1;i<route.points.length;i++)parts.push([route.points[i-1],route.points[i]]);}
   for(const[net,segments]of nets){const candidates=new Map(),key=p=>p.x.toFixed(3)+','+p.y.toFixed(3),add=p=>candidates.set(key(p),p);for(const[a,b]of segments){add(a);add(b);}for(const[a,b]of segments)for(const[c,d]of segments){if(Math.abs(a.y-b.y)>.01||Math.abs(c.x-d.x)>.01)continue;const q={x:c.x,y:a.y};if(q.x>=Math.min(a.x,b.x)&&q.x<=Math.max(a.x,b.x)&&q.y>=Math.min(c.y,d.y)&&q.y<=Math.max(c.y,d.y))add(q);}
    const dots=[];for(const point of candidates.values()){if([...terminals.values()].some(p=>Math.hypot(p.x-point.x,p.y-point.y)<2))continue;const dirs=new Set();for(const[a,b]of segments){if(Math.abs(a.y-b.y)<.01&&Math.abs(a.y-point.y)<.02&&point.x>=Math.min(a.x,b.x)-.01&&point.x<=Math.max(a.x,b.x)+.01){if(Math.min(a.x,b.x)<point.x-.02)dirs.add('l');if(Math.max(a.x,b.x)>point.x+.02)dirs.add('r');}if(Math.abs(a.x-b.x)<.01&&Math.abs(a.x-point.x)<.02&&point.y>=Math.min(a.y,b.y)-.01&&point.y<=Math.max(a.y,b.y)+.01){if(Math.min(a.y,b.y)<point.y-.02)dirs.add('u');if(Math.max(a.y,b.y)>point.y+.02)dirs.add('d');}}
     if(dirs.size<3)continue;const dot=node('circle',{cx:point.x,cy:point.y,r:1.6,class:'functional-junction'},undefined,junctionLayer);window.ChipOpenboxDiagramObjects.object(dot,{type:'junction',id:net+'.junction.'+key(point)});dots.push(dot);}junctions.set(net,dots);}
  }
  const footer=document.createElement('div');footer.className='functional-reference';const link=document.createElement('a');link.textContent=diagram.reference.section;link.href=window.ChipOpenboxSourceDocuments.resolve(diagram.reference).href;link.target='_blank';link.rel='noopener';const note=document.createElement('span');note.textContent=diagram.note;footer.append(link,note);container.append(footer);
  function fitFrame(){
   const footprints=[...records.values()].map(r=>{
    const extra=r.spec.shape==='mux'?Math.max(0,(r.label.getBBox().width-r.w)/2):0,above=r.spec.shape==='mux'?22:0;
    return{x:r.x-extra,y:r.y-above,w:r.w+extra*2,h:r.h+above};
   });
   const left=[...boundary.values()].filter(p=>p.side==='left'),right=[...boundary.values()].filter(p=>p.side==='right');
   const rightMargin=Math.max(36,...right.map(p=>p.label.getBBox().width+18));
   diagram.width=Math.ceil(Math.max(240,...footprints.map(r=>r.x+r.w+rightMargin)));
   diagram.height=Math.ceil(Math.max(100,Math.max(left.length,right.length)*18+36,...footprints.map(r=>r.y+r.h+24+(annotations.length?20:0))));
   for(const ports of [left,right]){
    const desired=p=>{const connected=routes.filter(route=>route.spec.from==='boundary.'+p.id||route.spec.to==='boundary.'+p.id).map(route=>terminals.get(route.spec.from==='boundary.'+p.id?route.spec.to:route.spec.from));return connected.length?connected.reduce((v,t)=>v+t.y,0)/connected.length:24;};
    const sorted=ports.map(p=>({p,y:desired(p)})).sort((a,b)=>a.y-b.y);let previous=0;
    sorted.forEach(({p,y},i)=>{p.y=Math.max(previous+18,Math.min(y,diagram.height-18-(sorted.length-i-1)*18));p.element.setAttribute('cy',p.y);p.label.setAttribute('y',p.y-6);previous=p.y;});
   }
   annotations.forEach((label,i)=>{label.setAttribute('x',i?diagram.width-12:12);label.setAttribute('y',diagram.height-8);label.setAttribute('text-anchor',i?'end':'start');});
   svg.setAttribute('viewBox','0 0 '+diagram.width+' '+diagram.height);
   card.style.setProperty('--detail-width',(diagram.width+2)+'px');
   card.style.setProperty('--detail-height',(diagram.height+footer.offsetHeight+42)+'px');
   signature='';
  }
  card.diagramNode.view.contentChanged=()=>{
   if(!fitted)return;
   card.style.removeProperty('width');card.style.removeProperty('height');
   fitFrame();updateEdges();
  };
  function compactLayout(){
   // Compress unused space; keep source row/order relationships and real text/port sizes.
   const footprints=[...records.values()].map(r=>{
    const label=r.label.getBBox(),extra=r.spec.shape==='mux'?Math.max(0,(label.width-r.w)/2):0,above=r.spec.shape==='mux'?22:0;
    return{r,x:r.x-extra,y:r.y-above,w:r.w+extra*2,h:r.h+above,offsetX:extra,offsetY:above};
   });
   const left=[...boundary.values()].filter(p=>p.side==='left');
   const leftMargin=Math.max(36,...left.map(p=>p.label.getBBox().width+18)),minX=Math.min(...footprints.map(r=>r.x)),minY=Math.min(...footprints.map(r=>r.y));
   const placedX=[];
   for(const item of [...footprints].sort((a,b)=>a.x-b.x)){
    item.newX=leftMargin+(item.x-minX)*.52;
    for(const prev of placedX)if(item.y<prev.y+prev.h+1&&item.y+item.h+1>prev.y&&prev.x+prev.w<=item.x+1)item.newX=Math.max(item.newX,prev.newX+prev.w+22);
    placedX.push(item);
   }
   const placedY=[];
   for(const item of [...footprints].sort((a,b)=>a.y-b.y)){
    item.newY=24+(item.y-minY)*.55;
    for(const prev of placedY)if(item.newX<prev.newX+prev.w+8&&item.newX+item.w+8>prev.newX&&prev.y+prev.h<=item.y+1)item.newY=Math.max(item.newY,prev.newY+prev.h+18);
    placedY.push(item);
   }
   // Resolve any residual cross-row collision without changing horizontal source order.
   for(let i=0;i<placedY.length;i++)for(let j=0;j<i;j++){
    const a=placedY[j],b=placedY[i];
    if(b.newX<a.newX+a.w+8&&b.newX+b.w+8>a.newX&&b.newY<a.newY+a.h+18&&b.newY+b.h>a.newY)b.newY=a.newY+a.h+18;
   }
   for(const item of footprints){item.r.x=item.newX+item.offsetX;item.r.y=item.newY+item.offsetY;place(item.r);}
   fitFrame();
   compacted=true;
  }
  function updateEdges(){if(!card.open||card.hidden||!svg.getScreenCTM())return;
   if(!fitted){for(const r of records.values()){
    if(r.spec.shape==='mux') {
     const inlets=r.ports.filter(p=>p.side==='left'&&p.direction==='input').sort((a,b)=>(a.at??.5)-(b.at??.5));
     const metrics=window.ChipOpenboxUnitBox.fitMux(r.captions,inlets.length);
     r.x+=(r.w-metrics.w)/2;r.y+=(r.h-metrics.h)/2;r.w=metrics.w;r.h=metrics.h;r.muxMetrics=metrics;
     inlets.forEach((p,i)=>p.at=(metrics.paddingY+metrics.rowHeight/2+i*(metrics.rowHeight+metrics.gap))/r.h);
    } else {
     const metrics=window.ChipOpenboxUnitBox.fit([r.label,...(r.value?[r.value]:[])]);
     const count=side=>r.ports.filter(p=>p.side===side).length;
     const portWidth=Math.max(0,Math.max(count('top'),count('bottom'))-1)*8+12,portHeight=Math.max(0,Math.max(count('left'),count('right'))-1)*8+12;
     const w=Math.max(portWidth,r.spec.shape==='and'?Math.max(24,metrics.w):metrics.w),h=Math.max(portHeight,r.spec.shape==='and'?Math.max(22,metrics.h):metrics.h);
     r.x+=(r.w-w)/2;r.y+=(r.h-h)/2;r.w=w;r.h=h;r.metrics=metrics;
    }
    place(r);
   }compactLayout();fitted=true;}
   const matrix=svg.getScreenCTM(),inverse=matrix.inverse(),box=card.getBoundingClientRect(),scale=box.width/card.offsetWidth;for(const item of boundary.values()){const old=new DOMPoint(0,item.y).matrixTransform(matrix);item.x=new DOMPoint(item.side==='left'?box.left+card.clientLeft*scale:box.left+(card.clientLeft+card.clientWidth)*scale,old.y).matrixTransform(inverse).x;item.element.setAttribute('cx',item.x);item.label.setAttribute('x',item.x+(item.side==='left'?8:-8));}
   const next=JSON.stringify([[...records.values()].map(r=>[r.x,r.y,r.w,r.h]),[...boundary.values()].map(p=>p.x)]);if(next===signature)return;signature=next;for(const route of routes)drawRoute(route);updateJunctions();objects.finish();
  }
  const observer=new ResizeObserver(()=>{updateEdges();onChange();});observer.observe(card);observer.observe(svg);card.addEventListener('toggle',()=>requestAnimationFrame(()=>{updateEdges();onChange();}));objects.finish();return Object.freeze({updateEdges,port:id=>{const p=boundary.get(id);return card.open&&p?{side:p.side,element:p.element}:null;}});
 }
 window.ChipOpenboxUnitDiagram={attach};
})();
