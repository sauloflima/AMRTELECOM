import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import os from 'node:os';
import { routes } from '../src/routes.mjs';

const require = createRequire(path.join(process.env.AMR_PLAYWRIGHT_ROOT || process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const origin = process.env.AMR_ORIGIN || 'http://127.0.0.1:4173';
const widths = [320, 375, 390, 768, 1024, 1440];
const errors = [];
const links = new Set();
let contactButtons = 0;

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

  for (const route of routes) {
    const response = await page.goto(origin + route.path);
    assert.equal(response.status(), 200, route.path);
    assert.equal(await page.title(), route.title);
    assert.equal(await page.locator('main h1').count(), 1, route.path);
    assert.ok(!await page.locator('body').innerText().then(text => /[\u2012-\u2015]/u.test(text)));

    for (const width of widths) {
      await page.setViewportSize({ width, height: 950 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `${route.path}: ${width}px`);
    }
    if (route.path === '/planos.html') {
      await page.screenshot({ path: path.join(os.tmpdir(), 'amr-pages-desktop.png') });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: path.join(os.tmpdir(), 'amr-pages-mobile.png') });
      await page.setViewportSize({ width: 1440, height: 950 });
    }
    for (const href of await page.locator('a[href]').evaluateAll(items => items.map(item => item.getAttribute('href')))) {
      if (href.startsWith('/')) links.add(href);
      if (href.startsWith('#')) assert.equal(await page.locator(href).count(), 1, href);
    }
    await page.locator('details').evaluateAll(items => items.forEach(item => item.open = true));
    for (const link of await page.locator('[data-whatsapp]').all()) {
      if (await link.isVisible()) {
        const href = await link.getAttribute('href');
        if (href.startsWith('https://wa.me/')) {
          assert.equal(new URL(href).hostname, 'wa.me');
          assert.equal(await link.getAttribute('target'), '_blank');
          assert.match(await link.getAttribute('rel'), /noopener noreferrer/);
        } else {
          await link.click();
          assert.equal(await page.locator('#contact-dialog').isVisible(), true);
          await page.keyboard.press('Escape');
        }
        contactButtons++;
      }
    }
    console.log(`Aprovado: ${route.path}; seis larguras, título e H1.`);
  }

  for (const href of links) {
    assert.ok(!href.startsWith('/#'), `Âncora antiga: ${href}`);
    const response = await page.request.get(origin + href);
    assert.equal(response.status(), 200, href);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  assert.equal(await page.locator('.header .brand-light').evaluate(img => getComputedStyle(img).display), 'block');
  assert.ok(await page.locator('.header .brand-light').evaluate(img => img.naturalWidth > 0));
  assert.equal(await page.locator('.amr-footer .brand-light').evaluate(img => getComputedStyle(img).display), 'none');
  await page.evaluate(() => scrollTo(0, 200));
  await page.waitForFunction(() => document.querySelector('.header').classList.contains('is-scrolled'));
  assert.equal(await page.locator('.header .brand-dark').evaluate(img => getComputedStyle(img).display), 'block');
  await page.locator('.routine-section').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector('.coverage-dock').hidden);
  assert.equal(await page.locator('.mobile-whatsapp').count(), 0);
  await page.locator('.plan-grid').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.coverage-dock').hidden);
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await page.locator('#navigation').getByRole('link', { name: 'Planos', exact: true }).click();
  await page.waitForURL(origin + '/planos.html');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('#navigation [aria-current="page"]').innerText(), 'Planos');
  await page.reload();
  assert.equal(await page.locator('.plan-card').count(), 4);
  await page.goBack();
  assert.equal(new URL(page.url()).pathname, '/');

  await page.goto(origin + '/perguntas.html');
  for (const details of await page.locator('details').all()) {
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.notEqual(await details.getAttribute('open'), null);
    await page.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'), null);
  }
  await page.goto(origin + '/contato.html');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'skip-link');
  assert.deepEqual(errors, []);
  console.log(`Aprovado: ${links.size} destinos internos; ${contactButtons} botões de contato; menu, recarregamento, Voltar e accordion. Nenhum erro no console.`);
} finally {
  await browser.close();
}
