// Exercita o assistente atual com dados fictícios e destino WhatsApp interceptado.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../src/config.mjs';
import { chromium, origin, reportFailure } from './browser-test.mjs';

const evidence = process.env.AMR_SUPPORT_EVIDENCE || 'output/playwright/support';
const browser = await chromium.launch({ headless: true });
const errors = [];
await mkdir(evidence, { recursive: true });

async function newPage(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, ...options });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === 'https://wa.me') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Destino interceptado</title>' });
    return url.origin === new URL(origin).origin ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return page;
}

async function openWhatsApp(page, selector, keyboard = true) {
  const link = page.locator(selector);
  assert.equal(await link.getAttribute('target'), '_blank');
  assert.match(await link.getAttribute('rel'), /noopener noreferrer/);
  const popupPromise = page.waitForEvent('popup');
  if (keyboard) await link.press('Enter'); else await link.click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  const url = new URL(popup.url());
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, `/${config.contact.whatsapp}`);
  assert.equal(url.searchParams.get('text'), 'Olá! Vim pelo site da AMR Telecom e gostaria de atendimento.');
  assert.equal(await popup.title(), 'Destino interceptado');
  await popup.close();
}

try {
  const page = await newPage();
  await page.goto(origin + '/');
  const widget = page.locator('.support-assistant');
  assert.equal(await widget.isVisible(), false);
  await page.waitForTimeout(10000);
  assert.equal(await widget.isVisible(), false, 'Não aparece nos primeiros dez segundos.');
  await widget.waitFor({ state: 'visible', timeout: 2500 });
  assert.equal(await page.locator('.support-prompt').isVisible(), true);
  assert.equal(await page.locator('.support-cta-mobile').innerText(), 'Posso ajudar?');
  await page.screenshot({ path: path.join(evidence, 'desktop-delay.png') });
  await openWhatsApp(page, '.support-cta-mobile');
  await page.clock.install();
  for (const navigate of [() => page.goto(origin + '/planos.html'), () => page.reload(), () => page.goBack()]) {
    await navigate();
    assert.equal(await widget.isVisible(), false);
    await page.clock.fastForward(10000);
    assert.equal(await widget.isVisible(), false);
    await page.clock.fastForward(1000);
    await widget.waitFor({ state: 'visible' });
  }
  await page.context().close();
  console.log('Aprovado: atraso real de 11s, WhatsApp interceptado, navegação, reload e Voltar.');

  for (const [width, height] of [[320,844],[360,640],[390,844],[430,932],[768,1024],[1024,950],[1440,950],[390,400]]) {
    const page = await newPage({ viewport: { width, height }, isMobile: width <= 800, hasTouch: width <= 800 });
    await page.clock.install();
    await page.goto(origin + '/');
    await page.locator('.carousel-rotation').click();
    await page.clock.fastForward(11000);
    const widget = page.locator('.support-assistant');
    const prompt = page.locator('.support-prompt');
    await widget.waitFor({ state: 'visible' });
    assert.equal(await prompt.isVisible(), true);
    if (width === 1024) await openWhatsApp(page, '.support-cta-mobile', false);
    const box = await widget.boundingBox();
    const card = await prompt.boundingBox();
    assert.ok(box.x >= 12 && box.x + box.width <= width - 12);
    assert.ok(card.x >= 0 && card.y >= 68 && card.x + card.width <= width && card.y + card.height <= height);
    const avatar = page.locator(width <= 800 ? '.support-avatar-link' : '.support-avatar-toggle');
    assert.equal(await avatar.evaluate(el => parseFloat(getComputedStyle(el).width)), width <= 800 ? 52 : 64);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    await page.screenshot({ path: path.join(evidence, `${width}x${height}.png`), animations: 'disabled' });
    await page.locator('.support-close').press('Enter');
    assert.equal(await prompt.isVisible(), false);
    if (await widget.isVisible()) {
      assert.equal(await avatar.evaluate(el => el === document.activeElement), true);
      if (width <= 800) await openWhatsApp(page, '.support-avatar-link');
      else {
        await avatar.press('Space');
        assert.equal(await prompt.isVisible(), true);
        await page.keyboard.press('Escape');
        assert.equal(await prompt.isVisible(), false);
      }
    } else {
      // O widget recolhido cede espaço aos controles; foco não pode ficar preso nele.
      await page.waitForFunction(() => !document.activeElement.closest('.support-assistant'));
    }
    await page.locator('.menu-toggle').dispatchEvent('click');
    await widget.waitFor({ state: 'hidden' });
    await page.keyboard.press('Escape');
    await page.locator('#contact-dialog').evaluate(dialog => dialog.showModal());
    assert.equal(await widget.isVisible(), false);
    await page.keyboard.press('Escape');
    await page.locator('#quick-cep').focus();
    assert.equal(await widget.isVisible(), false);
    await page.locator('footer').scrollIntoViewIfNeeded();
    assert.equal(await widget.isVisible(), false);
    await page.context().close();
    console.log(`Aprovado: assistente em ${width}x${height}, limites, foco, menu, modal, formulário e rodapé.`);
  }

  for (const mode of ['reduced', 'paused', 'no-javascript']) {
    const page = await newPage({ viewport: { width:390, height:844 }, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'no-javascript' });
    await page.clock.install();
    await page.goto(origin + '/');
    if (mode === 'paused') await page.locator('.effects-toggle').click();
    await page.clock.fastForward(11000);
    const widget = page.locator('.support-assistant');
    if (mode === 'no-javascript') {
      assert.equal(await widget.isVisible(), false);
      assert.ok(await page.locator('a[href^="https://wa.me/"]:visible').count());
    } else {
      await widget.waitFor({ state: 'visible' });
      if (mode === 'paused') assert.equal(await widget.evaluate(el => getComputedStyle(el).animationName), 'none');
      if (mode === 'reduced') {
        await page.locator('[data-slide="2"]').dispatchEvent('click');
        assert.equal(await page.locator('.enterprise-media video').evaluate(video => video.paused), true);
        assert.equal(await page.locator('.enterprise-media').evaluate(el => el.classList.contains('video-static')), true);
      }
    }
    await page.context().close();
    console.log(`Aprovado: ${mode}.`);
  }
  assert.deepEqual(errors, []);
} catch (error) {
  await reportFailure(browser, error).catch(() => {});
  throw error;
} finally { await browser.close(); }
