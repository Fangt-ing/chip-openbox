'use strict';
// Component storage primitives. No CPU, clock, voltages or programmer behavior.
(() => {
  function create({ baseAddress, rows, wordsPerRow, bitsPerWord, initialValue = null, readOnly = false }) {
    if (!Number.isSafeInteger(baseAddress) || baseAddress < 0 || bitsPerWord !== 8 ||
        !Number.isInteger(rows) || rows < 1 || !Number.isInteger(wordsPerRow) || wordsPerRow < 1)
      throw new RangeError('Unsupported byte-store preview geometry');
    if (initialValue !== null && (!Number.isInteger(initialValue) || initialValue < 0 || initialValue > 255))
      throw new RangeError("Expected an initial byte value");
    const length = rows * wordsPerRow;
    const values = new Uint8Array(length);
    const known = new Uint8Array(length);
    // A configured preview default is not a claim about real SRAM power-up contents.
    if (initialValue !== null) { values.fill(initialValue); known.fill(1); }
    const listeners = new Set();
    let revision = 0;
    function locate(address) {
      const offset = address - baseAddress;
      if (!Number.isInteger(offset) || offset < 0 || offset >= length) throw new RangeError('Address outside the storage preview');
      return { address, offset, row:Math.floor(offset / wordsPerRow), word:offset % wordsPerRow,
        firstColumn:(offset % wordsPerRow) * bitsPerWord };
    }
    function readByte(address) {
      const location = locate(address);
      return { ...location, value:values[location.offset], known:!!known[location.offset], revision };
    }
    function readBytes(address, count) {
      if (!Number.isInteger(count) || count < 1) throw new RangeError('Expected a positive byte count');
      locate(address); locate(address + count - 1);
      return Array.from({length:count}, (_,i) => readByte(address+i));
    }
    function writeBytes(address, input) {
      if(readOnly)throw new Error("Read-only inspection fixture; programming is not implemented");
      const bytes = Array.from(input);
      if (!bytes.length || bytes.some(value => !Number.isInteger(value) || value < 0 || value > 255))
        throw new RangeError('Expected byte values');
      const location = locate(address); locate(address + bytes.length - 1);
      bytes.forEach((value,i) => { values[location.offset+i]=value; known[location.offset+i]=1; });
      revision++;
      for (const listener of listeners) listener({type:'write',address,bytes:readBytes(address,bytes.length),revision});
      return readBytes(address,bytes.length);
    }
    function writeByte(address, value) { return writeBytes(address,[value])[0]; }
    return Object.freeze({
      readOnly:!!readOnly,
      geometry:Object.freeze({baseAddress, rows, wordsPerRow, bitsPerWord, length}),
      locate, readByte, writeByte, readBytes, writeBytes,
      subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
      get revision() { return revision; }
    });
  }
  window.ChipOpenboxByteStore = { create };
  window.ChipOpenboxSRAM = window.ChipOpenboxByteStore; // Existing RAM adapter compatibility.
})();
