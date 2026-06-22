const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const cwd = path.resolve(__dirname, '..');
const node = process.execPath;
const nuxt = path.join(cwd, 'node_modules', 'nuxt', 'bin', 'nuxt.mjs');
const out = fs.openSync(path.join(cwd, 'nuxt-dev.log'), 'a');
const err = fs.openSync(path.join(cwd, 'nuxt-dev.err.log'), 'a');

const child = spawn(node, [nuxt, 'dev', '--port', '3090', '--host', '127.0.0.1'], {
  cwd,
  detached: true,
  stdio: ['ignore', out, err],
  windowsHide: true,
});

child.unref();
console.log(child.pid);
