export function mountNavigation() {
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
}
