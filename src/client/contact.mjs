import { whatsappUrl, messageFor, validateCoverage, coverageMessage, selectedPlan, validateQuickCoverage, quickCoverageMessage } from '../lib/whatsapp.mjs';

export function mountContact() {
  const dialog=document.querySelector('#contact-dialog');
  const showPending=()=>dialog.showModal();
  dialog.querySelectorAll('.dialog-close,[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('click',event=> {if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  document.querySelectorAll('[data-whatsapp]').forEach(link=> {
    const url=whatsappUrl(messageFor(link.dataset.whatsapp,link.dataset.detail));
    if(url){link.href=url;link.target='_blank';link.rel='noopener noreferrer';}
    link.addEventListener('click',event=>{if(!url){event.preventDefault();showPending();}});
  });
  mountCoverageForm(document.querySelector('#coverage-form'), showPending);
  const quickForm=document.querySelector('#quick-coverage-form');
  mountQuickCoverageForm(quickForm, showPending);
  if(quickForm) document.querySelectorAll('[data-focus-coverage]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    quickForm.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});
    quickForm.elements.namedItem('cep').focus({preventScroll:true});
  }));
}

function mountCoverageForm(form, showPending) {
  if (!form) return;
  const interest=selectedPlan(new URLSearchParams(location.search).get('plano'));
  if(interest) {
    document.querySelector('#selected-plan-name').textContent=`${interest.speed} Mega`;
    document.querySelector('#selected-plan-context').textContent=interest.use;
    document.querySelector('#selected-plan-explain').href=`/planos.html#explicar-${interest.id}`;
    document.querySelector(`[data-plan-profile="${interest.id}"]`).hidden=false;
    document.querySelector('#selected-plan').hidden=false;
  }
  form.addEventListener('input',event=> {
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
  form.addEventListener('submit',event=> {
    event.preventDefault();
    const values=Object.fromEntries(new FormData(form));
    const errors=validateCoverage(values);
    for(const name of ['name','city','neighborhood','street']) {
      const field=form.elements.namedItem(name);
      field.setAttribute('aria-invalid',String(Boolean(errors[name])));
      document.querySelector(`#${name}-error`).textContent=errors[name]||'';
    }
    const status=document.querySelector('#form-status');
    status.dataset.state='error';
    if(Object.keys(errors).length){status.textContent='Confira os campos indicados antes de continuar.';form.elements.namedItem(Object.keys(errors)[0]).focus();return;}
    const url=whatsappUrl(coverageMessage(values,interest?.id));
    if(!url){status.textContent='O WhatsApp oficial ainda não está disponível. Nenhuma consulta foi enviada.';showPending();return;}
    status.dataset.state='ready';
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
  form.querySelectorAll('input, button[type="submit"]').forEach(control => {
    control.disabled = false;
  });
  document.querySelector('#coverage-load-message').hidden = true;
}

function mountQuickCoverageForm(quickForm, showPending) {
  if (!quickForm) return;
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
