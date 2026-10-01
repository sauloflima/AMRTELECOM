import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const shared = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const home = readFileSync(new URL('../src/home-refresh.css', import.meta.url), 'utf8');
const color = name => {
  const value = shared.match(new RegExp(`--amr-${name}:(#[a-f0-9]+);`))?.[1];
  assert.ok(value, `Token ${name} definido`);
  return value;
};
const homeColor = name => {
  const value = home.match(new RegExp(`--home-${name}:(#[a-f0-9]+);`))?.[1];
  assert.ok(value, `Token home-${name} definido`);
  return value;
};
const luminance = hex => {
  const value = hex.slice(1).length === 3 ? hex.slice(1).split('').map(x => x + x).join('') : hex.slice(1);
  return value.match(/../g).map(x => parseInt(x, 16) / 255)
    .map(x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
    .reduce((sum, x, i) => sum + x * [0.2126, 0.7152, 0.0722][i], 0);
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

test('tokens de texto e ação mantêm contraste AA em superfícies sólidas', () => {
  assert.ok(contrast(shared.match(/--whatsapp-green:(#[a-f0-9]+);/)[1], '#fff') >= 4.5);
  for (const action of ['action', 'action-hover', 'action-active']) {
    assert.ok(contrast(color(action), '#fff') >= 4.5, action);
  }
  for (const foreground of ['ink', 'muted', 'error']) {
    for (const background of ['paper', 'tint']) {
      assert.ok(contrast(color(foreground), color(background)) >= 4.5, `${foreground}/${background}`);
    }
  }
  assert.ok(contrast(color('on-dark'), color('navy')) >= 4.5);
  assert.ok(contrast(color('focus'), color('tint')) >= 3);
});

test('Home renovada mantém tokens, escala e cabeçalho responsivo', () => {
  for (const token of ['paper', 'navy', 'blue', 'ink', 'muted', 'line', 'focus']) {
    assert.ok(home.includes(`var(--home-${token})`), token);
  }
  assert.ok(home.includes('--home-container:1220px'));
  assert.ok(home.includes('--amr-header:84px'));
  assert.ok(shared.includes('max-height:calc(100dvh - var(--amr-header))'));
});

test('hero mantém contraste e entradas apenas no slide ativo', () => {
  assert.ok(contrast(homeColor('navy'), '#fff') >= 4.5);
  assert.ok(contrast(homeColor('blue'), '#fff') >= 4.5);
  assert.ok(contrast(homeColor('ink'), homeColor('sky')) >= 4.5);
  assert.ok(contrast(homeColor('blue-dark'), '#f4f9ff') >= 3);
  assert.match(home,/\.hero-slide-enterprise\.is-active \.enterprise-stage/);
  assert.match(home,/\.hero-slide-enterprise\.is-active \.arrival-letter/);
  assert.match(home,/\.hero-slide-service\.is-active \.arrival-letter/);
  assert.match(home,/@media\(prefers-reduced-motion:reduce\)\s*\{\s*\.hero-slide-enterprise/);
});

test('estados críticos de acessibilidade permanecem explícitos no CSS', () => {
  assert.ok(home.includes('outline:3px solid var(--home-focus)'));
  assert.ok(home.includes('min-width:44px;min-height:44px'));
  assert.ok(home.includes('input[aria-invalid=true]'));
  assert.ok(shared.includes('.button.primary:disabled:hover'));
  assert.doesNotMatch(shared,/prefers-reduced-motion/);
  assert.match(home,/\.hero-house-video,.hero-house-fallback \{[^}]*object-fit:contain/);
  assert.doesNotMatch(home,/\.hero-house-video[^}]*object-fit:cover/);
  assert.ok(home.includes('.hero-house-video'));
  assert.ok(home.includes('.business-video'));
  assert.ok(home.includes('.home-faq-list'));
  assert.ok(home.includes('aspect-ratio:16/9'));
  assert.ok(home.includes('transform:translate(-50%,-50%)'));
  assert.ok(!/body[^\{]*\{[^}]*overflow-x:\s*hidden/.test(home));
});

test('estilos não contêm travessões tipográficos', () => {
  for (const stylesheet of [shared, home]) {
    assert.doesNotMatch(stylesheet, /[\u2012-\u2015]/u);
  }
});
