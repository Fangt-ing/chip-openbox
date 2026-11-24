# Generic Cortex-M85 build profile

This is the default **scripting build target**, not a selected MCU/device or an executable chip model. Compiler Explorer uses Arm GCC 13.2 (carmug1320), with -mcpu=cortex-m85 -mthumb -mfloat-abi=soft for compilation and linking. Soft-float avoids emitting FP/MVE operations in this minimal example; those features are not demonstrated.

1. Editable application defaults: [main.c](../../../scripts/default-content/cortex-m85/main.c) and [config.h](../../../scripts/default-content/cortex-m85/config.h).
2. Build support: [startup.c](firmware-support/startup.c), [vectors.c](firmware-support/vectors.c), [linker.ld](firmware-support/linker.ld). Matching snapshots in [profiles.js](../../../scripts/default-content/profiles.js) allow direct-file opening.
3. Arm's generic [ARMCM85 GCC linker example](https://github.com/ARM-software/CMSIS_5/blob/develop/Device/ARM/ARMCM85/Source/GCC/gcc_arm.ld) states “__ROM_BASE = 0x00000000;”, “__ROM_SIZE = 0x00040000;”, “__RAM_BASE = 0x20000000;”, “__RAM_SIZE = 0x00020000;”. These are example ROM/RAM regions (256/128 KiB), not a device's Flash/RAM specification.
4. The [ARMCM85 startup example](https://github.com/ARM-software/CMSIS_5/blob/develop/Device/ARM/ARMCM85/Source/startup_ARMCM85.c) declares “__VECTOR_TABLE[496]”. This profile independently implements that table shape: 16 core slots (including SecureFault), 480 IRQ slots; demonstration IRQs 0–9 are named, later slots remain zero. The table is aligned to 2048 bytes; linker placement and handlers remain editable.
5. Minimal startup only copies .data from ROM to RAM, clears .bss and calls application_main. It is **not** Arm's complete CMSIS startup/SystemInit or production firmware: VTOR/security, stack limits, clocks, caches/EPU and C-library setup are absent. No GPIO, secure/nonsecure handoff, board runtime or programming is implemented.
6. Generated assembly, objects, vectors, map and HEX are inspected; they are not executed or flashed. A concrete MCU or runnable reference-system profile will require its own verified startup, memory/peripheral definitions and runtime model.

References checked 4 November 2026. GCC's [Arm options](https://gcc.gnu.org/onlinedocs/gcc/ARM-Options.html) list cortex-m85; a live Compiler Explorer build must still succeed before an image is accepted.
