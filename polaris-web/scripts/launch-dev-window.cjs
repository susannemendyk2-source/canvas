const { spawn } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname, '..');
const node = process.execPath;
const nuxt = path.join(cwd, 'node_modules', 'nuxt', 'bin', 'nuxt.mjs');
const command = `"${node}" "${nuxt}" dev --port 3090 --host 127.0.0.1`;

const child = spawn('cmd.exe', ['/k', command], {
  cwd,
  detached: true,
  stdio: 'ignore',
  windowsHide: false,
});

child.unref();
console.log(child.pid);
