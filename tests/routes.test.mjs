import test from 'node:test';
import assert from 'node:assert/strict';
import { routes } from '../src/routes.mjs';
import { header, footer, icon } from '../src/components/shared.mjs';
import { hero } from '../src/components/hero.mjs';
import { plans } from '../src/components/plans.mjs';
import { homeBusiness, homeProfiles, testimonials, coverageDock } from '../src/components/home-sections.mjs';
import { customerArea } from '../src/components/customer.mjs';
import { interiorPage, homeNavigation } from '../src/components/navigation.mjs';

test('catálogo contém 12 páginas com caminhos e metadados exclusivos', () => {
  assert.equal(routes.length, 12);
  for (const field of ['path', 'file', 'title', 'description']) {
    assert.equal(new Set(routes.map(route => route[field])).size, routes.length);
  }
  assert.ok(routes.every(route => !route.path.includes('#')));
});

test('menu aponta para páginas e identifica o destino atual', () => {
  for (const route of routes.filter(route => route.primary)) {
    const html = header(route.path);
    assert.ok(html.includes(`href="${route.path}" aria-current="page"`));
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
    assert.ok(!html.includes('href="/#'));
  }
});

test('atalho do cabeçalho identifica o WhatsApp sem mudar o destino', () => {
  const html = header('/');
  assert.match(html, /class="button header-cta whatsapp-action" href="https:\/\/wa\.me\/5581993467014\?/);
  assert.ok(html.includes(`${icon('whatsapp')}Falar no WhatsApp`));
});

test('início reúne consulta rápida, planos e acessos sem perder páginas existentes', () => {
  const html = hero() + plans({home:true}) + customerArea({home:true}) + testimonials() + homeBusiness() + homeProfiles() + coverageDock() + footer();
  for (const route of routes.filter(route => route.icon)) {
    assert.ok(html.includes(`href="${route.path}"`));
  }
  assert.ok(html.includes('id="quick-coverage-form"'));
  assert.ok(html.indexOf('id="quick-coverage-form"') < html.indexOf('id="planos"'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/class="plan-speed"/g) || []).length, 3);
});

test('páginas internas recebem H1 e breadcrumb, sem duplicar o próprio link relacionado', () => {
  const html = interiorPage('/planos.html', '<section><h2>Planos</h2><h3>200 Mega</h3></section>');
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.ok(html.includes('aria-current="page">Planos'));
  assert.ok(!html.includes('href="/planos.html"'));
  assert.ok(html.includes('href="/cobertura.html"'));
});
