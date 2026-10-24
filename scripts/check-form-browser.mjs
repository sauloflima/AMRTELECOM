// Dados fictícios e WhatsApp interceptado; nenhum contato externo.
import assert from 'node:assert/strict';
import { chromium, origin, reportFailure } from './browser-test.mjs';

const browser = await chromium.launch({ headless: true });

try {
  for (const mode of ['normal', 'sem-javascript', 'falha-no-script', 'falha-no-modulo']) {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== 'sem-javascript',
      viewport: { width: 390, height: 844 },
    });

    try {
      const page = await context.newPage();
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        const failedModule = mode === 'falha-no-script' ? '/src/client.mjs' : mode === 'falha-no-modulo' ? '/src/client/contact.mjs' : null;
        if (url.origin === 'https://wa.me') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>WhatsApp interceptado</title>' });
        return (failedModule && url.pathname === new URL(origin + failedModule).pathname) || url.origin !== new URL(origin).origin ? route.abort() : route.continue();
      });
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
        assert.equal(popups, 0, 'Preparar a consulta não abre o WhatsApp automaticamente.');
        const popupPromise = page.waitForEvent('popup');
        await page.locator('#coverage-continue').click();
        const popup = await popupPromise;
        await popup.waitForLoadState('domcontentloaded');
        assert.equal(popup.url(), prepared);
        assert.equal(await popup.title(), 'WhatsApp interceptado');
        await popup.close();
        await page.goto(origin + '/');
        const cep = page.locator('#quick-cep');
        for (const [position, digit] of [[0, '5'], [3, '3'], [6, '2']]) {
          await cep.fill('50030-230');
          await cep.evaluate((field, position) => field.setSelectionRange(position, position + 1), position);
          await cep.press('Backspace');
          await cep.press(digit);
          assert.equal(await cep.inputValue(), '50030-230', 'Corrigir um dígito deve preservar o CEP e a posição da edição.');
        }
        await page.locator('#quick-cep').fill('50030230');
        await page.locator('#quick-reference').fill('Casa de teste');
        await page.locator('#quick-coverage-form button[type="submit"]').click();
        const quickUrl = await page.locator('#quick-continue').getAttribute('href');
        assert.match(new URL(quickUrl).searchParams.get('text'), /CEP: 50030-230/);
        assert.equal(await page.locator('#quick-preview').isVisible(), true);
        assert.equal(new URL(quickUrl).searchParams.get('text'), await page.locator('#quick-preview').innerText());
        assert.equal(popups, 1, 'Consulta rápida não abre outra aba automaticamente.');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
        await page.setViewportSize({ width: 390, height: 400 });
        // O canal oficial está configurado; abre o diálogo de fallback para testar seus controles reais.
        await page.locator('#contact-dialog').evaluate(dialog => dialog.showModal());
        const box = await page.locator('#contact-dialog').boundingBox();
        assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= 390 && box.y + box.height <= 400);
        await page.getByRole('button', { name: 'Fechar aviso' }).click();
        assert.equal(await page.locator('#contact-dialog').isVisible(), false);
        await page.locator('#contact-dialog').evaluate(dialog => dialog.showModal());
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#contact-dialog').isVisible(), false);
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
      assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), []);
      console.log(`Aprovado: ${mode}; nenhum envio de dados pela URL.`);
    } catch (error) {
      await reportFailure(browser, error).catch(() => {});
      throw error;
    } finally {
      await context.close();
    }
  }
} catch (error) {
  await reportFailure(browser, error).catch(() => {});
  throw error;
} finally {
  await browser.close();
}
