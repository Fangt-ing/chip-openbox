'use strict';
(() => {
  const API = 'https://godbolt.org/api';
  const profiles = window.ChipOpenboxBuildProfiles;
  const DEFAULT_TARGET = 'cortex-m85';
  const DEFAULT_COMPILER = profiles[DEFAULT_TARGET].defaultCompiler;
  const defaultFiles = profiles[DEFAULT_TARGET].files;
  let catalogPromise = null;

  async function request(path, body, signal, timeout = 120000) {
    const controller = new AbortController();
    const cancel = () => controller.abort(signal.reason);
    if (signal?.aborted) cancel();
    else signal?.addEventListener('abort', cancel, { once: true });
    const timer = setTimeout(() => controller.abort(new Error('Compiler Explorer timed out. Open a process or click Refresh to retry.')), timeout);
    try {
      const response = await fetch(API + path, {
        method: body ? 'POST' : 'GET', mode: 'cors', credentials: 'omit',
        headers: body ? { Accept: 'application/json', 'Content-Type': 'application/json' } : { Accept: 'application/json' },
        body: body ? JSON.stringify(body) : undefined, signal: controller.signal
      });
      if (!response.ok) throw new Error('Compiler Explorer HTTP ' + response.status + '. Try again shortly.');
      try { return await response.json(); }
      catch { throw new Error('Compiler Explorer returned an unreadable response. Try again.'); }
    } catch (error) {
      if (controller.signal.aborted) throw controller.signal.reason || error;
      if (error instanceof TypeError) throw new Error('Cannot reach Compiler Explorer. Check your internet connection, then open a process or click Refresh.');
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
    }
  }

  async function getCompilers(target = DEFAULT_TARGET) {
    if (!profiles[target]) throw new Error('Unknown build target.');
    if (!catalogPromise) {
      catalogPromise = request('/compilers/c?fields=id,name,semver,supportsBinary,exe', null, null, 20000)
        .catch(error => { catalogPromise = null; throw error; });
    }
    const catalog = await catalogPromise;
    if (!Array.isArray(catalog)) throw new Error('Compiler catalog is unavailable.');
    const compatible = catalog.filter(compiler => target === 'desktop'
      ? /^cg\d+$/.test(compiler.id) && /^x86-64 gcc /.test(compiler.name) && compiler.supportsBinary
          && parseInt(compiler.semver || compiler.name.replace('x86-64 gcc ', ''), 10) >= 12
      : /^carmug\d+$/.test(compiler.id) && compiler.supportsBinary
          && /\/arm-unknown-eabi-gcc$/.test(compiler.exe || '')
          && parseInt(compiler.semver || compiler.name.match(/\d+/)?.[0], 10) >= (profiles[target].minimumGccMajor || 0));
    compatible.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
    const fallback = profiles[target].defaultCompiler;
    if (!compatible.some(compiler => compiler.id === fallback)) {
      compatible.unshift({ id: fallback, name: target === 'desktop' ? 'x86-64 gcc 12.2' : 'ARM GCC 13.2.0 (unknown-eabi)' });
    }
    return compatible;
  }

  function projectRequest(files, optimization, marker, profile) {
    const arm = !!profile.cpu;
    const cpuFlags = arm ? '-mcpu=' + profile.cpu + ' -mthumb -mfloat-abi=soft' : '';
    const objectExtension = arm ? 'obj' : 'o';
    const disassemblyMode = arm ? '' : ' -M intel';
    if (!['0', '1', '2', 's'].includes(optimization)) throw new Error('Unsupported optimization setting.');
    const cmake = [
      'cmake_minimum_required(VERSION 3.15)',
      ...(arm ? ['set(CMAKE_SYSTEM_NAME Generic)', 'set(CMAKE_TRY_COMPILE_TARGET_TYPE STATIC_LIBRARY)'] : []),
      'project(ChipOpenbox LANGUAGES C)',
      'add_executable(program main.c startup.c vectors.c)',
      'target_compile_options(program PRIVATE -O' + optimization + ' -g -save-temps=obj -ffreestanding -fno-stack-protector -fno-asynchronous-unwind-tables ' + (arm ? cpuFlags + ' -fno-builtin -fno-unwind-tables -fno-tree-loop-distribute-patterns' : '-fno-pie') + ')',
      'target_link_options(program PRIVATE -nostdlib ' + (arm ? cpuFlags : '-no-pie') + ' "-Wl,-T,${CMAKE_CURRENT_SOURCE_DIR}/linker.ld" "-Wl,-Map,${CMAKE_CURRENT_BINARY_DIR}/program.map" "-Wl,--build-id=none")',
      arm ? 'set(OPENBOX_OBJCOPY "${CMAKE_OBJCOPY}")' : 'find_program(OPENBOX_OBJCOPY NAMES objcopy REQUIRED)',
      arm ? 'set(OPENBOX_OBJDUMP "${CMAKE_OBJDUMP}")' : 'find_program(OPENBOX_OBJDUMP NAMES objdump REQUIRED)',
      'add_custom_command(TARGET program POST_BUILD',
      ' COMMAND "${OPENBOX_OBJCOPY}" -O ihex --strip-debug "$<TARGET_FILE:program>" "${CMAKE_CURRENT_BINARY_DIR}/program.hex"'
    ];
    const artifacts = {
      MAP: 'COMMAND "${CMAKE_COMMAND}" -E cat "${CMAKE_CURRENT_BINARY_DIR}/program.map"',
      HEX: 'COMMAND "${CMAKE_COMMAND}" -E cat "${CMAKE_CURRENT_BINARY_DIR}/program.hex"',
      PREPROCESS: 'COMMAND "${CMAKE_COMMAND}" -E cat "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/main.c.i"',
      VECTOR_PREPROCESS: 'COMMAND "${CMAKE_COMMAND}" -E cat "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/vectors.c.i"',
      STARTUP_PREPROCESS: 'COMMAND "${CMAKE_COMMAND}" -E cat "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/startup.c.i"',
      ASSEMBLY: 'COMMAND "${CMAKE_COMMAND}" -E cat "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/main.c.s"',
      VECTOR_ASSEMBLY: 'COMMAND "${CMAKE_COMMAND}" -E cat "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/vectors.c.s"',
      VECTOR_SECTION: 'COMMAND "${OPENBOX_OBJDUMP}" -h -j .vectors "$<TARGET_FILE:program>"',
      VECTOR_DATA: 'COMMAND "${OPENBOX_OBJDUMP}" -s -j .vectors "$<TARGET_FILE:program>"',
      VECTOR_SYMBOLS: 'COMMAND "${OPENBOX_OBJDUMP}" -t "$<TARGET_FILE:program>"',
      VECTOR_OBJECT: 'COMMAND "${OPENBOX_OBJDUMP}" -r -s -j .vectors "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/vectors.c.o"',
      STARTUP_ASSEMBLY: 'COMMAND "${CMAKE_COMMAND}" -E cat "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/startup.c.s"',
      DISASSEMBLY: 'COMMAND "${OPENBOX_OBJDUMP}" -d -l -M intel "$<TARGET_FILE:program>"',
      OBJECTS: 'COMMAND "${OPENBOX_OBJDUMP}" -dr -M intel "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/main.c.o" "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/startup.c.o" "${CMAKE_CURRENT_BINARY_DIR}/CMakeFiles/program.dir/vectors.c.o"'
    };
    for (const [key, originalCommand] of Object.entries(artifacts)) {
      const command = originalCommand.replaceAll('-j .vectors', '-j ' + profile.vectorSection)
        .replaceAll('.c.o"', '.c.' + objectExtension + '"')
        .replaceAll(' -M intel', disassemblyMode);
      cmake.push(' COMMAND "${CMAKE_COMMAND}" -E echo ' + marker + '_' + key + '_BEGIN',
        ' ' + command, ' COMMAND "${CMAKE_COMMAND}" -E echo ' + marker + '_' + key + '_END');
    }
    cmake.push(')');
    return {
      source: cmake.join('\n'),
      files: Object.entries(files).map(([filename, contents]) => ({ filename, contents })),
      lang: 'c', allowStoreCodeDebug: false,
      options: {
        userArguments: '',
        compilerOptions: { executorRequest: false, customOutputFilename: 'program' },
        filters: { execute: false, binary: true, intel: !arm, labels: true, directives: true, commentOnly: true, trim: false, libraryCode: true },
        tools: [], libraries: []
      }
    };
  }

  const lines = entries => (entries || []).map(entry => typeof entry === 'string' ? entry : entry.text || '').join('\n');
  function responseParts(response) {
    return [response, ...(response.buildsteps || []), response.result].filter(Boolean);
  }
  function extract(text, marker, name) {
    const begin = marker + '_' + name + '_BEGIN';
    const end = marker + '_' + name + '_END';
    const rows = text.replace(/\r/g, '').split('\n');
    const first = rows.findIndex(row => row.trim() === begin);
    const last = rows.findIndex((row, index) => index > first && row.trim() === end);
    if (first < 0 || last < 0) throw new Error('Compiler Explorer did not return the complete ' + name.toLowerCase() + ' artifact. No new image was accepted.');
    return rows.slice(first + 1, last).join('\n').trim() + '\n';
  }

  function vectorView(image, sections, symbols, raw, profile) {
    const arm = !!profile.cpu;
    const heading = arm
      ? profile.label + ' vector table\n' + profile.vectorNote + '\n'
      : 'Illustrative handler table · x86-64 desktop\nNot used by desktop hardware for reset or interrupt dispatch.\n';
    const sectionName = profile.vectorSection;
    const section = sections.split('\n').map(line => line.trim().split(/\s+/)).find(tokens => tokens[1] === sectionName);
    const symbolRows = symbols.split('\n').map(line => line.trim().split(/\s+/)).filter(tokens => /^[0-9a-f]+$/i.test(tokens[0]));
    const table = symbolRows.find(tokens => tokens.at(-1) === 'vector_table' && tokens.includes(sectionName));
    const fallback = message => heading + '\n' + message + '\n\nActual linked section bytes:\n' + raw;
    if (!section || !table) return fallback('No vector_table symbol in ' + sectionName + '; entry decoding is unavailable.');
    const vma = parseInt(section[3], 16), lma = parseInt(section[4], 16);
    const tableVma = parseInt(table[0], 16), tableLma = lma + tableVma - vma;
    const size = parseInt(table[table.indexOf(sectionName) + 1], 16), width = profile.vectorWidth;
    if (!Number.isSafeInteger(size) || size % width || size > 65536) {
      return fallback('The current view expects an array of ' + width + '-byte entries.');
    }
    const names = new Map();
    for (const row of symbolRows.filter(tokens => tokens.includes('F'))) {
      const address = BigInt('0x' + row[0]) & (arm ? ~1n : ~0n);
      names.set(address, [...(names.get(address) || []), row.at(-1)]);
    }
    const stackSymbol = symbolRows.find(tokens => tokens.at(-1) === '_estack');
    const memory = new Map(image.bytes.map(byte => [byte.address, byte.value]));
    const address = value => '0x' + value.toString(16).toUpperCase().padStart(8, '0');
    const rows = [
      heading, 'vector_table · ' + sectionName + ' · ' + size + ' bytes · ' + width + ' bytes/entry · little-endian',
      'Load address (LMA): ' + address(tableLma), 'Runtime address (VMA): ' + address(tableVma), '',
      'Entry  Stored at   Stored value        Resolved symbol / slot',
      '       Bytes in the programming image'
    ];
    for (let index = 0; index < size / width; index++) {
      const slot = tableLma + index * width;
      const bytes = Array.from({ length: width }, (_, offset) => memory.get(slot + offset));
      if (bytes.some(value => value === undefined)) return fallback('Some table bytes are absent from the programming image.');
      const target = bytes.reduceRight((value, byte) => value * 256n + BigInt(byte), 0n);
      const expected = profile.vectorNames[index];
      const matches = names.get(arm ? target & ~1n : target) || [];
      let resolved = matches.includes(expected) ? expected : matches.includes('Default_Handler') ? 'Default_Handler' : matches[0] || '(no matching function symbol)';
      if (arm && index === 0) resolved = stackSymbol && BigInt('0x' + stackSymbol[0]) === target ? '_estack [Initial MSP]' : '(unmatched initial MSP)';
      else if (arm && target === 0n) resolved = expected === 'Reserved' ? '(reserved)' : '(zero)';
      else if (arm && expected && expected !== resolved) resolved += ' [' + expected + ']';
      rows.push(String(index).padEnd(7) + address(slot) + '  ' + address(target).padEnd(20) + resolved,
        '       ' + bytes.map(byte => byte.toString(16).toUpperCase().padStart(2, '0')).join(' '));
    }
    return rows.join('\n') + '\n\nActual linked section bytes:\n' + raw;
  }

  async function fingerprint(image) {
    const bytes = new TextEncoder().encode(JSON.stringify({ bytes: image.bytes, entry: image.entry }));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function buildProject({ files, compiler, optimization = '0', signal, target = DEFAULT_TARGET }) {
    const profile = profiles[target];
    if (!profile) throw new Error('Unknown build target.');
    compiler = compiler || profile.defaultCompiler;
    const allowed = target === 'desktop' ? /^cg\d+$/.test(compiler) : /^carmug\d+$/.test(compiler);
    if (!allowed) throw new Error('Select a compiler compatible with the build target.');
    const marker = 'CHIP_OPENBOX_' + Math.random().toString(36).slice(2).toUpperCase();
    const payload = projectRequest(files, optimization, marker, profile);
    const response = await request('/compiler/' + encodeURIComponent(compiler) + '/cmake', payload, signal);
    const parts = responseParts(response);
    const diagnostics = parts.map(part => lines(part.stderr)).filter(Boolean).join('\n');
    const failed = parts.find(part => part.timedOut || part.truncated || (part.code !== undefined && part.code !== 0));
    if (failed || !response.result || response.result.code !== 0 || !response.buildsteps?.length) {
      const text = diagnostics || parts.map(part => lines(part.stdout)).filter(Boolean).join('\n') || 'The online build failed without diagnostics.';
      const failedStage = /objcopy|CHIP_OPENBOX_|post.build/i.test(text) ? 'export'
        : /undefined reference|ld:|linker|linking|collect2:/i.test(text) ? 'link' : 'compile';
      return { ok: false, failedStage, diagnostics: text };
    }
    const stdout = (response.buildsteps || []).map(part => lines(part.stdout)).join('\n');
    const artifact = key => extract(stdout, marker, key);
    const outputs = {
      preprocessed: { 'main.c': artifact('PREPROCESS'), 'startup.c': artifact('STARTUP_PREPROCESS'), 'vectors.c': artifact('VECTOR_PREPROCESS') },
      assembly: { 'main.c': artifact('ASSEMBLY'), 'startup.c': artifact('STARTUP_ASSEMBLY'), 'vectors.c': artifact('VECTOR_ASSEMBLY') },
      objects: { 'All object code': artifact('OBJECTS'), 'vectors.c.o — table bytes and relocations': artifact('VECTOR_OBJECT') },
      disassembly: artifact('DISASSEMBLY'), map: artifact('MAP'), hex: artifact('HEX')
    };
    const image = globalThis.ChipOpenboxHex.decodeIntelHex(outputs.hex);
    outputs.vectors = vectorView(image, artifact('VECTOR_SECTION'), artifact('VECTOR_SYMBOLS'), artifact('VECTOR_DATA'), profile);
    if (!image.byteCount) throw new Error('Compiler Explorer returned an empty image.');
    return {
      ok: true, compiler, provider: 'Compiler Explorer', profileId: target, target: profile.label,
      files: { ...files }, optimization, outputs, image, fingerprint: await fingerprint(image),
      commands: diagnostics ? [{ diagnostics }] : [],
      // CMake reports build-level timing; do not invent per-stage measurements.
      stages: ['preprocess', 'compile', 'assemble', 'link', 'export'].map(key => ({ key }))
    };
  }
  window.ChipOpenboxCompiler = { DEFAULT_TARGET, DEFAULT_COMPILER, defaultFiles, profiles, getCompilers, buildProject };
})();
