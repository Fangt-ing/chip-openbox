/* Generic Cortex-M85: minimal build-only C startup.
 * Copies .data, zeros .bss, then calls the application.
 * Not a complete CMSIS/platform boot implementation:
 * no VTOR/security, stack-limit, clock, cache or EPU setup,
 * no C library initialization. Generated code is not executed. */
extern unsigned char _sidata, _sdata, _edata;
extern unsigned char _sbss, _ebss;
extern void application_main(void);

void Reset_Handler(void) {
    unsigned char *source = &_sidata;
    unsigned char *destination = &_sdata;
    while (destination < &_edata)
        *destination++ = *source++;
    destination = &_sbss;
    while (destination < &_ebss)
        *destination++ = 0;
    application_main();
    for (;;) {}
}
