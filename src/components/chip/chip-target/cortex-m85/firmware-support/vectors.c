/* Generic Cortex-M85 example layout: 16 core + 480 IRQ slots.
 * Matches the shape of Arm's ARMCM85 example; not a device IRQ map.
 * IRQs 0..9 are editable demonstration handlers; 10..479 stay zero.
 * See chip-target/cortex-m85/cortex-m85.md for references and limits. */
typedef void (*handler_t)(void);
extern unsigned char _estack;
extern void Reset_Handler(void);

void Default_Handler(void) { for (;;) {} }
void Demo_Handler(void) {}
#define WEAK_IRQ(name) \
    void name(void) \
    __attribute__((weak, alias("Default_Handler")));

WEAK_IRQ(NMI_Handler)
WEAK_IRQ(HardFault_Handler)
WEAK_IRQ(MemManage_Handler)
WEAK_IRQ(BusFault_Handler)
WEAK_IRQ(UsageFault_Handler)
WEAK_IRQ(SecureFault_Handler)
WEAK_IRQ(SVC_Handler)
WEAK_IRQ(DebugMon_Handler)
WEAK_IRQ(PendSV_Handler)
WEAK_IRQ(SysTick_Handler)
WEAK_IRQ(Interrupt0_Handler)
WEAK_IRQ(Interrupt1_Handler)
WEAK_IRQ(Interrupt2_Handler)
WEAK_IRQ(Interrupt3_Handler)
WEAK_IRQ(Interrupt4_Handler)
WEAK_IRQ(Interrupt5_Handler)
WEAK_IRQ(Interrupt6_Handler)
WEAK_IRQ(Interrupt7_Handler)
WEAK_IRQ(Interrupt8_Handler)
WEAK_IRQ(Interrupt9_Handler)

__attribute__((used, section(".isr_vector"), aligned(2048)))
handler_t const vector_table[496] = {
    (handler_t)&_estack, /* Initial MSP */
    Reset_Handler,
    NMI_Handler,
    HardFault_Handler,
    MemManage_Handler,
    BusFault_Handler,
    UsageFault_Handler,
    SecureFault_Handler,
    0 /* Reserved */,
    0 /* Reserved */,
    0 /* Reserved */,
    SVC_Handler,
    DebugMon_Handler,
    0 /* Reserved */,
    PendSV_Handler,
    SysTick_Handler,
    Interrupt0_Handler,
    Interrupt1_Handler,
    Interrupt2_Handler,
    Interrupt3_Handler,
    Interrupt4_Handler,
    Interrupt5_Handler,
    Interrupt6_Handler,
    Interrupt7_Handler,
    Interrupt8_Handler,
    Interrupt9_Handler,
    /* Remaining IRQ slots are zero-initialized. */
};
