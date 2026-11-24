# Scripts component

Open [scripts.html](scripts.html), or [openbox](../../openbox.html). Direct-file use needs no local compiler or server.

```text
components/scripts/
├── scripts.html / scripts.css / scripts.js
├── visualization/connections.js
└── default-content/
    ├── profiles.js
    ├── cortex-m85/                  main.c, config.h (default)
    ├── desktop-teaching/            five source/build inputs
    └── stm32f103c8/                 main.c, config.h
```

1. Source windows hold editable **working content** and support minimize/restore and Restore default. The process diagram and expanded results are views on that content.
2. scripts.js owns editor state, profile drafts, controls and result rendering. It calls the separate [scripting workflow](../../workflows/scripting/scripting.md); cache, build requests and ordering do not live in the component.
3. default-content/profiles.js embeds matching source/metadata snapshots for direct opening. Keep it synchronized with the source files and firmware support under ../chip/chip-target/{cortex-m85,stm32f103c8}/firmware-support/.
4. Default target is Generic Cortex-M85 with Arm GCC 13.2 (carmug1320); its compiler/linker flags, example memory map and editable startup/vector inputs match that core. Desktop GCC 12.2 and C8 Arm GCC 13.2 remain optional profiles. See [M85 support and limits](../chip/chip-target/cortex-m85/cortex-m85.md); no MCU or board executes.
5. Inputs are edited in their containers. Saving/importing source sets remains future work; HEX download exports the build image only.
6. Flash is no longer in scripts. Successful current images are published to PCB/board through openbox; uncached edits clear the candidate. The end-of-flow note shows handoff availability. Independently opened scripts still compiles, but connecting other views requires openbox.

7. Canvas navigation: hold the left mouse button and drag the background to pan. Wheel/background or top −/+ buttons zoom (25–300%); the percentage button resets zoom and position. Scrollbars, scrollable content, editors, buttons and resize handles keep their native actions.

No timed scripting playback or separate bottom output panes. Usage/build behavior: [scripting workflow](../../workflows/scripting/scripting.md). Implementation overview: [scripts component](../../../implementation.md#scripts-component).

## Shared component heading

1. In openbox, selectors/actions appear in the existing component pane heading only when this component view is selected. All view hides those controls and retains the component label/Open separately link.
2. pane-heading.js / pane-heading.css provide the shared type and message bridge. This component supplies its own controls and keeps ownership of behavior/state. Dedicated-page controls remain visible in its existing header; embedded views have no duplicate settings row.
