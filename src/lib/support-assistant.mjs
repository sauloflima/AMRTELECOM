const SUPPORT_PROMPT_DELAY_MS = 11_000;

export function mountSupportAssistant(root) {
  if (!root) return;
  const prompt = root.querySelector('.support-prompt');
  const avatar = root.querySelector('.support-avatar-toggle');
  const mobile = matchMedia('(max-width:800px)');
  const menu = document.querySelector('.menu-toggle');
  const dialog = document.querySelector('#contact-dialog');
  const footer = document.querySelector('footer');
  const dock = document.querySelector('.coverage-dock');
  let footerVisible = false;
  let ready = false;
  const setExpanded = expanded => {
    prompt.hidden = !expanded;
    avatar.setAttribute('aria-expanded', String(expanded));
    avatar.setAttribute('aria-label', `${expanded ? 'Fechar' : 'Abrir'} atendimento da AMR Telecom`);
  };

  const position = () => {
    if (root.hidden) return;
    root.style.setProperty('--support-lift', '0px');
    prompt.style.setProperty('--support-prompt-lift', '0px');
    // No toque, somente o card aberto procura espaço; o avatar nunca salta na rolagem.
    const box = (mobile.matches && !prompt.hidden ? prompt : root).getBoundingClientRect();
    const top = document.querySelector('.header').getBoundingClientRect().bottom + 12;
    let lift = 0;
    const controls = [...document.querySelectorAll('main .button, main button, main input, main summary' +
      (prompt.hidden ? ', main p, main li, main h1, main h2, main h3, main .plan-compare a' : ''))];
    const obstacles = controls.filter(control => !control.closest('[inert]')).map(control => control.getBoundingClientRect())
      .filter(rect => rect.width && rect.height && rect.left < box.right && rect.right > box.left)
      .sort((a, b) => b.top - a.top);
    for (const rect of obstacles) {
      if (rect.top >= box.bottom - lift || rect.bottom <= box.top - lift) continue;
      if (prompt.hidden) { root.hidden = true; return; }
      const next = box.bottom - rect.top + 12;
      if (box.top - next < top) {
        if (mobile.matches) break;
        // Em telas baixas, prioriza os controles e conserva o atalho compacto.
        if (!prompt.hidden) { setExpanded(false); position(); }
        else root.hidden = true;
        return;
      }
      lift = next;
    }
    (mobile.matches ? prompt : root).style.setProperty(mobile.matches ? '--support-prompt-lift' : '--support-lift', `${lift}px`);
  };
  const sync = () => {
    const viewport = window.visualViewport;
    root.style.setProperty('--support-viewport-height', `${viewport?.height || innerHeight}px`);
    root.style.setProperty('--support-viewport-bottom', `${Math.max(0, innerHeight - (viewport?.height || innerHeight) - (viewport?.offsetTop || 0))}px`);
    root.style.setProperty('--support-header-height', `${document.querySelector('.header').getBoundingClientRect().bottom}px`);
    const blocked = document.hidden || footerVisible || dialog?.open || menu?.getAttribute('aria-expanded') === 'true' || document.activeElement?.closest('form, input, textarea, select, [contenteditable="true"]');
    if (blocked && mobile.matches) setExpanded(false);
    root.hidden = !ready || Boolean(blocked);
    position();
  };
  const close = () => {
    setExpanded(false);
    (mobile.matches ? root.querySelector('.support-avatar-link') : avatar).focus({ preventScroll: true });
    sync();
  };
  root.querySelector('.support-close').addEventListener('click', close);
  avatar.addEventListener('click', () => { setExpanded(prompt.hidden); sync(); });
  root.addEventListener('keydown', event => { if (event.key === 'Escape' && !prompt.hidden) { event.preventDefault(); close(); } });
  document.addEventListener('pointerdown', event => {
    if (mobile.matches && !prompt.hidden && !root.contains(event.target)) { setExpanded(false); sync(); }
  });
  mobile.addEventListener('change', () => { setExpanded(false); sync(); });
  if (footer) new IntersectionObserver(([entry]) => {
    footerVisible = entry.isIntersecting;
    sync();
  }).observe(footer);
  if (dock) new ResizeObserver(() => {
    root.style.setProperty('--support-dock-height', `${dock.getBoundingClientRect().height}px`);
    sync();
  }).observe(dock);
  const observer = new MutationObserver(sync);
  if (menu) observer.observe(menu, { attributes: true, attributeFilter: ['aria-expanded'] });
  if (dialog) observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) observer.observe(carousel, { attributes: true, subtree: true, attributeFilter: ['inert'] });
  document.addEventListener('focusin', sync);
  document.addEventListener('focusout', () => requestAnimationFrame(sync));
  document.addEventListener('visibilitychange', sync);
  let frame = 0;
  addEventListener('scroll', () => {
    setExpanded(false);
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; sync(); });
  }, { passive: true });
  addEventListener('resize', sync);
  window.visualViewport?.addEventListener('resize', sync);
  window.visualViewport?.addEventListener('scroll', sync);
  let timer;
  const start = () => {
    clearTimeout(timer);
    ready = false;
    setExpanded(false);
    sync();
    timer = setTimeout(() => { ready = true; sync(); }, SUPPORT_PROMPT_DELAY_MS);
  };
  addEventListener('pageshow', event => { if (event.persisted) start(); });
  addEventListener('pagehide', () => { clearTimeout(timer); root.hidden = true; });
  start();
}
