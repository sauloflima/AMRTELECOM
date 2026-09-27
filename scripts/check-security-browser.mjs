import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { config } from '../src/config.mjs';
import { routes } from '../src/routes.mjs';
import { hostingHeaders } from './security.mjs';

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
  for (const [name, value] of Object.entries(hostingHeaders)) assert.equal(response.headers()[name.toLowerCase()], value);
  assert.match(response.headers()['content-security-policy'], /script-src 'self'/);
  assert.match(response.headers()['content-security-policy'], /frame-ancestors 'none'/);
  assert.equal(response.headers()['x-frame-options'], 'DENY');
  assert.equal(response.headers()['x-content-type-options'], 'nosniff');
  assert.equal(response.headers()['referrer-policy'], 'no-referrer');
  assert.equal(response.headers()['permissions-policy'], 'camera=(), microphone=(), geolocation=()');
  assert.equal(await page.locator('meta[http-equiv="Content-Security-Policy"]').count(), 1);
  assert.doesNotMatch(response.headers()['content-security-policy'], /unsafe-inline|unsafe-eval|\*/);
  for (const letter of await page.locator('[data-letter-delay]').all()) {
    assert.equal(await letter.evaluate(el => el.style.getPropertyValue('--letter-delay')), `${await letter.getAttribute('data-letter-delay')}ms`);
  }
  await page.evaluate(() => {
    window.__violations = [];
    document.addEventListener('securitypolicyviolation', event => window.__violations.push(event.effectiveDirective));
    const script = document.createElement('script');
    script.textContent = 'window.__auditInjected = true';
    document.head.append(script);
    const style = document.createElement('style');
    style.textContent = 'body { --audit-style: injected; }';
    document.head.append(style);
    document.body.setAttribute('style', '--audit-attribute: injected');
  });
  await page.waitForFunction(() => ['script-src-elem', 'style-src-elem', 'style-src-attr'].every(name => window.__violations.includes(name)));
  assert.equal(await page.evaluate(() => Boolean(window.__auditInjected)), false);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--audit-style')), '');
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--audit-attribute')), '');
  assert.equal(await page.locator('#quick-coverage-form input:enabled').count(), 2);
  await page.evaluate(() => HTMLFormElement.prototype.submit.call(document.querySelector('#quick-coverage-form')));
  await page.waitForFunction(() => window.__violations.includes('form-action'));
  assert.equal(page.url(), origin + '/', 'Envio nativo não pode colocar dados na URL.');

  const payload = '<img src=x onerror="window.__auditInjected=true"> & # ?';
  for (const id of ['<svg onload=alert(1)>', '__proto__', 'constructor', '500&price=1']) {
    await page.goto(`${origin}/cobertura.html?plano=${encodeURIComponent(id)}#${encodeURIComponent(payload)}`);
    assert.equal(await page.locator('#selected-plan').isVisible(), false);
  }
  await page.goto(origin + '/cobertura.html?plano=500&price=1');
  assert.equal(await page.locator('#selected-plan-name').textContent(), '500 Mega');
  for (const id of ['name', 'city', 'neighborhood', 'street']) await page.locator(`#${id}`).fill(payload);
  await page.locator('#coverage-form button[type="submit"]').click();
  const preview = page.locator('#coverage-preview');
  assert.ok((await preview.textContent()).includes(payload));
  assert.equal(await preview.locator('img, script, svg').count(), 0);
  assert.equal(await page.evaluate(() => Boolean(window.__auditInjected)), false);
  const whatsapp = new URL(await page.locator('#coverage-continue').getAttribute('href'));
  assert.equal(whatsapp.origin, 'https://wa.me');
  assert.equal(whatsapp.pathname, '/' + config.contact.whatsapp);
  assert.deepEqual([...whatsapp.searchParams.keys()], ['text']);
  assert.equal(whatsapp.searchParams.get('text'), await preview.textContent());
  assert.match(whatsapp.searchParams.get('text'), /R\$\s*80,00/);
  await page.locator('#name').evaluate(el => { el.removeAttribute('maxlength'); });
  await page.locator('#name').fill('A'.repeat(101));
  await page.locator('#coverage-form button[type="submit"]').click();
  assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
  assert.equal(await page.locator('#coverage-continue').isVisible(), false);

  await page.goto(origin + '/');
  await page.locator('#quick-cep').fill('55641000');
  await page.locator('#quick-reference').fill(payload);
  await page.locator('#quick-coverage-form button[type="submit"]').click();
  assert.ok((await page.locator('#quick-preview').textContent()).includes(payload));
  assert.equal(await page.locator('#quick-preview img').count(), 0);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  assert.deepEqual(await context.cookies(), []);

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

  for (const file of ['/.env', '/.git/config', '/.codex-backups/home-before-conexao-casa-20260913.tar.gz', '/Arquivo.zip', '/README.md', '/SECURITY_AUDIT.md', '/src/client.mjs.map', '/assets/videos/AMR%20Telecom.mp4', '/%2e%2e/%2e%2e/package.json']) {
    assert.equal((await context.request.get(origin + file)).status(), 404, file);
  }
  assert.equal((await context.request.get(origin + '/%2e%2e%2fpackage.json')).status(), 403);
  for (const route of routes) {
    const response = await page.goto(origin + route.path);
    for (const [name, value] of Object.entries(hostingHeaders)) assert.equal(response.headers()[name.toLowerCase()], value, route.path);
    assert.deepEqual(await page.locator('[id]').evaluateAll(elements => {
      const ids = elements.map(el => el.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    }), [], `IDs duplicados: ${route.path}`);
    assert.equal(await page.locator('script:not([src]), [onclick], [onload], [onerror], iframe').count(), 0);
    for (const link of await page.locator('a[target="_blank"]').all()) assert.match(await link.getAttribute('rel'), /noopener noreferrer/);
  }
  console.log('Aprovado: 12 páginas, headers, CSP de scripts/estilos/formulários, cargas XSS como texto, plano por allowlist, limites, armazenamento vazio, iframe, traversal, arquivos privados e menu sem JavaScript.');
} finally {
  await browser.close();
}
