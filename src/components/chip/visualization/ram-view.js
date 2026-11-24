'use strict';
(() => {
  const NS='http://www.w3.org/2000/svg';
  const hex=(value,width=2)=>value.toString(16).toUpperCase().padStart(width,'0');
  const wordHex=bytes=>'0x'+bytes.slice().reverse().map(value=>hex(value)).join('');
  const nets=[
    {id:'address',label:'Address',color:'#397cad',y:50,anchor:175},
    {id:'input',label:'Write data',color:'#a27118',y:190,anchor:175},
    {id:'control',label:'R/W',color:'#8d70aa',y:245,anchor:175},
    {id:'output',label:'Read data',color:'#008b87',y:188,anchor:974}
  ];
  function addressRange(address) {
    const first=hex(address,8),last=hex(address+3,8);
    let shared=0;while(shared<last.length&&first[shared]===last[shared])shared++;
    return '0x'+first.slice(0,4)+' '+first.slice(4)+' - *'+last.slice(shared);
  }
  function attach({container,card,model,id="ram",name="RAM",kind="ram",cacheLineBytes=32,addressLabel="Address",addressMeaning="CPU-visible working RAM address",wordBytes=4,addressDigits=8,onChange=()=>{}}) {
    const {baseAddress,length}=model.geometry;
    if(![1,4].includes(wordBytes)||length<wordBytes||length%wordBytes)throw new RangeError('Expected complete selected storage slices');
    const bitCount=wordBytes*8,firstX=215,lastX=firstX+(bitCount-1)*23,fanX=lastX+27,outputAnchor=fanX+19,totalWidth=outputAnchor+126;
    const range=at=>wordBytes===1?'0x'+hex(at,addressDigits):addressRange(at);
    const selection=bitCount+'-bit slice';
    const readOnly=model.readOnly,isProgram=kind==='program';
    const cacheRole=kind==='instruction-cache'?'instruction':kind==='data-cache'?'data':null;
    const hasWritePath=!readOnly||isProgram;
    const cacheStates=new Map();
    const lineKey=at=>Math.floor((at-baseAddress)/cacheLineBytes);
    const cacheStateAt=at=>cacheStates.get(lineKey(at))||{tag:null,valid:false,...(cacheRole==='data'?{dirty:false}:{})};
    const activeNets=nets.filter(net=>hasWritePath||net.id!=='input').map(net=>({...net,label:
      net.id==='address'?addressLabel:
      net.id==='input'?(isProgram?'Program data':cacheRole==='instruction'?'Fill data':cacheRole==='data'?'Write / fill data':net.label):
      net.id==='control'?(isProgram||readOnly?'Read enable':cacheRole==='instruction'?'Read / fill':net.label):net.label}));
    if(isProgram)activeNets.push({id:'program-control',label:'Program control',color:'#9254aa',y:130,anchor:175});

    const markerPrefix='memory-'+id+'-arrow-';
    let address=baseAddress,input=Array(wordBytes).fill(0),operation='read',edgeConnections=[],drag=null;
    const positions={
      address:{x:20,y:39,width:140},input:{x:25,y:179,width:90},
      control:{x:52,y:234,width:62},output:{x:outputAnchor+11,y:177,width:90},
      "program-control":{x:25,y:119,width:100}
    };
    const root=document.createElement('section');root.className='ram-view memory-view';root.dataset.memoryId=id;
    root.innerHTML='<svg class="ram-diagram" viewBox="0 0 1100 280" role="group" aria-label="32 selected RAM cells, b31 MSB through b0 LSB, with movable read-only signal values"></svg>';
    root.querySelector('svg').setAttribute('viewBox','0 0 '+totalWidth+' 280');
    root.querySelector('svg').setAttribute('aria-label',name+': selected '+selection+', b'+(bitCount-1)+' MSB through b0 LSB, movable read-only signal values');
    container.append(root);
    const svg=root.querySelector('svg');
    const objects=window.ChipOpenboxDiagramObjects.wires({svg,id:'memory.'+id});
    let wireIndex=0;
    function node(tag,attrs={},value,parent=svg) {
      const element=document.createElementNS(NS,tag);
      for(const [name,v] of Object.entries(attrs))element.setAttribute(name,String(v));
      if(value!==undefined)element.textContent=value;
      parent.append(element);return element;
    }
    function text(x,y,value,cls='',parent=svg) {return node('text',{x,y,class:cls},value,parent);}
    function line(d,cls='ram-wire',parent=svg) {
      const path=node('path',{d,class:cls},undefined,parent);
      const signal=/ram-net-([a-z-]+)/.exec(cls)?.[1];
      objects.add(path,{id:'wire-'+wireIndex++,net:signal?'chip.'+id+'.'+signal:null,label:name+' · '+cls,
        decorations:()=>signal?[...svg.querySelectorAll('.diagram-signal-symbol.ram-net-'+signal)]:[],
        ports:()=>path.dataset.connection?[svg.querySelector('.ram-port[data-port="'+path.dataset.connection+'"]')]:[]});
      return path;
    }
    function signal(d,name,cls='ram-wire') {const path=line(d,cls);path.dataset.signal=name;return path;}
    function junction(x,y,cls='ram-junction') {node('circle',{cx:x,cy:y,r:1.2,class:cls});}
    function dots(d,kind) {
      for(let i=0;i<3;i++) {
        const dot=node('circle',{r:1.5,class:'ram-dot ram-net-'+kind});
        node('animateMotion',{path:d,dur:'2.8s',begin:(-i*.12)+'s',repeatCount:'indefinite'},undefined,dot);
      }
    }
    function svgPoint(event) {return new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse());}
    function placeLabel(group,id) {
      const p=positions[id];group.setAttribute('transform','translate('+p.x+' '+p.y+')');
      group.dataset.x=p.x;group.dataset.y=p.y;
    }
    function moveLabel(group,id,x,y) {
      const p=positions[id];p.x=Math.max(0,Math.min(totalWidth-p.width,x));p.y=Math.max(17,Math.min(258,y));
      placeLabel(group,id);updateEdges();
    }
    function stopDrag() {
      if(!drag)return;
      const state=drag;drag=null;state.group.classList.remove('is-dragging');
      if(state.group.hasPointerCapture(state.pointer))state.group.releasePointerCapture(state.pointer);
    }
    function valueLabel(id,name,value) {
      const p=positions[id],net=activeNets.find(item=>item.id===id);
      const group=node('g',{class:'ram-wire-value diagram-signal-symbol ram-net-'+id,role:'textbox',tabindex:0,'aria-readonly':'true',
        'aria-label':name,'data-label-id':id,'data-value':value});
      node('rect',{x:0,y:0,width:p.width,height:22,rx:2},undefined,group);
      text(6,15,value,'',group);text(0,-6,net.label,'ram-label',group);
      node('title',{},name+': '+value+'. Drag to move; arrow keys move the label. Value is read-only.',group);
      placeLabel(group,id);
      group.addEventListener('pointerdown',event=>{
        if(event.button!==0)return;
        event.stopPropagation();event.preventDefault();
        const point=svgPoint(event);
        drag={id,group,pointer:event.pointerId,x:p.x,y:p.y,start:point};
        group.setPointerCapture(event.pointerId);group.classList.add('is-dragging');
        group.focus({preventScroll:true});
      });
      group.addEventListener('pointermove',event=>{
        if(!drag||drag.group!==group||drag.pointer!==event.pointerId)return;
        if(!(event.buttons&1)){stopDrag();return;}
        event.stopPropagation();event.preventDefault();
        const point=svgPoint(event);
        moveLabel(group,id,drag.x+point.x-drag.start.x,drag.y+point.y-drag.start.y);
      });
      group.addEventListener('pointerup',stopDrag);group.addEventListener('pointercancel',stopDrag);
      group.addEventListener('lostpointercapture',stopDrag);
      group.addEventListener('keydown',event=>{
        const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
        if(!delta)return;
        event.preventDefault();event.stopPropagation();
        const step=event.shiftKey?10:2;moveLabel(group,id,p.x+delta[0]*step,p.y+delta[1]*step);
      });
      return group;
    }
    function playback() {if(card.open&&!card.hidden&&!document.hidden)svg.unpauseAnimations();else svg.pauseAnimations();}
    function render() {
      stopDrag();
      const bytes=model.readBytes(address,wordBytes),isRead=operation==='read';
      if(isProgram)activeNets.find(net=>net.id==='address').label=isRead?'Read address':'Program address';
      const focused=svg.contains(document.activeElement)?document.activeElement.dataset.labelId:null;
      objects.begin();svg.replaceChildren();edgeConnections=[];wireIndex=0;
      const defs=node('defs');
      for(const net of activeNets) {
        const marker=node('marker',{id:markerPrefix+net.id,markerWidth:5,markerHeight:5,refX:4,refY:2.5,orient:'auto'},undefined,defs);
        node('path',{d:'M0,0 L5,2.5 L0,5 Z',fill:net.color},undefined,marker);
        const wire=line('','ram-bus ram-net-'+net.id+((net.id==='input'&&isRead)||(net.id==='output'&&!isRead)||(isProgram&&net.id==='control'&&!isRead)||(net.id==='program-control'&&isRead)?' ram-idle':''));
        wire.dataset.connection=net.id;if(net.id==='output')wire.setAttribute('marker-end','url(#'+markerPrefix+net.id+')');
        const port=node('circle',{cx:net.id==='output'?totalWidth:0,cy:net.y,r:2.7,
          class:'ram-port ram-net-'+net.id,'data-port':net.id});
        window.ChipOpenboxDiagramObjects.port(port,{id:'chip.'+id+'.'+net.id,owner:'chip.'+id,
          direction:net.id==='output'?'output':'input',name:net.label});
        edgeConnections.push({...net,anchor:net.id==='output'?outputAnchor:net.anchor,wire,port});
      }
      
      const addressPath='M 175 50 H 182 V 40 H 190';
      const inputPath='M 175 190 H 182 V 90 H 190';
      const controlPath='M 175 245 H 186 V 160 H '+(lastX+11);
      signal(addressPath,'word-select','ram-select-wire ram-net-address');
      if(hasWritePath)signal(inputPath,'input-bus','ram-input-wire ram-net-input'+(isRead?' ram-idle':''));
      signal(controlPath,isProgram||readOnly?'read-enable':'RW','ram-control-wire ram-net-control'+(isProgram&&!isRead?' ram-idle':''));
      const programControlPath='M 175 130 H 198 V '+(94+8*16/17);
      if(isProgram)signal(programControlPath,'program-enable','ram-control-wire ram-net-program-control'+(isRead?' ram-idle':''));
      // Matching visual fan-out / fan-in symbols; no additional logic-gate model.
      const addressBreakout=node('polygon',{points:'190,36 207,20 207,60 190,44',
        class:'ram-bundle diagram-signal-symbol ram-net-address','data-bundle':'address'});
      node('title',{},'Selected-word fan-out to visible cell select pins; address decoding is abstracted',addressBreakout);
      if(hasWritePath){const inputBreakout=node('polygon',{points:'190,86 207,70 207,110 190,94',
        class:'ram-bundle diagram-signal-symbol ram-net-input','data-bundle':'input'});
      node('title',{},'Write-data bus fan-out: '+bitCount+' separate bit signals',inputBreakout);}
      const outputBreakout=node('polygon',{points:fanX+',170 '+outputAnchor+',184 '+outputAnchor+',192 '+fanX+',211',
        class:'ram-bundle diagram-signal-symbol ram-net-output','data-bundle':'output'});
      node('title',{},'Read-data bus fan-in: '+bitCount+' separate bit signals',outputBreakout);
      // Multi-byte inspection displays the numeric significance of a little-endian word.
      // The model and adapter continue to store bytes in increasing address order.
      for(let lane=wordBytes-1;lane>=0;lane--) {
        const byte=bytes[lane],group=node('g',{'data-byte-address':byte.address,'aria-label':'Byte 0x'+hex(byte.address,8)});
        for(let b=7;b>=0;b--) {
          const wordBit=lane*8+b,index=bitCount-1-wordBit,x=firstX+index*23,y=135;
          const inPath='M 207 '+(105-index)+' H '+(x-3)+' V '+y+' H '+x;
          const selectPath='M 207 '+(55-index)+' H '+(x+5)+' V 124';
          const outPath='M '+(x+16)+' '+y+' H '+(x+19)+' V '+(175+(bitCount-1-index))+' H '+fanX;
          const paths=[
            ['in',inPath,'ram-input-wire ram-net-input'+(isRead?' ram-idle':'')],
            ['out',outPath,'ram-output-wire ram-net-output'+(isRead?'':' ram-idle')],
            ['select',selectPath,'ram-select-wire ram-net-address'],
            [isProgram||readOnly?'enable':'rw','M '+(x+11)+' 160 V 146','ram-control-wire ram-net-control'+(isProgram&&!isRead?' ram-idle':'')]
          ];
          for(const [name,path,cls] of paths) {
            if(!hasWritePath&&name==='in')continue;
            const wire=signal(path,lane+'.'+b+'.'+name,cls);wire.dataset.cellConnection=lane+'-'+b+'-'+name;
          }
          junction(x+11,160,'ram-control-junction');
          const label=text(x+8,116,'b'+wordBit,'ram-bit-index',group);label.setAttribute('text-anchor','middle');
          if(wordBit===bitCount-1||wordBit===0)label.setAttribute('aria-label',wordBit===bitCount-1?'b'+(bitCount-1)+', most significant bit':'b0, least significant bit');
          const cell=node('rect',{x,y:124,width:16,height:22,rx:1.5,class:'ram-cell',
            'data-bit':b,'data-word-bit':wordBit,'data-word-index':index},undefined,group);
          node('title',{},'b'+wordBit+': byte 0x'+hex(byte.address,8)+', bit '+b,cell);
          text(x+8,139,byte.known?String((byte.value>>b)&1):'X','ram-bit-value',group).setAttribute('text-anchor','middle');
          if(b===7){if(isRead||!isProgram)dots(isRead?outPath:inPath,isRead?'output':'input');dots(selectPath,'address');}
        }
      }
      dots(addressPath,'address');if(!isProgram||isRead)dots(controlPath,'control');
      if(isProgram&&!isRead)dots(programControlPath,'program-control');
      if(cacheRole){
        const state=cacheStateAt(address),meta=node('g',{class:'memory-cache-state',role:'group','aria-label':'Selected cache-line metadata','data-line-offset':lineKey(address)*cacheLineBytes});
        const tag=text(215,248,'Tag: '+(state.tag??'—'),'memory-cache-field',meta);tag.dataset.field='tag';
        const valid=text(390,248,'Valid: '+Number(state.valid),'memory-cache-field',meta);valid.dataset.field='valid';
        if(cacheRole==='data'){const dirty=text(490,248,'Dirty: '+Number(state.dirty),'memory-cache-field',meta);dirty.dataset.field='dirty';}
        node('title',{},'Logical metadata for the selected 32-byte cache line; tag width and encoded status RAM layout are not specified.',meta);
      }
      dots(isRead?'M '+outputAnchor+' 188 H '+totalWidth:inputPath,isRead?'output':'input');
      const addressLabel=valueLabel('address','Address value',range(address));
      addressLabel.dataset.addressStart=address;addressLabel.dataset.addressEnd=address+wordBytes-1;
      addressLabel.querySelector('title').textContent=addressMeaning+'. Selected '+selection+' from 0x'+hex(address,addressDigits)+' through 0x'+hex(address+wordBytes-1,addressDigits)+'. Drag to move.';
      if(hasWritePath)valueLabel('input','Data input value',wordHex(input));
      valueLabel('control',isProgram||readOnly?'Read enable value':'Read/write value',isProgram?(isRead?'Enabled':'Disabled'):cacheRole==='instruction'?(isRead?'Read':'Fill'):(isRead?'Read':'Write'));
      if(isProgram){const programming=valueLabel('program-control','Programming control value',isRead?'Idle':'Pending');programming.querySelector('title').textContent='Programming request placeholder; no cells are programmed. Drag to move.';}
      valueLabel('output','Data output value',isRead?(bytes.every(byte=>byte.known)?wordHex(bytes.map(byte=>byte.value)):'0x'+'X'.repeat(wordBytes*2)):'—');
      objects.finish();playback();updateEdges();onChange();
      if(focused)svg.querySelector('[data-label-id="'+focused+'"]')?.focus({preventScroll:true});
    }
    function updateEdges() {
      if(!card.open||card.hidden)return;
      const matrix=svg.getScreenCTM();if(!matrix||!svg.clientWidth||!svg.clientHeight)return;
      const bounds=card.getBoundingClientRect(),scale=bounds.width/card.offsetWidth;
      const left=bounds.left+card.clientLeft*scale,right=left+card.clientWidth*scale,inverse=matrix.inverse();
      for(const net of edgeConnections) {
        const {id,y,wire,port,anchor}=net,p=positions[id],middle=p.y+11;
        const viewportPoint=new DOMPoint(0,y).matrixTransform(matrix);
        const edge=new DOMPoint(id==='output'?right:left,viewportPoint.y).matrixTransform(inverse);
        port.setAttribute('cx',edge.x);
        const via=' H '+(p.x-8)+' V '+middle+' H '+p.x+' H '+(p.x+p.width)+' H '+(p.x+p.width+8)+' V '+y;
        wire.setAttribute('d',id==='output'?'M '+anchor+' '+y+via+' H '+edge.x:'M '+edge.x+' '+y+via+' H '+anchor);
        objects.update(wire);
      }
      onChange();
    }
    function validateAddress(next) {
      model.locate(next);model.locate(next+wordBytes-1);
      if((next-baseAddress)%wordBytes)throw new RangeError('Expected an aligned selected-slice address');
    }
    function drive(signals={}) {
      if(readOnly&&!isProgram&&(signals.operation==='write'||signals.input!==undefined))throw new Error('Read-only storage');
      const nextAddress=signals.address??address,nextInput=signals.input===undefined?input.slice():Array.from(signals.input);
      const nextOperation=signals.operation??(signals.address===undefined?operation:'read');
      validateAddress(nextAddress);
      if(nextInput.length!==wordBytes||nextInput.some(value=>!Number.isInteger(value)||value<0||value>255))throw new RangeError('Expected one input byte per selected byte address');
      if(!['read','write'].includes(nextOperation))throw new RangeError('Expected read or write');
      let nextCache=null;
      if(signals.cache!==undefined){
        if(!cacheRole||!signals.cache||typeof signals.cache!=='object'||Array.isArray(signals.cache))throw new Error('Cache metadata is only supported on cache views');
        const allowed=cacheRole==='data'?['tag','valid','dirty']:['tag','valid'];
        if(Object.keys(signals.cache).some(key=>!allowed.includes(key)))throw new Error('Unsupported cache metadata field');
        nextCache={...cacheStateAt(nextAddress),...signals.cache};
        if(nextCache.tag!==null&&(typeof nextCache.tag!=='string'||!/^0x[0-9a-f]{1,8}$/i.test(nextCache.tag)))throw new Error('Expected a hexadecimal tag or null');
        if(typeof nextCache.valid!=='boolean'||(cacheRole==='data'&&typeof nextCache.dirty!=='boolean'))throw new Error('Expected boolean cache state');
      }
      address=nextAddress;input=nextInput;operation=nextOperation;
      if(nextCache)cacheStates.set(lineKey(address),nextCache);
      // Program writes expose a request path only. Flash programming is still a workflow placeholder.
      if(signals.operation==='write'&&!isProgram)model.writeBytes(address,input);else render();
      return model.readBytes(address,wordBytes);
    }
    const edgeObserver=new ResizeObserver(updateEdges);edgeObserver.observe(card);edgeObserver.observe(svg);
    card.addEventListener('toggle',()=>{stopDrag();playback();requestAnimationFrame(updateEdges);});
    card.addEventListener('diagram-visibility',()=>{stopDrag();playback();if(!card.hidden)requestAnimationFrame(updateEdges);});
    window.addEventListener('blur',stopDrag);document.addEventListener('visibilitychange',playback);
    model.subscribe(render);render();
    return Object.freeze({model,drive,nets:activeNets,get signals(){return {address,input:input.slice(),operation,...(isProgram?{programmingStatus:operation==='write'?'placeholder':'idle'}:{}),...(cacheRole?{cache:{...cacheStateAt(address)},cacheLineOffset:lineKey(address)*cacheLineBytes}:{})};}});
  }
  window.ChipOpenboxMemoryView={attach,nets};
  window.ChipOpenboxRamView=window.ChipOpenboxMemoryView; // RAM view compatibility.
})();
