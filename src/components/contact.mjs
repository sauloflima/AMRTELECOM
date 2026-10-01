import { config } from '../config.mjs';
import { icon, action, escape, displayWhatsapp } from './shared.mjs';
import { whatsappUrl } from '../lib/whatsapp.mjs';
import { supportAvatar } from './support-assistant.mjs';
export function coverage() {
  const fields = [['name','Seu nome','text','name','Como podemos chamar você?'],['city','Cidade','text','address-level2','Em qual cidade você mora?'],['neighborhood','Bairro','text','address-level3','Qual é o seu bairro?'],['street','Rua ou ponto de referência','text','street-address','Informe sua rua ou uma referência próxima']];
  const available = Boolean(whatsappUrl(''));
  return `<section id="cobertura" class="section coverage"><div class="container coverage-layout">
    <div><p class="eyebrow">CONSULTE A COBERTURA</p><h2>O primeiro passo<br>é o seu endereço.</h2>
      <p>Informe onde você precisa de internet. A equipe verifica a disponibilidade e explica as condições de instalação.</p>
      <div class="coverage-info">${icon('pin')}<p>Preencha o formulário e revise a mensagem antes de enviá-la pelo WhatsApp. A consulta não garante cobertura nem contratação.</p></div>
      ${config.coverage.cities.length ? `<div class="footer-coverage coverage-cities"><div class="footer-coverage-heading">${icon('pin')}<strong>Onde atendemos</strong></div><ul>${config.coverage.cities.map(city=>`<li>${escape(city)}</li>`).join('')}</ul><p>A equipe confirma a disponibilidade no seu endereço.</p><a href="#coverage-form">Consultar meu endereço ${icon('arrow')}</a></div>` : ''}
      ${config.coverage.neighborhoods.length ? `<p>Bairros para consulta: ${config.coverage.neighborhoods.map(escape).join(', ')}.</p>` : ''}
    </div>
    <form id="coverage-form" novalidate autocomplete="on" aria-labelledby="coverage-form-title">
      <h2 id="coverage-form-title">Consultar disponibilidade</h2>
      <div id="selected-plan" class="selected-plan" hidden><p>Seu plano de interesse: <strong id="selected-plan-name"></strong></p>${config.plans.map(plan=>`<span class="selected-plan-profile" data-plan-profile="${plan.id}" hidden>${icon(plan.profile.icon)} ${escape(plan.profile.label)}</span>`).join('')}<p id="selected-plan-context"></p><a id="selected-plan-explain" class="text-link" href="/planos.html">Detalhes do plano ${icon('arrow')}</a><a class="text-link" href="/planos.html">Trocar plano ${icon('arrow')}</a></div>
      ${!available ? '<p class="availability-note">O WhatsApp oficial ainda não está disponível neste site. Você pode preparar a consulta, mas ela não será enviada enquanto o canal estiver indisponível.</p>' : ''}
      <p class="small">Todos os campos são obrigatórios.</p>
      <p id="coverage-load-message" class="small" role="status">Para preencher a consulta, ative o JavaScript. Se ele já estiver ativo, aguarde o carregamento ou recarregue a página.</p>
      <div class="form-grid">${fields.map(([name,label,type,auto,placeholder]) => `<div class="field ${name==='street'?'full':''}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" disabled autocomplete="${auto}" placeholder="${placeholder}" required minlength="2" maxlength="${name==='street'?200:100}" aria-describedby="${name}-error"><span class="field-error" id="${name}-error"></span></div>`).join('')}</div>
      <p id="form-status" class="form-status" role="status" aria-live="polite"></p>
      <button class="button primary" type="submit" disabled>Preparar consulta ${icon('arrow')}</button>
      <p id="coverage-preview" class="message-preview" hidden></p>
      <a id="coverage-continue" class="text-link" hidden target="_blank" rel="noopener noreferrer">Abrir consulta no WhatsApp ${icon('arrow')}</a>
      <p class="form-privacy">Revise a mensagem antes de abrir o WhatsApp. Ao clicar no link, nome, cidade, bairro, rua ou referência e, se houver, o plano escolhido entram na URL enviada ao WhatsApp, mesmo que você não envie a mensagem no aplicativo. Este site não salva os campos. <a href="/privacidade.html">Como seus dados são usados</a>.</p>
    </form></div></section>`;
}
export function support() {
  const choices=[['offline','Estou sem conexão','fiber'],['slow','Minha internet está lenta','work'],['wifi','Preciso de ajuda com meu Wi-Fi','wifi'],['payment','Tenho uma dúvida sobre pagamento','chat'],['other','Preciso de outro atendimento','headset']];
  return `<section id="suporte" class="section support"><div class="container support-layout"><div><p class="eyebrow">SUPORTE AO CLIENTE</p><h2>Precisou?<br>Vamos conversar.</h2><p>Escolha o assunto. O WhatsApp abrirá com uma mensagem pronta para a equipe entender seu pedido.</p>${!whatsappUrl('') ? '<p class="availability-note">O WhatsApp de atendimento ainda não está disponível neste site. Nenhuma solicitação será enviada por enquanto.</p>' : ''}<p class="small">Não envie senhas, documentos ou dados sensíveis.</p><a class="text-link" href="/cobertura.html">Ainda não é cliente? Consulte a cobertura ${icon('arrow')}</a></div><div class="support-options">${choices.map(([id,label,i])=>`<div>${icon(i)}${action(label,'support',id,'support-link')}</div>`).join('')}</div></div></section>`;
}
export function faq() {
  const items=[
    ['A conexão é por fibra óptica?','A proposta da AMR Telecom é oferecer internet por fibra óptica. A equipe confirma a viabilidade técnica e as condições para o seu endereço.'],
    ['Como consulto a cobertura?','Preencha o formulário de cobertura com seu endereço. A consulta é encaminhada pelo WhatsApp e a equipe confirma a disponibilidade.'],
    ['Existe fidelidade?',config.commercialConfirmed && config.benefits.includes('Sem contrato de fidelização') ? 'Os planos apresentados não têm contrato de fidelização. Consulte as demais condições de contratação e instalação com a equipe.' : 'Os materiais iniciais indicam planos sem contrato de fidelização. Essa condição ainda precisa de confirmação. Consulte a equipe antes de contratar.'],
    ['Qual plano é ideal para minha casa?','Considere quantas pessoas usam a internet ao mesmo tempo, os aparelhos conectados e atividades como videochamadas, jogos e transmissões. A equipe pode ajudar a comparar as opções.'],
    ['O roteador está incluído?','A inclusão e o modelo do equipamento precisam ser confirmados com a equipe. Consulte também as condições de instalação.'],
    ['Como solicitar suporte?',`Na seção de suporte, escolha o assunto do atendimento para preparar uma mensagem no WhatsApp.${config.contact.whatsapp ? '' : ' O canal ficará disponível assim que o número oficial for informado.'}`],
    ['O Wi-Fi chega igual em todos os cômodos?','Não. Paredes, distância, tamanho do imóvel, roteador e quantidade de aparelhos influenciam o sinal. A equipe pode orientar uma solução adequada para cada ambiente.']
  ];
  return `<section class="section faq"><div class="container faq-layout"><div><p class="eyebrow">SEM COMPLICAÇÃO</p><h2>Antes de conectar,<br>tire suas dúvidas.</h2></div><div>${items.map(([q,a])=>`<details><summary>${q}${icon('plus')}</summary><div class="faq-answer"><p>${a}</p>${action('Conversar com a equipe','general','','text-link')}</div></details>`).join('')}</div></div></section>`;
}

export function contactPage() {
  const c = config.contact;
  const details = [
    ['Telefone', c.phone, c.phone ? 'tel:' + c.phone.replace(/[^\d+]/g, '') : ''],
    ['E-mail', c.email, c.email ? 'mailto:' + c.email : ''],
    ['Endereço', c.address, ''],
    ['Horário de atendimento', c.hours, ''],
  ].filter(([, value]) => value);
  return `<section class="section contact-page"><div class="container contact-layout">
    <div class="contact-intro"><p class="eyebrow">FALE COM A AMR</p><h2>Uma conversa é<br>o primeiro passo.</h2>
    <p>Fale com a equipe sobre planos, cobertura ou suporte. Para consultar um endereço, use o formulário de cobertura.</p>
    <nav class="contact-shortcuts" aria-label="Escolha o assunto"><a href="/cobertura.html"><span>${icon('pin')}</span><span><strong>Quero consultar cobertura</strong><small>Verificar disponibilidade no meu endereço</small></span>${icon('arrow')}</a><a href="/suporte.html"><span>${icon('headset')}</span><span><strong>Já sou cliente e preciso de ajuda</strong><small>Encontrar o canal certo para suporte</small></span>${icon('arrow')}</a></nav></div>
    <div class="contact-panel"><div class="contact-panel-top"><div class="contact-panel-heading"><span class="contact-panel-icon">${icon('whatsapp')}</span><span>CANAL DIRETO · AMR TELECOM</span></div><span class="contact-agent" aria-hidden="true"><img src="${supportAvatar}" alt="" loading="lazy" decoding="async"></span></div><h2>Atendimento pelo WhatsApp</h2>
    <p>${c.whatsapp ? 'Converse com a equipe sobre planos, disponibilidade e atendimento.' : 'O canal oficial está pendente de confirmação e será disponibilizado aqui.'}</p>
    ${action('Falar com a AMR')}
    ${c.whatsapp ? `<p class="contact-number">Número oficial <strong>${escape(displayWhatsapp(c.whatsapp))}</strong></p>` : ''}
    ${details.length ? `<dl>${details.map(([label, value, href]) => `<div><dt>${label}</dt><dd>${href ? `<a href="${escape(href)}">${escape(value)}</a>` : escape(value)}</dd></div>`).join('')}</dl>` : ''}
    </div></div></section>`;
}
