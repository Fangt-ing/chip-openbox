/* Illustrative desktop table.
 * Not an MCU hardware layout. */
typedef void (*handler_t)(void);
extern void _start(void);

void Default_Handler(void) { for (;;) {} }
void Demo_Handler(void) {}

__attribute__((used, section(".vectors")))
handler_t const vector_table[] = {
    _start,          /* reset */
    Default_Handler /* interrupt */
};
