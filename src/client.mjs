import { whatsappUrl, messageFor, validateCoverage, coverageMessage, selectedPlan, validateQuickCoverage, quickCoverageMessage } from './lib/whatsapp.mjs';
import { mountCarousel } from './lib/carousel.mjs';
import { createHeroVideo } from './lib/hero-video.mjs';
import { mountSupportAssistant } from './lib/support-assistant.mjs';
mountSupportAssistant(document.querySelector('.support-assistant'));
mountCarousel(document.querySelector('[data-carousel]'));
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
// Links de qualquer página chegam à explicação correspondente; details também funciona sem JS.
function openPlanExplanation() {
  const target=document.getElementById(location.hash.slice(1));
  if(!target?.matches('details.plan-details')) return;
  target.open=true;
  target.querySelector('summary').focus({preventScroll:true});
  target.scrollIntoView({block:'center',behavior:'instant'});
}
openPlanExplanation();
addEventListener('hashchange',openPlanExplanation);
document.addEventListener('click',event=> {
  const link=event.target.closest('a[href^="#explicar-"]');
  if(link && link.hash===location.hash) {
    event.preventDefault();
    openPlanExplanation();
  }
});
const siteHeader=document.querySelector('.header');
const syncHeader=()=>siteHeader?.classList.toggle('is-scrolled',scrollY>30);
addEventListener('scroll',syncHeader,{passive:true});
syncHeader();
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(returnFocus=false) {
  nav.classList.remove('is-open');
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','Abrir menu');
  if(returnFocus) menu.focus();
}
menu.addEventListener('click',()=> {
  const open=menu.getAttribute('aria-expanded')!=='true';
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  nav.classList.toggle('is-open',open);
});
nav.addEventListener('click',event=> {if(event.target.closest('a')) closeMenu();});
document.addEventListener('keydown',event=> {if(event.key==='Escape' && menu.getAttribute('aria-expanded')==='true')closeMenu(true);});
document.addEventListener('click',event=> {if(!event.target.closest('.header'))closeMenu();});
document.addEventListener('focusin',event=> {
  if(menu.getAttribute('aria-expanded')==='true' && !event.target.closest('.header')) closeMenu();
});
matchMedia('(min-width:801px)').addEventListener('change',()=>closeMenu());
const dialog=document.querySelector('#contact-dialog');
const showPending=()=>dialog.showModal();
dialog.querySelectorAll('.dialog-close,[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',event=> {if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelectorAll('[data-whatsapp]').forEach(link=> {
  const url=whatsappUrl(messageFor(link.dataset.whatsapp,link.dataset.detail));
  if(url){link.href=url;link.target='_blank';link.rel='noopener noreferrer';}
  link.addEventListener('click',event=>{if(!url){event.preventDefault();showPending();}});
});
const form=document.querySelector('#coverage-form');
const interest=selectedPlan(new URLSearchParams(location.search).get('plano'));
if(form && interest) {
  document.querySelector('#selected-plan-name').textContent=`${interest.speed} Mega`;
  document.querySelector('#selected-plan-context').textContent=interest.use;
  document.querySelector('#selected-plan-explain').href=`/planos.html#explicar-${interest.id}`;
  document.querySelector(`[data-plan-profile="${interest.id}"]`).hidden=false;
  document.querySelector('#selected-plan').hidden=false;
}
form?.addEventListener('input',event=> {
  const field=event.target;
  if(field.getAttribute('aria-invalid')==='true') {
    const errors=validateCoverage(Object.fromEntries(new FormData(form)));
    if(!errors[field.name]) {
      field.setAttribute('aria-invalid','false');
      document.querySelector(`#${field.name}-error`).textContent='';
    }
  }
  document.querySelector('#coverage-continue').hidden=true;
  document.querySelector('#coverage-continue').removeAttribute('href');
  document.querySelector('#coverage-preview').hidden=true;
  document.querySelector('#form-status').textContent='';
});
form?.addEventListener('submit',event=> {
  event.preventDefault();
  const values=Object.fromEntries(new FormData(form));
  const errors=validateCoverage(values);
  for(const name of ['name','city','neighborhood','street']) {
    const field=form.elements.namedItem(name);
    field.setAttribute('aria-invalid',String(Boolean(errors[name])));
    document.querySelector(`#${name}-error`).textContent=errors[name]||'';
  }
  const status=document.querySelector('#form-status');
  if(Object.keys(errors).length){status.textContent='Confira os campos indicados antes de continuar.';form.elements.namedItem(Object.keys(errors)[0]).focus();return;}
  const url=whatsappUrl(coverageMessage(values,interest?.id));
  if(!url){status.textContent='O WhatsApp oficial ainda não está disponível. Nenhuma consulta foi enviada.';showPending();return;}
  status.textContent='Revise a mensagem abaixo. Ao abrir o WhatsApp, os dados na URL serão compartilhados com o serviço.';
  const preview=document.querySelector('#coverage-preview');
  preview.textContent=coverageMessage(values,interest?.id);
  preview.hidden=false;
  const continueLink=document.querySelector('#coverage-continue');
  continueLink.href=url;
  continueLink.hidden=false;
});
// Só habilita o formulário depois de instalar o tratamento de envio.
// Sem JavaScript, os campos não podem ser enviados por GET nem aparecer na URL.
if (form) {
  form.querySelectorAll('input, button[type="submit"]').forEach(control => {
    control.disabled = false;
  });
  document.querySelector('#coverage-load-message').hidden = true;
}
const quickForm=document.querySelector('#quick-coverage-form');
if(quickForm) {
  const status=quickForm.querySelector('#quick-status');
  const next=quickForm.querySelector('#quick-continue');
  const renderError=(name,error)=> {
    quickForm.elements.namedItem(name).setAttribute('aria-invalid',String(Boolean(error)));
    quickForm.querySelector(`#quick-${name}-error`).textContent=error||'';
  };
  quickForm.addEventListener('input',event=> {
    const field=event.target;
    if(field.name==='cep') {
      const digits=field.value.replace(/\D/g,'').slice(0,8);
      field.value=digits.length>5?`${digits.slice(0,5)}-${digits.slice(5)}`:digits;
    }
    if(field.getAttribute('aria-invalid')==='true') {
      const errors=validateQuickCoverage(Object.fromEntries(new FormData(quickForm)));
      if(!errors[field.name])renderError(field.name,'');
    }
    status.textContent='';
    next.hidden=true;
    next.removeAttribute('href');
    quickForm.querySelector('#quick-preview').hidden=true;
  });
  quickForm.addEventListener('submit',event=> {
    event.preventDefault();
    const values=Object.fromEntries(new FormData(quickForm));
    const errors=validateQuickCoverage(values);
    ['cep','reference'].forEach(name=>renderError(name,errors[name]));
    if(Object.keys(errors).length) {
      status.dataset.state='error';
      status.textContent='Confira os campos indicados para continuar.';
      quickForm.elements.namedItem(Object.keys(errors)[0]).focus();
      return;
    }
    const url=whatsappUrl(quickCoverageMessage(values));
    if(!url) {
      status.dataset.state='pending';
      status.textContent='O WhatsApp oficial ainda não está disponível. Nenhuma consulta foi enviada.';
      showPending();
      return;
    }
    status.dataset.state='ready';
    status.textContent='Revise a mensagem abaixo. Ao abrir o WhatsApp, os dados na URL serão compartilhados com o serviço.';
    const preview=quickForm.querySelector('#quick-preview');
    preview.textContent=quickCoverageMessage(values);
    preview.hidden=false;
    next.href=url;
    next.hidden=false;
  });
  quickForm.querySelectorAll('input,button[type="submit"]').forEach(control=>control.disabled=false);
  quickForm.querySelector('#quick-load-message').hidden=true;
}

const connectedHero=document.querySelector('.home-hero');
if(connectedHero) {
  const art=connectedHero.querySelector('.hero-house');
  const houseVideo=connectedHero.querySelector('[data-hero-house-video]');
  const houseVideoSlide=houseVideo?.closest('.carousel-slide');
  const servicePhoto=connectedHero.querySelector('.service-photo');
  const serviceVideo=servicePhoto?.querySelector('[data-service-video]');
  const serviceSlide=servicePhoto?.closest('.carousel-slide');
  const enterpriseMedia=connectedHero.querySelector('.enterprise-media');
  const enterpriseVideo=enterpriseMedia?.querySelector('[data-enterprise-video]');
  const enterpriseSlide=enterpriseMedia?.closest('.carousel-slide');
  const toggle=connectedHero.querySelector('.effects-toggle');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const connection=navigator.connection;
  let userPaused=false;
  let inView=!('IntersectionObserver' in window);
  let serviceInView=!('IntersectionObserver' in window);
  let enterpriseInView=!('IntersectionObserver' in window);
  let frame=0;
  const updateVideo=houseVideo ? createHeroVideo(houseVideo,art) : null;
  const updateServiceVideo=serviceVideo ? createHeroVideo(serviceVideo,servicePhoto) : null;
  const updateEnterpriseVideo=enterpriseVideo ? createHeroVideo(enterpriseVideo,enterpriseMedia) : null;
  const syncHouseVideo=()=> {
    updateVideo?.({paused:userPaused,reduced:reduced.matches,saveData:Boolean(connection?.saveData),hidden:document.hidden,inView,active:houseVideoSlide?.classList.contains('is-active')});
  };
  const syncServiceVideo=()=> {
    updateServiceVideo?.({paused:userPaused,reduced:reduced.matches,saveData:Boolean(connection?.saveData),hidden:document.hidden,inView:serviceInView,active:serviceSlide?.classList.contains('is-active')});
  };
  const syncEnterpriseVideo=()=> {
    const active=enterpriseSlide?.classList.contains('is-active');
    updateEnterpriseVideo?.({paused:userPaused,reduced:reduced.matches,saveData:Boolean(connection?.saveData),hidden:document.hidden,inView:enterpriseInView,active});
    if(!active && enterpriseVideo && enterpriseVideo.currentTime) enterpriseVideo.currentTime=0;
  };
  const reset=()=> {
    cancelAnimationFrame(frame);
    art.style.setProperty('--house-x','0px');
    art.style.setProperty('--house-y','0px');
  };
  const update=()=> {
    const paused=userPaused||reduced.matches||document.hidden||Boolean(connection?.saveData);
    connectedHero.classList.toggle('effects-paused',paused);
    connectedHero.classList.toggle('user-effects-paused',userPaused);
    toggle.hidden=reduced.matches;
    toggle.textContent=userPaused?'Ativar efeitos':'Pausar efeitos';
    toggle.setAttribute('aria-pressed',String(userPaused));
    if(paused||!inView||!desktopPointer.matches)reset();
    syncHouseVideo();
    syncServiceVideo();
    syncEnterpriseVideo();
  };
  toggle.addEventListener('click',()=>{userPaused=!userPaused;update();});
  art.addEventListener('pointermove',event=> {
    if(userPaused||reduced.matches||connection?.saveData||document.hidden||!desktopPointer.matches||!inView)return;
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
  reduced.addEventListener('change',update);
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
  if(enterpriseVideo && enterpriseSlide) {
    new MutationObserver(syncEnterpriseVideo).observe(enterpriseSlide,{attributes:true,attributeFilter:['class','aria-hidden']});
    if('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{enterpriseInView=entry.isIntersecting;syncEnterpriseVideo();},{threshold:0}).observe(enterpriseMedia);
  }
  update();
}

// Vídeo empresarial decorativo: carrega quando entra em cena e mantém o poster
// quando a preferência do sistema ou a conexão pede menos movimento.
const office=document.querySelector('[data-office-motion]');
if(office) {
  const officeVideo=office.querySelector('[data-business-video]');
  const control=office.querySelector('.office-motion-toggle');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const connection=navigator.connection;
  let visible=!('IntersectionObserver' in window);
  let paused=false;
  const updateVideo=officeVideo ? createHeroVideo(officeVideo,office) : null;
  const sync=()=> {
    updateVideo?.({paused,reduced:motion.matches,saveData:Boolean(connection?.saveData),hidden:document.hidden,inView:visible,active:true});
    office.classList.toggle('office-motion-active',visible && !paused && !motion.matches && !connection?.saveData && !document.hidden);
    control.hidden=motion.matches;
    control.textContent=paused?'Ativar animação':'Pausar animação';
    control.setAttribute('aria-pressed',String(paused));
  };
  control.addEventListener('click',()=>{paused=!paused;sync();});
  motion.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  connection?.addEventListener('change',sync);
  if('IntersectionObserver' in window) new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.15}).observe(office);
  sync();
}

const dock=document.querySelector('.coverage-dock');
if(dock && quickForm && 'IntersectionObserver' in window) {
  let formVisible=true;
  let heroVisible=true;
  let plansVisible=false;
  let footerVisible=false;
  const heroPanel=document.querySelector('.hero-frame');
  const plansGrid=document.querySelector('.plan-grid');
  const syncDock=()=>{
    const dialogOpen=Boolean(document.querySelector('dialog[open]'));
    dock.hidden=heroVisible||formVisible||plansVisible||footerVisible||dialogOpen||menu.getAttribute('aria-expanded')==='true'||Boolean(document.activeElement?.closest('form'));
  };
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.target===quickForm)formVisible=entry.isIntersecting;else if(entry.target===heroPanel)heroVisible=entry.isIntersecting;else if(entry.target===plansGrid)plansVisible=entry.isIntersecting;else footerVisible=entry.isIntersecting;});
    syncDock();
  },{threshold:0,rootMargin:'-76px 0px 0px'});
  observer.observe(quickForm);
  if(heroPanel) observer.observe(heroPanel);
  else heroVisible=false;
  if(plansGrid) observer.observe(plansGrid);
  observer.observe(document.querySelector('footer'));
  document.addEventListener('focusin',syncDock);
  document.addEventListener('focusout',()=>requestAnimationFrame(syncDock));
  new MutationObserver(syncDock).observe(dialog,{attributes:true,attributeFilter:['open']});
  new MutationObserver(syncDock).observe(menu,{attributes:true,attributeFilter:['aria-expanded']});
  document.querySelectorAll('[data-focus-coverage]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    dock.hidden=true;
    quickForm.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});
    quickForm.elements.namedItem('cep').focus({preventScroll:true});
  }));
}

document.querySelectorAll('.brand').forEach(brand=> {
  const fallback=()=> {
    brand.querySelectorAll('img').forEach(img=>img.hidden=true);
    brand.querySelector('.brand-fallback').hidden=false;
  };
  brand.querySelectorAll('img').forEach(img=> {
    img.addEventListener('error',fallback);
    if(img.complete && !img.naturalWidth)fallback();
  });
});
