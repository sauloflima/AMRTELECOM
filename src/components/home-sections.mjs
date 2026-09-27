import { config } from '../config.mjs';
import { icon, escape, action } from './shared.mjs';

export const profileImages = {
  home: '/assets/generated/amr-perfil-familia.jpg',
  work: '/assets/photos/amr-perfil-trabalho.jpg',
  game: '/assets/generated/amr-perfil-entretenimento.jpg'
};
export const homeAssets = [
  ...Object.values(profileImages),
  '/assets/generated/amr-rotina-conectada-3d.jpg',
  '/assets/generated/amr-escritorio-pessoas.jpg',
  '/assets/generated/amr-pessoa-celular-parada.png',
  '/assets/generated/amr-atendimento-local-editorial-v2.jpg'
];

export function connectionStrip() {
  return `<div class="connection-strip container" aria-label="Fibra óptica, atendimento local e suporte humano"><p>A conexão é só o começo.</p><ul><li>${icon('fiber')} Fibra óptica</li><li>${icon('pin')} Atendimento local</li><li>${icon('headset')} Suporte humano</li></ul></div>`;
}

export function testimonials(items=config.testimonials) {
  const approved=(items||[]).filter(item=>item.approved===true && typeof item.name==='string' && item.name.trim() && typeof item.quote==='string' && item.quote.trim());
  if(!approved.length)return '';
  return `<section class="home-testimonials home-section" aria-labelledby="testimonials-title"><div class="container"><div class="home-heading"><p class="eyebrow">EXPERIÊNCIAS REAIS</p><h2 id="testimonials-title">Quem se conecta com a AMR</h2></div><div class="testimonial-grid">${approved.map(item=>`<figure><blockquote><p>${escape(item.quote)}</p></blockquote><figcaption>${escape(item.name)}</figcaption></figure>`).join('')}</div></div></section>`;
}

export function homeBusiness() {
  return `<section class="business-section-home" aria-labelledby="business-title"><div class="container business-layout-home"><div class="business-copy"><p class="section-kicker">AMR para empresas</p><h2 id="business-title">Conexão para o trabalho continuar em movimento.</h2><p>Para pequenos negócios e escritórios, a equipe conversa sobre a rotina de uso antes de indicar uma opção.</p><ul><li>${icon('check')} Solução avaliada para a operação</li><li>${icon('check')} Tecnologia em fibra óptica</li><li>${icon('check')} Suporte técnico com atendimento humano</li></ul><a class="button primary" href="/empresas.html">Conhecer soluções para empresas ${icon('arrow')}</a></div><div class="business-media" data-office-motion><div class="business-scene"><img class="business-video-fallback" src="/assets/generated/amr-escritorio-pessoas.jpg" alt="Ambiente conectado em 3D, com pessoas trabalhando online, jogando no computador, assistindo a uma série e usando redes sociais no celular." width="1672" height="941" loading="lazy" decoding="async"><svg class="office-floor-light" viewBox="0 0 1672 941" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1000" d="M399 347 L399 382 L588 440 Q582 443 597 451 L847 548 Q916 579 958 562 L1154 450 Q1180 434 1153 418 L1048 386"/><path pathLength="1000" d="M633 254 L839 331 L1045 385"/></svg><span class="office-person office-person-gamer" aria-hidden="true"></span><span class="office-person office-person-worker" aria-hidden="true"></span><span class="office-person office-person-colleague" aria-hidden="true"></span><span class="office-person office-person-viewer" aria-hidden="true"></span><span class="office-phone-user" aria-hidden="true"></span><span class="office-screen office-screen-game" aria-hidden="true"></span><span class="office-screen office-screen-stream" aria-hidden="true"></span><span class="office-monitor office-monitor-game" aria-hidden="true">AMR</span><span class="office-monitor office-monitor-work" aria-hidden="true">AMR</span><span class="office-wall-logo" aria-hidden="true"></span></div><button class="office-motion-toggle" type="button" aria-pressed="false" hidden>Pausar animação</button></div></div></section>`;
}

export function homeSupport() {
  return `<section class="human-section" aria-labelledby="human-support-title"><div class="container human-layout"><div class="human-media"><img src="/assets/generated/amr-atendimento-local-editorial-v2.jpg" width="1536" height="1024" loading="lazy" decoding="async" alt="Profissional orienta um cliente durante um atendimento."><span class="service-wall-logo" aria-hidden="true"></span></div><div class="support-copy"><p class="section-kicker">Atendimento humano</p><h2 id="human-support-title">Tecnologia conecta. Gente cuida.</h2><p>Quer contratar, tirar uma dúvida ou resolver um problema de conexão? Encontre o canal certo para falar com a equipe.</p><div class="support-paths"><div><strong>Quero contratar</strong><a href="/cobertura.html">Consultar cobertura ${icon('arrow')}</a></div><div><strong>Já sou cliente</strong><a href="/suporte.html">Acessar suporte ${icon('arrow')}</a></div></div><div class="support-actions">${action('Falar com atendimento','support','other')}</div></div></div></section>`;
}

export function homeFaq() {
  const items = [
    ['A conexão é por fibra óptica?', 'A proposta da AMR Telecom é oferecer internet por fibra óptica. A equipe confirma a viabilidade técnica e as condições para o seu endereço.'],
    ['Como consulto a cobertura?', 'Informe o CEP e o número ou referência. A equipe confirma a disponibilidade antes de qualquer contratação.'],
    ['Qual plano combina com a minha rotina?', 'Compare as velocidades, os aparelhos conectados e atividades como estudo, trabalho, jogos e transmissões.'],
    ['Como solicitar suporte?', 'A página de suporte separa os principais assuntos para direcionar seu atendimento com clareza.']
  ];
  return `<section class="home-faq" aria-labelledby="home-faq-title"><div class="container home-faq-layout"><div><p class="section-kicker">Perguntas frequentes</p><h2 id="home-faq-title">Informação clara antes de escolher.</h2><p>Veja como funcionam cobertura, escolha do plano e suporte.</p><a class="text-link" href="/perguntas.html">Ver todas as perguntas ${icon('arrow')}</a></div><div class="home-faq-list">${items.map(([question,answer])=>`<details><summary>${question}${icon('plus')}</summary><p>${answer}</p></details>`).join('')}</div></div></section>`;
}

// Rascunho inerte, sem avaliações fictícias e sem conteúdo visível na publicação.
export function pendingStories(items=config.testimonials) {
  const hasApproved=(items||[]).some(item=>item.approved===true && typeof item.name==='string' && item.name.trim() && typeof item.quote==='string' && item.quote.trim());
  return hasApproved ? '' : '<template id="customer-stories-pending"><section class="home-testimonials home-section"><div class="container"><div class="home-heading"><p class="eyebrow">EXPERIÊNCIAS REAIS</p><h2>Histórias de clientes</h2><p>Conteúdo pendente de depoimentos reais e autorização de publicação.</p></div></div></section></template>';
}

export function homeContactBand() {
  return `<section class="home-contact-band" aria-labelledby="contact-band-title"><div class="container"><div><p class="section-kicker">Pronto para começar?</p><h2 id="contact-band-title">Leve a AMR para a sua rotina.</h2></div><div class="contact-band-actions"><a class="button light" href="/cobertura.html">Consultar cobertura ${icon('arrow')}</a><a href="/contato.html" class="text-link">Ver canais de atendimento ${icon('arrow')}</a></div></div></section>`;
}

export function homeRoutine() {
  const moments = [
    ['Casa e família','Conexão para acompanhar todos os momentos.','/assets/generated/amr-perfil-familia.jpg'],
    ['Trabalho e estudo','Estabilidade para manter o dia em movimento.','/assets/photos/amr-perfil-trabalho.jpg'],
    ['Filmes e jogos','Velocidade para aproveitar o tempo livre.','/assets/generated/amr-perfil-entretenimento.jpg']
  ];
  return `<section class="routine-section" aria-labelledby="routine-title"><div class="container"><div class="routine-heading"><p class="section-kicker">A internet acompanha a vida</p><h2 id="routine-title">Conexão para todos os momentos.</h2></div><div class="routine-grid">${moments.map(([title,text,image])=>`<a class="routine-card" href="/solucoes.html"><img src="${image}" alt="" width="1536" height="1024" loading="lazy" decoding="async"><span><strong>${title}</strong><small>${text}</small>${icon('arrow')}</span></a>`).join('')}</div></div></section>`;
}

// Mantém compatibilidade com integrações que ainda importam o nome anterior.
export const homeProfiles = homeRoutine;

export function coverageDock() {
  return `<aside class="coverage-dock" aria-label="Consulta rápida de cobertura" hidden><div><strong>A conexão começa aqui.</strong><span>Consulte a disponibilidade no seu endereço.</span></div><a class="button primary" href="#quick-coverage-form" data-focus-coverage>Consultar cobertura ${icon('arrow')}</a></aside>`;
}
