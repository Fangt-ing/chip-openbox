'use strict';
// Existing CMSDK timer units and connectivity, rendered with the shared functional box type.
(() => {
 const diagram={
  "width": 840,
  "height": 390,
  "units": [
    {
      "id": "synchronizer",
      "name": "Synchronizer",
      "value": "2 flip-flops",
      "x": 56.160000000000004,
      "y": 68.64,
      "w": 85.8,
      "h": 34.32,
      "ports": [
        {
          "id": "sync.in",
          "side": "left",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "sync.out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        },
        {
          "id": "sync.clock",
          "side": "top",
          "direction": "input",
          "at": 0.4818181818181818
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "EXTIN is sampled through two flip-flops",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "edge-detector",
      "name": "Edge detect",
      "value": "0 → 1",
      "x": 164.58,
      "y": 69.42,
      "w": 63.96,
      "h": 32.76,
      "ports": [
        {
          "id": "edge.in",
          "side": "left",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "edge.out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "Rising-edge detection on synchronized EXTIN",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "clock-select",
      "name": "CTRL[2]",
      "value": null,
      "x": 261.3,
      "y": 66.3,
      "w": 35.1,
      "h": 56.160000000000004,
      "ports": [
        {
          "id": "clock.in1",
          "side": "left",
          "direction": "input",
          "at": 0.3472222222222222
        },
        {
          "id": "clock.in0",
          "side": "left",
          "direction": "input",
          "at": 0.8333333333333334
        },
        {
          "id": "clock.select",
          "side": "top",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "clock.out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "Input selector · CTRL[2]",
      "shape": "mux",
      "labelAbove": true,
      "captions": [
        {
          "text": "1",
          "x": 7.0200000000000005,
          "y": 15.600000000000001
        },
        {
          "text": "0",
          "x": 7.0200000000000005,
          "y": 46.800000000000004
        }
      ]
    },
    {
      "id": "enable-select",
      "name": "CTRL[1]",
      "value": null,
      "x": 261.3,
      "y": 156.0,
      "w": 35.1,
      "h": 56.160000000000004,
      "ports": [
        {
          "id": "enable.in1",
          "side": "left",
          "direction": "input",
          "at": 0.25
        },
        {
          "id": "enable.in0",
          "side": "left",
          "direction": "input",
          "at": 0.8333333333333334
        },
        {
          "id": "enable.select",
          "side": "top",
          "direction": "input",
          "at": 0.5
        },
        {
          "id": "enable.out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "Input selector · CTRL[1]",
      "shape": "mux",
      "labelAbove": true,
      "captions": [
        {
          "text": "1",
          "x": 7.0200000000000005,
          "y": 15.600000000000001
        },
        {
          "text": "0",
          "x": 7.0200000000000005,
          "y": 46.800000000000004
        }
      ]
    },
    {
      "id": "count-enable",
      "name": "&",
      "value": null,
      "x": 341.25,
      "y": 90.48,
      "w": 18.720023803710937,
      "h": 18.72,
      "ports": [
        {
          "id": "count.clock",
          "side": "left",
          "direction": "input",
          "at": 0.3409090909090911
        },
        {
          "id": "count.enable",
          "side": "left",
          "direction": "input",
          "at": 0.7272727272727266
        },
        {
          "id": "count.ctrl",
          "side": "top",
          "direction": "input",
          "at": 0.4444438793048282
        },
        {
          "id": "count.out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "CTRL[0] and selected external-clock/enable conditions permit decrement",
      "shape": "and",
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "counter",
      "name": "VALUE · 32-bit",
      "value": "0x00000000",
      "x": 422.76,
      "y": 85.41,
      "w": 74.88,
      "h": 32.76,
      "ports": [
        {
          "id": "counter.enable",
          "side": "left",
          "direction": "input",
          "at": 0.46153846153846156
        },
        {
          "id": "counter.out",
          "side": "right",
          "direction": "output",
          "at": 0.4769230769230771
        },
        {
          "id": "counter.reload",
          "side": "top",
          "direction": "input",
          "at": 0.43333333333333357
        },
        {
          "id": "counter.clock",
          "side": "top",
          "direction": "input",
          "at": 0.8666666666666671
        },
        {
          "id": "counter.reset",
          "side": "top",
          "direction": "input",
          "at": 0.6666666666666666
        },
        {
          "id": "counter.registers",
          "side": "left",
          "direction": "bidirectional",
          "at": 0.8153846153846154
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=60",
        "section": "CMSDK §4.2.1 · Table 4-4"
      },
      "description": "VALUE +0x004 RW: down-counter, reset 0",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "reload",
      "name": "RELOAD",
      "value": "0x00000000",
      "x": 427.83000000000004,
      "y": 176.67000000000002,
      "w": 64.74000000000001,
      "h": 32.76,
      "ports": [
        {
          "id": "reload.out",
          "side": "right",
          "direction": "output",
          "at": 0.4545454545454546
        },
        {
          "id": "reload.registers",
          "side": "left",
          "direction": "bidirectional",
          "at": 0.4545454545454546
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=60",
        "section": "CMSDK §4.2.1 · Table 4-4"
      },
      "description": "RELOAD +0x008 RW: value used after the count reaches zero; reset 0",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "event-detector",
      "name": "val == 1",
      "value": null,
      "x": 554.19,
      "y": 90.87,
      "w": 47.58,
      "h": 20.28,
      "ports": [
        {
          "id": "event.in",
          "side": "left",
          "direction": "input",
          "at": 0.4888888888888888
        },
        {
          "id": "event.out",
          "side": "right",
          "direction": "output",
          "at": 0.4888888888888888
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "Terminal-count logic shown in Figure 4-3: upcoming zero event",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "interrupt-enable",
      "name": "&",
      "value": null,
      "x": 641.5500000000001,
      "y": 96.72,
      "w": 18.720047607421876,
      "h": 18.72,
      "ports": [
        {
          "id": "irq-enable.event",
          "side": "left",
          "direction": "input",
          "at": 0.3409090909090911
        },
        {
          "id": "irq-enable.ctrl",
          "side": "top",
          "direction": "input",
          "at": 0.5111098112916441
        },
        {
          "id": "irq-enable.out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "CTRL[3] enables the timer interrupt event",
      "shape": "and",
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "irq-status",
      "name": "INTSTATUS",
      "value": "0",
      "x": 710.97,
      "y": 88.14,
      "w": 60.06,
      "h": 32.76,
      "ports": [
        {
          "id": "status.set",
          "side": "left",
          "direction": "input",
          "at": 0.5294117647058827
        },
        {
          "id": "status.registers",
          "side": "left",
          "direction": "bidirectional",
          "at": 0.8088235294117647
        },
        {
          "id": "status.reset",
          "side": "top",
          "direction": "input",
          "at": 0.75
        },
        {
          "id": "status.irq",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=60",
        "section": "CMSDK §4.2.1 · Table 4-4"
      },
      "description": "INTSTATUS / INTCLEAR +0x00C: pending status; write 1 to clear; event wins over simultaneous clear",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "apb-interface",
      "name": "APB register access",
      "value": "read / write",
      "x": 76.83,
      "y": 292.5,
      "w": 95.94,
      "h": 32.76,
      "ports": [
        {
          "id": "apb.request",
          "side": "left",
          "direction": "input",
          "at": 0.38043478260869634
        },
        {
          "id": "apb.response",
          "side": "right",
          "direction": "output",
          "at": 0.6521739130434777
        },
        {
          "id": "apb.registers",
          "side": "right",
          "direction": "bidirectional",
          "at": 0.21739130434782591
        },
        {
          "id": "apb.clock",
          "side": "top",
          "direction": "input",
          "at": 0.2941176470588236
        },
        {
          "id": "apb.reset",
          "side": "top",
          "direction": "input",
          "at": 0.6764705882352943
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "PSEL, PADDR[11:2], PENABLE, PWRITE, PWDATA[31:0]; PRDATA[31:0], PREADY, PSLVERR",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "ctrl",
      "name": "CTRL · +0x000",
      "value": "[3:0] = 0000",
      "x": 268.71000000000004,
      "y": 292.5,
      "w": 74.88,
      "h": 32.76,
      "ports": [
        {
          "id": "ctrl.registers",
          "side": "left",
          "direction": "bidirectional",
          "at": 0.45652173913043453
        },
        {
          "id": "ctrl.reset",
          "side": "top",
          "direction": "input",
          "at": 0.7878787878787877
        },
        {
          "id": "ctrl.en",
          "side": "right",
          "direction": "output",
          "at": 0.1630434782608691
        },
        {
          "id": "ctrl.ext-enable",
          "side": "right",
          "direction": "output",
          "at": 0.38043478260869634
        },
        {
          "id": "ctrl.ext-clock",
          "side": "right",
          "direction": "output",
          "at": 0.5978260869565223
        },
        {
          "id": "ctrl.irq",
          "side": "right",
          "direction": "output",
          "at": 0.8152173913043482
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=60",
        "section": "CMSDK §4.2.1 · Table 4-4"
      },
      "description": "CTRL reset 0: [0] enable; [1] EXTIN enable; [2] EXTIN clock; [3] IRQ enable",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "id-registers",
      "name": "ID registers · optional",
      "value": "PID / CID",
      "x": 597.48,
      "y": 289.38,
      "w": 103.74000000000001,
      "h": 32.76,
      "ports": [
        {
          "id": "id.registers",
          "side": "left",
          "direction": "bidirectional",
          "at": 0.4714285714285717
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=60",
        "section": "CMSDK §4.2.1 · Table 4-4"
      },
      "description": "Optional CMSDK identification registers, offsets +0xFD0…+0xFFC; ECOREVNUM[3:0] integration input is not assigned",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "logic-high-clock",
      "name": "1",
      "value": "HIGH",
      "x": 230.88,
      "y": 120.08,
      "w": 18.72,
      "h": 14.040000000000001,
      "ports": [
        {
          "id": "high-clock.out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "Logic 1 (HIGH)",
      "shape": null,
      "labelAbove": false,
      "captions": null
    },
    {
      "id": "logic-high-enable",
      "name": "1",
      "value": "HIGH",
      "x": 230.88,
      "y": 195.78,
      "w": 18.72,
      "h": 14.040000000000001,
      "ports": [
        {
          "id": "high-enable.out",
          "side": "right",
          "direction": "output",
          "at": 0.5
        }
      ],
      "reference": {
        "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
        "section": "CMSDK §4.2 · Figure 4-3"
      },
      "description": "Logic 1 (HIGH)",
      "shape": null,
      "labelAbove": false,
      "captions": null
    }
  ],
  "ports": [
    {
      "id": "pclk",
      "label": "PCLK",
      "side": "left",
      "direction": "input",
      "y": 19.5
    },
    {
      "id": "pclkg",
      "label": "PCLKG",
      "side": "left",
      "direction": "input",
      "y": 42.9
    },
    {
      "id": "reset",
      "label": "PRESETn",
      "side": "left",
      "direction": "input",
      "y": 249.60000000000002
    },
    {
      "id": "extin",
      "label": "EXTIN",
      "side": "left",
      "direction": "input",
      "y": 85.8
    },
    {
      "id": "registers",
      "label": "APB request",
      "side": "left",
      "direction": "input",
      "y": 300.3
    },
    {
      "id": "irq",
      "label": "TIMERINT",
      "side": "right",
      "direction": "output",
      "y": 104.52000000000001
    },
    {
      "id": "register-return",
      "label": "APB response",
      "side": "right",
      "direction": "output",
      "y": 374.40000000000003
    }
  ],
  "wires": [
    {
      "id": "sync-edge",
      "net": "chip.timer.ext-level",
      "label": "Synchronized EXTIN → rising-edge detector",
      "both": false,
      "kind": null,
      "from": "synchronizer.sync.out",
      "to": "edge-detector.edge.in"
    },
    {
      "id": "edge-clock-select",
      "net": "chip.timer.edge-clock-select",
      "label": "EXTIN rising-edge pulse → external-clock selection",
      "both": false,
      "kind": null,
      "from": "edge-detector.edge.out",
      "to": "clock-select.clock.in1"
    },
    {
      "id": "sync-enable-select",
      "net": "chip.timer.ext-level",
      "label": "Synchronized EXTIN level → external-enable selection",
      "both": false,
      "kind": null,
      "from": "synchronizer.sync.out",
      "to": "enable-select.enable.in1"
    },
    {
      "id": "clock-constant",
      "net": "chip.timer.clock-constant",
      "label": "Constant 1 → peripheral-clock selection",
      "both": false,
      "kind": null,
      "from": "logic-high-clock.high-clock.out",
      "to": "clock-select.clock.in0"
    },
    {
      "id": "enable-constant",
      "net": "chip.timer.enable-constant",
      "label": "Constant 1 → ungated enable selection",
      "both": false,
      "kind": null,
      "from": "logic-high-enable.high-enable.out",
      "to": "enable-select.enable.in0"
    },
    {
      "id": "clock-count-enable",
      "net": "chip.timer.clock-count-enable",
      "label": "Selected clock condition → decrement enable",
      "both": false,
      "kind": null,
      "from": "clock-select.clock.out",
      "to": "count-enable.count.clock"
    },
    {
      "id": "level-count-enable",
      "net": "chip.timer.level-count-enable",
      "label": "Selected EXTIN-enable condition → decrement enable",
      "both": false,
      "kind": null,
      "from": "enable-select.enable.out",
      "to": "count-enable.count.enable"
    },
    {
      "id": "decrement",
      "net": "chip.timer.decrement",
      "label": "Enabled decrement → VALUE counter",
      "both": false,
      "kind": null,
      "from": "count-enable.count.out",
      "to": "counter.counter.enable"
    },
    {
      "id": "reload-counter",
      "net": "chip.timer.reload-counter",
      "label": "RELOAD value → counter reload",
      "both": false,
      "kind": null,
      "from": "reload.reload.out",
      "to": "counter.counter.reload"
    },
    {
      "id": "counter-event",
      "net": "chip.timer.counter-event",
      "label": "VALUE → terminal-count detection",
      "both": false,
      "kind": null,
      "from": "counter.counter.out",
      "to": "event-detector.event.in"
    },
    {
      "id": "event-irq-enable",
      "net": "chip.timer.event-irq-enable",
      "label": "Terminal-count event → interrupt-enable gate",
      "both": false,
      "kind": null,
      "from": "event-detector.event.out",
      "to": "interrupt-enable.irq-enable.event"
    },
    {
      "id": "irq-set",
      "net": "chip.timer.irq-set",
      "label": "Enabled event → interrupt pending SET",
      "both": false,
      "kind": null,
      "from": "interrupt-enable.irq-enable.out",
      "to": "irq-status.status.set"
    },
    {
      "id": "ctrl-enable",
      "net": "chip.timer.ctrl-enable",
      "label": "CTRL[0] timer enable → decrement gate",
      "both": false,
      "kind": "control",
      "from": "ctrl.ctrl.en",
      "to": "count-enable.count.ctrl"
    },
    {
      "id": "ctrl-ext-enable",
      "net": "chip.timer.ctrl-ext-enable",
      "label": "CTRL[1] → external-enable selector",
      "both": false,
      "kind": "control",
      "from": "ctrl.ctrl.ext-enable",
      "to": "enable-select.enable.select"
    },
    {
      "id": "ctrl-ext-clock",
      "net": "chip.timer.ctrl-ext-clock",
      "label": "CTRL[2] → external-clock selector",
      "both": false,
      "kind": "control",
      "from": "ctrl.ctrl.ext-clock",
      "to": "clock-select.clock.select"
    },
    {
      "id": "ctrl-interrupt-enable",
      "net": "chip.timer.ctrl-interrupt-enable",
      "label": "CTRL[3] → interrupt-enable gate",
      "both": false,
      "kind": "control",
      "from": "ctrl.ctrl.irq",
      "to": "interrupt-enable.irq-enable.ctrl"
    },
    {
      "id": "register-ctrl",
      "net": "chip.timer.register-bus",
      "label": "APB access ↔ CTRL",
      "both": false,
      "kind": "register",
      "from": "apb-interface.apb.registers",
      "to": "ctrl.ctrl.registers"
    },
    {
      "id": "register-value",
      "net": "chip.timer.register-bus",
      "label": "APB access ↔ VALUE +0x004",
      "both": false,
      "kind": "register",
      "from": "apb-interface.apb.registers",
      "to": "counter.counter.registers"
    },
    {
      "id": "register-reload",
      "net": "chip.timer.register-bus",
      "label": "APB access ↔ RELOAD +0x008",
      "both": false,
      "kind": "register",
      "from": "apb-interface.apb.registers",
      "to": "reload.reload.registers"
    },
    {
      "id": "register-intstatus",
      "net": "chip.timer.register-bus",
      "label": "APB status read / write-one clear → INTSTATUS / INTCLEAR",
      "both": false,
      "kind": "register",
      "from": "apb-interface.apb.registers",
      "to": "irq-status.status.registers"
    },
    {
      "id": "register-id",
      "net": "chip.timer.register-bus",
      "label": "APB access → optional PID/CID register reads",
      "both": false,
      "kind": "register",
      "from": "apb-interface.apb.registers",
      "to": "id-registers.id.registers"
    },
    {
      "id": "reset-counter",
      "net": "chip.timer.reset",
      "label": "PRESETn → counter reset",
      "both": false,
      "kind": "reset",
      "from": "boundary.reset",
      "to": "counter.counter.reset"
    },
    {
      "id": "reset-ctrl",
      "net": "chip.timer.reset",
      "label": "PRESETn → CTRL reset",
      "both": false,
      "kind": "reset",
      "from": "boundary.reset",
      "to": "ctrl.ctrl.reset"
    },
    {
      "id": "reset-status",
      "net": "chip.timer.reset",
      "label": "PRESETn → interrupt-status reset",
      "both": false,
      "kind": "reset",
      "from": "boundary.reset",
      "to": "irq-status.status.reset"
    },
    {
      "id": "reset-access",
      "net": "chip.timer.reset",
      "label": "PRESETn → APB register logic reset",
      "both": false,
      "kind": "reset",
      "from": "boundary.reset",
      "to": "apb-interface.apb.reset"
    },
    {
      "id": "port-pclk",
      "net": "chip.timer.pclk",
      "label": "Free-running peripheral clock → counter",
      "both": false,
      "kind": null,
      "from": "boundary.pclk",
      "to": "counter.counter.clock"
    },
    {
      "id": "pclk-sync",
      "net": "chip.timer.pclk",
      "label": "PCLK → EXTIN synchronizer",
      "both": false,
      "kind": null,
      "from": "boundary.pclk",
      "to": "synchronizer.sync.clock"
    },
    {
      "id": "port-pclkg",
      "net": "chip.timer.pclkg",
      "label": "Gated register-access clock → APB logic; synchronous with PCLK",
      "both": false,
      "kind": null,
      "from": "boundary.pclkg",
      "to": "apb-interface.apb.clock"
    },
    {
      "id": "port-extin",
      "net": "chip.timer.port-extin",
      "label": "Optional external timer input; source not assigned, not automatically a package pin",
      "both": false,
      "kind": null,
      "from": "boundary.extin",
      "to": "synchronizer.sync.in"
    },
    {
      "id": "port-registers",
      "net": "chip.timer.apb",
      "label": "Logical processor register requests; P-AHB/APB conversion is abstracted",
      "both": false,
      "kind": null,
      "from": "boundary.registers",
      "to": "apb-interface.apb.request"
    },
    {
      "id": "port-irq",
      "net": "chip.timer.irq",
      "label": "Timer interrupt request → processor IRQ contact",
      "both": false,
      "kind": null,
      "from": "irq-status.status.irq",
      "to": "boundary.irq"
    },
    {
      "id": "port-register-return",
      "net": "chip.timer.apb",
      "label": "PRDATA[31:0], PREADY, PSLVERR return through abstracted bus conversion",
      "both": false,
      "kind": null,
      "from": "apb-interface.apb.response",
      "to": "boundary.register-return"
    }
  ],
  "reference": {
    "href": "https://documentation-service.arm.com/static/5e8f224c7100066a414f7810#page=59",
    "section": "CMSDK §4.2 · Fig. 4-3 / Table 4-4"
  },
  "note": "Reset snapshot · P-AHB/APB bridge abstracted · EXTIN/ECO unassigned"
};
 window.ChipOpenboxTimerView={attach:options=>{const view=window.ChipOpenboxUnitDiagram.attach({...options,definition:{...options.definition,diagram}});options.container.querySelector('.functional-view').classList.add('timer-view');return view;}};
})();
