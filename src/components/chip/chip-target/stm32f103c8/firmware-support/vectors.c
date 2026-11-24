/* STM32F103C8 main-Flash vector layout.
 * 16 core slots + 43 device IRQ slots.
 * Handler order follows ST's medium-
 * density startup table. No RAM-boot
 * magic word is included in this example. */
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
WEAK_IRQ(SVC_Handler)
WEAK_IRQ(DebugMon_Handler)
WEAK_IRQ(PendSV_Handler)
WEAK_IRQ(SysTick_Handler)
WEAK_IRQ(WWDG_IRQHandler)
WEAK_IRQ(PVD_IRQHandler)
WEAK_IRQ(TAMPER_IRQHandler)
WEAK_IRQ(RTC_IRQHandler)
WEAK_IRQ(FLASH_IRQHandler)
WEAK_IRQ(RCC_IRQHandler)
WEAK_IRQ(EXTI0_IRQHandler)
WEAK_IRQ(EXTI1_IRQHandler)
WEAK_IRQ(EXTI2_IRQHandler)
WEAK_IRQ(EXTI3_IRQHandler)
WEAK_IRQ(EXTI4_IRQHandler)
WEAK_IRQ(DMA1_Channel1_IRQHandler)
WEAK_IRQ(DMA1_Channel2_IRQHandler)
WEAK_IRQ(DMA1_Channel3_IRQHandler)
WEAK_IRQ(DMA1_Channel4_IRQHandler)
WEAK_IRQ(DMA1_Channel5_IRQHandler)
WEAK_IRQ(DMA1_Channel6_IRQHandler)
WEAK_IRQ(DMA1_Channel7_IRQHandler)
WEAK_IRQ(ADC1_2_IRQHandler)
WEAK_IRQ(USB_HP_CAN1_TX_IRQHandler)
WEAK_IRQ(USB_LP_CAN1_RX0_IRQHandler)
WEAK_IRQ(CAN1_RX1_IRQHandler)
WEAK_IRQ(CAN1_SCE_IRQHandler)
WEAK_IRQ(EXTI9_5_IRQHandler)
WEAK_IRQ(TIM1_BRK_IRQHandler)
WEAK_IRQ(TIM1_UP_IRQHandler)
WEAK_IRQ(TIM1_TRG_COM_IRQHandler)
WEAK_IRQ(TIM1_CC_IRQHandler)
WEAK_IRQ(TIM2_IRQHandler)
WEAK_IRQ(TIM3_IRQHandler)
WEAK_IRQ(TIM4_IRQHandler)
WEAK_IRQ(I2C1_EV_IRQHandler)
WEAK_IRQ(I2C1_ER_IRQHandler)
WEAK_IRQ(I2C2_EV_IRQHandler)
WEAK_IRQ(I2C2_ER_IRQHandler)
WEAK_IRQ(SPI1_IRQHandler)
WEAK_IRQ(SPI2_IRQHandler)
WEAK_IRQ(USART1_IRQHandler)
WEAK_IRQ(USART2_IRQHandler)
WEAK_IRQ(USART3_IRQHandler)
WEAK_IRQ(EXTI15_10_IRQHandler)
WEAK_IRQ(RTC_Alarm_IRQHandler)
WEAK_IRQ(USBWakeUp_IRQHandler)

__attribute__((used, section(".isr_vector")))
handler_t const vector_table[] = {
    (handler_t)&_estack, /* Initial MSP */
    Reset_Handler,
    NMI_Handler,
    HardFault_Handler,
    MemManage_Handler,
    BusFault_Handler,
    UsageFault_Handler,
    0,
    0,
    0,
    0,
    SVC_Handler,
    DebugMon_Handler,
    0,
    PendSV_Handler,
    SysTick_Handler,
    WWDG_IRQHandler, /* IRQ 0 */
    PVD_IRQHandler, /* IRQ 1 */
    TAMPER_IRQHandler, /* IRQ 2 */
    RTC_IRQHandler, /* IRQ 3 */
    FLASH_IRQHandler, /* IRQ 4 */
    RCC_IRQHandler, /* IRQ 5 */
    EXTI0_IRQHandler, /* IRQ 6 */
    EXTI1_IRQHandler, /* IRQ 7 */
    EXTI2_IRQHandler, /* IRQ 8 */
    EXTI3_IRQHandler, /* IRQ 9 */
    EXTI4_IRQHandler, /* IRQ 10 */
    DMA1_Channel1_IRQHandler, /* IRQ 11 */
    DMA1_Channel2_IRQHandler, /* IRQ 12 */
    DMA1_Channel3_IRQHandler, /* IRQ 13 */
    DMA1_Channel4_IRQHandler, /* IRQ 14 */
    DMA1_Channel5_IRQHandler, /* IRQ 15 */
    DMA1_Channel6_IRQHandler, /* IRQ 16 */
    DMA1_Channel7_IRQHandler, /* IRQ 17 */
    ADC1_2_IRQHandler, /* IRQ 18 */
    USB_HP_CAN1_TX_IRQHandler, /* IRQ 19 */
    USB_LP_CAN1_RX0_IRQHandler, /* IRQ 20 */
    CAN1_RX1_IRQHandler, /* IRQ 21 */
    CAN1_SCE_IRQHandler, /* IRQ 22 */
    EXTI9_5_IRQHandler, /* IRQ 23 */
    TIM1_BRK_IRQHandler, /* IRQ 24 */
    TIM1_UP_IRQHandler, /* IRQ 25 */
    TIM1_TRG_COM_IRQHandler, /* IRQ 26 */
    TIM1_CC_IRQHandler, /* IRQ 27 */
    TIM2_IRQHandler, /* IRQ 28 */
    TIM3_IRQHandler, /* IRQ 29 */
    TIM4_IRQHandler, /* IRQ 30 */
    I2C1_EV_IRQHandler, /* IRQ 31 */
    I2C1_ER_IRQHandler, /* IRQ 32 */
    I2C2_EV_IRQHandler, /* IRQ 33 */
    I2C2_ER_IRQHandler, /* IRQ 34 */
    SPI1_IRQHandler, /* IRQ 35 */
    SPI2_IRQHandler, /* IRQ 36 */
    USART1_IRQHandler, /* IRQ 37 */
    USART2_IRQHandler, /* IRQ 38 */
    USART3_IRQHandler, /* IRQ 39 */
    EXTI15_10_IRQHandler, /* IRQ 40 */
    RTC_Alarm_IRQHandler, /* IRQ 41 */
    USBWakeUp_IRQHandler, /* IRQ 42 */
};
