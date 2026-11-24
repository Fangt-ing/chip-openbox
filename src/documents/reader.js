'use strict';
(() => {
 const query=new URLSearchParams(location.search),item=ChipOpenboxSourceDocuments.entries.find(e=>e.id===query.get('document'));
 if(!item){document.querySelector('#title').textContent='Unknown source document';document.querySelector('#document').remove();return;}
 if(item.onlineReader){location.replace(item.onlineReader);return;}
 const page=Math.max(1,Math.min(item.pages,Number.parseInt(query.get('page'),10)||1));
 document.title='Chip Openbox · '+item.title;
 document.querySelector('#title').textContent=item.title;
 document.querySelector('#location').textContent=item.revision+' · page '+page;
 const preview=document.querySelector('#preview');
 if(!item.previewPages.includes(page)){preview.remove();document.querySelector('#missing').hidden=false;return;}
 preview.src=new URL('../-output/source-documents/-'+item.id+'-'+page+'.png',location.href).href;
 preview.alt=item.title+' · PDF page '+page;
})();
