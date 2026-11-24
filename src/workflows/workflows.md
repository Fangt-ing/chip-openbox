# Workflows

```text
workflows/
├── scripting/
│   ├── scripting.js
│   └── integrations/compiler-explorer.js
├── flash/flash.js
├── standalone/standalone.js
└── debug/debug.js
```

Each workflow has a uniquely named Markdown document and operation file. Components own objects, ports, connections, controls and display state; workflow controllers own operations/status and will drive simulation/animation events. Components render those events. The chip architecture and cross-component wires are currently static; no continuous/step or points-prop controls are implemented.

<table>
<thead><tr><th>No.</th><th>Workflow</th><th>Implemented / remaining</th></tr></thead>
<tbody>
<tr><td>1</td><td><a href="scripting/scripting.md">Scripting</a></td><td>Live build/cache operations and a current-image snapshot for handoff.</td></tr>
<tr><td>2</td><td><a href="flash/flash.md">Flash</a></td><td>Current-image selection and preview handoff. Programming returns placeholder status; no storage write.</td></tr>
<tr><td>3</td><td><a href="standalone/standalone.md">Standalone</a></td><td>Board request routed to an explicit controller placeholder; no execution.</td></tr>
<tr><td>4</td><td><a href="debug/debug.md">Debug</a></td><td>Board request routed to an explicit controller placeholder; no state/execution control.</td></tr>
</tbody>
</table>

openbox coordinates the components through common/component-channel.js. The channel carries image previews and workflow requests; it is not a programmer protocol or circuit bus. See [implementation.md](../../implementation.md#3-workflows-current-operation).
