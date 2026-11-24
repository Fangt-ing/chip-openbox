'use strict';
(() => {
 function fit(labels,{paddingX=6,paddingY=3,gap=3}={}) {
  const rows=labels.map(element=>{const box=element.getBBox(),baseline=Number(element.getAttribute('y'))||0;return{element,width:box.width,height:box.height,offset:box.y-baseline};});
  return {w:Math.ceil(Math.max(0,...rows.map(r=>r.width))+paddingX*2),h:Math.ceil(rows.reduce((n,r)=>n+r.height,0)+Math.max(0,rows.length-1)*gap+paddingY*2),rows,paddingY,gap};
 }
 function fitMux(captions,inputCount,{paddingX=6,paddingY=3,gap=4,bevel=6}={}) {
  const rows=captions.map(element=>{const box=element.getBBox(),baseline=Number(element.getAttribute('y'))||0;return{element,width:box.width,height:box.height,offset:box.y-baseline};});
  const count=Math.max(2,inputCount,rows.length),rowHeight=Math.ceil(Math.max(10,...rows.map(r=>r.height)));
  return {w:Math.max(24,Math.ceil(Math.max(0,...rows.map(r=>r.width))+paddingX*2+bevel)),h:count*rowHeight+(count-1)*gap+paddingY*2,rows,rowHeight,paddingX,paddingY,gap,bevel};
 }
 window.ChipOpenboxUnitBox=Object.freeze({fit,fitMux});
})();
