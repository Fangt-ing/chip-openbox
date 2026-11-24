'use strict';
(() => {
  const workflow = new window.ChipOpenboxScripting.Session(window.ChipOpenboxCompiler, () => renderAll());
  const $ = selector => document.querySelector(selector);
  const channel = window.ChipOpenboxChannel.connect('scripts');
  window.ChipOpenboxPorts.observe(channel, { 'image-out':{ selector:'#stage-export summary', side:'right' } });
  let publishedKey;
  const names = ['main.c', 'config.h', 'startup.c', 'vectors.c', 'linker.ld'];
  const stageKeys = ['preprocess', 'compile', 'assemble', 'link', 'export'];
  const state = {
    defaults: { ...workflow.defaultFiles }, editors: new Map(),
    target: workflow.DEFAULT_TARGET, drafts: new Map(), compilerGeneration: 0,
    activeStage: null, views: { link: 'disassembly', export: 'hex' }
  };
  if (window.self !== window.top) document.documentElement.classList.add('embedded');
  const diagram = new window.ChipOpenboxConnections.SourceConnections();
  function publishImage(force = false) {
    const key = currentKey();
    const result = workflow.result(key);
    const signature = result ? key : null;
    $('#handoff-status').textContent = result
      ? channel.connected ? 'Current image available to PCB / board.' : 'Current image ready. Open openbox to connect PCB / board.'
      : 'Build an image to make it available to PCB / board.';
    if (!force && publishedKey === signature) return;
    publishedKey = signature;
    channel.send('scripts:image', { image: workflow.image(key) });
  }
  channel.subscribe(message => { if (message.type === 'host:sync') publishImage(true); });
  function status(text, error = false) {
    $('#build-status').textContent = text;
    $('#build-status').classList.toggle('error', error);
  }
  function capture() {
    return {
      files: Object.fromEntries(names.map(name => [name, state.editors.get(name).input.value])),
      compiler: $('#compiler').value, optimization: $('#optimization').value, target: $('#target').value
    };
  }
  const identity = input => workflow.identity(input);
  const currentKey = () => identity(capture());
function highlight(text) {
  const fragment = document.createDocumentFragment();
  const pattern = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|#[a-zA-Z_]\w*|\b(?:typedef|void|const|volatile|unsigned|char|int|extern|return|for|while|if|else|SECTIONS|ENTRY|COMMON|DISCARD)\b|\b(?:0x[\da-f]+|\d+)(?:u|ul)?\b/gi;
  let previous = 0;
  for (const match of text.matchAll(pattern)) {
    fragment.append(document.createTextNode(text.slice(previous, match.index)));
    const span = document.createElement('span');
    const token = match[0];
    span.className = token.startsWith('/*') || token.startsWith('//') ? 'token-comment'
      : token.startsWith('"') ? 'token-string' : token.startsWith('#') ? 'token-directive'
        : /^\d/.test(token) ? 'token-number' : 'token-keyword';
    span.textContent = token;
    fragment.append(span);
    previous = match.index + token.length;
  }
  fragment.append(document.createTextNode(text.slice(previous)));
  return fragment;
}
function updateEditorInk(name) {
  const item = state.editors.get(name);
  item.ink.replaceChildren(highlight(item.input.value));
  item.numbers.textContent = item.input.value.split('\n').map((_, index) => index + 1).join('\n');
  item.ink.style.transform = 'translate(' + -item.input.scrollLeft + 'px,' + -item.input.scrollTop + 'px)';
  item.numbers.style.transform = 'translateY(' + -item.input.scrollTop + 'px)';
}
function renderEditors(files) {
  const root = $('#editors');
  root.replaceChildren();
  names.forEach(name => {
    const card = document.createElement('article');
    card.className = 'file-card';
    card.dataset.file = name;
    card.innerHTML = '<header class="file-header"><svg viewBox="0 0 16 20" aria-hidden="true"><path d="M3 1h7l4 4v14H3Z M10 1v5h4 M5 9h6 M5 12h6 M5 15h5"/></svg><strong></strong><button class="icon-button file-minimize" type="button" aria-expanded="true">−</button><button class="icon-button file-options" aria-expanded="false" title="File options">⋮</button></header><div class="file-menu"><button type="button">Restore default</button></div><div class="editor-body"><div class="ink-clip" aria-hidden="true"><pre class="editor-ink"></pre></div><pre class="line-numbers" aria-hidden="true"></pre><textarea class="code-editor" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off"></textarea></div>';
    card.querySelector('strong').textContent = name;
    const input = card.querySelector('textarea');
    input.setAttribute('aria-label', name);
    input.id = 'editor-' + name.replaceAll('.', '-');
    input.value = files[name];
    state.editors.set(name, { card, input, ink: card.querySelector('.editor-ink'), numbers: card.querySelector('.line-numbers') });
    root.append(card);
    updateEditorInk(name);
    input.addEventListener('scroll', () => updateEditorInk(name));
    input.addEventListener('input', () => { updateEditorInk(name); inputsChanged(); });
    input.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        event.preventDefault();
        input.setRangeText('    ', input.selectionStart, input.selectionEnd, 'end');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    const body = card.querySelector('.editor-body');
    body.id = 'body-' + input.id;
    const minimize = card.querySelector('.file-minimize');
    minimize.setAttribute('aria-controls', body.id);
    minimize.setAttribute('aria-label', 'Minimize ' + name);
    minimize.title = 'Minimize ' + name;
    minimize.addEventListener('click', () => {
      const minimized = card.classList.toggle('minimized');
      body.hidden = minimized;
      minimize.textContent = minimized ? '+' : '−';
      minimize.setAttribute('aria-expanded', String(!minimized));
      minimize.setAttribute('aria-label', (minimized ? 'Restore ' : 'Minimize ') + name);
      minimize.title = (minimized ? 'Restore ' : 'Minimize ') + name;
      diagram.rebuild();
    });
    const options = card.querySelector('.file-options');
    options.setAttribute('aria-label', 'Options for ' + name);
    const menu = card.querySelector('.file-menu');
    options.addEventListener('click', event => {
      event.stopPropagation();
      const wasOpen = menu.classList.contains('open');
      closeMenus();
      menu.classList.toggle('open', !wasOpen);
      options.setAttribute('aria-expanded', String(!wasOpen));
    });
    menu.querySelector('button').addEventListener('click', () => {
      input.value = state.defaults[name];
      updateEditorInk(name);
      closeMenus();
      inputsChanged();
    });
  });
  diagram.rebuild();
}
function closeMenus() {
  document.querySelectorAll('.file-menu').forEach(menu => menu.classList.remove('open'));
  document.querySelectorAll('.file-options').forEach(button => button.setAttribute('aria-expanded', 'false'));
}
document.addEventListener('click', closeMenus);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenus(); });


  function inputsChanged() {
    workflow.clearFailure();
    state.editors.forEach(item => item.card.classList.remove('failed'));
    const cached = workflow.result(currentKey());
    if (cached) {
      workflow.accept(cached, currentKey());
      status('Unchanged inputs · cached results available.');
    } else {
      status('Inputs changed · open a process or click Refresh to rebuild.');
    }
    renderAll();
  }
  const hex = (value, width = 2) => value.toString(16).toUpperCase().padStart(width, '0');
  function units(items, preprocess = false) {
    return Object.entries(items || {}).map(([name, value]) =>
      '── ' + name + ' ──\n' + (preprocess
        ? value.split('\n').filter(line => !/^#\s+\d/.test(line)).join('\n').trim()
        : value.trim())
    ).join('\n\n');
  }
  function renderImage(output, result, mode) {
    output.replaceChildren();
    const add = (text, changed = false) => {
      const span = document.createElement(changed ? 'mark' : 'span');
      span.textContent = text;
      output.append(span);
    };
    if (mode === 'hex') {
      result.image.records.forEach(record => {
        const changed = record.type === 0 && record.data.some((_, index) => workflow.changed.has(record.address + index));
        add(record.line + '\n', changed);
      });
      return;
    }
    const bytes = result.image.bytes, count = mode === 'bits' ? 8 : 16;
    let row = [];
    const flush = () => {
      if (!row.length) return;
      add(hex(row[0].address, 8) + ':  ');
      row.forEach((byte, index) => {
        if (index) add(' ');
        add(mode === 'bits' ? byte.value.toString(2).padStart(8, '0') : hex(byte.value), workflow.changed.has(byte.address));
      });
      add('\n'); row = [];
    };
    bytes.forEach(byte => {
      if (row.length && (row.length === count || byte.address !== row[row.length - 1].address + 1)) flush();
      row.push(byte);
    });
    flush();
  }
  function renderStage(key) {
    const card = $('#stage-' + key);
    const output = $('#output-' + key);
    const inputKey = currentKey();
    const result = workflow.result(inputKey);
    const failure = workflow.failure(inputKey);
    const busy = workflow.busy(inputKey);
    const previous = workflow.previous(state.target);
    const outdated = !result && !!previous;
    card.querySelector('.process-status').textContent = busy ? 'Building…' : failure ? 'Failed' : result ? 'Cached' : outdated ? 'Outdated' : 'Not built';
    card.classList.toggle('failed', !!failure);
    card.classList.toggle('active', state.activeStage === key && card.open);
    card.querySelector('.result-state').textContent = busy ? 'Waiting for compiler results…'
      : failure ? 'Build failed. Fix the inputs and retry.'
      : outdated ? 'Outdated results · click Refresh to rebuild.'
      : result ? 'Cached for these files and compiler settings.' : 'No build yet.';
    output.classList.toggle('outdated', outdated && !failure);
    output.classList.toggle('diagnostics', !!failure);
    card.querySelector('.refresh-stage').disabled = !!busy;
    card.querySelectorAll('[data-view]').forEach(button => {
      const selected = button.dataset.view === state.views[key];
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (failure) {
      output.textContent = failure.diagnostics;
    } else {
      const shown = result || previous;
      if (!shown) output.textContent = busy ? 'Waiting for Compiler Explorer…' : 'Open this process to request its results.';
      else if (key === 'preprocess') output.textContent = units(shown.outputs.preprocessed, true);
      else if (key === 'compile') output.textContent = units(shown.outputs.assembly);
      else if (key === 'assemble') output.textContent = units(shown.outputs.objects);
      else if (key === 'link') output.textContent = state.views.link === 'map' ? shown.outputs.map : state.views.link === 'vectors' ? shown.outputs.vectors : shown.outputs.disassembly;
      else renderImage(output, shown, state.views.export);
    }
    if (key === 'export') $('#download').disabled = !result;
  }
  function renderAll() {
    stageKeys.forEach(renderStage);
    $('#workspace').setAttribute('aria-busy', String(workflow.pending));
    const participants = !workflow.result(currentKey()) ? []
      : state.activeStage === 'link' ? ['linker.ld']
      : ['preprocess', 'compile', 'assemble'].includes(state.activeStage) ? names.filter(name => name !== 'linker.ld') : [];
    state.editors.forEach((item, name) => item.card.classList.toggle('participating', participants.includes(name)));
    diagram.select(state.activeStage);
    publishImage();
  }

  async function inspect(key) {
    state.activeStage = key;
    const input = capture(), inputKey = identity(input);
    const cached = workflow.result(inputKey);
    workflow.clearFailure();
    if (cached) {
      workflow.accept(cached, inputKey);
      status('Cached results · ' + cached.image.byteCount + ' image bytes · ' + cached.fingerprint.slice(0, 8));
      renderAll();
      return;
    }
    status('Requesting results from ' + $('#compiler').selectedOptions[0].textContent + '…');
    try {
      const result = await workflow.obtain(input, inputKey, () => inputKey === currentKey());
      if (inputKey !== currentKey() || !result) {
        // This result can stay cached for its inputs, but cannot become the current preview.
        renderAll();
        if (!workflow.pending) status('Inputs changed · open a process or click Refresh to rebuild.');
        return;
      }
      if (!result.ok) {
        workflow.recordFailure(inputKey, result);
        for (const [name, item] of state.editors) item.card.classList.toggle('failed', result.diagnostics.includes(name));
        status('Build failed during ' + result.failedStage, true);
      } else {
        workflow.accept(result, inputKey);
        state.editors.forEach(item => item.card.classList.remove('failed'));
        status(result.image.byteCount + ' image bytes · ' + result.fingerprint.slice(0, 8) + ' · results cached');
      }
    } catch (error) {
      if (inputKey === currentKey()) {
        workflow.recordFailure(inputKey, { diagnostics: error.message });
        status(error.message, true);
      }
    } finally {
      renderAll();
    }
  }

  document.querySelectorAll('.process-card').forEach(card => {
    const key = card.dataset.stage;
    card.addEventListener('toggle', () => {
      if (card.open) {
        state.activeStage = key;
        inspect(key);
      } else if (state.activeStage === key) {
        state.activeStage = null;
        renderAll();
      }
      diagram.rebuild();
    });
    card.querySelector('.refresh-stage')?.addEventListener('click', () => inspect(key));
    card.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
      state.views[key] = button.dataset.view;
      renderStage(key);
    }));
  });
  for (const id of ['compiler', 'optimization']) $('#' + id).addEventListener('change', inputsChanged);
  $('#download').addEventListener('click', () => {
    const result = workflow.result(currentKey());
    if (!result) return;
    const url = URL.createObjectURL(new Blob([result.outputs.hex], { type: 'text/plain' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = '-' + result.profileId + '-' + result.compiler + '.hex';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  function compilerOption(compiler, target) {
    const option = document.createElement('option');
    option.value = compiler.id;
    option.textContent = target === 'desktop'
      ? compiler.name.replace(/^x86-64 gcc /, 'GCC ') + ' · x86-64'
      : compiler.name.replace(/^ARM GCC /, 'Arm GCC ');
    return option;
  }
  function updateTargetCaption() {
    const profile = workflow.profiles[state.target];
    $('#target-label').textContent = profile.label;
    $('#profile-note').textContent = profile.note;
  }
  function setCompilerFallback(target, id) {
    $('#compiler').replaceChildren(compilerOption({
      id, name: target === 'desktop' ? (id === 'cg122' ? 'x86-64 gcc 12.2' : 'Desktop GCC ' + id) : (id === 'carmug1320' ? 'ARM GCC 13.2.0 (unknown-eabi)' : 'ARM GCC ' + id)
    }, target));
  }
  async function loadCompilers(target, selected) {
    const generation = ++state.compilerGeneration;
    try {
      const compilers = await workflow.getCompilers(target);
      if (generation !== state.compilerGeneration || target !== state.target) return;
      $('#compiler').replaceChildren(...compilers.map(compiler => compilerOption(compiler, target)));
      const actual = compilers.some(compiler => compiler.id === selected) ? selected : workflow.profiles[target].defaultCompiler;
      $('#compiler').value = actual;
      $('#compiler').title = target === 'desktop' ? 'Live catalog · compatible desktop GCC versions' : 'Live catalog · bare-metal Arm GCC with project build support';
      if (actual !== selected) inputsChanged();
    } catch (error) {
      if (generation === state.compilerGeneration && target === state.target) {
        $('#compiler').title = 'Catalog unavailable; the selected compiler remains available. ' + error.message;
      }
    }
  }
  function switchTarget() {
    const previous = capture();
    previous.target = state.target;
    state.drafts.set(state.target, previous);
    state.target = $('#target').value;
    const profile = workflow.profiles[state.target];
    const draft = state.drafts.get(state.target) || { files: profile.files, compiler: profile.defaultCompiler, optimization: '0' };
    state.defaults = { ...profile.files };
    state.editors.clear();
    renderEditors(draft.files);
    setCompilerFallback(state.target, draft.compiler);
    $('#optimization').value = draft.optimization;
    updateTargetCaption();
    inputsChanged();
    loadCompilers(state.target, draft.compiler);
  }
  $('#target').addEventListener('change', switchTarget);
  async function initialize() {
    $('#target').value = state.target;
    setCompilerFallback(state.target, workflow.DEFAULT_COMPILER);
    renderEditors(state.defaults);
    updateTargetCaption();
    renderAll();
    await loadCompilers(state.target, workflow.DEFAULT_COMPILER);
  }
  window.ChipOpenboxCanvasZoom.attach({
    viewport:$('.canvas-viewport'), surface:$('#scripts-zoom-surface'),
    minus:$('#zoom-out'), reset:$('#zoom-reset'), plus:$('#zoom-in'), onChange:() => diagram.rebuild()
  });
  window.ChipOpenboxPaneHeading.connect({
    root:$('.toolbar'),channel,description:()=>$('#profile-note').textContent+' '+$('#build-status').textContent
  });
  initialize();
})();
