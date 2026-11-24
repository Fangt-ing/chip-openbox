/* Generic Cortex-M85 example regions from Arm's ARMCM85 GCC script.
 * ROM: 0x00000000, 0x00040000 bytes; RAM: 0x20000000, 0x00020000 bytes.
 * Example storage, not a manufactured MCU's Flash specification. */
ENTRY(Reset_Handler)
MEMORY {
    ROM (rx) : ORIGIN = 0x00000000, LENGTH = 256K
    RAM (rwx) : ORIGIN = 0x20000000, LENGTH = 128K
}
_estack = ORIGIN(RAM) + LENGTH(RAM);
SECTIONS {
    .isr_vector : ALIGN(2048) {
        KEEP(*(.isr_vector))
    } > ROM
    .text : ALIGN(4) {
        *(.text*) *(.rodata*)
        . = ALIGN(4);
    } > ROM
    .ARM.exidx : { *(.ARM.exidx*) } > ROM
    .data : ALIGN(4) {
        _sdata = .;
        *(.data*)
        . = ALIGN(4);
        _edata = .;
    } > RAM AT> ROM
    _sidata = LOADADDR(.data);
    .bss (NOLOAD) : ALIGN(4) {
        _sbss = .;
        *(.bss*) *(COMMON)
        . = ALIGN(4);
        _ebss = .;
    } > RAM
    /DISCARD/ : { *(.comment*) *(.note*) }
}
ASSERT(_ebss <= _estack, "RAM overflow")
