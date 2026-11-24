'use strict';
(() => {
function decodeIntelHex(text) {
  const memory = new Map();
  const records = [];
  let base = 0;
  let entry = null;
  let ended = false;
  for (const original of text.trim().split(/\r?\n/)) {
    const line = original.trim();
    if (!line) continue;
    if (ended || !/^:[0-9a-f]+$/i.test(line) || line.length % 2 !== 1) throw new Error('Invalid Intel HEX record.');
    const bytes = Array.from({ length: (line.length - 1) / 2 }, (_, index) => parseInt(line.slice(1 + index * 2, 3 + index * 2), 16));
    if (bytes.length < 5 || bytes.length !== bytes[0] + 5 || bytes.reduce((sum, byte) => sum + byte, 0) % 256) throw new Error('Intel HEX length/checksum mismatch.');
    const count = bytes[0];
    const offset = bytes[1] * 256 + bytes[2];
    const type = bytes[3];
    const data = bytes.slice(4, 4 + count);
    let address = null;
    if (type === 0) {
      address = base + offset;
      for (let index = 0; index < data.length; index++) {
        if (memory.has(address + index) && memory.get(address + index) !== data[index]) throw new Error('Conflicting HEX bytes.');
        memory.set(address + index, data[index]);
      }
    } else if (type === 1) {
      if (count !== 0) throw new Error('Invalid HEX end record.');
      ended = true;
    } else if (type === 2 || type === 4) {
      if (count !== 2) throw new Error('Invalid HEX address record.');
      base = (data[0] * 256 + data[1]) * (type === 2 ? 16 : 65536);
    } else if (type === 3) {
      if (count !== 4 || offset !== 0) throw new Error('Invalid HEX segment entry record.');
      entry = (data[0] * 256 + data[1]) * 16 + data[2] * 256 + data[3];
    } else if (type === 5) {
      if (count !== 4) throw new Error('Invalid HEX entry record.');
      entry = data.reduce((sum, byte) => sum * 256 + byte, 0);
    } else {
      throw new Error('Unsupported Intel HEX record type.');
    }
    records.push({ line, type, address, data });
  }
  if (!ended) throw new Error('Missing Intel HEX end record.');
  const bytes = [...memory.entries()].sort((a, b) => a[0] - b[0]).map(([address, value]) => ({ address, value }));
  return { records, bytes, entry, byteCount: bytes.length, firstAddress: bytes[0]?.address ?? null };
}

globalThis.ChipOpenboxHex = { decodeIntelHex };
})();
