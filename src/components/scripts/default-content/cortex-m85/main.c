#include "config.h"

/* Generic Cortex-M85 RAM-write build example.
 * No board GPIO or LED is configured. */
volatile unsigned char led_state;
volatile unsigned char initial_value = LED_MASK;
const unsigned char boot_pattern = LED_MASK;

void application_main(void) {
    led_state = initial_value;
}
