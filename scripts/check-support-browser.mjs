// Usa o Playwright disponível no ambiente, sem dependência nova no site.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../src/config.mjs';

const require = createRequire(path.join(process.env.AMR_PLAYWRIGHT_ROOT || process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const origin = process.env.AMR_ORIGIN || 'http://127.0.0.1:4173';
const evidence = process.env.AMR_SUPPORT_EVIDENCE || 'support-assistant-qa';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
await mkdir(evidence, { recursive: true });

async function newPage(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, ...options });
  // Verifica a nova aba sem contatar o WhatsApp nem enviar mensagens.
  await context.route('https://wa.me/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Destino verificado</title>' }));
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return page;
}

async function openWhatsApp(page, selector) {
  const popupPromise = page.waitForEvent('popup');
  const link = page.locator(selector);
  assert.equal(await link.getAttribute('target'), '_blank');
  assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
  await link.click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  const url = new URL(popup.url());
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, `/${config.contact.whatsapp}`);
  assert.equal(url.searchParams.get('text'), config.messages.assistant);
  await popup.close();
}

try {
  const page = await newPage();
  await page.goto(origin);
  const widget = page.locator('.support-assistant');
  const prompt = page.locator('.support-prompt');
  const toggle = page.locator('.support-avatar-toggle');
  assert.equal(await widget.isVisible(), false);
  await page.waitForTimeout(10000);
  assert.equal(await widget.isVisible(), false, 'Não aparece nos primeiros dez segundos');
  await widget.waitFor({ state: 'visible', timeout: 2500 });
  assert.equal(await prompt.isVisible(), true);
  assert.equal(await widget.evaluate(el => getComputedStyle(el).animationDuration), '0.42s');
  assert.equal((await prompt.innerText()).trim(), 'Posso ajudar?');
  await page.waitForFunction(() => document.querySelector('.support-portrait img').naturalWidth === 1536);
  await page.screenshot({ path: path.join(evidence, 'desktop-1440.png'), animations: 'disabled' });
  await widget.screenshot({ path: path.join(evidence, 'widget.png'), animations: 'disabled' });
  await openWhatsApp(page, '.support-cta-mobile');

  await page.locator('.support-close').focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.support-close').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
  await page.keyboard.press('Enter');
  assert.equal(await prompt.isVisible(), false);
  assert.equal(await toggle.evaluate(el => el === document.activeElement), true, 'Fechar devolve o foco ao avatar');
  await page.keyboard.press('Enter');
  assert.equal(await prompt.isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await prompt.isVisible(), false);
  await page.clock.install();
  for (const navigate of [() => page.goto(origin + '/planos.html'), () => page.reload(), () => page.goBack()]) {
    await navigate();
    assert.equal(await widget.isVisible(), false);
    await page.clock.fastForward(10000);
    assert.equal(await widget.isVisible(), false, 'Cada abertura deve esperar 11 segundos');
    await page.clock.fastForward(1000);
    await prompt.waitFor({ state: 'visible' });
  }
  await page.context().close();
  console.log('Aprovado: delay real de 11s, entrada 420ms, texto, fechamento, foco, WhatsApp e novo convite após navegação/reload/Voltar.');

  for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
    const mobile = width <= 800;
    const page = await newPage({ isMobile: mobile, hasTouch: mobile, viewport: { width, height: width === 360 ? 640 : width === 768 ? 1024 : width < 600 ? 844 : 950 } });
    await page.clock.install();
    await page.goto(origin);
    const widget = page.locator('.support-assistant');
    const prompt = page.locator('.support-prompt');
    assert.equal(await widget.isVisible(), false, 'Nova sessão reinicia o convite');
    await page.clock.fastForward(11000);
    await widget.waitFor({ state: 'visible' });
    await page.locator('.support-portrait img').first().evaluate(img => img.decode());
    await page.screenshot({ path: path.join(evidence, `viewport-${width}.png`), animations: 'disabled' });
    const box = await widget.boundingBox();
    assert.ok(box.x >= 12 && box.x + box.width <= width - 12, `${width}px: margens seguras`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    // O centro de cada controle visível continua clicável, sem o widget por cima.
    assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('main .button, main button, main input, main summary')]
      .filter(el => !el.closest('[inert]') && el.checkVisibility())
      .filter(el => {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
        return Boolean(document.elementFromPoint(x, y)?.closest('.support-assistant'));
      }).map(el => el.textContent.trim() || el.className || el.id)), [], 'Widget não cobre botões, carrossel ou campos');
    // No celular o avatar é um link direto; no desktop ele abre e fecha o convite.
    const avatarSelector = mobile ? '.support-avatar-link' : '.support-avatar-toggle';
    const avatar = await page.locator(avatarSelector).boundingBox();
    assert.equal(avatar.width, mobile ? 52 : 64);
    assert.equal(avatar.height, avatar.width);
    assert.equal(await prompt.isVisible(), true, 'Convite abre automaticamente após 11 segundos');
    const card = await prompt.boundingBox();
    assert.ok(card.x >= 12 && card.x + card.width <= width - 12 && card.y >= 68);
    if (mobile) assert.ok(card.y + card.height <= avatar.y, '"Posso ajudar?" fica acima do avatar');
    await page.screenshot({ path: path.join(evidence, `open-${width}.png`), animations: 'disabled' });
    await openWhatsApp(page, '.support-cta-mobile');
    await page.locator('.support-close').click();
    assert.equal(await prompt.isVisible(), false);
    // Se o avatar recolhido encostar em conteúdo, ele cede espaço e some.
    if (await widget.isVisible()) assert.equal(await page.locator(avatarSelector).evaluate(el => el === document.activeElement), true);
    await page.clock.fastForward(22000);
    assert.equal(await prompt.isVisible(), false, 'Permanece recolhido depois de fechado');
    if (!mobile) {
      await page.locator('.support-avatar-toggle').press('Space');
      assert.equal(await prompt.isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await prompt.isVisible(), false);
    }
    assert.equal(await page.locator('.mobile-whatsapp').count(), 0, 'Sem atalho duplicado');
    const visibleAtTop = await widget.isVisible();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await widget.waitFor({ state: 'hidden' });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    if (visibleAtTop) {
      await widget.waitFor({ state: 'visible' });
      if (mobile) {
        await page.locator('.menu-toggle').click();
        await widget.waitFor({ state: 'hidden' });
        await page.keyboard.press('Escape');
        await widget.waitFor({ state: 'visible' });
      }
      await page.locator('#quick-cep').focus();
      await widget.waitFor({ state: 'hidden' });
    }
    await page.context().close();
    console.log(`Aprovado: ${width}px, avatar, convite, limites da viewport, rodapé, menu e formulário.`);
  }

  const short = await newPage({ viewport: { width: 390, height: 400 }, isMobile: true, hasTouch: true });
  await short.clock.install();
  await short.goto(origin);
  await short.clock.fastForward(11000);
  assert.equal(await short.locator('.support-prompt').isVisible(), true);
  const shortCard = await short.locator('.support-prompt').boundingBox();
  assert.ok(shortCard.y >= 69 && shortCard.y + shortCard.height <= 400);
  await short.screenshot({ path: path.join(evidence, 'short-390x400.png'), animations: 'disabled' });
  await short.evaluate(() => document.querySelector('#contact-dialog').showModal());
  await short.locator('.support-assistant').waitFor({ state: 'hidden' });
  await short.keyboard.press('Escape');
  await short.locator('.support-assistant').waitFor({ state: 'visible' });
  assert.equal(await short.locator('.support-prompt').isVisible(), false);
  await short.locator('#quick-cep').focus();
  await short.setViewportSize({ width: 390, height: 300 });
  assert.equal(await short.locator('.support-assistant').isVisible(), false);
  await short.context().close();
  console.log('Aprovado: 390x400, modal e redução da viewport com formulário focado.');

  for (const mode of ['reduced', 'paused', 'no-javascript']) {
    const page = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'no-javascript' });
    await page.clock.install();
    await page.goto(origin);
    if (mode === 'paused') await page.locator('.effects-toggle').click();
    await page.clock.fastForward(12000);
    if (mode === 'no-javascript') {
      assert.equal(await page.locator('.support-assistant').isVisible(), false);
      assert.ok(await page.locator('a[href^="https://wa.me/"]:visible').count());
    } else {
      await page.locator('.support-assistant').waitFor({ state: 'visible' });
      assert.equal(await page.locator('.support-assistant').evaluate(el => getComputedStyle(el).animationName), 'none');
      assert.equal(await page.locator('.support-avatar-link').evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    }
    await page.context().close();
    console.log(`Aprovado: ${mode}.`);
  }
  assert.deepEqual(errors, []);
  console.log('Nenhum erro no console. Nenhuma mensagem enviada.');
} finally {
  await browser.close();
}
