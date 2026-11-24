'use strict';
(() => {
 const base=new URL('.',document.currentScript.src);
 const entries=[
{
  "id": "c8051f500",
  "title": "Silicon Labs C8051F50x/F51x datasheet",
  "file": "../components/chip/chip-target/c8051f500/datasheets/C8051F50x-51x.pdf",
  "source": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf",
  "revision": "Rev. 1.0 · February 2009 · Keil archive",
  "pages": 320,
  "defaultPage": 18,
  "previewPages": [
    18,
    21,
    52,
    70,
    72,
    73,
    75,
    81,
    84,
    85,
    87,
    93,
    94,
    95,
    97,
    100,
    117,
    119,
    129,
    140,
    141,
    147,
    165,
    166,
    167,
    168,
    169,
    170,
    171,
    172,
    173,
    177,
    178,
    181,
    201,
    221,
    222,
    228,
    250,
    259,
    272,
    273,
    274,
    279,
    282,
    288,
    294,
    314,
    315,
    316
  ],
  "sha256": "b5f2e5124f804af4a0d22a098cf4058cae23b093b05cb624b5cf1806f434d0ed"
},
  {
    "id": "cmsdk",
    "title": "Arm Cortex-M System Design Kit TRM · DDI0479D",
    "file": "cmsdk-trm-ddi0479d.pdf",
    "source": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810",
    "revision": "r1p1 · DDI0479D",
    "pages": 177,
    "previewPages": [59,60],
    "sha256": "dc5f8844063f15f5f28cb6f53dd6c826e689311d79647498344da227810a7026"
  },
  {
    "id": "m85",
    "title": "Arm Cortex-M85 Processor TRM · Issue 07",
    "file": "cortex-m85-trm-0101-07.pdf",
    "source": "https://documentation-service.arm.com/static/662a65926862ee0ae48937cd",
    "revision": "101924_0101_07_en",
    "pages": 414,
    "previewPages": [29,127,236],
    "sha256": "e8cec43b7f9499c292a202d5a0fd025b0ad3061ad819b1828fe41135c9acf23a"
  },
  {
    "id": "pm0075",
    "title": "ST PM0075 · Flash programming manual",
    "file": null,
    "onlineReader": "https://device.report/m/2296c5d528f71ddc7502baa907a0d6a7473ad10f1c67e8b07bb046f291dd4a8a",
    "source": "https://www.st.com/resource/en/programming_manual/pm0075-stm32f10xxx-flash-memory-microcontrollers-stmicroelectronics.pdf",
    "revision": "Doc ID 17863 · Rev 2 · August 2012",
    "pages": 31,
    "defaultPage": 11
  }
];
 function reader(id,page=1) {
  const item=entries.find(e=>e.id===id);if(!item)throw new Error('Unknown source document');
  if(item.onlineReader)return item.onlineReader;
  const url=new URL('reader.html',base);url.searchParams.set('document',id);url.searchParams.set('page',Math.max(1,Math.min(item.pages,page)));
  return url.href;
 }
 function resolve(reference) {
  const source=new URL(reference.href,document.baseURI),item=entries.find(e=>e.source===source.origin+source.pathname);
  if(!item)return reference;
  const page=Number(new URLSearchParams(source.hash.slice(1)).get('page'))||item.defaultPage||1;
  return {...reference,href:reader(item.id,page),sourceHref:reference.href,documentId:item.id,page};
 }
 window.ChipOpenboxSourceDocuments=Object.freeze({entries,reader,resolve});
})();
