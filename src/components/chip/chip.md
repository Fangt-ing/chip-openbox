# Chip / MCU component

## 1. Open and select

Open [chip.html](chip.html) directly or select chip in [openbox](../../openbox.html). C8051F500 is the default diagram. Type in the existing heading selector and choose **Generic MCU · Cortex-M85** or **C8051F500 · CIP-51 / 8051**. [Open C8051F500 directly](chip.html?chipset=c8051f500).

1. Unit headers fold/expand and drag; expanded windows resize from the lower-right corner. References on unit names open source pages independently of folding. The selected MCU name inside the chip boundary opens its datasheet/reference; the pane heading has no Datasheet link.
2. Internal clock/timer rectangles fit their text. Drag their body with the move cursor; wires follow. Names with the pointer cursor open source documentation.
3. Drag a group name or boundary to move its members and nested groups together. Unrelated units remain outside its membership.
4. Click a wire or use Enter/Space to highlight it. One repeat click, blank-canvas click or Escape clears selection. Ports belong to actual units; routes and group outlines follow movement/resize/folding.
5. Background drag pans; wheel and heading buttons zoom. All view hides selectors/actions; dedicated/focused views show them in the existing heading.
6. Switching chipset reloads only this component and resets its view/fixtures. Scripts and board remain loaded; Open separately retains the selected chipset.

## 2. Implemented boundaries

<table>
<thead><tr><th>No.</th><th>Instance</th><th>Implemented / missing</th></tr></thead>
<tbody>
<tr><td>I1</td><td>Generic Cortex-M85</td><td>Existing 43-unit processor/reference/generic-MCU diagram, nested domains, selected 32-bit memory rows and CMSDK timer detail retained. No manufactured MCU or execution model.</td></tr>
<tr><td>I2</td><td>C8051F500</td><td>33 datasheet-based units, CIP-51 processor boundary, digital/analog groups, C2/reset contact fan-out, separate CODE/DATA/XDATA byte views and internal inspection views for every unit. No bootloader or compiler profile added.</td></tr>
<tr><td>I3</td><td>Workflow boundary</td><td>Image handoff remains preview-only. Flash storage programming, standalone execution and debug transactions are not implemented.</td></tr>
</tbody></table>

## 3. Implementation and extension

Implementation choices, the recursive object design, current chipset details and extension rules are maintained together in [implementation.md §2.3](../../../implementation.md#mcu-component). Original datasheet provenance remains beside the retained source documents.
