'use strict';
(() => {
  if (window.self !== window.top) document.documentElement.classList.add('embedded');
  const channel = window.ChipOpenboxChannel.connect('board');
  window.ChipOpenboxPorts.observe(channel, {
    'flash-in':{ selector:'#flash', side:'left' }, 'flash-out':{ selector:'#flash', side:'right' }
  });
  const $ = selector => document.querySelector(selector);
  let image = null;
  let activity = null;
  function render() {
    $('#board-connection').textContent = channel.connected
      ? image ? 'Current image received from scripts through openbox.' : 'Connected. Build a current image in scripts.'
      : 'Open openbox to connect scripts, board and MCU views.';
    $('#selected-image').hidden = !image;
    $('#selected-image').dataset.imageId = image?.imageId || '';
    if (image) {
      $('#image-target').textContent = image.target;
      $('#image-compiler').textContent = image.compiler;
      $('#image-size').textContent = image.byteCount + ' bytes';
      $('#image-bytes').textContent = image.bytes.slice(0, 16).map(byte => byte.value.toString(16).toUpperCase().padStart(2, '0')).join(' ');
    }
    $('#workflow-status').textContent = activity?.message || 'No programming or execution has occurred.';
    $('#workflow-status').dataset.state = activity?.status || 'idle';
  }
  channel.subscribe(message => {
    if (!['host:sync', 'host:state'].includes(message.type)) return;
    image = message.payload.image;
    activity = message.payload.activity;
    render();
  });
  document.querySelectorAll('[data-workflow]').forEach(button => button.addEventListener('click', () => {
    const workflow = button.dataset.workflow;
    activity = { status: 'requesting', message: 'Requesting ' + button.childNodes[0].textContent + '…' };
    if (!channel.send('workflow:request', { workflow })) activity = {
      status: 'unconnected', message: 'Open openbox to connect this control. No workflow has run.'
    };
    render();
  }));
  window.ChipOpenboxCanvasZoom.attach({
    viewport:$('.board-canvas'), surface:$('#board-zoom-surface'),
    minus:$('#zoom-out'), reset:$('#zoom-reset'), plus:$('#zoom-in')
  });
  window.ChipOpenboxPaneHeading.connect({
    root:$('.board-toolbar'),channel,description:()=>$('#workflow-status').textContent
  });
  render();
})();
