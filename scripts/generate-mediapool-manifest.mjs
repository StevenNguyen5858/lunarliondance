import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mediaPoolDir = path.resolve(__dirname, '../src/assets/mediapool');
const manifestPath = path.join(mediaPoolDir, 'manifest.json');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export async function generateMediaPoolManifest() {
  await mkdir(mediaPoolDir, { recursive: true });

  const directoryEntries = await readdir(mediaPoolDir, { withFileTypes: true });
  const images = directoryEntries
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .filter(fileName => allowedExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map(fileName => `assets/mediapool/${encodeURIComponent(fileName)}`);

  await writeFile(manifestPath, `${JSON.stringify({ images }, null, 2)}\n`, 'utf8');
  return images.length;
}

if (path.resolve(process.argv[1] ?? '') === __filename) {
  const count = await generateMediaPoolManifest();
  console.log(`Mediapool manifest generated (${count} images).`);
}
