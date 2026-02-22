import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const watchScriptPath = path.resolve(__dirname, './watch-mediapool-manifest.mjs');
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const watcherProcess = spawn(process.execPath, [watchScriptPath], {
  stdio: 'inherit'
});

const ngServeProcess = spawn(npxCommand, ['ng', 'serve'], {
  stdio: 'inherit'
});

let shuttingDown = false;

function stopAll(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  if (!watcherProcess.killed) {
    watcherProcess.kill('SIGTERM');
  }
  if (!ngServeProcess.killed) {
    ngServeProcess.kill('SIGTERM');
  }

  process.exit(exitCode);
}

ngServeProcess.on('exit', code => {
  stopAll(code ?? 0);
});

watcherProcess.on('exit', code => {
  if (!shuttingDown && code !== 0) {
    stopAll(code ?? 1);
  }
});

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
