# Scripting workflow

Operate this workflow through the [scripts component](../../components/scripts/scripts.html).

```text
workflows/scripting/
├── scripting.js
└── integrations/compiler-explorer.js
```

1. scripting.js exposes a Session to the component: input identity, successful-result cache, pending jobs, failure state, accepted per-target previews and changed-byte information. It has no DOM/editor/layout code.
2. The default target is Generic Cortex-M85 with Arm GCC 13.2 (carmug1320). integrations/compiler-explorer.js fetches compatible compilers and submits complete builds to Compiler Explorer. The shared Intel HEX decoder remains in ../../common/correspondence/intel-hex.js.
3. Opening a process or pressing Refresh requests results for an exact snapshot of files, profile, compiler and optimization. A matching cache hit avoids a new build; typing/settings changes alone do not compile.
4. Identical pending requests share work. Changed snapshots are serialized; superseded queued edits are skipped. Old responses cannot become the selected component's current preview.
5. Cache lifetime is the scripts page/session lifetime. Component view switching through openbox preserves it. Profile source drafts remain component working content, not workflow cache.
6. Preprocess/Compile/Assemble show actual intermediate artifacts. Link has Disassembly/Map/Vectors; Export has HEX/Bytes/Bits and HEX download. The remote endpoint builds the complete project; selecting a process only chooses the artifact to inspect.
7. image returns the selected cached build as an image/metadata snapshot, without raw source files. The component publishes it through common/component-channel.js for board handoff; stale/failed current inputs publish no image.
8. Generated programs are inspected, not executed. Failure results are not cached as successes. Flash/standalone/debug behavior is outside this workflow.

Earlier build verification and current limitations are summarized in [implementation.md](../../../implementation.md#3-workflows-current-operation). Retained -output/ evidence is historical.
