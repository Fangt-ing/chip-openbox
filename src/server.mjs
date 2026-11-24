import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicFiles = [
  'openbox.html', 'openbox.css', 'openbox.js',
  'components/scripts/scripts.html', 'components/scripts/scripts.js', 'components/scripts/scripts.css',
  'components/scripts/default-content/profiles.js',
  'components/scripts/visualization/connections.js',
  'workflows/scripting/scripting.js', 'workflows/scripting/integrations/compiler-explorer.js',
  'components/chip/chip.html', 'components/chip/chip.css', 'components/chip/chip.js',
  'components/board/board.html', 'components/board/board.css', 'components/board/board.js',
  'common/correspondence/intel-hex.js', 'common/component-channel.js',
  'workflows/flash/flash.js', 'workflows/standalone/standalone.js', 'workflows/debug/debug.js'
];
const routes = new Map(publicFiles.map(file => ['/' + file, file]));
routes.set('/', 'openbox.html');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  if (request.method === 'GET' && pathname === '/favicon.ico') { response.writeHead(204); response.end(); return; }
  const file = routes.get(pathname);
  if (request.method !== 'GET' || !file) { response.writeHead(404); response.end('Not found.'); return; }
  try {
    const content = await readFile(path.join(root, file));
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] + '; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(content);
  } catch {
    response.writeHead(500); response.end('Unable to load page asset.');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(Number(process.env.CHIP_OPENBOX_PORT || 8765), '127.0.0.1', () => {
  console.log('Chip Openbox: http://127.0.0.1:' + server.address().port);
});
