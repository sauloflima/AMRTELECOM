import assert from 'node:assert/strict';
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { pagesBase as base, withPagesBase } from './publication.mjs';

// GitHub Pages serves this repository under /AMRTELECOM/.
const dist = new URL('../dist/', import.meta.url);
for (const name of await readdir(dist, { recursive: true })) {
  if (!/\.(html|css|mjs)$/.test(name)) continue;
  const file = new URL(name, dist);
  const text = withPagesBase(await readFile(file, 'utf8'));
  await writeFile(file, text);
  if (!name.endsWith('.html')) continue;
  for (const match of text.matchAll(/(?:href|src|poster|data-src)="(\/AMRTELECOM\/[^"?#]*)/g)) {
    const target = match[1].slice(base.length + 1) || 'index.html';
    assert.ok((await stat(new URL(target, dist))).isFile(), `Missing published file: ${target}`);
  }
}
const home = await readFile(new URL('index.html', dist), 'utf8');
assert.ok(home.includes(`href="${base}/styles.css`));
const contact = await readFile(new URL('src/client/contact.mjs', dist), 'utf8');
assert.ok(contact.includes(`${base}/planos.html#explicar-`));
console.log('GitHub Pages: paths and linked files verified.');
