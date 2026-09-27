// Cada cena fica tempo suficiente para ler o texto e concluir os vídeos de 8s.
export const ROTATION_DELAY = 10000;
export function canRotate(state) {
  return !state.paused && !state.focused && !state.hidden && state.visible;
}
export function swipeStep(dx, dy) {
  return Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5 ? (dx < 0 ? 1 : -1) : 0;
}
export function mountCarousel(root, environment = window) {
  if (!root) return;
  const document = root.ownerDocument;
  const slides = [...root.querySelectorAll('.carousel-slide')];
  const dots = [...root.querySelectorAll('[data-slide]')];
  const rotation = root.querySelector('.carousel-rotation');
  const status = root.querySelector('.carousel-status');
  const state = { paused: false, focused: false, hidden: document.hidden, visible: true };
  let index = 0, timer, origin, rotationIntent;
  function schedule() {
    environment.clearTimeout(timer);
    rotation.hidden = false;
    rotation.textContent = state.paused ? 'Ativar carrossel' : 'Pausar carrossel';
    root.dataset.rotation = canRotate(state) ? 'playing' : 'paused';
    if (canRotate(state)) timer = environment.setTimeout(() => show(index + 1, false), ROTATION_DELAY);
  }
  function show(next, manual = true) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.inert = i !== index;
      slide.setAttribute('aria-hidden', String(i !== index));
      if (i === index) dots[i].setAttribute('aria-current', 'true');
      else dots[i].removeAttribute('aria-current');
    });
    if (manual) status.textContent = slides[index].getAttribute('aria-label');
    root.dataset.activeSlide = String(index + 1);
    schedule();
  }
  rotation.addEventListener('pointerdown', () => { rotationIntent = !state.paused; });
  rotation.addEventListener('click', () => { state.paused = rotationIntent ?? !state.paused; rotationIntent = undefined; schedule(); });
  rotation.addEventListener('pointercancel', () => { rotationIntent = undefined; });
  root.querySelector('.carousel-prev').addEventListener('click', () => show(index - 1));
  root.querySelector('.carousel-next').addEventListener('click', () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  root.addEventListener('keydown', event => {
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    // Keep focus on a stable control when a keyboard change hides a slide CTA.
    if (event.target.closest('.carousel-slide')) dots[(next + slides.length) % slides.length].focus();
    show(next);
  });
  const focusRegion = root.closest('.connected-hero') || root;
  focusRegion.addEventListener('focusin', event => { state.focused = Boolean(event.target.matches?.(':focus-visible')); schedule(); });
  focusRegion.addEventListener('focusout', event => {
    if (focusRegion.contains?.(event.relatedTarget)) return;
    state.focused = false; schedule();
  });
  root.addEventListener('pointerdown', event => {
    if (event.target === rotation) return;
    origin = event.target.closest('a,button,input') ? null : { x: event.clientX, y: event.clientY };
  });
  root.addEventListener('pointerup', event => {
    if (!origin) return;
    const step = swipeStep(event.clientX - origin.x, event.clientY - origin.y);
    origin = null;
    if (step) show(index + step);
  });
  root.addEventListener('pointercancel', () => { origin = null; });
  root.addEventListener('dragstart', event => event.preventDefault());
  document.addEventListener('visibilitychange', () => { state.hidden = document.hidden; schedule(); });
  if ('IntersectionObserver' in environment) new environment.IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting; schedule();
  }).observe(root);
  root.querySelector('.carousel-controls').hidden = false;
  show(0, false);
}
