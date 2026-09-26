import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../src/config.mjs';
import { routes } from '../src/routes.mjs';
import { privacy, terms } from '../src/legal.mjs';
import { heroAssets } from '../src/components/hero.mjs';
import { supportAvatar } from '../src/components/support-assistant.mjs';
import { homeAssets } from '../src/components/home-sections.mjs';
import { publicationIssues } from './publication.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const allowed = new Set([
  ...routes.map(route => route.file), 'styles.css', 'home-refresh.css', 'support-assistant.css', 'robots.txt', 'sitemap.xml',
  ...['client.mjs', 'config.mjs', 'lib/whatsapp.mjs', 'lib/carousel.mjs', 'lib/hero-video.mjs', 'lib/support-assistant.mjs'].map(file => `src/${file}`),
  ...[config.brand.logo, config.brand.logoLight, config.brand.favicon, ...heroAssets, ...homeAssets, supportAvatar].map(file => file.slice(1)),
]);

async function files(dir, prefix = '') {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) result.push(...await files(path.join(dir, entry.name), name + '/'));
    else {
      assert.ok(entry.isFile(), `Arquivo especial ou link simbólico no build: ${name}`);
      result.push(name);
    }
  }
  return result;
}

const actual = await files(dist);
assert.deepEqual(actual.sort(), [...allowed].sort(), 'O build deve conter somente páginas, código e mídias explicitamente selecionados.');
const issues = publicationIssues(config, privacy, terms);
for (const name of routes.map(route => route.file)) {
  const html = await readFile(path.join(dist, name), 'utf8');
  assert.match(html, /<meta http-equiv="Content-Security-Policy"/);
  assert.match(html, issues.length ? /<meta name="robots" content="noindex, nofollow"/ : /<meta name="robots" content="index, follow"/);
}
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
assert.match(robots, issues.length ? /^Disallow: \/$/m : /^Allow: \/$/m);
for (const name of actual.filter(file => /\.(html|css|mjs|txt|xml)$/.test(file))) {
  const content = await readFile(path.join(dist, name), 'utf8');
  assert.doesNotMatch(content, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk_live_[a-zA-Z0-9]{16,}|gh[pousr]_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16})\b/, `Possível credencial em ${name}`);
}
console.log(`Build verificado: ${actual.length} arquivos permitidos em dist/; nenhuma origem, backup, arquivo de desenvolvimento ou credencial conhecida.`);
if (process.argv.includes('--release')) {
  if (issues.length) {
    console.error('Pré-publicação bloqueada:\n- ' + issues.join('\n- '));
    process.exitCode = 1;
  } else console.log('Aprovações locais registradas. Ainda é obrigatório verificar a configuração e o HTTPS da hospedagem.');
}
