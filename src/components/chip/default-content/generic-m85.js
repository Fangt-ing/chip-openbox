'use strict';
// Generic MCU integration around M85; timer detail uses the CMSDK reference.
window.ChipOpenboxGenericM85 = {
  "id": "generic-m85",
  "architecture": "cortex-m85",
  "label": "Generic MCU · Cortex-M85",
  "blocks": [
    {
      "id": "flash-controller",
      "name": "Flash controller",
      "fullName": "Generic Flash Memory Controller",
      "kind": "integration",
      "open": false,
      "text": "Receives bus-side programming commands and controls the program-storage array. This functional MCU integration is not a Cortex-M85 processor block; program/erase behavior is not implemented.",
      "parts": [
        "Address and data registers / buffers",
        "Program / erase control logic",
        "Busy / error status"
      ],
      "reference": "Example functional Flash interface: ST PM0075, section 2",
      "referenceHref": "https://www.st.com/resource/en/programming_manual/pm0075-stm32f10xxx-flash-memory-microcontrollers-stmicroelectronics.pdf"
    },
    {
      "id": "program",
      "name": "Program storage",
      "open": false,
      "text": "Generic program-storage array, behind the separate Flash controller. The bit-cell view is an inspection fixture; no physical Flash technology or programming algorithm is selected.",
      "parts": [],
      "kind": "integration",
      "fullName": "Program Storage"
    },
    {
      "id": "ram",
      "name": "RAM",
      "open": false,
      "text": "Generic MCU working RAM, outside the Cortex-M85 processor. Shows one selected 32-bit word; its capacity and implementation are not fixed by M85.",
      "parts": [],
      "kind": "integration",
      "fullName": "Random Access Memory"
    },
    {
      "id": "clock-control",
      "name": "Clock control",
      "fullName": "MCU Clock Generation / Control",
      "text": "MCU-level clock circuitry selects and distributes clock sources to the processor and other on-chip units. Source generation and divider details depend on integration; no particular oscillator or PLL is assumed.",
      "parts": [
        "Optional external clock input; internal source details not selected",
        "CLKIN, DBGCLK and IWICCLK",
        "Processor clock-control Q-Channels"
      ],
      "open": false,
      "kind": "integration"
    },
    {
      "id": "reset-control",
      "name": "Reset control",
      "fullName": "MCU Reset Control",
      "text": "Combines external and internal reset requests and distributes reset signals to the appropriate circuitry. Source and reset scope remain distinct; no device-specific reset policy is selected.",
      "parts": [
        "External reset input",
        "Software SYSRESETREQ request",
        "Internal hardware reset sources may include power-on detection / watchdog",
        "nPORESET, nSYSRESET, nDBGRESET and nIWICRESET"
      ],
      "open": false,
      "kind": "integration"
    },
    {
      "id": "power-control",
      "name": "Power control",
      "fullName": "MCU Power Control",
      "text": "Coordinates processor power states through the documented P-/Q-Channel interfaces. This is control logic, not an electrical supply pin or a selected power-management peripheral.",
      "parts": [
        "Core P-Channel → CPC",
        "Debug power Q-Channel → DPC",
        "No power-state machine is executed"
      ],
      "open": false,
      "kind": "integration"
    },
    {
      "id": "supply",
      "name": "Supply distribution",
      "fullName": "MCU Electrical Supply Distribution",
      "text": "Abstract on-chip supply and ground distribution from the external power connections to internal circuitry. This view does not assume a regulator or model voltages.",
      "parts": [
        "External supply / ground connection",
        "Processor and MCU circuitry supply rails",
        "Separate from P-/Q-Channel power-control handshakes"
      ],
      "open": false,
      "kind": "integration"
    },
    {
      "id": "timer",
      "detailView": "cmsdk-timer",
      "name": "Timer · generic",
      "fullName": "CMSDK APB Timer — MCU Reference Peripheral",
      "text": "CMSDK APB timer reference: 32-bit down-counter, reload, external-input synchronization/selection, APB registers and latched interrupt status. Static reset-state view; no MCU product, timer base address or IRQ number is selected.",
      "parts": [
        "CMSDK 32-bit down-counter / reload / terminal-count detection",
        "EXTIN synchronizer, edge detector and CTRL[2:1] input selection",
        "CTRL, VALUE, RELOAD and INTSTATUS / INTCLEAR APB registers",
        "TIMERINT → processor IRQ input → NVIC; P-AHB/APB bridge abstracted"
      ],
      "open": false,
      "kind": "integration",
      "reference": "Arm CMSDK §4.2 · Figure 4-3 / Table 4-4",
      "referenceHref": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59"
    }
  ],
  "pins": [
    {
      "id": "program",
      "label": "JTAG / SW",
      "side": "left",
      "target": "dap",
      "offset": 0,
      "both": true,
      "description": "Bidirectional connection. External chip debug/programming connection to DAP; logical group without a product pin number."
    },
    {
      "id": "clock",
      "label": "Clock in (opt.)",
      "side": "left",
      "target": "clock-control",
      "offset": 5,
      "alignTarget": true,
      "signalKind": "clock",
      "description": "Example external clock connection when an MCU integration provides one. On-chip clock generation/control is inside the MCU."
    },
    {
      "id": "reset",
      "label": "Reset in",
      "side": "left",
      "target": "reset-control",
      "offset": 6,
      "alignTarget": true,
      "signalKind": "reset",
      "description": "Example external reset connection to MCU reset circuitry; it is not the M85 nSYSRESET package-pin definition."
    },
    {
      "id": "power",
      "label": "Supply / GND",
      "side": "left",
      "target": "supply",
      "offset": 8,
      "alignTarget": true,
      "signalKind": "supply",
      "description": "Electrical supply and ground connections, not processor P-/Q-Channel power-control signals."
    },
    {
      "id": "gpio",
      "label": "GPIO I/O",
      "side": "right",
      "offset": 0,
      "both": true,
      "description": "Bidirectional connection. External GPIO connection point; internal GPIO circuitry/mapping remains unmodeled. This is not a P-AHB bus pin."
    }
  ],
  "links": [
    [
      "interfaces",
      "flash-controller",
      true,
      "M-AXI · generic system connection"
    ],
    [
      "flash-controller",
      "program",
      true,
      "Flash array interface"
    ],
    [
      "interfaces",
      "ram",
      true,
      "M-AXI · generic working RAM"
    ],
    [
      "clock-control",
      "core",
      false,
      "CLKIN · primary processor clock",
      "clock"
    ],
    [
      "clock-control",
      "dbg",
      false,
      "DBGCLK · debug and trace clock",
      "clock"
    ],
    [
      "clock-control",
      "iwic",
      false,
      "IWICCLK · wakeup-controller clock",
      "clock"
    ],
    [
      "clock-control",
      "cpc",
      true,
      "Core clock-control Q-Channel",
      "clock"
    ],
    [
      "clock-control",
      "dpc",
      true,
      "Debug clock-control Q-Channel",
      "clock"
    ],
    [
      "reset-control",
      "cpc",
      false,
      "nPORESET / nSYSRESET · core-domain reset",
      "reset"
    ],
    [
      "reset-control",
      "dpc",
      false,
      "nDBGRESET · debug-domain reset",
      "reset"
    ],
    [
      "reset-control",
      "iwic",
      false,
      "nIWICRESET · wakeup-controller reset",
      "reset"
    ],
    [
      "sysregs",
      "reset-control",
      false,
      "SYSRESETREQ · software functional-reset request",
      "reset"
    ],
    [
      "power-control",
      "cpc",
      true,
      "Core power P-Channel",
      "power-control"
    ],
    [
      "power-control",
      "dpc",
      true,
      "Debug power Q-Channel",
      "power-control"
    ],
    [
      "supply",
      "clock-control",
      false,
      "Electrical supply · clock circuitry",
      "supply"
    ],
    [
      "supply",
      "reset-control",
      false,
      "Electrical supply · reset circuitry",
      "supply"
    ],
    [
      "supply",
      "power-control",
      false,
      "Electrical supply · power-control circuitry",
      "supply"
    ],
    [
      "clock-control",
      "systick",
      false,
      "CLKIN with SSTCLKEN / NSSTCLKEN · SysTick clocks",
      "clock"
    ],
    [
      "clock-control",
      "timer",
      false,
      "PCLK · free-running timer clock",
      "clock",
      "pclk",
      "chip.timer.pclk"
    ],
    [
      "reset-control",
      "timer",
      false,
      "PRESETn · active-low timer reset",
      "reset",
      "reset",
      "chip.timer.reset"
    ],
    [
      "reset-control",
      "systick",
      false,
      "Processor system-timer reset",
      "reset"
    ],
    [
      "supply",
      "timer",
      false,
      "Electrical supply · timer unit",
      "supply"
    ],
    [
      "clock-control",
      "timer",
      false,
      "PCLKG · gated APB register clock, synchronous with PCLK",
      "clock",
      "pclkg",
      "chip.timer.pclkg"
    ]
  ],
  "ramPreview": {
    "peer": "interfaces",
    "baseAddress": 536870912,
    "rows": 8,
    "wordsPerRow": 1,
    "bitsPerWord": 8,
    "initialValue": 0
  },
  "memoryPreviews": {
    "program": {
      "peer": "flash-controller",
      "baseAddress": 0,
      "rows": 8,
      "wordsPerRow": 1,
      "bitsPerWord": 8,
      "initialValue": 0,
      "readOnly": true,
      "addressLabel": "Address",
      "addressMeaning": "Selected read/program address in the generic program-storage region",
      "kind": "program",
      "netPeers": {
        "address": "flash-controller",
        "input": "flash-controller",
        "control": "flash-controller",
        "program-control": "flash-controller",
        "output": "flash-controller"
      }
    },
    "iram": {
      "peer": "icache",
      "baseAddress": 0,
      "rows": 32,
      "wordsPerRow": 1,
      "bitsPerWord": 8,
      "initialValue": 0,
      "addressLabel": "Offset",
      "addressMeaning": "Instruction-cache array offset; selected 32-bit word within a 32-byte line, not a CPU address",
      "kind": "instruction-cache",
      "cacheLineBytes": 32
    },
    "dram": {
      "peer": "dcache",
      "baseAddress": 0,
      "rows": 32,
      "wordsPerRow": 1,
      "bitsPerWord": 8,
      "initialValue": 0,
      "addressLabel": "Offset",
      "addressMeaning": "Data-cache array offset; selected 32-bit word within a 32-byte line, not a CPU address",
      "kind": "data-cache",
      "cacheLineBytes": 32
    }
  },
  "view": {
    "positions": {
      "interrupts": [
        450,
        150
      ],
      "mau": [
        630,
        150
      ],
      "tcm": [
        900,
        150
      ],
      "ifu": [
        485,
        285
      ],
      "core": [
        695,
        285
      ],
      "epu": [
        510,
        470
      ],
      "access": [
        1000,
        280
      ],
      "piu": [
        1150,
        280
      ],
      "store": [
        1000,
        455
      ],
      "icache": [
        460,
        610
      ],
      "dcache": [
        675,
        610
      ],
      "iram": [
        475,
        725
      ],
      "dram": [
        695,
        725
      ],
      "interfaces": [
        1000,
        725
      ],
      "miu": [
        1150,
        610
      ],
      "iwic": [
        1330,
        600
      ],
      "dap": [
        1860,
        170
      ],
      "program": [
        2260,
        350
      ],
      "ram": [
        2260,
        490
      ],
      "dbg": [
        1370,
        160
      ],
      "bpu": [
        1360,
        290
      ],
      "dwt": [
        1480,
        290
      ],
      "pmu": [
        1600,
        290
      ],
      "itm": [
        1360,
        400
      ],
      "cti": [
        1480,
        400
      ],
      "etm": [
        1600,
        400
      ],
      "debug-rom": [
        1370,
        510
      ],
      "sysregs": [
        1150,
        455
      ],
      "pmc": [
        1120,
        800
      ],
      "ewic": [
        1860,
        300
      ],
      "sbist": [
        2020,
        300
      ],
      "mcu-rom": [
        1860,
        410
      ],
      "etb": [
        1860,
        520
      ],
      "tpiu": [
        2020,
        520
      ],
      "flash-controller": [
        2260,
        170
      ],
      "cpc": [
        1150,
        150
      ],
      "dpc": [
        1600,
        510
      ],
      "clock-control": [
        100,
        170
      ],
      "reset-control": [
        100,
        310
      ],
      "power-control": [
        100,
        450
      ],
      "supply": [
        100,
        590
      ],
      "systick": [
        630,
        200
      ],
      "timer": [
        100,
        800
      ]
    },
    "rightColumnX": 1860,
    "processorOffsetX": 300,
    "leftColumn": {
      "x": 100,
      "gap": 24,
      "members": [
        "clock-control",
        "reset-control",
        "power-control",
        "supply",
        "timer"
      ]
    },
    "mcuLabel": "MCU level · documented reference components",
    "minWidth": 1650,
    "minHeight": 930
  },
  "groups": [
    {
      "id": "mcu-integration",
      "name": "MCU integration · generic memory",
      "note": "Example system components, not blocks mandated by Cortex-M85",
      "children": [
        "flash-controller",
        "program",
        "ram"
      ]
    },
    {
      "id": "mcu-system",
      "name": "MCU system circuitry",
      "note": "On-chip system functions, outside the M85 processor; abstract integration, not a selected product implementation",
      "children": [
        "clock-control",
        "reset-control",
        "power-control",
        "supply"
      ]
    },
    {
      "id": "mcu-peripherals",
      "name": "MCU peripherals",
      "note": "Generic MCU timer example outside the processor; no product-specific peripheral inventory is implied",
      "children": [
        "timer"
      ]
    }
  ],
  "domainLinks": [
    {
      "source": "supply",
      "target": "processor",
      "kind": "supply",
      "label": "Electrical supply · processor circuitry"
    },
    {
      "source": "supply",
      "target": "mcu-integration",
      "kind": "supply",
      "label": "Electrical supply · memory circuitry"
    }
  ],
  "interfaceLinks": [
    {
      "source": "timer",
      "interface": "irq",
      "blockSide": "right",
      "both": false,
      "kind": "interrupt",
      "label": "TIMERINT · timer pending interrupt; IRQ assignment not selected",
      "net": "chip.timer.irq",
      "detailPort": "irq"
    },
    {
      "source": "timer",
      "interface": "pahb",
      "blockSide": "left",
      "both": false,
      "kind": "peripheral",
      "label": "P-AHB → timer APB requests · bus bridge abstracted",
      "net": "chip.timer.apb",
      "detailPort": "registers"
    },
    {
      "id": "timer-register-return",
      "source": "timer",
      "interface": "pahb",
      "blockSide": "right",
      "both": false,
      "direction": "from-block",
      "kind": "peripheral",
      "label": "Timer APB response → P-AHB · bus bridge abstracted",
      "net": "chip.timer.apb",
      "detailPort": "register-return"
    }
  ],
  "scope": "Generic MCU integration around Cortex-M85; no manufactured MCU or execution model."
};
