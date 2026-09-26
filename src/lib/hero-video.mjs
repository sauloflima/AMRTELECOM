// O poster permanece visível até o primeiro quadro e em qualquer falha.
export function createHeroVideo(video, art) {
  let allowed = false;
  let pending = false;
  let failed = false;
  let blocked = false;
  const retry = video.ownerDocument.createElement('button');
  retry.type = 'button';
  retry.className = 'video-play';
  retry.textContent = 'Reproduzir vídeo';
  retry.hidden = true;
  art.append(retry);
  const syncRetry = () => { retry.hidden = !allowed || !blocked; };
  const fail = () => {
    failed = true;
    allowed = false;
    syncRetry();
    video.pause();
    art.classList.add('video-failed');
    art.classList.remove('video-ready');
  };
  video.addEventListener('error', fail);
  // Os vídeos usam uma fonte MP4; falha de <source> não propaga para <video>.
  video.querySelector('source')?.addEventListener('error', fail);
  video.addEventListener('playing', () => {
    if (!allowed) { video.pause(); return; }
    blocked = false;
    if (retry === video.ownerDocument.activeElement) {
      (art.closest('.hero-frame')?.querySelector('.effects-toggle') || art.querySelector('.office-motion-toggle'))?.focus({ preventScroll:true });
    }
    syncRetry();
    art.classList.add('video-ready');
  });
  const play = () => {
    if (!allowed || blocked || pending || !video.paused) return;
    video.muted = true;
    pending = true;
    video.play().then(() => {
      // A preferência ou o slide podem mudar enquanto play() aguarda.
      if (!allowed) video.pause();
    }).catch(error => {
      // Autoplay bloqueado preserva o poster e permite nova tentativa manual.
      art.classList.remove('video-ready');
      blocked = error.name !== 'AbortError';
      syncRetry();
    }).finally(() => {
      pending = false;
      // Uma pausa pode abortar play() enquanto o slide volta a ficar visível.
      if (allowed && !blocked && !failed && video.paused) play();
    });
  };
  retry.addEventListener('click', () => { blocked = false; play(); });
  return ({ paused, reduced, saveData, hidden, inView, active }) => {
    art.classList.toggle('video-static', reduced || saveData);
    allowed = !paused && !reduced && !saveData && !hidden && inView && active && !failed;
    syncRetry();
    if (!allowed) { video.pause(); return; }
    play();
  };
}
