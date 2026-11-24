'use strict';
(() => {
  const copy = image => image ? { ...image, bytes: image.bytes.map(byte => ({ ...byte })) } : null;
  class Session {
    constructor() { this.image = null; }
    select(image) {
      if (image == null) { this.image = null; return; }
      if (typeof image.imageId !== 'string' || !image.imageId ||
          typeof image.profileId !== 'string' || typeof image.target !== 'string' ||
          typeof image.compiler !== 'string' || typeof image.hex !== 'string' ||
          !Array.isArray(image.bytes) || !image.bytes.length || image.byteCount !== image.bytes.length ||
          !image.bytes.every(byte => Number.isSafeInteger(byte.address) && byte.address >= 0 &&
            Number.isInteger(byte.value) && byte.value >= 0 && byte.value <= 255)) {
        throw new Error('Invalid programming-image preview.');
      }
      this.image = copy(image);
    }
    current() { return copy(this.image); }
    request() {
      if (!this.image) return {
        workflow: 'flash', status: 'unavailable', implemented: false, image: null,
        message: 'No current build image. Build successfully in scripts first.'
      };
      return {
        workflow: 'flash', status: 'placeholder', implemented: false, image: this.current(),
        message: 'Flash placeholder: MCU image preview requested; no memory is programmed.'
      };
    }
  }
  window.ChipOpenboxFlash = { Session };
})();
