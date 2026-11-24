'use strict';
// Documented M85 processor / reference integration; abstract functional layout.
window.ChipOpenboxM85Architecture = {
  "id": "cortex-m85",
  "label": "Cortex-M85 processor",
  "reference": "https://documentation-service.arm.com/static/662a65926862ee0ae48937cd#page=29",
  "hierarchyReference": "Figure 3-1, Tables 3-1 to 3-3 and Table 7-1. Documented functional blocks and reference integration.",
  "blocks": [
    {
      "id": "ifu",
      "name": "IFU",
      "text": "Fetches instructions for decoding and execution.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Instruction Fetch Unit",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "core",
      "name": "DPU",
      "text": "Decodes instructions and performs scalar integer operations.",
      "parts": [
        "Optional integer Custom Datapath Extension (CDE) is embedded in the core logic"
      ],
      "open": true,
      "kind": "processor",
      "fullName": "Data Processing Unit",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "epu",
      "name": "EPU · optional",
      "text": "Handles optional vector and floating-point operations.",
      "parts": [
        "Optional floating-point / MVE Custom Datapath Extension (CDE)"
      ],
      "open": false,
      "kind": "processor",
      "fullName": "Extension Processing Unit",
      "reference": "Figure 3-1; Table 3-1",
      "optional": true
    },
    {
      "id": "mau",
      "name": "MAU",
      "text": "Checks memory permissions and security attributes.",
      "parts": [
        "SAU — security attribution",
        "TGU — TCM gating",
        "MPU_S / MPU_NS — memory protection"
      ],
      "open": false,
      "kind": "processor",
      "fullName": "Memory Authentication Unit",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "tcm",
      "name": "TCU",
      "text": "Routes accesses to tightly coupled memory interfaces.",
      "parts": [
        "ITCM interface",
        "D0–D3 TCM interfaces"
      ],
      "open": false,
      "kind": "processor",
      "fullName": "TCM Control Unit",
      "reference": "Figure 3-1; Table 3-1",
      "optional": true
    },
    {
      "id": "access",
      "name": "LSU",
      "text": "Handles data loads and stores requested by the core.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Load Store Unit",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "piu",
      "name": "PIU",
      "text": "Routes processor accesses to peripheral interfaces.",
      "parts": [
        "P-AHB — Peripheral AHB interface",
        "Core / Debug EPPB access routing"
      ],
      "open": false,
      "kind": "processor",
      "fullName": "Peripheral Interface Unit",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "store",
      "name": "STB",
      "text": "Holds committed writes until the memory system accepts them.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Store Buffer",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "icache",
      "name": "ICU",
      "text": "Caches instructions to reduce repeated memory fetches.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Instruction Cache Unit",
      "reference": "Figure 3-1; Table 3-1",
      "optional": true
    },
    {
      "id": "dcache",
      "name": "DCU",
      "text": "Caches data for processor loads and stores.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Data Cache Unit",
      "reference": "Figure 3-1; Table 3-1",
      "optional": true
    },
    {
      "id": "interfaces",
      "name": "BIU",
      "text": "Handles transfers through the external memory bus interface.",
      "parts": [
        "M-AXI interface"
      ],
      "open": false,
      "kind": "processor",
      "fullName": "Bus Interface Unit",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "miu",
      "name": "MIU",
      "text": "Connects memory-test control to supported memory blocks.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "MBIST Interface Unit",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "interrupts",
      "name": "NVIC",
      "text": "Prioritizes interrupts and signals the processor.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Nested Vectored Interrupt Controller",
      "reference": "Figure 3-1; Table 3-1"
    },
    {
      "id": "iram",
      "name": "IRAM",
      "text": "Stores instruction-cache data with per-line tag and valid state; the selected word uses array-local offsets.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Instruction Cache RAM",
      "reference": "Figure 3-1; Table 3-1",
      "optional": true
    },
    {
      "id": "dram",
      "name": "DRAM",
      "text": "Stores data-cache contents with tag, valid and clean/dirty state. DRAM here means data RAM, not dynamic RAM.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Data Cache RAM",
      "reference": "Figure 3-1; Table 3-1",
      "optional": true
    },
    {
      "id": "iwic",
      "name": "IWIC · optional",
      "text": "Supports processor wakeup; outside PDCORE in this reference.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "fullName": "Internal Wakeup Interrupt Controller",
      "reference": "Figure 3-1; Table 3-1",
      "optional": true
    },
    {
      "id": "dbg",
      "name": "DBG D-AHB",
      "fullName": "Debug AHB Interface",
      "text": "Accepts debugger accesses from the DAP and routes them to processor registers, memory and peripherals. This is an interface, not a Flash programmer.",
      "parts": [
        "32-bit AMBA 5 AHB subordinate",
        "Debug access control and routing"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "bpu",
      "name": "BPU",
      "fullName": "Breakpoint Unit",
      "text": "Compares instruction addresses against configured hardware breakpoints.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "dwt",
      "name": "DWT",
      "fullName": "Data Watchpoint and Trace Unit",
      "text": "Monitors data accesses and execution events for watchpoints, tracing and profiling.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "pmu",
      "name": "PMU",
      "fullName": "Performance Monitoring Unit",
      "text": "Counts selected processor events for software and debugger performance analysis.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "itm",
      "name": "ITM",
      "fullName": "Instrumentation Trace Macrocell",
      "text": "Produces software instrumentation and DWT trace packets.",
      "parts": [
        "Optional component",
        "ATB trace output"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": true
    },
    {
      "id": "cti",
      "name": "CTI",
      "fullName": "Cross Trigger Interface",
      "text": "Synchronizes debug and trace trigger events with other CoreSight components.",
      "parts": [
        "Four cross-trigger channels"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "etm",
      "name": "ETM",
      "fullName": "Embedded Trace Macrocell",
      "text": "Produces instruction trace for reconstructing program execution.",
      "parts": [
        "Optional licensable ETM-M85 component",
        "ATB trace output"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": true
    },
    {
      "id": "debug-rom",
      "name": "ROM table",
      "fullName": "Processor CoreSight ROM Table",
      "text": "Identifies the implemented processor debug and trace components. This discovery table is not application program storage.",
      "parts": [],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "sysregs",
      "name": "System registers",
      "fullName": "Internal System Registers",
      "text": "Contains the internal memory-mapped system-control registers shown in Figure 3-1.",
      "parts": [
        "Internal interface from PIU; see system-register descriptions"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "pmc",
      "name": "PMC-100",
      "fullName": "Programmable MBIST Controller",
      "text": "Controls memory built-in self-test through the MIU when this optional integration is included.",
      "parts": [
        "Optional component",
        "APB subordinate control interface; MIU memory-test interface"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": true
    },
    {
      "id": "cpc",
      "name": "CPC",
      "fullName": "Core Power Control",
      "text": "Manages internal clocking and reset of PDCORE, PDRAMS and PDEPU. Connects processor-side core power and clock-control handshakes to the MCU system controllers.",
      "parts": [
        "Core P-Channel",
        "Core clock Q-Channel",
        "Core-domain clock and reset coordination"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Section 7.3: processor-internal control",
      "referenceHref": "https://documentation-service.arm.com/static/662a65926862ee0ae48937cd#page=127"
    },
    {
      "id": "dpc",
      "name": "DPC",
      "fullName": "Debug Power Control",
      "text": "Connects debug-domain power-control handshakes to the MCU power controller, separately from the core domains.",
      "parts": [
        "Debug power Q-Channel",
        "Debug clock-control Q-Channel",
        "PDDEBUG control"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Section 7.3: processor-internal control",
      "referenceHref": "https://documentation-service.arm.com/static/662a65926862ee0ae48937cd#page=127"
    },
    {
      "id": "systick",
      "name": "SysTick",
      "fullName": "Processor System Timers — SysTick",
      "text": "Architectural 24-bit system timers. Secure and Non-secure instances are grouped in this overview; each uses its own state and SysTick exception. This is not an external IRQ peripheral.",
      "parts": [
        "Secure SysTick and Non-secure SysTick",
        "24-bit current / reload counters",
        "SYST_CSR, SYST_RVR, SYST_CVR, SYST_CALIB",
        "Dedicated SysTick exception to NVIC; no external IRQ line"
      ],
      "open": false,
      "kind": "processor",
      "reference": "Section 12.5 / Table C-1: SysTick registers and clocks",
      "referenceHref": "https://documentation-service.arm.com/static/662a65926862ee0ae48937cd#page=236"
    }
  ],
  "groups": [
    {
      "id": "pdcore",
      "name": "PDCORE",
      "note": "Figure 3-1 · core power-domain enclosure",
      "children": [
        "interrupts",
        "systick",
        "mau",
        "tcm",
        {
          "id": "processor-core",
          "name": "Core",
          "note": "Figure 3-1 · processor core",
          "children": [
            "ifu",
            "core",
            {
              "id": "pdepu",
              "name": "PDEPU",
              "note": "Figure 3-1 · EPU power-domain enclosure",
              "children": [
                "epu"
              ]
            }
          ]
        },
        "access",
        "piu",
        "store",
        "icache",
        "dcache",
        {
          "id": "pdrams",
          "name": "PDRAMS",
          "note": "Figure 3-1 · cache RAM power-domain enclosure",
          "children": [
            "iram",
            "dram"
          ]
        },
        "interfaces",
        "miu",
        "sysregs",
        "pmc",
        "cpc"
      ]
    },
    {
      "id": "pddebug",
      "name": "PDDEBUG",
      "note": "Figure 3-1 / Table 7-1: debug power domain containing documented debug logic, not a programming controller",
      "children": [
        "dbg",
        "bpu",
        "dwt",
        "pmu",
        "itm",
        "debug-rom",
        "cti",
        "etm",
        "dpc"
      ]
    },
    "iwic"
  ],
  "mcuBlocks": [
    {
      "id": "dap",
      "name": "DAP",
      "fullName": "Debug Access Port",
      "text": "Bridges the external JTAG or Serial Wire connection to the processor D-AHB debug interface. Separate from the processor PDDEBUG power domain.",
      "parts": [
        "CoreSight DAP-Lite2 reference integration",
        "Not a Flash controller"
      ],
      "open": false,
      "kind": "reference-integration",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "ewic",
      "name": "EWIC",
      "fullName": "External Wakeup Interrupt Controller",
      "text": "Latches wakeup events at system level when the processor subsystem can be powered down.",
      "parts": [
        "Optional system-level component",
        "Core EPPB configuration and wakeup connection to NVIC"
      ],
      "open": false,
      "kind": "reference-integration",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": true
    },
    {
      "id": "sbist",
      "name": "SBIST controller",
      "fullName": "Software Built-In Self-Test Controller",
      "text": "Provides the system-level SBIST control component shown outside the processor in Figure 3-1.",
      "parts": [
        "Optional reference integration",
        "Core EPPB configuration connection"
      ],
      "open": false,
      "kind": "reference-integration",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": true
    },
    {
      "id": "mcu-rom",
      "name": "MCU ROM table",
      "fullName": "MCU CoreSight ROM Table",
      "text": "Identifies system-level CoreSight components outside the processor. This is a discovery table, not executable program Flash.",
      "parts": [
        "Debug EPPB connection"
      ],
      "open": false,
      "kind": "reference-integration",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": false
    },
    {
      "id": "etb",
      "name": "ETB",
      "fullName": "Embedded Trace Buffer",
      "text": "Captures trace into external SRAM when this optional system-level component is integrated.",
      "parts": [
        "Optional licensed CoreSight integration; not delivered as M85 processor logic",
        "ATB trace and Debug EPPB configuration connections"
      ],
      "open": false,
      "kind": "reference-integration",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": true
    },
    {
      "id": "tpiu",
      "name": "TPIU",
      "fullName": "Trace Port Interface Unit",
      "text": "Exports trace to an external trace analyzer, including supported Serial Wire Output configurations.",
      "parts": [
        "Optional system-level trace integration",
        "ATB trace and Debug EPPB configuration connections"
      ],
      "open": false,
      "kind": "reference-integration",
      "reference": "Figure 3-1; sections 3.1 and 3.2",
      "optional": true
    }
  ],
  "links": [
    [
      "ifu",
      "core",
      false,
      "Instruction fetch / execution"
    ],
    [
      "core",
      "access",
      true,
      "Load/store requests and results"
    ],
    [
      "icache",
      "ifu",
      false,
      "Instruction data"
    ],
    [
      "ifu",
      "tcm",
      true,
      "Instruction TCM access"
    ],
    [
      "access",
      "tcm",
      true,
      "Data TCM access"
    ],
    [
      "interrupts",
      "core",
      false,
      "Exceptions"
    ],
    [
      "core",
      "epu",
      true,
      "Extension operations"
    ],
    [
      "access",
      "dcache",
      true,
      "Data cache access"
    ],
    [
      "access",
      "store",
      false,
      "Buffered stores"
    ],
    [
      "store",
      "interfaces",
      false,
      "M-AXI stores"
    ],
    [
      "store",
      "piu",
      false,
      "Peripheral stores"
    ],
    [
      "store",
      "tcm",
      false,
      "TCM stores"
    ],
    [
      "icache",
      "interfaces",
      true,
      "Instruction line fetch"
    ],
    [
      "dcache",
      "interfaces",
      true,
      "Data line transfer"
    ],
    [
      "icache",
      "iram",
      true,
      "Instruction cache RAM"
    ],
    [
      "dcache",
      "dram",
      true,
      "Data cache RAM"
    ],
    [
      "mau",
      "tcm",
      false,
      "Memory access attributes"
    ],
    [
      "iwic",
      "interrupts",
      false,
      "Wakeup"
    ],
    [
      "piu",
      "sysregs",
      true,
      "Internal system-register interface"
    ],
    [
      "dap",
      "dbg",
      true,
      "D-AHB debug access"
    ],
    [
      "dbg",
      "access",
      true,
      "Debug memory access"
    ],
    [
      "dbg",
      "piu",
      true,
      "Debug peripheral / register access"
    ],
    [
      "dbg",
      "bpu",
      true,
      "Debug EPPB register access"
    ],
    [
      "dbg",
      "dwt",
      true,
      "Debug EPPB register access"
    ],
    [
      "dbg",
      "pmu",
      true,
      "Debug EPPB register access"
    ],
    [
      "dbg",
      "itm",
      true,
      "Debug EPPB register access"
    ],
    [
      "dbg",
      "debug-rom",
      true,
      "Debug EPPB discovery"
    ],
    [
      "dbg",
      "cti",
      true,
      "Debug EPPB register access"
    ],
    [
      "dbg",
      "etm",
      true,
      "Debug EPPB register access"
    ],
    [
      "bpu",
      "core",
      false,
      "Breakpoint match"
    ],
    [
      "dwt",
      "itm",
      false,
      "DWT trace packets"
    ],
    [
      "cti",
      "etm",
      true,
      "Cross-trigger events"
    ],
    [
      "itm",
      "tpiu",
      false,
      "ATB trace (reference integration)"
    ],
    [
      "etm",
      "tpiu",
      false,
      "ATB trace (reference integration)"
    ],
    [
      "itm",
      "etb",
      false,
      "ATB trace (reference integration)"
    ],
    [
      "etm",
      "etb",
      false,
      "ATB trace (reference integration)"
    ],
    [
      "dbg",
      "mcu-rom",
      true,
      "Debug EPPB"
    ],
    [
      "dbg",
      "etb",
      true,
      "Debug EPPB configuration"
    ],
    [
      "dbg",
      "tpiu",
      true,
      "Debug EPPB configuration"
    ],
    [
      "piu",
      "ewic",
      true,
      "Core EPPB configuration"
    ],
    [
      "piu",
      "sbist",
      true,
      "Core EPPB configuration"
    ],
    [
      "ewic",
      "interrupts",
      false,
      "Wakeup"
    ],
    [
      "pmc",
      "miu",
      true,
      "MBIST control"
    ],
    [
      "miu",
      "iram",
      true,
      "Cache RAM test"
    ],
    [
      "miu",
      "dram",
      true,
      "Cache RAM test"
    ],
    [
      "miu",
      "tcm",
      true,
      "TCM test interface"
    ],
    [
      "systick",
      "interrupts",
      false,
      "SysTick system exceptions · internal to processor",
      "interrupt"
    ],
    [
      "piu",
      "systick",
      true,
      "IPPB · SysTick register access"
    ]
  ],
  "interfaces": [
    {
      "id": "pahb",
      "net": "chip.timer.apb",
      "name": "P-AHB",
      "source": "piu",
      "side": "right",
      "both": true,
      "description": "Peripheral AHB (P-AHB): 32-bit AMBA 5 AHB manager interface for system peripherals. Processor interface, not a GPIO electrical pin.",
      "reference": "Table 3-3"
    },
    {
      "id": "irq",
      "net": "chip.timer.irq",
      "name": "IRQ",
      "source": "interrupts",
      "side": "left",
      "direction": "input",
      "both": false,
      "description": "Processor interrupt input interface to NVIC. MCU external-interrupt pin mapping is integration-specific; this interface is not itself a package pin.",
      "reference": "Figure 3-1 / section 3.1.4"
    }
  ],
  "referenceLabel": "Arm M85 TRM"
};
