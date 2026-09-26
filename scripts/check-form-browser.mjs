// Teste de regressão opcional. Usa Playwright já disponível no ambiente,
// sem acrescentar dependências à aplicação.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';

const runtime = process.env.AMR_PLAYWRIGHT_ROOT || process.cwd();
const require = createRequire(path.join(runtime, 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.AMR_ORIGIN || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  for (const mode of ['normal', 'sem-javascript', 'falha-no-script']) {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== 'sem-javascript',
      viewport: { width: 390, height: 844 },
    });

    try {
      const page = await context.newPage();
      await page.route('**/*', route => mode === 'falha-no-script' && new URL(route.request().url()).pathname === '/src/client.mjs' ? route.abort() : new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
      const navigations = [];
      let popups = 0;
      page.on('popup', () => { popups++; });
      page.on('request', request => {
        if (request.isNavigationRequest()) navigations.push(request.url());
      });
      await page.goto(origin + '/cobertura.html');

      const notice = page.locator('#coverage-load-message');
      const controls = page.locator('#coverage-form input, #coverage-form button');
      assert.equal(await controls.count(), 5);

      if (mode === 'normal') {
        assert.equal(await notice.isVisible(), false);
        for (const control of await controls.all()) {
          assert.equal(await control.isEnabled(), true);
        }
        await page.locator('#coverage-form button').click();
        assert.equal(await page.locator('[aria-invalid="true"]').count(), 4);
        assert.equal(await page.evaluate(() => document.activeElement.id), 'name');

        const values = {
          name: 'Pessoa de teste',
          city: 'Cidade de teste',
          neighborhood: 'Bairro de teste',
          street: 'Rua de teste',
        };
        for (const [id, value] of Object.entries(values)) {
          await page.locator(`#${id}`).fill(value);
        }
        await page.locator('#street').press('Enter');
        const prepared = await page.locator('#coverage-continue').getAttribute('href');
        assert.equal(await page.locator('#coverage-continue').isVisible(), true);
        assert.equal(await page.locator('#coverage-preview').isVisible(), true);
        assert.match(await page.locator('#coverage-preview').innerText(), /Pessoa de teste/);
        assert.equal(new URL(prepared).searchParams.get('text').includes('Pessoa de teste'), true);
        assert.equal(new URL(prepared).searchParams.get('text').includes('Telefone:'), false);
        await page.goto(origin + '/');
        await page.locator('#quick-cep').fill('50030230');
        await page.locator('#quick-reference').fill('Casa de teste');
        await page.locator('#quick-coverage-form button[type="submit"]').click();
        const quickUrl = await page.locator('#quick-continue').getAttribute('href');
        assert.equal(await page.locator('#quick-preview').isVisible(), true);
        assert.equal(new URL(quickUrl).searchParams.get('text'), await page.locator('#quick-preview').innerText());
        assert.equal(popups, 0, 'Preparar a consulta não abre o WhatsApp automaticamente.');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
      } else {
        assert.equal(await notice.isVisible(), true);
        for (const control of await controls.all()) {
          assert.equal(await control.isDisabled(), true);
        }
        await page.locator('#coverage-form').scrollIntoViewIfNeeded();
        await page.keyboard.press('Enter');
      }

      assert.equal(new URL(page.url()).search, '');
      assert.deepEqual(navigations, mode === 'normal' ? [`${origin}/cobertura.html`, `${origin}/`] : [`${origin}/cobertura.html`]);
      assert.equal(await page.evaluate(() => localStorage.length), 0);
      assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage).filter(key => key !== 'amrSupportPromptShown')), []);
      console.log(`Aprovado: ${mode}; nenhum envio de dados pela URL.`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
