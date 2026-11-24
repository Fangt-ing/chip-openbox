/* STM32F103C8: main-Flash boot only.
 * Reset clock configuration is retained. */
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
