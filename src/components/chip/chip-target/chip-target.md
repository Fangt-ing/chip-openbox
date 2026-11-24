# Chip-target definitions

**Cortex-M85 is selected as the demonstration core.** Exact MCU/package and execution backend remain undecided; RA8M1 is a candidate. A device-specific M85 definition must be grounded in the selected part's documentation and verified behavior. See [MCU component](../../../../implementation.md#mcu-component).

The [generic Cortex-M85 folder](cortex-m85/cortex-m85.md) supplies the default scripting build profile using Arm example memory regions and minimal build-only startup/vectors. It does not select a physical MCU or implement a running chip.

The [STM32F103C8 folder](stm32f103c8/stm32f103c8.md) currently contains verified firmware build support. It does not implement CPU, peripheral or bit-cell simulation.

**Architecture-to-instance (a2i):** architecture → MCU-series definition → device definition → chip instance. Reuse documented blocks and behavior; specialize topology, addresses, startup and peripheral rules. Each board instance owns its live state. Runtime architecture/reference and series definitions remain to be designed; current target folders provide build support only.

The three component domains and four workflows are described in [component implementations](../../../../implementation.md#components). Chip definitions supply internal programming/debug behavior; PCB/board owns the Flash workflow and external programming route.

A candidate can receive build support before runtime selection. A complete device model must identify:

1. CPU/ISA and supported execution behavior.
2. Physical storage blocks, address spaces/aliases, memory widths and reset contents.
3. Boot/reset/vector behavior and required firmware-support inputs.
4. Buses, clocks, register access rules, peripheral state and pin interfaces.
5. Documentation sources and a fidelity declaration distinguishing documented structure from symbolic bit-cell presentation.
6. Build/trace compatibility and tests that the supported behavior actually passes.

A board references the target definition through a chip instance and owns that instance's connections. Shared data formats or reusable storage primitives belong under common/. Public architecture manuals do not by themselves establish exact manufactured cell positions or a complete production netlist.
