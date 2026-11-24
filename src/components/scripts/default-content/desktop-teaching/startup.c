/* Temporary desktop entry point. */
extern void application_main(void);

void _start(void) {
    application_main();
    for (;;) {}
}
