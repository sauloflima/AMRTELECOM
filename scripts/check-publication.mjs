import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../src/config.mjs';
import { routes } from '../src/routes.mjs';
import { privacy, terms } from '../src/legal.mjs';
import { browserModules, stylesheets, mediaAssets, assetRevision, versionImports } from './build-files.mjs';
import { publicationIssues, pagesBase, withPagesBase } from './publication.mjs';
import { contentSecurityPolicy } from './security.mjs';
import { organizationJson } from './seo.mjs';
import { escape } from '../src/components/shared.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const allowed = new Set([
  ...routes.map(route => route.file), ...stylesheets, 'robots.txt', 'sitemap.xml',
  ...browserModules.map(file => `src/${file}`),
  ...mediaAssets.map(file => file.slice(1)),
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
const revision = await assetRevision(root);
const home = await readFile(path.join(dist, 'index.html'), 'utf8');
const pagesPrepared = home.includes(`href="${pagesBase}/styles.css`);
for (const file of stylesheets) {
  const source = await readFile(path.join(root, 'src', file), 'utf8');
  const published = await readFile(path.join(dist, file), 'utf8');
  assert.equal(published, pagesPrepared ? withPagesBase(source) : source, `CSS desatualizado: ${file}`);
}
for (const file of browserModules) {
  const source = await readFile(path.join(root, 'src', file), 'utf8');
  const published = await readFile(path.join(dist, 'src', file), 'utf8');
  const expected = versionImports(source, revision);
  assert.equal(published, pagesPrepared ? withPagesBase(expected) : expected, `Módulo desatualizado: ${file}`);
  assert.doesNotMatch(published, /^\s*import\s+[^;]*?\sfrom\s+['"]\.[^'"?]+['"]/gm, `Import sem revisão: ${file}`);
}
const issues = publicationIssues(config, privacy, terms);
const demo = process.argv.includes('--demo');
for (const name of routes.map(route => route.file)) {
  const html = await readFile(path.join(dist, name), 'utf8');
  assert.ok(html.includes(`<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}">`), `Meta CSP diferente da política central: ${name}`);
  assert.ok(html.includes(`${pagesPrepared ? pagesBase : ''}/src/client.mjs?v=${revision}`), `Entrada JS desatualizada: ${name}`);
  for (const file of ['styles.css', 'support-assistant.css', ...(['index.html', 'planos.html'].includes(name) ? ['home-refresh.css'] : [])]) {
    assert.ok(html.includes(`${pagesPrepared ? pagesBase : ''}/${file}?v=${revision}`), `CSS sem revisão: ${name}: ${file}`);
  }
  const route = routes.find(route => route.file === name);
  assert.ok(html.includes(`<title>${escape(route.title)}</title>`), `Título incorreto: ${name}`);
  assert.ok(html.includes(`<meta name="description" content="${escape(route.description)}">`), `Descrição incorreta: ${name}`);
  assert.ok(html.includes(`<meta property="og:site_name" content="${escape(config.brand.name)}">`));
  const sharingOrigin = demo ? `https://sauloflima.github.io${pagesBase}` : config.siteUrl.replace(/\/$/, '');
  if (sharingOrigin) {
    assert.ok(html.includes(`<meta property="og:url" content="${sharingOrigin}${route.path}">`), `URL social incorreta: ${name}`);
    assert.ok(html.includes(`<meta property="og:image" content="${sharingOrigin}${config.brand.logo}">`), `Imagem social incorreta: ${name}`);
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)];
  assert.equal(schemas.length, name === 'index.html' ? 1 : 0);
  if (schemas.length) {
    assert.equal(schemas[0][1], organizationJson);
    assert.equal(JSON.parse(schemas[0][1])['@type'], 'Organization');
  }
  if (demo || issues.length) assert.doesNotMatch(html, /rel="canonical"/);
  else assert.ok(html.includes(`<link rel="canonical" href="${config.siteUrl.replace(/\/$/, '')}${route.path}">`));
  assert.match(html, demo || issues.length ? /<meta name="robots" content="noindex, nofollow"/ : /<meta name="robots" content="index, follow"/);
}
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
assert.match(robots, /^Allow: \/$/m);
assert.doesNotMatch(robots, /^Disallow: \/$/m, 'O buscador precisa ler a meta noindex.');
if (demo || issues.length) assert.doesNotMatch(await readFile(path.join(dist, 'sitemap.xml'), 'utf8'), /<loc>/, 'Demonstração deve manter sitemap vazio.');
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
