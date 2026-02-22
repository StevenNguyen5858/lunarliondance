import { watch } from 'node:fs';
import { basename } from 'node:path';
import { generateMediaPoolManifest, mediaPoolDir } from './generate-mediapool-manifest.mjs';

const manifestFileName = 'manifest.json';
let updateTimer = null;

async function runGenerate() {
  try {
    const count = await generateMediaPoolManifest();
    console.log(`Mediapool updated (${count} images).`);
  } catch (error) {
    console.error('Failed to update mediapool manifest.', error);
  }
}

function scheduleGenerate() {
  if (updateTimer !== null) {
    clearTimeout(updateTimer);
  }

  updateTimer = setTimeout(() => {
    updateTimer = null;
    void runGenerate();
  }, 150);
}

await runGenerate();

const watcher = watch(mediaPoolDir, (_eventType, fileName) => {
  if (!fileName) {
    scheduleGenerate();
    return;
  }

  if (basename(String(fileName)).toLowerCase() === manifestFileName) {
    return;
  }

  scheduleGenerate();
});

console.log(`Watching ${mediaPoolDir} for media changes...`);

function shutdown() {
  watcher.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
