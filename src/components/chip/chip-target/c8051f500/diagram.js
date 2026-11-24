'use strict';
// Manufacturer-defined instance; aggregate units and routing are abstract functional views.
window.ChipOpenboxC8051F500 = {
  "architecture": {
    "id": "cip-51",
    "label": "CIP-51 processor",
    "reference": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=18",
    "referenceLabel": "Silicon Labs datasheet · Rev. 1.0",
    "hierarchyReference": "§11 / Figure 11.1; functional aggregates of documented CIP-51 units, not silicon layout.",
    "blocks": [
      {
        "id": "pc",
        "name": "PC / program address",
        "fullName": "Program counter and program-address registers",
        "text": "Selects the program-memory instruction address.",
        "parts": [
          "16-bit PC",
          "PC incrementer",
          "Program address register"
        ],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "pipeline",
        "name": "Pipeline buffer",
        "fullName": "Instruction pipeline buffer",
        "text": "Holds fetched instruction bytes for the CIP-51 control logic.",
        "parts": [],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "control",
        "name": "Control logic",
        "fullName": "CIP-51 instruction control logic",
        "text": "Decodes instructions and controls operations; this view does not execute instructions.",
        "parts": [],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "alu",
        "name": "ALU",
        "fullName": "8-bit Arithmetic Logic Unit",
        "text": "Performs arithmetic and logic operations.",
        "parts": [
          "TMP1 / TMP2 input registers"
        ],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "registers",
        "name": "ACC / B / PSW",
        "fullName": "Accumulator, B register and program status word",
        "text": "Eight-bit operand and status registers connected to the internal data bus.",
        "parts": [
          "ACC · 8 bits",
          "B · 8 bits",
          "PSW · 8 bits"
        ],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "pointers",
        "name": "DPTR / SP",
        "fullName": "Data pointer and stack pointer",
        "text": "Addresses data accesses and the internal-RAM stack.",
        "parts": [
          "DPTR · 16 bits",
          "SP · 8 bits"
        ],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "memory-interface",
        "name": "Memory interface",
        "fullName": "CIP-51 memory interface",
        "text": "Connects program and MOVX memory transactions through the documented memory interface.",
        "parts": [
          "MEM_ADDRESS · 16 bits",
          "MEM_WRITE_DATA / MEM_READ_DATA · 8 bits",
          "MEM_CONTROL"
        ],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "sfr-interface",
        "name": "SFR bus interface",
        "fullName": "Special Function Register Bus Interface",
        "text": "Connects the core to distributed control and peripheral registers; SFRs are not another RAM array.",
        "parts": [
          "SFR_ADDRESS",
          "SFR_CONTROL",
          "SFR_WRITE_DATA / SFR_READ_DATA · 8 bits"
        ],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "interrupts",
        "name": "Interrupt interface",
        "fullName": "CIP-51 interrupt interface",
        "text": "Accepts peripheral/system requests and the debug emulation request.",
        "parts": [
          "SYSTEM_IRQs",
          "EMULATION_IRQ"
        ],
        "open": false,
        "kind": "processor",
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "ram",
        "name": "Internal RAM · 256 B",
        "fullName": "Internal Data RAM",
        "text": "DATA/IDATA space: 256 bytes, with direct/indirect addressing distinctions. The default byte is 0x00; zero contents are only a fixture default.",
        "parts": [
          "Register banks / bit-addressable area",
          "Upper 128 bytes: indirect access"
        ],
        "open": false,
        "kind": "processor",
        "reference": "§12 · Figure 12.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=97"
      },
      {
        "id": "sram-address",
        "name": "SRAM address register",
        "fullName": "Internal SRAM Address Register",
        "text": "Selects the internal SRAM byte independently of CODE and MOVX memory spaces.",
        "parts": [],
        "kind": "processor",
        "open": false,
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      },
      {
        "id": "power-control",
        "name": "Power control register",
        "fullName": "CIP-51 Power Control Register",
        "text": "Controls documented IDLE and STOP operating modes; no power-state simulation is implemented.",
        "parts": [
          "IDLE",
          "STOP"
        ],
        "kind": "processor",
        "open": false,
        "reference": "§11 · Figure 11.1",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=87"
      }
    ],
    "mcuBlocks": [],
    "groups": [
      "pc",
      "pipeline",
      "control",
      "alu",
      "registers",
      "pointers",
      "memory-interface",
      "sfr-interface",
      "interrupts",
      "ram",
      "sram-address",
      "power-control"
    ],
    "links": [
      [
        "pc",
        "memory-interface",
        false,
        "Program address · 16 bits",
        null
      ],
      [
        "memory-interface",
        "pipeline",
        false,
        "Fetched instruction bytes · 8 bits",
        null
      ],
      [
        "pipeline",
        "control",
        false,
        "Buffered instruction",
        null
      ],
      [
        "control",
        "alu",
        false,
        "ALU operation control",
        null
      ],
      [
        "registers",
        "alu",
        true,
        "Operand/result data · 8 bits",
        null
      ],
      [
        "pointers",
        "memory-interface",
        false,
        "Data address",
        null
      ],
      [
        "control",
        "pc",
        false,
        "Branch / sequential PC control",
        null
      ],
      [
        "control",
        "sfr-interface",
        true,
        "SFR transactions",
        null
      ],
      [
        "sfr-interface",
        "registers",
        true,
        "Architectural register access · 8 bits",
        null
      ],
      [
        "interrupts",
        "control",
        false,
        "Interrupt service request",
        "interrupt"
      ],
      [
        "pointers",
        "sram-address",
        false,
        "Internal SRAM address selection",
        null
      ],
      [
        "clock",
        "control",
        false,
        "System clock",
        "clock"
      ],
      [
        "reset",
        "control",
        false,
        "Reset",
        "reset"
      ],
      [
        "regulator",
        "reset",
        false,
        "Supply / power-on monitor",
        "supply"
      ],
      [
        "debug",
        "interrupts",
        false,
        "Emulation request",
        "interrupt"
      ],
      [
        "debug",
        "program",
        true,
        "C2 Flash programming access",
        null
      ],
      [
        "memory-interface",
        "program",
        true,
        "CODE read / self-program access",
        null
      ],
      [
        "memory-interface",
        "xram",
        true,
        "MOVX on-chip data access",
        null
      ],
      [
        "memory-interface",
        "emif",
        true,
        "MOVX off-chip access",
        null
      ],
      [
        "emif",
        "ports",
        true,
        "External memory signals / configured ports",
        null
      ],
      [
        "sfr-interface",
        "timers",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "pca",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "uart",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "spi",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "smbus",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "can",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "lin",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "clock",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "reset",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "ports",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "adc",
        true,
        "SFR register access",
        null
      ],
      [
        "sfr-interface",
        "comparators",
        true,
        "SFR register access",
        null
      ],
      [
        "timers",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "pca",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "uart",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "spi",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "smbus",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "can",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "lin",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "adc",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "comparators",
        "interrupts",
        false,
        "Peripheral interrupt request",
        "interrupt"
      ],
      [
        "timers",
        "crossbar",
        true,
        "Peripheral pin routing",
        null
      ],
      [
        "pca",
        "crossbar",
        true,
        "Peripheral pin routing",
        null
      ],
      [
        "uart",
        "crossbar",
        true,
        "Peripheral pin routing",
        null
      ],
      [
        "spi",
        "crossbar",
        true,
        "Peripheral pin routing",
        null
      ],
      [
        "smbus",
        "crossbar",
        true,
        "Peripheral pin routing",
        null
      ],
      [
        "can",
        "crossbar",
        true,
        "Peripheral pin routing",
        null
      ],
      [
        "lin",
        "crossbar",
        true,
        "Peripheral pin routing",
        null
      ],
      [
        "crossbar",
        "ports",
        true,
        "Selected digital functions",
        null
      ],
      [
        "ports",
        "amux",
        false,
        "Analog port input selection",
        null
      ],
      [
        "temperature",
        "amux",
        false,
        "Internal analog source",
        null
      ],
      [
        "amux",
        "adc",
        false,
        "Selected analog input",
        null
      ],
      [
        "reference",
        "adc",
        false,
        "ADC voltage reference",
        null
      ],
      [
        "comparators",
        "reset",
        false,
        "Comparator 0 reset option",
        "reset"
      ],
      [
        "pca",
        "reset",
        false,
        "Watchdog reset",
        "reset"
      ],
      [
        "control",
        "power-control",
        true,
        "IDLE / STOP control",
        null
      ],
      [
        "ports",
        "interrupts",
        false,
        "External INT0 / INT1 requests",
        "interrupt"
      ],
      [
        "reset",
        "clock",
        false,
        "MCU reset → clock configuration registers",
        "reset"
      ],
      [
        "clock",
        "timers",
        false,
        "SYSCLK → timers clock selection",
        "clock"
      ],
      [
        "clock",
        "timers",
        false,
        "Optional EXOSC → timers clock selection (not selected at reset)",
        "clock"
      ],
      [
        "clock",
        "pca",
        false,
        "SYSCLK → pca clock selection",
        "clock"
      ],
      [
        "clock",
        "pca",
        false,
        "Optional EXOSC → pca clock selection (not selected at reset)",
        "clock"
      ]
    ],
    "interfaces": []
  },
  "instance": {
    "id": "c8051f500",
    "architecture": "cip-51",
    "label": "C8051F500 · CIP-51 / 8051",
    "referenceLabel": "Datasheet",
    "keywords": "Silicon Labs 8-bit 8051 CIP51 C2 bootloader",
    "scope": "C8051F500 functional diagram from the manufacturer datasheet. Static inspection only; grouped logical contacts, no selected package pin numbers or bootloader installed.",
    "programUnit": "program",
    "blocks": [
      {
        "id": "program",
        "name": "Flash · 64 KiB",
        "fullName": "Flash Program Memory",
        "text": "CODE space, nominal 64 KiB. Device security/reserved areas must be respected by a future programmer. No bootloader is preloaded in this diagram.",
        "parts": [
          "512-byte erase sectors",
          "Self-programming and C2 programming"
        ],
        "open": false,
        "kind": "device",
        "reference": "§15 · Flash memory",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=129"
      },
      {
        "id": "xram",
        "name": "XRAM · 4 KiB",
        "fullName": "On-chip External-Data-Space RAM",
        "text": "Separate XDATA address space; 4096 on-chip bytes accessed with MOVX. Address 0x0000 here does not identify the CODE or internal-RAM byte.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§18 · External data memory / XRAM",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=147"
      },
      {
        "id": "clock",
        "name": "System clock setup",
        "fullName": "Oscillators and Clock Selection",
        "text": "Internal/external oscillator paths, IFCN divider, clock multiplier, CLKSEL selection and their SFR controls. Static reset snapshot: nominal 24 MHz / 128 = 187.5 kHz SYSCLK.",
        "parts": [
          "Internal 24 MHz oscillator",
          "External oscillator drive",
          "Clock multiplier / source selection"
        ],
        "open": false,
        "kind": "device",
        "reference": "§19 · Oscillators and clock selection",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=165"
      },
      {
        "id": "reset",
        "name": "Reset sources",
        "fullName": "Reset Source Logic",
        "text": "Combines external reset and documented internal reset causes.",
        "parts": [
          "Power-on / VDD monitor",
          "External RST / software reset",
          "Missing-clock / comparator / PCA watchdog / Flash error"
        ],
        "open": false,
        "kind": "device",
        "reference": "§17 · Reset sources",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=141"
      },
      {
        "id": "regulator",
        "name": "REG0 · LDO",
        "fullName": "On-chip Voltage Regulator",
        "text": "Regulates the supply from VREGIN to the internal supply domain. Electrical behavior is not simulated.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§10 · Voltage regulator",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=84"
      },
      {
        "id": "debug",
        "name": "C2 debug / programming",
        "fullName": "Debug and Programming Hardware",
        "text": "Documented C2 interface provides in-system Flash programming and debugging. It is hardware, distinct from bootloader firmware stored in Flash.",
        "parts": [
          "C2CK / RST shared pin",
          "C2D shared with P3.0",
          "Breakpoints / run / halt / memory access"
        ],
        "open": false,
        "kind": "device",
        "reference": "§28 · C2 interface",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=314"
      },
      {
        "id": "timers",
        "name": "Timers 0–3",
        "fullName": "Four 16-bit Counter/Timers",
        "text": "Timer 0/1 provide classic 8051 modes; Timer 2/3 provide reload/capture functions. No CMSDK timer internals are reused.",
        "parts": [
          "Timer 0",
          "Timer 1",
          "Timer 2",
          "Timer 3"
        ],
        "open": false,
        "kind": "device",
        "reference": "§26 · Timers",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=272"
      },
      {
        "id": "pca",
        "name": "PCA0 / watchdog",
        "fullName": "Programmable Counter Array and Watchdog",
        "text": "Six capture/compare channels and watchdog functionality share the documented PCA.",
        "parts": [
          "16-bit counter",
          "Channels 0–5",
          "Watchdog"
        ],
        "open": false,
        "kind": "device",
        "reference": "§27 · Programmable counter array",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=294"
      },
      {
        "id": "uart",
        "name": "UART0",
        "fullName": "Enhanced UART0",
        "text": "Asynchronous transmit/receive peripheral with its dedicated baud-rate generator.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§24 · UART0",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=250"
      },
      {
        "id": "spi",
        "name": "SPI0",
        "fullName": "Enhanced Serial Peripheral Interface",
        "text": "Full-duplex synchronous serial peripheral; its signals are routed by the crossbar.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§25 · Enhanced SPI",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=259"
      },
      {
        "id": "smbus",
        "name": "SMBus / I²C",
        "fullName": "SMBus Serial Interface",
        "text": "Two-wire serial controller connected through the priority crossbar.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§23 · SMBus",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=228"
      },
      {
        "id": "can",
        "name": "CAN0",
        "fullName": "CAN 2.0B Controller",
        "text": "CAN controller present on C8051F500. External transceiver and bus circuitry belong to the board.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§22 · CAN",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=222"
      },
      {
        "id": "lin",
        "name": "LIN0",
        "fullName": "LIN Controller",
        "text": "LIN controller present on C8051F500. External transceiver belongs to the board.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§21 · LIN",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=201"
      },
      {
        "id": "crossbar",
        "name": "Priority crossbar",
        "fullName": "Priority Crossbar Decoder",
        "text": "Routes enabled digital peripheral signals to port pins. Connections show possible routes, not simultaneous pin assignments.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§20 · Port input/output",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=177"
      },
      {
        "id": "ports",
        "name": "Ports P0–P4",
        "fullName": "Port I/O Configuration and Drivers",
        "text": "Forty digital I/O pins with input/output configuration and driver circuitry. Package contacts are endpoints; this unit is their on-chip logic.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§20 · Port input/output",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=177"
      },
      {
        "id": "emif",
        "name": "External memory interface",
        "fullName": "External Data Memory Interface",
        "text": "Routes off-chip MOVX address/data/control signals through configured port functions.",
        "parts": [
          "EMIF address/data/control",
          "Port configuration"
        ],
        "open": false,
        "kind": "device",
        "reference": "§18 · External data memory / XRAM",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=147"
      },
      {
        "id": "amux",
        "name": "AMUX0",
        "fullName": "Analog Input Multiplexer",
        "text": "Selects port analog inputs or internal sources for ADC0.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§6.5 · ADC analog multiplexer",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=70"
      },
      {
        "id": "adc",
        "name": "ADC0 · 12-bit",
        "fullName": "12-bit Analog-to-Digital Converter",
        "text": "Converts the selected analog input; conversion and analog voltages are not simulated.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§6 · ADC0",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=52"
      },
      {
        "id": "reference",
        "name": "VREF",
        "fullName": "Voltage Reference",
        "text": "Selects the voltage reference used by ADC0.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§8 · Voltage reference",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=73"
      },
      {
        "id": "temperature",
        "name": "Temperature sensor",
        "fullName": "On-chip Temperature Sensor",
        "text": "Provides an internal analog source to AMUX0.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§7 · Temperature sensor",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=72"
      },
      {
        "id": "comparators",
        "name": "Comparators 0 / 1",
        "fullName": "Analog Comparators",
        "text": "Two comparators with selectable inputs, interrupt output and Comparator 0 reset option.",
        "parts": [],
        "open": false,
        "kind": "device",
        "reference": "§9 · Comparators",
        "referenceHref": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=75"
      }
    ],
    "links": [],
    "pins": [
      {
        "id": "program",
        "label": "C2D / P3.0",
        "side": "left",
        "offset": 0,
        "target": "debug",
        "both": true,
        "description": "Shared C2 data / P3.0 package signal; no pin number selected."
      },
      {
        "id": "c2-clock",
        "label": "C2CK / RST",
        "side": "left",
        "offset": 1,
        "target": "debug",
        "description": "Shared C2 clock and external reset pin; reset branch shown separately.",
        "targets": [
          "debug",
          "reset"
        ]
      },
      {
        "id": "clock",
        "label": "XTAL1 / P0.2",
        "side": "left",
        "offset": 3,
        "target": "clock",
        "both": false,
        "description": "XTAL1 shares P0.2; used by crystal/resonator mode. Board crystal circuitry is not implemented.",
        "detailPort": "XTAL1",
        "net": "chip.clock.xtal1"
      },
      {
        "id": "clock-xtal2",
        "label": "XTAL2 / P0.3",
        "side": "left",
        "offset": 4,
        "target": "clock",
        "both": true,
        "detailPort": "XTAL2",
        "net": "chip.clock.xtal2",
        "description": "XTAL2 shares P0.3; oscillator output or external clock input according to mode."
      },
      {
        "id": "power",
        "label": "VREGIN",
        "side": "left",
        "offset": 5,
        "target": "regulator",
        "signalKind": "supply"
      },
      {
        "id": "supply",
        "label": "VDD / GND",
        "side": "left",
        "offset": 6,
        "target": "reset",
        "signalKind": "supply",
        "description": "Grouped VDD / GND supply and monitor connection; analog supply and VIO routing are omitted from this functional view."
      },
      {
        "id": "analog",
        "label": "Analog in",
        "side": "left",
        "offset": 8,
        "target": "amux",
        "description": "Logical analog view of multiplexed P0–P3 pads; these are not extra package pins."
      },
      {
        "id": "reference",
        "label": "VREF",
        "side": "left",
        "offset": 9,
        "target": "reference",
        "both": true,
        "description": "External reference input or internal reference output, according to configuration."
      },
      {
        "id": "io",
        "label": "P0–P4 I/O",
        "side": "right",
        "offset": 8,
        "target": "ports",
        "both": true,
        "direction": "output",
        "description": "Forty multiplexed digital I/O pads; some share analog, EMIF and C2 functions."
      }
    ],
    "groups": [
      {
        "id": "device-memory",
        "name": "Program / XDATA memory",
        "note": "§12 distinguishes CODE and XDATA spaces; this is a functional grouping, not a silicon floorplan.",
        "children": [
          "program",
          "xram"
        ]
      },
      {
        "id": "digital-peripherals",
        "name": "Digital peripherals / port I/O",
        "note": "Figure 1.1; digital peripheral functions and port routing.",
        "children": [
          "timers",
          "pca",
          "uart",
          "spi",
          "smbus",
          "can",
          "lin",
          "crossbar",
          "ports",
          "emif"
        ]
      },
      {
        "id": "analog-peripherals",
        "name": "Analog peripherals",
        "note": "Figure 1.1; documented analog units.",
        "children": [
          "amux",
          "adc",
          "reference",
          "temperature",
          "comparators"
        ]
      }
    ],
    "view": {
      "positions": {
        "pc": [
          410,
          165
        ],
        "pipeline": [
          620,
          165
        ],
        "control": [
          810,
          165
        ],
        "pointers": [
          410,
          255
        ],
        "memory-interface": [
          620,
          255
        ],
        "sfr-interface": [
          810,
          255
        ],
        "registers": [
          410,
          345
        ],
        "alu": [
          620,
          345
        ],
        "interrupts": [
          810,
          345
        ],
        "ram": [
          410,
          525
        ],
        "clock": [
          105,
          175
        ],
        "reset": [
          105,
          300
        ],
        "regulator": [
          105,
          425
        ],
        "debug": [
          105,
          550
        ],
        "program": [
          1050,
          165
        ],
        "xram": [
          1050,
          255
        ],
        "timers": [
          1050,
          430
        ],
        "pca": [
          1250,
          430
        ],
        "uart": [
          1430,
          430
        ],
        "spi": [
          1050,
          510
        ],
        "smbus": [
          1250,
          510
        ],
        "can": [
          1430,
          510
        ],
        "lin": [
          1050,
          590
        ],
        "crossbar": [
          1250,
          590
        ],
        "ports": [
          1430,
          590
        ],
        "emif": [
          1250,
          670
        ],
        "amux": [
          410,
          700
        ],
        "adc": [
          610,
          700
        ],
        "reference": [
          810,
          700
        ],
        "temperature": [
          410,
          785
        ],
        "comparators": [
          650,
          785
        ],
        "sram-address": [
          410,
          435
        ],
        "power-control": [
          650,
          435
        ]
      },
      "minWidth": 1640,
      "minHeight": 930
    },
    "domainLinks": [],
    "interfaceLinks": [],
    "connectionPorts": {
      "architecture:0": {
        "fromSide": "right",
        "toSide": "left",
        "from": "program-address",
        "to": "code-address"
      },
      "architecture:1": {
        "fromSide": "right",
        "toSide": "left",
        "from": "code-read-data",
        "to": "instruction-bytes"
      },
      "architecture:2": {
        "fromSide": "right",
        "toSide": "left",
        "from": "instruction",
        "to": "decode"
      },
      "architecture:3": {
        "fromSide": "right",
        "toSide": "left",
        "from": "alu-control",
        "to": "operation"
      },
      "architecture:4": {
        "fromSide": "right",
        "toSide": "left",
        "from": "operand/result",
        "to": "operand/result"
      },
      "architecture:5": {
        "fromSide": "right",
        "toSide": "left",
        "from": "data-address",
        "to": "data-address"
      },
      "architecture:6": {
        "fromSide": "right",
        "toSide": "left",
        "from": "pc-control",
        "to": "pc-control"
      },
      "architecture:7": {
        "fromSide": "right",
        "toSide": "left",
        "from": "sfr-access",
        "to": "core-access"
      },
      "architecture:8": {
        "fromSide": "right",
        "toSide": "left",
        "from": "register-access",
        "to": "sfr-access"
      },
      "architecture:9": {
        "fromSide": "right",
        "toSide": "left",
        "from": "irq",
        "to": "interrupt-request"
      },
      "architecture:10": {
        "fromSide": "right",
        "toSide": "left",
        "from": "sram-access",
        "to": "address/data"
      },
      "architecture:11": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SYSCLK",
        "to": "CLOCK",
        "net": "chip.clock.sysclk"
      },
      "architecture:12": {
        "fromSide": "right",
        "toSide": "left",
        "from": "RESET",
        "to": "RESET"
      },
      "architecture:13": {
        "fromSide": "right",
        "toSide": "left",
        "from": "VDD",
        "to": "supply-monitor"
      },
      "architecture:14": {
        "fromSide": "right",
        "toSide": "left",
        "from": "EMULATION_IRQ",
        "to": "EMULATION_IRQ"
      },
      "architecture:15": {
        "fromSide": "right",
        "toSide": "left",
        "from": "flash-program",
        "to": "C2-programming"
      },
      "architecture:16": {
        "fromSide": "right",
        "toSide": "left",
        "from": "code-access",
        "to": "code-access"
      },
      "architecture:17": {
        "fromSide": "right",
        "toSide": "left",
        "from": "xdata-access",
        "to": "xdata-access"
      },
      "architecture:18": {
        "fromSide": "right",
        "toSide": "left",
        "from": "external-access",
        "to": "memory-access"
      },
      "architecture:19": {
        "fromSide": "right",
        "toSide": "left",
        "from": "address/data/control",
        "to": "EMIF"
      },
      "architecture:20": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:21": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:22": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:23": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:24": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:25": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:26": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:27": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR",
        "net": "chip.clock.sfr"
      },
      "architecture:28": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:29": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:30": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:31": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SFR_ADDRESS / DATA / CONTROL",
        "to": "SFR"
      },
      "architecture:32": {
        "fromSide": "right",
        "toSide": "left",
        "from": "timers-irq",
        "to": "timers-irq"
      },
      "architecture:33": {
        "fromSide": "right",
        "toSide": "left",
        "from": "pca-irq",
        "to": "pca-irq"
      },
      "architecture:34": {
        "fromSide": "right",
        "toSide": "left",
        "from": "uart-irq",
        "to": "uart-irq"
      },
      "architecture:35": {
        "fromSide": "right",
        "toSide": "left",
        "from": "spi-irq",
        "to": "spi-irq"
      },
      "architecture:36": {
        "fromSide": "right",
        "toSide": "left",
        "from": "smbus-irq",
        "to": "smbus-irq"
      },
      "architecture:37": {
        "fromSide": "right",
        "toSide": "left",
        "from": "can-irq",
        "to": "can-irq"
      },
      "architecture:38": {
        "fromSide": "right",
        "toSide": "left",
        "from": "lin-irq",
        "to": "lin-irq"
      },
      "architecture:39": {
        "fromSide": "right",
        "toSide": "left",
        "from": "adc-irq",
        "to": "adc-irq"
      },
      "architecture:40": {
        "fromSide": "right",
        "toSide": "left",
        "from": "comparators-irq",
        "to": "comparators-irq"
      },
      "architecture:41": {
        "fromSide": "right",
        "toSide": "left",
        "from": "I/O",
        "to": "I/O-timers"
      },
      "architecture:42": {
        "fromSide": "right",
        "toSide": "left",
        "from": "I/O",
        "to": "I/O-pca"
      },
      "architecture:43": {
        "fromSide": "right",
        "toSide": "left",
        "from": "I/O",
        "to": "I/O-uart"
      },
      "architecture:44": {
        "fromSide": "right",
        "toSide": "left",
        "from": "I/O",
        "to": "I/O-spi"
      },
      "architecture:45": {
        "fromSide": "right",
        "toSide": "left",
        "from": "I/O",
        "to": "I/O-smbus"
      },
      "architecture:46": {
        "fromSide": "right",
        "toSide": "left",
        "from": "I/O",
        "to": "I/O-can"
      },
      "architecture:47": {
        "fromSide": "right",
        "toSide": "left",
        "from": "I/O",
        "to": "I/O-lin"
      },
      "architecture:48": {
        "fromSide": "right",
        "toSide": "left",
        "from": "routed-functions",
        "to": "crossbar"
      },
      "architecture:49": {
        "fromSide": "right",
        "toSide": "left",
        "from": "analog-inputs",
        "to": "external-analog-inputs"
      },
      "architecture:50": {
        "fromSide": "right",
        "toSide": "left",
        "from": "temperature-voltage",
        "to": "internal-source"
      },
      "architecture:51": {
        "fromSide": "right",
        "toSide": "left",
        "from": "selected-input",
        "to": "analog-input"
      },
      "architecture:52": {
        "fromSide": "right",
        "toSide": "left",
        "from": "VREF",
        "to": "VREF"
      },
      "architecture:53": {
        "fromSide": "right",
        "toSide": "left",
        "from": "CP0-reset",
        "to": "comparator-reset"
      },
      "architecture:54": {
        "fromSide": "right",
        "toSide": "left",
        "from": "watchdog-reset",
        "to": "watchdog-reset"
      },
      "architecture:55": {
        "from": "power-mode",
        "to": "power-mode",
        "fromSide": "right",
        "toSide": "left"
      },
      "architecture:56": {
        "from": "INT0 / INT1",
        "to": "external-irq",
        "fromSide": "right",
        "toSide": "left"
      },
      "architecture:57": {
        "fromSide": "right",
        "toSide": "left",
        "from": "RESET",
        "to": "RESET",
        "net": "chip.clock.reset"
      },
      "architecture:58": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SYSCLK",
        "to": "SYSCLK",
        "net": "chip.clock.sysclk"
      },
      "architecture:59": {
        "fromSide": "right",
        "toSide": "left",
        "from": "EXOSC",
        "to": "EXOSC",
        "net": "chip.clock.exosc"
      },
      "architecture:60": {
        "fromSide": "right",
        "toSide": "left",
        "from": "SYSCLK",
        "to": "SYSCLK",
        "net": "chip.clock.sysclk"
      },
      "architecture:61": {
        "fromSide": "right",
        "toSide": "left",
        "from": "EXOSC",
        "to": "EXOSC",
        "net": "chip.clock.exosc"
      }
    },
    "memoryPreviews": {
      "ram": {
        "peer": "registers",
        "baseAddress": 0,
        "rows": 256,
        "wordsPerRow": 1,
        "bitsPerWord": 8,
        "initialValue": 0,
        "readOnly": false,
        "kind": "ram",
        "wordBytes": 1,
        "addressDigits": 2,
        "addressMeaning": "DATA/IDATA byte address; not CODE, XDATA or SFR space",
        "netPeers": {
          "address": "sram-address",
          "input": "registers",
          "control": "control",
          "output": "registers"
        }
      },
      "xram": {
        "peer": "memory-interface",
        "baseAddress": 0,
        "rows": 4096,
        "wordsPerRow": 1,
        "bitsPerWord": 8,
        "initialValue": 0,
        "readOnly": false,
        "kind": "ram",
        "wordBytes": 1,
        "addressDigits": 4,
        "addressMeaning": "XDATA byte address; MOVX selects this separate address space"
      },
      "program": {
        "peer": "memory-interface",
        "baseAddress": 0,
        "rows": 65536,
        "wordsPerRow": 1,
        "bitsPerWord": 8,
        "initialValue": 255,
        "readOnly": true,
        "kind": "program",
        "wordBytes": 1,
        "addressDigits": 4,
        "addressMeaning": "CODE byte address; fixture programming requests remain pending"
      }
    }
  },
  "keywords": "Silicon Labs 8-bit 8051 CIP51 C2 bootloader"
};
