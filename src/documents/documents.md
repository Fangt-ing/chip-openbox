# Source documents

1. Reference links prefer an available online reader. The Arm references have stored PDFs opened through reader.html at explicit pages. Clicking a unit does not fetch a vendor PDF. The local reader shows prepared reference-page images from ../-output/source-documents/; it requires no browser PDF plug-in and is not a datasheet parser.
2. Prefer a verified online reading page for future sources. Otherwise store the original PDF here or in the relevant chipset’s datasheets/ folder before exposing its reference link. Record revision, source URL, page mapping and checksum.
3. Datasheet import, extraction and conversion to chip diagrams are deferred for later discussion/design. No importer or automatic diagram generation is implemented.

<table>
<thead><tr><th>No.</th><th>File</th><th>Revision / provenance</th><th>SHA-256</th></tr></thead><tbody>
<tr><td>D1</td><td>cmsdk-trm-ddi0479d.pdf</td><td>r1p1 · DDI0479D; <a href="https://documentation-service.arm.com/static/5e8f224c7100066a414f7810">Publisher PDF</a></td><td style="overflow-wrap:anywhere;max-width:15em">dc5f8844063f15f5f28cb6f53dd6c826e689311d79647498344da227810a7026</td></tr>
<tr><td>D2</td><td>cortex-m85-trm-0101-07.pdf</td><td>101924_0101_07_en; <a href="https://documentation-service.arm.com/static/662a65926862ee0ae48937cd">Publisher PDF</a></td><td style="overflow-wrap:anywhere;max-width:15em">e8cec43b7f9499c292a202d5a0fd025b0ad3061ad819b1828fe41135c9acf23a</td></tr>
<tr><td>D3</td><td>Online reader</td><td>Doc ID 17863 · Rev 2 · August 2012; <a href="https://www.st.com/resource/en/programming_manual/pm0075-stm32f10xxx-flash-memory-microcontrollers-stmicroelectronics.pdf">Publisher PDF</a>; <a href="https://device.report/m/2296c5d528f71ddc7502baa907a0d6a7473ad10f1c67e8b07bb046f291dd4a8a">online reading page</a> (third-party host of the original ST document).</td><td style="overflow-wrap:anywhere;max-width:15em">—</td></tr>
</tbody></table>

Original publisher notices remain in the unmodified PDFs. Page numbers in links are PDF page indices, including front matter.

4. Previews currently cover CMSDK PDF pages 59–60 and M85 PDF pages 29, 127 and 236, matching all current unit links. Original full PDFs stay here. Regenerate a cited page using pdftoppm -f PAGE -singlefile -scale-to 1600 -png SOURCE_PDF OUTPUT_PREFIX; update previewPages in catalog.js when adding references.

5. C8051F500 uses a retained manufacturer Rev. 1.0 archive in its [datasheets folder](../components/chip/chip-target/c8051f500/datasheets/c8051f500-datasheets.md), with 50 prepared source pages, covering the clock and all current C8051F500 functional-unit references. The newer official Rev. 1.5 is documented separately; its direct download was denied. catalog.js keeps this revision/page mapping explicit.
