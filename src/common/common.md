# Common resources

Current implementation:

1. correspondence/intel-hex.js validates/decodes Intel HEX addresses, bytes and entry records.
2. visualization/connection-ports.js reports visible component endpoint geometry; visualization/component-connections.js renders the openbox connection overlay. Neither changes workflow state.
3. visualization/canvas-zoom.js and canvas-navigation.css supply shared navigation for scripts, chip and board: left-button background drag pans; wheel/background and top buttons zoom (25–300%); the percentage button resets zoom and position. Wheel over scrollable content or scrollbar tracks scrolls normally. Editors, buttons and resize handles retain native actions. Workflow state is unchanged.
4. visualization/pane-resizer.js handles openbox’s draggable/keyboard-adjustable component dividers, preserving pane proportions and iframe state.
5. component-channel.js connects a component to its openbox parent using postMessage envelopes. Namespace/version, exact source-window and origin checks apply. File pages use opaque origins, so source-window checks are required.

6. visualization/diagram-objects.js and diagram-objects.css provide shared unit, port, wire and junction contracts. All current wire renderers use one selection implementation per document and shared full-signal IDs across renderer boundaries: mouse/keyboard toggle, single-click clearing, port highlights, stable redraw/focus and transparent SVG hit targets. Unit names resolve to online readers or stored source-document previews through catalog.js; missing product references remain null. Geometry and workflow state remain with their existing owners.

The channel carries current-image previews, workflow requests/status and endpoint geometry for static drawing. It does not emulate electrical signals or program storage.

The methodology has three component domains and four workflows. common supports their shared contracts; it is not a fourth component domain or a fifth workflow. Openbox coordinates component views and cross-domain workflow requests. See [component implementations](../../implementation.md#components).

Shared concerns may later include image/source/address correspondence, programming/debug handoff formats, generic storage primitives and synchronized signal-event formats. Define these when their consumers exist; do not add empty scaffolding or duplicate a device model here.

Chip-specific architecture/support definitions belong to ../components/chip/chip-target/. Board-specific instances and connections belong to ../components/board/. Sharing a definition does not transfer ownership of either workspace's layout.

7. visualization/pane-heading.js and pane-heading.css define the shared pane-heading type and host/component control bridge. Each component exposes its existing select/button state through component:view; the host sends view:control through the checked component channel. All view hides pane-controls; a selected component view exposes its own controls. Dedicated pages use the same heading class inside the existing header. Components keep ownership of behavior/state; layout switching does not reload them.
