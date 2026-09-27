import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { browserModules, stylesheets, assetRevision, versionImports } from '../scripts/build-files.mjs';

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

test('revisão de recursos muda quando um módulo transitivo muda', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'amr-revision-'));
  try {
    for (const file of [...stylesheets, ...browserModules]) {
      const target = path.join(root, 'src', file);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, 'original');
    }
    const before = await assetRevision(root);
    await writeFile(path.join(root, 'src/client/contact.mjs'), 'alterado');
    const afterModule = await assetRevision(root);
    assert.notEqual(afterModule, before);
    await writeFile(path.join(root, 'src/styles.css'), 'alterado');
    const afterStyles = await assetRevision(root);
    assert.notEqual(afterStyles, afterModule);
    assert.equal(afterStyles.length, 16);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
