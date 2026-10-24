import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { routes } from '../src/routes.mjs';
import { config } from '../src/config.mjs';
import { organizationJson } from './seo.mjs';
import { pagesBase } from './publication.mjs';
import { chromium, origin, reportFailure } from './browser-test.mjs';

const browser = await chromium.launch({ headless: true });
const evidence = process.env.AMR_BROWSER_EVIDENCE || 'output/playwright';
await mkdir(evidence, { recursive: true });
const widths = [320, 375, 390, 768, 801, 844, 900, 1000, 1024, 1100, 1440];
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
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), route.description);
    assert.equal(await page.locator('meta[property="og:site_name"]').getAttribute('content'), config.brand.name);
    const socialUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    const sharingOrigin = socialUrl.startsWith(`https://sauloflima.github.io${pagesBase}/`) ? `https://sauloflima.github.io${pagesBase}` : config.siteUrl.replace(/\/$/, '');
    assert.equal(socialUrl, sharingOrigin + route.path);
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), sharingOrigin + config.brand.logo);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    assert.deepEqual(schemas, route.path === '/' ? [organizationJson] : []);
    assert.equal(await page.locator('main h1').count(), 1, route.path);
    assert.ok(!await page.locator('body').innerText().then(text => /[\u2012-\u2015]/u.test(text)));

    for (const width of widths) {
      await page.setViewportSize({ width, height: 950 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `${route.path}: ${width}px`);
      const customer = page.locator('.header-customer');
      assert.equal(await customer.isVisible(), true, 'Área do cliente deve aparecer sem abrir o menu.');
      const box = await customer.boundingBox();
      assert.ok(box.height >= 44 && box.x >= 0 && box.x + box.width <= width, `${route.path}: acesso do cliente em ${width}px`);
    }
    if (route.path === '/planos.html') {
      await page.screenshot({ path: path.join(evidence, 'amr-pages-desktop.png') });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: path.join(evidence, 'amr-pages-mobile.png') });
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
    console.log(`Aprovado: ${route.path}; ${widths.length} larguras, acesso do cliente visível, título e H1.`);
  }

  for (const href of links) {
    assert.ok(!href.startsWith('/#'), `Âncora antiga: ${href}`);
    const response = await page.request.get(new URL(href, origin + '/').href);
    assert.equal(response.status(), 200, href);
  }

  const motionPage = await browser.newPage({ viewport: { width: 412, height: 823 }, isMobile: true, reducedMotion: 'reduce' });
  await motionPage.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await motionPage.clock.install();
  await motionPage.goto(origin + '/');
  await motionPage.waitForLoadState('networkidle');
  assert.deepEqual(await motionPage.evaluate(() => performance.getEntriesByType('resource')
    .filter(entry => /amr-casa-fibra-3d|amr-empresa-flow-poster|amr-atendimento-bordado/.test(entry.name))
    .map(entry => entry.name)), [], 'Slides não visitados não devem carregar seus posters.');
  await motionPage.clock.fastForward(9000);
  assert.equal(await motionPage.locator('[data-carousel]').getAttribute('data-active-slide'), '1');
  assert.equal(await motionPage.locator('.carousel-rotation').isDisabled(), true);
  for (const index of [1, 2, 3]) {
    await motionPage.locator(`[data-slide="${index}"]`).dispatchEvent('click');
    const image = motionPage.locator('.carousel-slide.is-active img').first();
    await image.evaluate(img => img.decode());
    assert.equal(await image.isVisible(), true, 'Imagem de segurança permanece disponível com movimento reduzido.');
    assert.equal(await motionPage.locator('.carousel-slide.is-active video').evaluate(video => video.paused), true);
  }
  await motionPage.emulateMedia({ reducedMotion: 'no-preference' });
  await motionPage.waitForFunction(() => document.querySelector('[data-carousel]').dataset.rotation === 'playing');
  await motionPage.emulateMedia({ reducedMotion: 'reduce' });
  await motionPage.waitForFunction(() => document.querySelector('[data-carousel]').dataset.rotation === 'paused');
  await motionPage.clock.fastForward(11000);
  assert.equal(await motionPage.locator('[data-carousel]').getAttribute('data-active-slide'), '4');
  for (const route of ['/', '/empresas.html', '/cobertura.html']) {
    await motionPage.goto(origin + route);
    assert.equal(await motionPage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    assert.equal(await motionPage.locator('body').evaluate(body => body.getAnimations({ subtree: true }).length), 0, route);
  }
  await motionPage.context().close();
  console.log('Aprovado: posters sob demanda, fallback dos três vídeos, preferência reduzida inicial e dinâmica, navegação manual e ausência de animações nas páginas internas.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/');
  assert.equal(await page.locator('.header .brand-light').evaluate(img => getComputedStyle(img).display), 'block');
  assert.ok(await page.locator('.header .brand-light').evaluate(img => img.naturalWidth > 0));
  assert.equal(await page.locator('.amr-footer .brand-light').evaluate(img => getComputedStyle(img).display), 'none');
  await page.evaluate(() => scrollTo(0, 200));
  await page.waitForFunction(() => document.querySelector('.header').classList.contains('is-scrolled'));
  assert.equal(await page.locator('.header .brand-dark').evaluate(img => getComputedStyle(img).display), 'block');
  assert.equal(await page.locator('.mobile-whatsapp').count(), 0);
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('.hero-cta[data-focus-coverage]').first().click();
  assert.equal(await page.locator('#quick-cep').evaluate(el => el === document.activeElement), true);
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await page.locator('#navigation').getByRole('link', { name: 'Planos', exact: true }).click();
  await page.waitForURL(origin + '/planos.html');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('#navigation [aria-current="page"]').innerText(), 'Planos');
  await page.reload();
  assert.equal(await page.locator('.plan-card').count(), 4);
  await page.goBack();
  assert.equal(new URL(page.url()).pathname, new URL(origin + '/').pathname);
  await page.locator('.header-customer').click();
  await page.waitForURL(origin + '/area-do-cliente.html');
  assert.equal(await page.locator('.header-customer').getAttribute('aria-current'), 'page');
  assert.equal(await page.locator('.customer-access').getAttribute('href'), config.customerPortalUrl);

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
} catch (error) {
  await reportFailure(browser, error).catch(() => {});
  throw error;
} finally {
  await browser.close();
}
