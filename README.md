# Chip Openbox

Chip Openbox is a browser-based prototype for exploring embedded software and hardware together. The goal is to follow C source through compilation, see where the resulting instructions are stored on a chip, and trace how running them produces a response on the board.

## 1. What works today

- **Scripts** lets you edit example firmware and inspect the preprocessed source, assembly, object files, link map, vector table, and Intel HEX output.
- **Chip** lets you explore interactive C8051F500 and generic Cortex-M85 diagrams. Expand processor and peripheral blocks, follow signal connections, and inspect selected memory down to individual bits.
- **Board** can pass a compiled image to the chip view for preview. Hardware programming, execution simulation, and debugging are still unfinished.

## 2. Try it locally

1. Clone or download the repository and open [`src/openbox.html`](src/openbox.html) from your local copy in a browser. The workspace requires no installation or local server.
2. In **Scripts**, open **Compile**, **Link**, or **Export** to inspect the example build. New builds require internet access and send the build inputs to Compiler Explorer.
3. In **Chip**, choose a diagram and expand a block. The chip selector and the Scripts build target are independent.
4. After a successful build, switch to **Board** in the combined workspace and select **Flash** to preview the compiled image.

## 3. Work on the prototype

The pane code is in [`src/components/`](src/components/) and the workflow code is in [`src/workflows/`](src/workflows/). Edit the relevant files, reload the local workspace, and try the affected workflow with the included example.

Open areas include placing the compiled image in modeled chip memory, simulating firmware execution and its effects on a board, and adding debugging controls. Possible study extensions include visualizing RTOS tasks and interrupts and tracing signals through digital logic such as a UART.
