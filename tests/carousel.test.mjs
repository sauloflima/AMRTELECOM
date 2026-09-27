import test from 'node:test';
import assert from 'node:assert/strict';
import { mountCarousel, canRotate, swipeStep, ROTATION_DELAY } from '../src/lib/carousel.mjs';
import { hero } from '../src/components/hero.mjs';

class Element {
  constructor() { this.events = {}; this.attrs = {}; this.dataset = {}; this.classList = { toggle() {} }; }
  addEventListener(name, callback) { (this.events[name] ||= []).push(callback); }
  emit(name, values = {}) { for (const fn of this.events[name] || []) fn({ target: this, preventDefault() {}, ...values }); }
  setAttribute(name, value) { this.attrs[name] = value; }
  removeAttribute(name) { delete this.attrs[name]; }
  getAttribute(name) { return this.attrs[name]; }
  closest() { return null; }
  focus() {}
}
function fixture(reduced = false) {
  const root = new Element(), doc = new Element(), motion = new Element();
  const slides = Array.from({ length: 3 }, (_, i) => { const slide = new Element(); slide.setAttribute('aria-label', `${i + 1} de 3`); return slide; });
  const dots = slides.map(() => new Element());
  const controls = Object.fromEntries(['rotation', 'status', 'prev', 'next', 'controls'].map(name => [`.carousel-${name}`, new Element()]));
  root.ownerDocument = doc;
  root.querySelector = selector => controls[selector];
  root.querySelectorAll = selector => selector === '.carousel-slide' ? slides : dots;
  motion.matches = reduced;
  const timers = new Map(); let id = 0;
  const environment = { matchMedia: () => motion, setTimeout: fn => { timers.set(++id, fn); return id; }, clearTimeout: id => timers.delete(id) };
  mountCarousel(root, environment);
  return { root, doc, motion, timers, controls, slides, tick: () => { const fn = [...timers.values()][0]; timers.clear(); fn?.(); } };
}
test('três slides, um H1 e conteúdo inativo protegido antes do JavaScript', () => {
  const html = hero();
  assert.equal((html.match(/aria-roledescription="slide"/g) || []).length, 3);
  assert.equal((html.match(/<h1 /g) || []).length, 1);
  assert.equal((html.match(/aria-hidden="true" inert/g) || []).length, 2);
  assert.ok(html.includes('data-focus-coverage'));
  assert.ok(!html.includes('<b aria-hidden="true">'));
  assert.equal((html.match(/class="carousel-dots"/g) || []).length, 1);
});
test('autoplay de 10s ignora movimento reduzido e respeita pausa, foco e aba oculta', () => {
  assert.equal(ROTATION_DELAY, 10000);
  const f = fixture(); assert.equal(f.timers.size, 1);
  f.tick(); assert.equal(f.root.dataset.activeSlide, '2');
  f.tick(); assert.equal(f.root.dataset.activeSlide, '3');
  f.tick(); assert.equal(f.root.dataset.activeSlide, '1');
  f.root.emit('focusin', { target: { matches: () => true } }); assert.equal(f.timers.size, 0);
  f.root.emit('focusout'); assert.equal(f.timers.size, 1);
  const r = fixture(true); assert.equal(r.timers.size, 1); assert.equal(r.controls['.carousel-rotation'].hidden, false);
  r.controls['.carousel-rotation'].emit('click'); assert.equal(r.timers.size, 0);
  const h = fixture(); h.doc.hidden = true; h.doc.emit('visibilitychange'); assert.equal(h.timers.size, 0);
  assert.equal(canRotate({ reduced: true, visible: true }), true);
});
test('mouse, teclado e toque navegam sem deixar links de slides ocultos no foco', () => {
  const f = fixture(); f.controls['.carousel-next'].emit('click');
  assert.equal(f.root.dataset.activeSlide, '2'); assert.deepEqual(f.slides.map(s => s.inert), [true, false, true]);
  assert.equal(f.timers.size, 1);
  f.root.emit('keydown', { key: 'End' }); assert.equal(f.root.dataset.activeSlide, '3');
  f.root.emit('keydown', { key: 'Home' }); assert.equal(f.root.dataset.activeSlide, '1');
  f.root.emit('pointerdown', { pointerType: 'touch', clientX: 290, clientY: 250 });
  f.root.emit('pointerup', { pointerType: 'touch', clientX: 100, clientY: 252 });
  assert.equal(f.root.dataset.activeSlide, '2'); assert.equal(f.timers.size, 1);
  assert.equal(swipeStep(2, 140), 0); assert.equal(swipeStep(140, 2), -1);
  assert.equal(f.timers.size, 1);
});
test('pausa por mouse não é desfeita pelo foco automático do botão', () => {
  const f = fixture(), button = f.controls['.carousel-rotation'];
  button.emit('pointerdown'); f.root.emit('focusin'); button.emit('click');
  assert.equal(f.root.dataset.rotation, 'paused');
  button.emit('pointerdown'); button.emit('click'); assert.equal(f.root.dataset.rotation, 'playing');
  f.motion.matches = true; f.motion.emit('change'); assert.equal(f.timers.size, 1);
});
