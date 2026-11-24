#include "config.h"

volatile unsigned char led_state;
const unsigned char boot_pattern =
    LED_MASK;

void application_main(void) {
    led_state = LED_MASK;
}
