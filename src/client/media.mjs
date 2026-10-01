import { createHeroVideo } from '../lib/hero-video.mjs';

export function mountPageMotion() {
  // Mantém os mesmos tempos de entrada sem autorizar atributos style na CSP.
  document.querySelectorAll('[data-letter-delay]').forEach(letter => {
    letter.style.setProperty('--letter-delay', `${Number(letter.dataset.letterDelay)}ms`);
  });
  // Cada efeito acompanha seu próprio componente, também quando o hero empilha no celular.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting);
    }));
    document.querySelectorAll('.icon, .hero-copy, .enterprise-stage, .service-photo').forEach(element => observer.observe(element));
  }
  const syncMotion = () => document.body.classList.toggle('motion-suspended', document.hidden || Boolean(navigator.connection?.saveData));
  document.addEventListener('visibilitychange', syncMotion);
  navigator.connection?.addEventListener('change', syncMotion);
  syncMotion();
  const customerSection=document.querySelector('.customer-section');
  if(customerSection && 'IntersectionObserver' in window) {
    const observer=new IntersectionObserver(([entry])=> {
      if(!entry.isIntersecting)return;
      customerSection.classList.add('is-visible');
      observer.disconnect();
    },{threshold:.15});
    observer.observe(customerSection);
  }
}

export function mountMedia() {
  const connectedHero=document.querySelector('.home-hero');
  if(connectedHero) {
    const art=connectedHero.querySelector('.hero-house');
    const houseVideo=connectedHero.querySelector('[data-hero-house-video]');
    const houseVideoSlide=houseVideo?.closest('.carousel-slide');
    const servicePhoto=connectedHero.querySelector('.service-photo');
    const serviceVideo=servicePhoto?.querySelector('[data-service-video]');
    const serviceSlide=servicePhoto?.closest('.carousel-slide');
    const toggle=connectedHero.querySelector('.effects-toggle');
    const desktopPointer=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
    const connection=navigator.connection;
    let userPaused=false;
    let inView=!('IntersectionObserver' in window);
    let serviceInView=!('IntersectionObserver' in window);
    let frame=0;
    const updateVideo=houseVideo ? createHeroVideo(houseVideo,art) : null;
    const updateServiceVideo=serviceVideo ? createHeroVideo(serviceVideo,servicePhoto) : null;
    const syncHouseVideo=()=> {
      updateVideo?.({paused:userPaused,reduced:false,saveData:Boolean(connection?.saveData),hidden:document.hidden,inView,active:houseVideoSlide?.classList.contains('is-active')});
    };
    const syncServiceVideo=()=> {
      updateServiceVideo?.({paused:userPaused,reduced:false,saveData:Boolean(connection?.saveData),hidden:document.hidden,inView:serviceInView,active:serviceSlide?.classList.contains('is-active')});
    };
    const reset=()=> {
      cancelAnimationFrame(frame);
      art.style.setProperty('--house-x','0px');
      art.style.setProperty('--house-y','0px');
    };
    const update=()=> {
      const paused=userPaused||document.hidden||Boolean(connection?.saveData);
      connectedHero.classList.toggle('effects-paused',paused);
      connectedHero.classList.toggle('user-effects-paused',userPaused);
      toggle.hidden=false;
      toggle.textContent=userPaused?'Ativar efeitos':'Pausar efeitos';
      toggle.setAttribute('aria-pressed',String(userPaused));
      if(paused||!inView||!desktopPointer.matches)reset();
      syncHouseVideo();
      syncServiceVideo();
    };
    toggle.addEventListener('click',()=>{userPaused=!userPaused;update();});
    art.addEventListener('pointermove',event=> {
      if(userPaused||connection?.saveData||document.hidden||!desktopPointer.matches||!inView)return;
      cancelAnimationFrame(frame);
      const box=art.getBoundingClientRect();
      const x=((event.clientX-box.left)/box.width-.5)*10;
      const y=((event.clientY-box.top)/box.height-.5)*8;
      frame=requestAnimationFrame(()=> {
        art.style.setProperty('--house-x',`${x.toFixed(2)}px`);
        art.style.setProperty('--house-y',`${y.toFixed(2)}px`);
      });
    });
    art.addEventListener('pointerleave',reset);
    desktopPointer.addEventListener('change',update);
    document.addEventListener('visibilitychange',update);
    connection?.addEventListener('change',update);
    if('IntersectionObserver' in window) {
      new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update();},{threshold:0}).observe(art);
    }
    if(houseVideo && houseVideoSlide) {
      new MutationObserver(syncHouseVideo).observe(houseVideoSlide,{attributes:true,attributeFilter:['class','aria-hidden']});
    }
    if(serviceVideo && serviceSlide) {
      new MutationObserver(syncServiceVideo).observe(serviceSlide,{attributes:true,attributeFilter:['class','aria-hidden']});
      if('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{serviceInView=entry.isIntersecting;syncServiceVideo();},{threshold:0}).observe(servicePhoto);
    }
    update();
  }

  // Vídeo empresarial decorativo: carrega quando entra em cena e mantém o poster
  // quando a preferência do sistema ou a conexão pede menos movimento.
  const office=document.querySelector('[data-office-motion]');
  if(office) {
    const officeVideo=office.querySelector('[data-business-video]');
    const control=office.querySelector('.office-motion-toggle');
    const connection=navigator.connection;
    let visible=!('IntersectionObserver' in window);
    let paused=false;
    const updateVideo=officeVideo ? createHeroVideo(officeVideo,office) : null;
    const sync=()=> {
      updateVideo?.({paused,reduced:false,saveData:Boolean(connection?.saveData),hidden:document.hidden,inView:visible,active:true});
      office.classList.toggle('office-motion-active',visible && !paused && !connection?.saveData && !document.hidden);
      control.hidden=false;
      control.textContent=paused?'Ativar animação':'Pausar animação';
      control.setAttribute('aria-pressed',String(paused));
    };
    control.addEventListener('click',()=>{paused=!paused;sync();});
    document.addEventListener('visibilitychange',sync);
    connection?.addEventListener('change',sync);
    if('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.15}).observe(office);
    sync();
  }
}
