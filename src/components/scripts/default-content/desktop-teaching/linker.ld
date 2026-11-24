/* Desktop demonstration, not an MCU. */
ENTRY(_start)
PHDRS {
  rom PT_LOAD FLAGS(5);
  ram PT_LOAD FLAGS(6);
}
SECTIONS {
  . = 0x10000;
  .vectors : {
    KEEP(*(.vectors))
  } :rom
  .text : { *(.text*) } :rom
  .rodata : { *(.rodata*) } :rom
  .data : { *(.data*) } :ram
  .bss (NOLOAD) : {
    *(.bss*) *(COMMON)
  } :ram
  /DISCARD/ : {
    *(.eh_frame*) *(.note*)
    *(.comment*)
  }
}
