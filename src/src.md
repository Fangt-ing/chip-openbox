# Source layout

Open [openbox.html](openbox.html) directly. Each [scripts](components/scripts/scripts.html), [chip](components/chip/chip.html) and [board](components/board/board.html) page can also open independently. Optional HTTP serving: `node src/server.mjs` from the project root.

```text
src/
├── openbox.html / openbox.css / openbox.js
├── server.mjs
├── components/
│   ├── scripts/                    editors, working content and result views
│   ├── chip/                       architecture/package, RAM inspection, image preview and definitions
│   └── board/                      workflow controls and image preview
├── workflows/
│   ├── workflows.md                status of all four workflows
│   ├── scripting/                  build/cache operations and compiler integration
│   ├── flash/                      image selection and programming placeholder
│   ├── standalone/                 execution placeholder
│   └── debug/                      debug placeholder
├── common/
│   ├── correspondence/intel-hex.js
│   ├── component-channel.js        component/coordinator messages
│   └── visualization/              shared diagram objects, navigation and SVG connections
├── documents/                      reference catalog, reader and original source PDFs
└── -output/                         retained evidence and cited source-page previews
```

<table>
<thead><tr><th>No.</th><th>Area</th><th>Boundary</th></tr></thead>
<tbody>
<tr><td>1</td><td>components/</td><td>Views, editable working content and component presentation/state. Scripts is implemented. Chip has architectural/package windows, pin connections and a local SRAM state/access inspector; board retains workflow controls and image previews. CPU execution and board runtime models remain unimplemented.</td></tr>
<tr><td>2</td><td>workflows/</td><td>Operations on component content. Scripting is implemented. Flash owns preview selection; Flash programming, standalone and debug return explicit controller placeholders.</td></tr>
<tr><td>3</td><td>components/scripts/default-content/</td><td>Generic M85/desktop/C8 prefills and profile snapshots. These initialize editable containers, not a new project/template structure.</td></tr>
<tr><td>4</td><td>common/</td><td>Shared data handling. Add shared contracts only when consumers require them.</td></tr>
<tr><td>5</td><td>-output/</td><td>Retained build/research/design evidence. Temporary intermediates use -inter/ and operation scratch uses -tmp/ beneath -output/ when needed.</td></tr>
</tbody>
</table>

Cortex-M85 is the selected demonstration architecture and the default scripting build target (generic example configuration, Arm GCC 13.2). All profiles remain build-only. The chip view is a generic integration around selected M85 processor groups with a local RAM organization preview; no MCU execution runtime is implemented. Flash now belongs to board. openbox routes a current image from scripts to board and passes a preview to the MCU on request, without programming storage.

In openbox’s All view, drag the vertical dividers to resize adjacent component panes. Focus a divider and use Left/Right arrows for keyboard adjustment. Width proportions remain when switching views or resizing the browser; narrow screens keep the stacked layout. The helper is common/visualization/pane-resizer.js.

The cross-component connection works within openbox, for direct-file and HTTP use. Separate pages remain independent; source-set save/import and cross-tab state persistence are not implemented.

The optional server serves static assets only. Retained build records in -output/ are historical. The reference reader uses the prepared page previews in -output/source-documents/.

Current details and directory trees: [component implementations](../implementation.md#components) and [workflows](../implementation.md#3-workflows-current-operation).
