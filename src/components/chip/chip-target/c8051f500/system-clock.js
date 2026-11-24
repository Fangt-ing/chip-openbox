'use strict';
// C8051F500 clock detail, manually traced from retained datasheet §19 / Figure 19.1.
(() => {
 const target=window.ChipOpenboxC8051F500;
 const clock=target.instance.blocks.find(unit=>unit.id==='clock');
 clock.detailView='functional';
 clock.diagram={
  "width": 800,
  "height": 480,
  "units": [
    {
      "id": "oscicrs",
      "name": "OSCICRS · 0xA2",
      "x": 76.0,
      "y": 14.4,
      "w": 116.0,
      "h": 32.0,
      "ports": [
        {
          "id": "SFR",
          "side": "top",
          "direction": "bidirectional",
          "at": 0.25
        },
        {
          "id": "reset",
          "side": "top",
          "direction": "input",
          "at": 0.75
        },
        {
          "id": "trim",
          "side": "bottom",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=169",
        "section": "§19 · OSCICRS"
      },
      "description": "OSCICRS on SFR page 0x0F; factory trim. Read-only reset snapshot.",
      "value": "factory trim"
    },
    {
      "id": "oscifin",
      "name": "OSCIFIN · 0x9E",
      "x": 208.0,
      "y": 14.4,
      "w": 116.0,
      "h": 32.0,
      "ports": [
        {
          "id": "SFR",
          "side": "top",
          "direction": "bidirectional",
          "at": 0.25
        },
        {
          "id": "reset",
          "side": "top",
          "direction": "input",
          "at": 0.75
        },
        {
          "id": "trim",
          "side": "bottom",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=169",
        "section": "§19 · OSCIFIN"
      },
      "description": "OSCIFIN on SFR page 0x0F; factory trim. Read-only reset snapshot.",
      "value": "factory trim"
    },
    {
      "id": "oscicn",
      "name": "OSCICN · 0xA1",
      "x": 344.0,
      "y": 14.4,
      "w": 124.0,
      "h": 32.0,
      "ports": [
        {
          "id": "SFR",
          "side": "top",
          "direction": "bidirectional",
          "at": 0.25
        },
        {
          "id": "reset",
          "side": "top",
          "direction": "input",
          "at": 0.75
        },
        {
          "id": "enable",
          "side": "bottom",
          "direction": "output",
          "at": 0.25
        },
        {
          "id": "divider",
          "side": "bottom",
          "direction": "output",
          "at": 0.8
        },
        {
          "id": "ready",
          "side": "left",
          "direction": "input",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=168",
        "section": "§19 · OSCICN"
      },
      "description": "OSCICN on SFR page 0x0F; 0xD0 · IFCN=000. Read-only reset snapshot.",
      "value": "0xD0 · IFCN=000"
    },
    {
      "id": "clksel",
      "name": "CLKSEL · 0x8F",
      "x": 608.0,
      "y": 14.4,
      "w": 116.0,
      "h": 32.0,
      "ports": [
        {
          "id": "SFR",
          "side": "top",
          "direction": "bidirectional",
          "at": 0.25
        },
        {
          "id": "reset",
          "side": "top",
          "direction": "input",
          "at": 0.75
        },
        {
          "id": "select",
          "side": "bottom",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=166",
        "section": "§19 · CLKSEL"
      },
      "description": "CLKSEL on SFR page 0x0F; 0x00 · CLKSL=00. Read-only reset snapshot.",
      "value": "0x00 · CLKSL=00"
    },
    {
      "id": "oscxcn",
      "name": "OSCXCN · 0x9F",
      "x": 80.0,
      "y": 376.0,
      "w": 124.0,
      "h": 32.0,
      "ports": [
        {
          "id": "SFR",
          "side": "top",
          "direction": "bidirectional",
          "at": 0.25
        },
        {
          "id": "reset",
          "side": "top",
          "direction": "input",
          "at": 0.75
        },
        {
          "id": "mode",
          "side": "right",
          "direction": "output",
          "at": 0.5
        },
        {
          "id": "valid",
          "side": "left",
          "direction": "input",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=173",
        "section": "§19 · OSCXCN"
      },
      "description": "OSCXCN on SFR page 0x0F; 0x00 · off. Read-only reset snapshot.",
      "value": "0x00 · XTLVLD=0"
    },
    {
      "id": "clkmul",
      "name": "CLKMUL · 0x97",
      "x": 416.0,
      "y": 392.0,
      "w": 152.0,
      "h": 32.0,
      "ports": [
        {
          "id": "SFR",
          "side": "top",
          "direction": "bidirectional",
          "at": 0.25
        },
        {
          "id": "reset",
          "side": "top",
          "direction": "input",
          "at": 0.75
        },
        {
          "id": "source",
          "side": "right",
          "direction": "output",
          "at": 0.2
        },
        {
          "id": "enable",
          "side": "right",
          "direction": "output",
          "at": 0.5
        },
        {
          "id": "scale",
          "side": "right",
          "direction": "output",
          "at": 0.8
        },
        {
          "id": "ready",
          "side": "left",
          "direction": "input",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=171",
        "section": "§19 · CLKMUL"
      },
      "description": "CLKMUL on SFR page 0x0F; 0x00 · disabled. Read-only reset snapshot.",
      "value": "0x00 · EN=0 RDY=0"
    },
    {
      "id": "iosc",
      "name": "Internal oscillator",
      "x": 80.0,
      "y": 68.0,
      "w": 115.2,
      "h": 33.6,
      "ports": [
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        },
        {
          "id": "coarse",
          "side": "top",
          "direction": "input",
          "at": 0.2
        },
        {
          "id": "fine",
          "side": "top",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "enable",
          "side": "top",
          "direction": "input",
          "at": 0.8
        },
        {
          "id": "ready",
          "side": "bottom",
          "direction": "output",
          "at": 0.95
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=167",
        "section": "§19.2 · Internal oscillator"
      },
      "description": "IOSC before the IFCN divider. Factory calibration registers vary per device; reset IOSCEN=11, SUSPEND=0, IFRDY=1.",
      "value": "24 MHz nominal"
    },
    {
      "id": "ifcn",
      "name": "IFCN divider",
      "x": 272.0,
      "y": 72.0,
      "w": 76.80000000000001,
      "h": 32.0,
      "ports": [
        {
          "id": "in",
          "side": "left",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        },
        {
          "id": "select",
          "side": "top",
          "direction": "input",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=168",
        "section": "§19.2 · OSCICN.IFCN"
      },
      "description": "IFCN=000 divides IOSC by 128; 111 divides by 1. This divider does not feed the clock multiplier.",
      "value": "÷128 (reset)"
    },
    {
      "id": "exosc",
      "name": "External drive",
      "x": 80.0,
      "y": 196.0,
      "w": 115.2,
      "h": 41.6,
      "ports": [
        {
          "id": "XTAL1",
          "side": "left",
          "direction": "input",
          "at": 0.2
        },
        {
          "id": "XTAL2",
          "side": "left",
          "direction": "bidirectional",
          "at": 0.8
        },
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        },
        {
          "id": "mode",
          "side": "bottom",
          "direction": "input",
          "at": 0.25
        },
        {
          "id": "valid",
          "side": "bottom",
          "direction": "output",
          "at": 0.8
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=172",
        "section": "§19.4 · External oscillator"
      },
      "description": "On-chip drive circuit. XTAL1/P0.2 and XTAL2/P0.3 share port functions. Crystal/resonator or RC/C/CMOS sources are board components; none is assumed installed.",
      "value": "off (reset)"
    },
    {
      "id": "iosc-half",
      "name": "IOSC/2",
      "x": 264.0,
      "y": 244.0,
      "w": 60.800000000000004,
      "h": 22.400000000000002,
      "ports": [
        {
          "id": "in",
          "side": "left",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=165",
        "section": "§19 · Figure 19.1"
      },
      "description": "IOSC/2 path into the multiplier source selector."
    },
    {
      "id": "exosc-half",
      "name": "EXOSC/2",
      "x": 264.0,
      "y": 316.0,
      "w": 60.800000000000004,
      "h": 22.400000000000002,
      "ports": [
        {
          "id": "in",
          "side": "left",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=165",
        "section": "§19 · Figure 19.1"
      },
      "description": "EXOSC/2 path into the multiplier source selector."
    },
    {
      "id": "mul-select",
      "name": "MULSEL",
      "x": 368.0,
      "y": 240.0,
      "w": 40.0,
      "h": 112.0,
      "ports": [
        {
          "id": "iosc-half",
          "side": "left",
          "direction": "input",
          "at": 0.1
        },
        {
          "id": "exosc-half",
          "side": "left",
          "direction": "input",
          "at": 0.36
        },
        {
          "id": "iosc",
          "side": "left",
          "direction": "input",
          "at": 0.64
        },
        {
          "id": "exosc",
          "side": "left",
          "direction": "input",
          "at": 0.9
        },
        {
          "id": "select",
          "side": "top",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=171",
        "section": "§19.3 · CLKMUL.MULSEL"
      },
      "description": "MULSEL mapping: 00 IOSC/2, 01 EXOSC/2, 10 IOSC, 11 EXOSC, followed by ×4. This follows Figure 19.1 and the register table.",
      "shape": "mux",
      "captions": [
        {
          "x": 5.6000000000000005,
          "y": 14.4,
          "text": "00"
        },
        {
          "x": 5.6000000000000005,
          "y": 43.2,
          "text": "01"
        },
        {
          "x": 5.6000000000000005,
          "y": 74.4,
          "text": "10"
        },
        {
          "x": 5.6000000000000005,
          "y": 104.0,
          "text": "11"
        }
      ],
      "labelAbove": true
    },
    {
      "id": "multiply",
      "name": "×4",
      "x": 440.0,
      "y": 281.6,
      "w": 36.800000000000004,
      "h": 28.8,
      "ports": [
        {
          "id": "in",
          "side": "left",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        },
        {
          "id": "enable",
          "side": "top",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "ready",
          "side": "bottom",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=170",
        "section": "§19.3 · Clock multiplier"
      },
      "description": "Clock-multiplier stage, disabled at reset. MULEN/MULINIT control initialization; MULRDY reports readiness. Startup and locking are not simulated."
    },
    {
      "id": "mul-scale",
      "name": "Scale n",
      "x": 504.0,
      "y": 280.0,
      "w": 52.0,
      "h": 32.0,
      "ports": [
        {
          "id": "in",
          "side": "left",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        },
        {
          "id": "select",
          "side": "top",
          "direction": "input",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=171",
        "section": "§19.3 · CLKMUL.MULDIV"
      },
      "description": "Programmable scaling after ×4: 1, 2/3, 1/2, 2/5, 1/3 or 2/7. MULDIV is ignored for the ×2 base modes; see register-table note.",
      "value": "1 (reset)"
    },
    {
      "id": "sys-select",
      "name": "CLKSL",
      "x": 608.0,
      "y": 72.0,
      "w": 44.800000000000004,
      "h": 144.0,
      "ports": [
        {
          "id": "internal",
          "side": "left",
          "direction": "input",
          "at": 0.1111111111111111
        },
        {
          "id": "multiplier",
          "side": "left",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "external",
          "side": "left",
          "direction": "input",
          "at": 0.8888888888888888
        },
        {
          "id": "select",
          "side": "top",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=166",
        "section": "§19.1 · CLKSEL.CLKSL"
      },
      "description": "CLKSL: 00 divided internal oscillator, 01 external oscillator, 10 multiplier, 11 reserved. Reset selects 00.",
      "shape": "mux",
      "captions": [
        {
          "x": 5.6000000000000005,
          "y": 19.200000000000003,
          "text": "00"
        },
        {
          "x": 5.6000000000000005,
          "y": 75.2,
          "text": "10"
        },
        {
          "x": 5.6000000000000005,
          "y": 131.20000000000002,
          "text": "01"
        }
      ],
      "labelAbove": true
    }
  ],
  "wires": [
    {
      "id": "internal-divide",
      "from": "iosc.out",
      "to": "ifcn.in",
      "via": [
        [
          212.0,
          84.80000000000001
        ],
        [
          212.0,
          88.0
        ]
      ],
      "kind": "",
      "net": "chip.clock.iosc",
      "both": false,
      "label": "IOSC → IFCN divider"
    },
    {
      "id": "internal-system",
      "from": "ifcn.out",
      "to": "sys-select.internal",
      "via": [
        [
          584.0,
          88.0
        ]
      ],
      "kind": "",
      "net": "chip.clock.internal-divided",
      "both": false,
      "label": "Divided internal oscillator → CLKSL 00; 24 MHz ÷128 = nominal 187.5 kHz at reset"
    },
    {
      "id": "internal-half",
      "from": "iosc.out",
      "to": "iosc-half.in",
      "via": [
        [
          212.0,
          84.80000000000001
        ],
        [
          212.0,
          255.20000000000002
        ]
      ],
      "kind": "",
      "net": "chip.clock.iosc",
      "both": false,
      "label": "Raw IOSC → divide by 2"
    },
    {
      "id": "internal-direct",
      "from": "iosc.out",
      "to": "mul-select.iosc",
      "via": [
        [
          212.0,
          84.80000000000001
        ],
        [
          212.0,
          311.68000000000006
        ]
      ],
      "kind": "",
      "net": "chip.clock.iosc",
      "both": false,
      "label": "Raw IOSC → MULSEL 10; independent of IFCN"
    },
    {
      "id": "internal-half-select",
      "from": "iosc-half.out",
      "to": "mul-select.iosc-half",
      "via": [
        [
          336.0,
          255.20000000000002
        ],
        [
          336.0,
          251.20000000000002
        ]
      ],
      "kind": "",
      "net": "chip.clock.iosc-half",
      "both": false,
      "label": "IOSC/2 → MULSEL 00"
    },
    {
      "id": "external-half-select",
      "from": "exosc-half.out",
      "to": "mul-select.exosc-half",
      "via": [
        [
          336.0,
          327.20000000000005
        ],
        [
          336.0,
          280.32
        ]
      ],
      "kind": "",
      "net": "chip.clock.exosc-half",
      "both": false,
      "label": "EXOSC/2 → MULSEL 01"
    },
    {
      "id": "xtal1",
      "from": "boundary.XTAL1",
      "to": "exosc.XTAL1",
      "via": [
        [
          52.0,
          204.32000000000002
        ]
      ],
      "kind": "",
      "net": "chip.clock.xtal1",
      "both": false,
      "label": "XTAL1 / P0.2 → external oscillator drive"
    },
    {
      "id": "xtal2",
      "from": "boundary.XTAL2",
      "to": "exosc.XTAL2",
      "via": [
        [
          52.0,
          229.28000000000003
        ]
      ],
      "kind": "",
      "net": "chip.clock.xtal2",
      "both": true,
      "label": "XTAL2 / P0.3 ↔ mode-dependent external drive/input"
    },
    {
      "id": "external-system",
      "from": "exosc.out",
      "to": "sys-select.external",
      "via": [
        [
          224.0,
          216.8
        ],
        [
          224.0,
          200.0
        ]
      ],
      "kind": "",
      "net": "chip.clock.exosc",
      "both": false,
      "label": "EXOSC → CLKSL 01"
    },
    {
      "id": "external-half",
      "from": "exosc.out",
      "to": "exosc-half.in",
      "via": [
        [
          224.0,
          216.8
        ],
        [
          224.0,
          327.20000000000005
        ]
      ],
      "kind": "",
      "net": "chip.clock.exosc",
      "both": false,
      "label": "EXOSC → divide by 2"
    },
    {
      "id": "external-direct",
      "from": "exosc.out",
      "to": "mul-select.exosc",
      "via": [
        [
          224.0,
          216.8
        ],
        [
          224.0,
          352.0
        ],
        [
          352.0,
          352.0
        ],
        [
          352.0,
          340.8
        ]
      ],
      "kind": "",
      "net": "chip.clock.exosc",
      "both": false,
      "label": "EXOSC → MULSEL 11"
    },
    {
      "id": "multiplier-input",
      "from": "mul-select.out",
      "to": "multiply.in",
      "via": [],
      "kind": "",
      "net": "chip.clock.multiplier-input",
      "both": false,
      "label": "Selected multiplier input → ×4"
    },
    {
      "id": "multiplier-base",
      "from": "multiply.out",
      "to": "mul-scale.in",
      "via": [],
      "kind": "",
      "net": "chip.clock.multiplier-base",
      "both": false,
      "label": "×4 → output scaling"
    },
    {
      "id": "multiplier-system",
      "from": "mul-scale.out",
      "to": "sys-select.multiplier",
      "via": [
        [
          576.0,
          296.0
        ],
        [
          576.0,
          144.0
        ]
      ],
      "kind": "",
      "net": "chip.clock.multiplier-output",
      "both": false,
      "label": "Scaled multiplier output → CLKSL 10"
    },
    {
      "id": "sysclk",
      "from": "sys-select.out",
      "to": "boundary.SYSCLK",
      "via": [],
      "kind": "",
      "net": "chip.clock.sysclk",
      "both": false,
      "label": "SYSCLK → processor and peripheral clocks; reset nominal 187.5 kHz"
    },
    {
      "id": "exosc-peripheral",
      "from": "exosc.out",
      "to": "boundary.EXOSC",
      "via": [
        [
          224.0,
          216.8
        ],
        [
          224.0,
          224.0
        ]
      ],
      "kind": "",
      "net": "chip.clock.exosc",
      "both": false,
      "label": "EXOSC → optional timer/PCA clock selection; off at reset"
    },
    {
      "id": "coarse-trim",
      "from": "oscicrs.trim",
      "to": "iosc.coarse",
      "via": [
        [
          134.0,
          55.2
        ],
        [
          103.04000000000002,
          55.2
        ]
      ],
      "kind": "control",
      "net": "chip.clock.coarse-trim",
      "both": false,
      "label": "OSCICRS coarse calibration → internal oscillator"
    },
    {
      "id": "fine-trim",
      "from": "oscifin.trim",
      "to": "iosc.fine",
      "via": [
        [
          266.0,
          59.2
        ],
        [
          137.6,
          59.2
        ]
      ],
      "kind": "control",
      "net": "chip.clock.fine-trim",
      "both": false,
      "label": "OSCIFIN fine calibration → internal oscillator"
    },
    {
      "id": "oscillator-enable",
      "from": "oscicn.enable",
      "to": "iosc.enable",
      "via": [
        [
          375.0,
          51.2
        ],
        [
          172.16,
          51.2
        ]
      ],
      "kind": "control",
      "net": "chip.clock.oscillator-enable",
      "both": false,
      "label": "OSCICN.IOSCEN / SUSPEND → internal oscillator"
    },
    {
      "id": "ifcn-select",
      "from": "oscicn.divider",
      "to": "ifcn.select",
      "via": [
        [
          443.20000000000005,
          64.0
        ],
        [
          310.40000000000003,
          64.0
        ]
      ],
      "kind": "control",
      "net": "chip.clock.ifcn-select",
      "both": false,
      "label": "OSCICN.IFCN → internal divider; reset 000"
    },
    {
      "id": "system-select",
      "from": "clksel.select",
      "to": "sys-select.select",
      "via": [
        [
          666.0,
          60.800000000000004
        ],
        [
          630.4000000000001,
          60.800000000000004
        ]
      ],
      "kind": "control",
      "net": "chip.clock.system-select",
      "both": false,
      "label": "CLKSEL.CLKSL → system source selector; reset 00"
    },
    {
      "id": "external-mode",
      "from": "oscxcn.mode",
      "to": "exosc.mode",
      "via": [
        [
          240.0,
          392.0
        ],
        [
          240.0,
          368.0
        ],
        [
          108.80000000000001,
          368.0
        ]
      ],
      "kind": "control",
      "net": "chip.clock.external-mode",
      "both": false,
      "label": "OSCXCN.XOSCMD / XFCN → external oscillator mode and drive"
    },
    {
      "id": "crystal-valid",
      "from": "exosc.valid",
      "to": "oscxcn.valid",
      "via": [
        [
          172.16,
          372.0
        ],
        [
          64.0,
          372.0
        ],
        [
          64.0,
          392.0
        ]
      ],
      "kind": "status",
      "net": "chip.clock.crystal-valid",
      "both": false,
      "label": "External oscillator validity → OSCXCN.XTLVLD; reset 0"
    },
    {
      "id": "multiplier-select",
      "from": "clkmul.source",
      "to": "mul-select.select",
      "via": [
        [
          592.0,
          398.40000000000003
        ],
        [
          592.0,
          228.0
        ],
        [
          388.0,
          228.0
        ]
      ],
      "kind": "control",
      "net": "chip.clock.multiplier-select",
      "both": false,
      "label": "CLKMUL.MULSEL → multiplier input selector; reset 00"
    },
    {
      "id": "multiplier-enable",
      "from": "clkmul.enable",
      "to": "multiply.enable",
      "via": [
        [
          596.0,
          408.0
        ],
        [
          596.0,
          272.0
        ],
        [
          458.40000000000003,
          272.0
        ]
      ],
      "kind": "control",
      "net": "chip.clock.multiplier-enable",
      "both": false,
      "label": "CLKMUL.MULEN / MULINIT → multiplier enable and initialization; reset 0"
    },
    {
      "id": "multiplier-scale",
      "from": "clkmul.scale",
      "to": "mul-scale.select",
      "via": [
        [
          600.0,
          417.6
        ],
        [
          600.0,
          265.6
        ],
        [
          530.0,
          265.6
        ]
      ],
      "kind": "control",
      "net": "chip.clock.multiplier-scale",
      "both": false,
      "label": "CLKMUL.MULDIV → output scaling; reset 000"
    },
    {
      "id": "multiplier-ready",
      "from": "multiply.ready",
      "to": "clkmul.ready",
      "via": [
        [
          458.40000000000003,
          364.0
        ],
        [
          400.0,
          364.0
        ],
        [
          400.0,
          408.0
        ]
      ],
      "kind": "status",
      "net": "chip.clock.multiplier-ready",
      "both": false,
      "label": "Multiplier readiness → CLKMUL.MULRDY; reset 0"
    },
    {
      "id": "sfr-oscicrs",
      "from": "boundary.SFR",
      "to": "oscicrs.SFR",
      "via": [
        [
          32.0,
          440.0
        ],
        [
          32.0,
          2.4000000000000004
        ],
        [
          105.0,
          2.4000000000000004
        ]
      ],
      "kind": "register",
      "net": "chip.clock.sfr",
      "both": true,
      "label": "SFR address/data/control ↔ OSCICRS · 0xA2"
    },
    {
      "id": "reset-oscicrs",
      "from": "boundary.RESET",
      "to": "oscicrs.reset",
      "via": [
        [
          44.0,
          464.0
        ],
        [
          44.0,
          8.0
        ],
        [
          163.0,
          8.0
        ]
      ],
      "kind": "reset",
      "net": "chip.clock.reset",
      "both": false,
      "label": "MCU reset → OSCICRS · 0xA2"
    },
    {
      "id": "sfr-oscifin",
      "from": "boundary.SFR",
      "to": "oscifin.SFR",
      "via": [
        [
          32.0,
          440.0
        ],
        [
          32.0,
          2.4000000000000004
        ],
        [
          237.0,
          2.4000000000000004
        ]
      ],
      "kind": "register",
      "net": "chip.clock.sfr",
      "both": true,
      "label": "SFR address/data/control ↔ OSCIFIN · 0x9E"
    },
    {
      "id": "reset-oscifin",
      "from": "boundary.RESET",
      "to": "oscifin.reset",
      "via": [
        [
          44.0,
          464.0
        ],
        [
          44.0,
          8.0
        ],
        [
          295.0,
          8.0
        ]
      ],
      "kind": "reset",
      "net": "chip.clock.reset",
      "both": false,
      "label": "MCU reset → OSCIFIN · 0x9E"
    },
    {
      "id": "sfr-oscicn",
      "from": "boundary.SFR",
      "to": "oscicn.SFR",
      "via": [
        [
          32.0,
          440.0
        ],
        [
          32.0,
          2.4000000000000004
        ],
        [
          375.0,
          2.4000000000000004
        ]
      ],
      "kind": "register",
      "net": "chip.clock.sfr",
      "both": true,
      "label": "SFR address/data/control ↔ OSCICN · 0xA1"
    },
    {
      "id": "reset-oscicn",
      "from": "boundary.RESET",
      "to": "oscicn.reset",
      "via": [
        [
          44.0,
          464.0
        ],
        [
          44.0,
          8.0
        ],
        [
          437.0,
          8.0
        ]
      ],
      "kind": "reset",
      "net": "chip.clock.reset",
      "both": false,
      "label": "MCU reset → OSCICN · 0xA1"
    },
    {
      "id": "sfr-clksel",
      "from": "boundary.SFR",
      "to": "clksel.SFR",
      "via": [
        [
          32.0,
          440.0
        ],
        [
          32.0,
          2.4000000000000004
        ],
        [
          637.0,
          2.4000000000000004
        ]
      ],
      "kind": "register",
      "net": "chip.clock.sfr",
      "both": true,
      "label": "SFR address/data/control ↔ CLKSEL · 0x8F"
    },
    {
      "id": "reset-clksel",
      "from": "boundary.RESET",
      "to": "clksel.reset",
      "via": [
        [
          44.0,
          464.0
        ],
        [
          44.0,
          8.0
        ],
        [
          695.0,
          8.0
        ]
      ],
      "kind": "reset",
      "net": "chip.clock.reset",
      "both": false,
      "label": "MCU reset → CLKSEL · 0x8F"
    },
    {
      "id": "sfr-oscxcn",
      "from": "boundary.SFR",
      "to": "oscxcn.SFR",
      "via": [
        [
          32.0,
          440.0
        ],
        [
          32.0,
          356.0
        ],
        [
          111.0,
          356.0
        ]
      ],
      "kind": "register",
      "net": "chip.clock.sfr",
      "both": true,
      "label": "SFR address/data/control ↔ OSCXCN · 0x9F"
    },
    {
      "id": "reset-oscxcn",
      "from": "boundary.RESET",
      "to": "oscxcn.reset",
      "via": [
        [
          44.0,
          464.0
        ],
        [
          44.0,
          360.0
        ],
        [
          173.0,
          360.0
        ]
      ],
      "kind": "reset",
      "net": "chip.clock.reset",
      "both": false,
      "label": "MCU reset → OSCXCN · 0x9F"
    },
    {
      "id": "sfr-clkmul",
      "from": "boundary.SFR",
      "to": "clkmul.SFR",
      "via": [
        [
          32.0,
          440.0
        ],
        [
          32.0,
          356.0
        ],
        [
          454.0,
          356.0
        ]
      ],
      "kind": "register",
      "net": "chip.clock.sfr",
      "both": true,
      "label": "SFR address/data/control ↔ CLKMUL · 0x97"
    },
    {
      "id": "reset-clkmul",
      "from": "boundary.RESET",
      "to": "clkmul.reset",
      "via": [
        [
          44.0,
          464.0
        ],
        [
          44.0,
          360.0
        ],
        [
          530.0,
          360.0
        ]
      ],
      "kind": "reset",
      "net": "chip.clock.reset",
      "both": false,
      "label": "MCU reset → CLKMUL · 0x97"
    },
    {
      "id": "oscillator-ready",
      "from": "iosc.ready",
      "to": "oscicn.ready",
      "via": [
        [
          189.44000000000003,
          108.0
        ],
        [
          240.0,
          108.0
        ],
        [
          240.0,
          52.0
        ],
        [
          332.0,
          52.0
        ],
        [
          332.0,
          30.400000000000002
        ]
      ],
      "kind": "status",
      "net": "chip.clock.oscillator-ready",
      "both": false,
      "label": "Internal oscillator readiness → OSCICN.IFRDY; reset 1"
    }
  ],
  "ports": [
    {
      "id": "XTAL1",
      "label": "XTAL1 / P0.2",
      "side": "left",
      "direction": "input",
      "y": 204.32000000000002
    },
    {
      "id": "XTAL2",
      "label": "XTAL2 / P0.3",
      "side": "left",
      "direction": "bidirectional",
      "y": 229.28000000000003
    },
    {
      "id": "SFR",
      "label": "SFR bus",
      "side": "left",
      "direction": "bidirectional",
      "y": 440.0
    },
    {
      "id": "RESET",
      "label": "RESET",
      "side": "left",
      "direction": "input",
      "y": 464.0
    },
    {
      "id": "SYSCLK",
      "label": "SYSCLK",
      "side": "right",
      "direction": "output",
      "y": 144.0
    },
    {
      "id": "EXOSC",
      "label": "EXOSC · peripheral option",
      "side": "right",
      "direction": "output",
      "y": 224.0
    }
  ],
  "labels": [
    {
      "x": 792,
      "y": 163.20000000000002,
      "text": "187.5 kHz nominal",
      "anchor": "end"
    },
    {
      "x": 672.0,
      "y": 185.60000000000002,
      "text": "11: reserved"
    }
  ],
  "reference": {
    "href": "https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf#page=165",
    "section": "§19 · Fig. 19.1"
  },
  "note": "SFR page 0x0F · reset snapshot · no clock/startup simulation"
};
})();
