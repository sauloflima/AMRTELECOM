import assert from 'node:assert/strict';
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';

// GitHub Pages serves this repository under /AMRTELECOM/.
const base = '/AMRTELECOM';
const dist = new URL('../dist/', import.meta.url);
for (const name of await readdir(dist, { recursive: true })) {
  if (!/\.(html|css|mjs)$/.test(name)) continue;
  const file = new URL(name, dist);
  const text = (await readFile(file, 'utf8')).replace(/(["'`])\/(?!\/)/g, `$1${base}/`);
  await writeFile(file, text);
  if (!name.endsWith('.html')) continue;
  for (const match of text.matchAll(/(?:href|src|poster|data-src)="(\/AMRTELECOM\/[^"?#]*)/g)) {
    const target = match[1].slice(base.length + 1) || 'index.html';
    assert.ok((await stat(new URL(target, dist))).isFile(), `Missing published file: ${target}`);
  }
}
const home = await readFile(new URL('index.html', dist), 'utf8');
assert.ok(home.includes(`href="${base}/styles.css`));
const client = await readFile(new URL('src/client.mjs', dist), 'utf8');
assert.ok(client.includes(`${base}/planos.html#explicar-`));
console.log('GitHub Pages: paths and linked files verified.');
