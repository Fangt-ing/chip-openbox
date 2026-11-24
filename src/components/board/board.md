# PCB / board component

Open [board.html](board.html) independently or through [openbox](../../openbox.html).

```text
components/board/
├── board.html
├── board.css
└── board.js
```

1. Board owns Flash, Standalone and Debug controls, current-image metadata/bytes and workflow feedback.
2. board.js renders component state and sends workflow requests through ../../common/component-channel.js. openbox invokes the separate controllers under ../../workflows/.
3. In openbox, a successful current scripts build becomes the board's image preview. Pressing Flash requests the MCU preview; no memory is programmed.
4. Uncached edits, target changes without a build and failures clear the current candidate. They do not represent changing programmed hardware.
5. The Flash button exposes visual input/output anchors: scripts Export → Flash → chip PROG I/O is drawn in openbox through the shared geometry helper. Programmer hardware/protocols remain deferred.
6. Standalone and Debug return explicit placeholder feedback. No runtime, board circuit, programmer pins or physical response is implemented.
7. An independently opened board page has no connected image/session; use openbox to coordinate views. Cross-tab persistence is not implemented.

8. Canvas navigation: hold the left mouse button and drag the background to pan. Wheel/background or top −/+ buttons zoom (25–300%); the percentage button resets zoom and position. Scrollbars, scrollable content, editors, buttons and resize handles keep their native actions.

Runtime/model choices remain open. See [implementation.md](../../../implementation.md#components).

## Shared component heading

1. In openbox, selectors/actions appear in the existing component pane heading only when this component view is selected. All view hides those controls and retains the component label/Open separately link.
2. pane-heading.js / pane-heading.css provide the shared type and message bridge. This component supplies its own controls and keeps ownership of behavior/state. Dedicated-page controls remain visible in its existing header; embedded views have no duplicate settings row.
