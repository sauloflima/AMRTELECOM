import assert from 'node:assert/strict';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pagesBase } from './publication.mjs';

const exec = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = path.join(root, 'output/playwright', `${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`);
await mkdir(evidence, { recursive: true });
let pages = false;
const summary = { startedAt: new Date().toISOString(), node: process.version, artifact: 'dist/', checks: [] };
let server;

async function run(script, env = process.env, args = []) {
  const start = Date.now();
  let result;
  try {
    result = await exec(process.execPath, [`scripts/${script}.mjs`, ...args], { cwd: root, env, timeout: 180000, maxBuffer: 8 * 1024 * 1024 });
  } catch (error) {
    result = error;
  }
  await writeFile(path.join(evidence, `${script}.log`), (result.stdout || '') + (result.stderr || '') + (result.message || ''));
  const ok = !(result instanceof Error);
  summary.checks.push({ script, ok, durationMs: Date.now() - start });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  assert.ok(ok, `${script} falhou ou excedeu 180s. Relatórios: ${evidence}`);
}

try {
  pages = (await readFile(path.join(root, 'dist/index.html'), 'utf8')).includes(`href="${pagesBase}/styles.css`);
  summary.base = pages ? pagesBase : '/';
  await run('check-publication', process.env, pages ? ['--demo'] : []);
  // Prova que um arquivo privado extra bloqueia o artefato antes de iniciar o navegador.
  const probe = path.join(root, 'dist', `.private-ci-probe-${process.pid}`);
  await writeFile(probe, 'DADO FICTÍCIO DE TESTE', { flag: 'wx' });
  try {
    await assert.rejects(exec(process.execPath, ['scripts/check-publication.mjs'], { cwd: root, timeout: 10000 }),
      error => error.code === 1 && error.stderr.includes('O build deve conter somente'));
    summary.checks.push({ script: 'private-artifact-rejected', ok: true });
  } finally { await unlink(probe); }

  server = spawn(process.execPath, ['scripts/dev.mjs', '--preview', ...(pages ? ['--pages'] : [])], {
    cwd: root, env: { ...process.env, HOST: '127.0.0.1', PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const address = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Prévia não iniciou em 10s.')), 10000);
    server.once('error', error => { clearTimeout(timer); reject(error); });
    server.once('exit', code => { clearTimeout(timer); reject(new Error(`Prévia encerrou: ${code}`)); });
    server.stderr.on('data', chunk => process.stderr.write(chunk));
    server.stdout.on('data', chunk => {
      const url = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url) { clearTimeout(timer); resolve(url); }
    });
  });
  const env = { ...process.env, AMR_ORIGIN: address + (pages ? pagesBase : ''), AMR_BROWSER_EVIDENCE: evidence,
    AMR_MOBILE_EVIDENCE: path.join(evidence, 'mobile'), AMR_SUPPORT_EVIDENCE: path.join(evidence, 'support') };
  summary.url = env.AMR_ORIGIN;
  for (const check of ['pages', 'form', 'security', 'mobile', 'support']) await run(`check-${check}-browser`, env);
  await run('check-publication', process.env, pages ? ['--demo'] : []);
} catch (error) {
  summary.error = error.stack;
  process.exitCode = 1;
  console.error(error.message);
} finally {
  server?.kill();
  summary.finishedAt = new Date().toISOString();
  await writeFile(path.join(evidence, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(`Relatórios do navegador: ${evidence}`);
}
