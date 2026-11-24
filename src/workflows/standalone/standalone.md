# Standalone workflow

standalone.js owns an explicit request/status placeholder. The board control is routed here through openbox.

No power-on, MCU execution or board response is implemented. No compiler/build is invoked. Device/runtime methods will be selected when MCU and board models exist.
