import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';

const origin = process.env.AMR_ORIGIN || 'http://127.0.0.1:4173';
const require = createRequire(path.join(process.env.AMR_PLAYWRIGHT_ROOT || process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const context = await browser.newContext();
  await context.route('**/*', route => route.request().url().startsWith(`${origin}/`) ? route.continue() : route.abort());
  const page = await context.newPage();
  const response = await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  assert.match(response.headers()['content-security-policy'], /script-src 'self'/);
  assert.match(response.headers()['content-security-policy'], /frame-ancestors 'none'/);
  assert.equal(response.headers()['x-frame-options'], 'DENY');
  assert.equal(response.headers()['x-content-type-options'], 'nosniff');
  assert.equal(response.headers()['referrer-policy'], 'no-referrer');
  assert.equal(response.headers()['permissions-policy'], 'camera=(), microphone=(), geolocation=()');
  assert.equal(await page.locator('meta[http-equiv="Content-Security-Policy"]').count(), 1);
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.__auditInjected = true';
    document.head.append(script);
  });
  assert.equal(await page.evaluate(() => Boolean(window.__auditInjected)), false);
  assert.equal(await page.locator('#quick-coverage-form input:enabled').count(), 2);

  const framePage = await context.newPage();
  await framePage.setContent(`<iframe src="${origin}/"></iframe>`);
  await framePage.waitForTimeout(200);
  assert.equal(framePage.frames().some(frame => frame.url() === origin + '/'), false);

  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noScript.route('**/*', route => route.request().url().startsWith(`${origin}/`) ? route.continue() : route.abort());
  const noScriptPage = await noScript.newPage();
  await noScriptPage.goto(origin + '/');
  assert.equal(await noScriptPage.locator('#navigation').isVisible(), true, 'Menu móvel deve continuar visível sem JavaScript.');
  await noScript.close();

  for (const file of ['/.env', '/.git/config', '/.codex-backups/home-before-conexao-casa-20260913.tar.gz', '/assets/videos/AMR%20Telecom.mp4', '/%2e%2e/%2e%2e/package.json']) {
    assert.equal((await context.request.get(origin + file)).status(), 404, file);
  }
  console.log('Aprovado: CSP bloqueia script inline; iframe e arquivos fora do build bloqueados; menu sem JavaScript e consulta rápida ativos.');
} finally {
  await browser.close();
}
