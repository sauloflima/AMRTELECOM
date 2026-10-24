import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, cp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { browserModules, assetRevision, versionImports } from '../scripts/build-files.mjs';

test('grafo estático do navegador cabe na allowlist, sem Node, ciclos ou módulos órfãos', async () => {
  const imports = new Map();
  for (const file of browserModules) {
    const source = await readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /^\s*(?:import\s*['"]|export\s+[^;\n]*?\sfrom\s*['"])|\bimport\s*\(/gm,
      `Import fora do formato versionado: ${file}`);
    const dependencies = [...source.matchAll(/^import\s+[^;]*?\sfrom\s+['"]([^'"]+)['"]/gm)].map(([, specifier]) => {
      assert.ok(specifier.startsWith('.'), `Import não local no navegador: ${file}: ${specifier}`);
      const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
      assert.ok(browserModules.includes(dependency), `Import ausente da allowlist: ${dependency}`);
      return dependency;
    });
    imports.set(file, dependencies);
  }
  const visited = new Set();
  function visit(file, ancestors = []) {
    assert.ok(!ancestors.includes(file), `Ciclo: ${[...ancestors, file].join(' -> ')}`);
    if (visited.has(file)) return;
    for (const dependency of imports.get(file)) visit(dependency, [...ancestors, file]);
    visited.add(file);
  }
  visit('client.mjs');
  assert.deepEqual([...visited].sort(), [...browserModules].sort());
});

test('módulos de comportamento podem ser importados sem depender do DOM na importação', async () => {
  for (const file of browserModules.filter(file => file !== 'client.mjs')) {
    await import(new URL(`../src/${file}`, import.meta.url));
  }
});

test('revisão de imports cobre dependências relativas sem modificar destinos externos', () => {
  const source = "import { a } from './a.mjs';\nimport b from '../b.mjs';\nimport c from 'external';";
  assert.equal(versionImports(source, 'abc123'),
    "import { a } from './a.mjs?v=abc123';\nimport b from '../b.mjs?v=abc123';\nimport c from 'external';");
});

test('revisão muda com CSS, módulos e fontes que geram HTML', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'amr-revision-'));
  try {
    for (const directory of ['src', 'scripts']) {
      await cp(new URL(`../${directory}/`, import.meta.url), path.join(root, directory), { recursive: true });
    }
    await cp(new URL('../package-lock.json', import.meta.url), path.join(root, 'package-lock.json'));
    for (const file of ['src/client/contact.mjs', 'src/styles.css', 'src/components/home-sections.mjs', 'src/legal.mjs', 'src/routes.mjs', 'scripts/build.mjs', 'scripts/build-files.mjs', 'scripts/security.mjs', 'scripts/seo.mjs', 'scripts/publication.mjs', 'package-lock.json']) {
      const before = await assetRevision(root);
      const target = path.join(root, file);
      await writeFile(target, (await readFile(target, 'utf8')) + '\n');
      const after = await assetRevision(root);
      assert.notEqual(after, before, `Artefato deve perder validade após mudar ${file}`);
      assert.equal(after.length, 16);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
