# Flash workflow

flash.js owns current-image selection and the explicit programming placeholder. Board owns its controls; openbox coordinates the scripts → board → MCU connection.

1. Scripting supplies a generated image snapshot containing identity, target/compiler metadata, HEX and decoded bytes.
2. select validates/copies the preview; current returns a copy. An unavailable/currently stale build clears the candidate.
3. request returns unavailable without an image, or a placeholder result with an image preview. openbox forwards that preview to the MCU view.
4. No target compatibility, programmer transport, erase/write or storage verification is implemented. No modeled or physical memory changes.

Use [openbox](../../openbox.html) to connect the component views.
