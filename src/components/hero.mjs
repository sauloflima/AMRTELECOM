import { icon, action } from './shared.mjs';
import { config } from '../config.mjs';
import { whatsappUrl } from '../lib/whatsapp.mjs';

export const heroAssets = [
  '/assets/generated/amr-casa-fibra-3d.png',
  '/assets/generated/amr-atendimento-local-editorial-v2.jpg',
  '/assets/videos/hero-amr-integrado-corrigido.mp4',
  '/assets/videos/atendimento-amr.mp4',
  '/assets/brand/logo-amr-relief.png',
  '/assets/generated/amr-empresa-hero-poster.jpg',
  '/assets/videos/amr-empresa-hero.mp4',
  '/assets/generated/amr-empresa-card.jpg'
];

function arrivingTitle(text, accent='') {
  let index=0;
  const words=part=>part.split(' ').map(word=>`<span class="arrival-word">${[...word].map(letter=>`<span class="arrival-letter" data-letter-delay="${index++*14}">${letter}</span>`).join('')}</span>`).join(' ');
  return `${words(text)}${accent?` <span class="arrival-accent">${words(accent)}</span>`:''}`;
}

export function hero() {
  return `<section id="inicio" class="hero home-hero connected-hero" aria-labelledby="hero-title">
    <div class="hero-frame" data-carousel role="region" aria-roledescription="carrossel" aria-label="Destaques da AMR Telecom">
      <button class="carousel-rotation" type="button" hidden>Pausar carrossel</button>
      <div class="carousel-track">
        <article class="carousel-slide hero-slide hero-slide-home is-active" id="amr-slide-1" role="group" aria-roledescription="slide" aria-label="1 de 3: Fibra para a casa">
          <div class="hero-copy">
            <p class="hero-kicker">Conexão que faz parte da casa</p>
            <h1 id="hero-title">Fibra para a casa <span>viver tudo.</span></h1>
            <p class="hero-lead">Mais estabilidade para trabalhar, estudar, assistir e jogar com quem importa.</p>
            <a class="button primary hero-cta" href="#quick-coverage-form" data-focus-coverage>Consultar cobertura ${icon('arrow')}</a>
            <ul class="hero-proof"><li>${icon('fiber')} 100% fibra óptica</li><li>${icon('pin')} Atendimento local</li><li>${icon('headset')} Suporte humanizado</li></ul>
          </div>
          <div class="hero-house connected-art"><div class="house-parallax"><video class="hero-house-video" data-hero-house-video muted loop playsinline preload="none" poster="${heroAssets[0]}" width="1920" height="1080" aria-hidden="true" tabindex="-1"><source src="${heroAssets[2]}" type="video/mp4"></video><img class="hero-house-fallback" src="${heroAssets[0]}" width="1254" height="1254" fetchpriority="high" decoding="async" alt=""></div></div>
        </article>
        <article class="carousel-slide hero-slide hero-slide-enterprise" id="amr-slide-2" role="group" aria-roledescription="slide" aria-label="2 de 3: Conexão para empresas" aria-hidden="true" inert>
          <div class="hero-copy"><p class="hero-kicker">AMR para empresas</p><h2 aria-label="Sua empresa conectada. Suporte por perto."><span aria-hidden="true">${arrivingTitle('Sua empresa conectada.','Suporte por perto.')}</span></h2><p class="hero-lead">Para lojas, escritórios e equipes, a AMR avalia a cobertura e entende a rotina da operação antes de apresentar uma solução. Você também conta com suporte técnico e atendimento humano.</p>${action('Conversar sobre minha empresa','business','','button primary hero-cta')}</div>
          <div class="enterprise-stage"><div class="enterprise-media"><img src="${heroAssets[5]}" width="1280" height="720" loading="lazy" decoding="async" alt="Prédio comercial iluminado ao anoitecer."><video data-enterprise-video muted loop playsinline preload="none" poster="${heroAssets[5]}" width="1280" height="720" aria-hidden="true" tabindex="-1"><source src="${heroAssets[6]}" type="video/mp4"></video></div><div class="enterprise-support">${icon('headset')}<p><strong>Suporte técnico para empresas, com gente de verdade.</strong><span>Orientação para sua equipe no canal oficial da AMR.</span></p></div></div>
        </article>
        <article class="carousel-slide hero-slide hero-slide-service" id="amr-slide-3" role="group" aria-roledescription="slide" aria-label="3 de 3: Atendimento próximo" aria-hidden="true" inert>
          <div class="service-photo"><img src="${heroAssets[1]}" width="1536" height="1024" loading="lazy" decoding="async" alt="Profissional orienta um cliente durante um atendimento."><video data-service-video muted loop playsinline preload="none" poster="${heroAssets[1]}" width="960" height="646" aria-hidden="true" tabindex="-1"><source src="${heroAssets[3]}" type="video/mp4"></video><span class="service-wall-logo" aria-hidden="true"></span></div>
          <div class="hero-copy"><p class="hero-kicker">Tecnologia com conversa de verdade</p><h2 aria-label="Atendimento próximo quando você precisar."><span aria-hidden="true">${arrivingTitle('Atendimento próximo quando você precisar.')}</span></h2><p class="hero-lead">Fale com a equipe para contratar, tirar dúvidas ou pedir suporte.</p>${action('Falar com a equipe','general','','button hero-cta')}</div>
        </article>
      </div>
      <div class="carousel-controls" hidden><button class="carousel-arrow carousel-prev" type="button" aria-label="Slide anterior">${icon('arrow')}</button><div class="carousel-dots">${['Casa','Empresas','Atendimento'].map((title,index)=>`<button type="button" data-slide="${index}" aria-label="Mostrar slide ${index+1}: ${title}" aria-controls="amr-slide-${index+1}" ${index===0?'aria-current="true"':''}><span aria-hidden="true"></span></button>`).join('')}</div><button class="carousel-arrow carousel-next" type="button" aria-label="Próximo slide">${icon('arrow')}</button></div>
      <p class="sr-only carousel-status" role="status" aria-live="polite" aria-atomic="true"></p><button class="effects-toggle" type="button" aria-pressed="false" hidden>Pausar efeitos</button>
    </div>
    <div class="container coverage-wrap"><form id="quick-coverage-form" class="quick-coverage" novalidate aria-labelledby="quick-coverage-title">
      <div class="coverage-intro"><span>${icon('pin')}</span><h2 id="quick-coverage-title">Cobertura</h2></div>
      <div class="quick-fields"><div class="field"><label class="sr-only" for="quick-cep">CEP</label><input id="quick-cep" name="cep" type="text" inputmode="numeric" autocomplete="postal-code" placeholder="CEP" maxlength="9" required disabled aria-describedby="quick-cep-error"><span id="quick-cep-error" class="field-error"></span></div><div class="field"><label class="sr-only" for="quick-reference">Número ou referência</label><input id="quick-reference" name="reference" type="text" autocomplete="address-line2" placeholder="Número ou referência" maxlength="160" required disabled aria-describedby="quick-reference-error"><span id="quick-reference-error" class="field-error"></span></div><button class="button primary" type="submit" disabled>Consultar cobertura ${icon('arrow')}</button></div>
      <p id="quick-status" class="quick-status" role="status" aria-live="polite"></p><p id="quick-preview" class="message-preview" hidden></p><a id="quick-continue" class="text-link" hidden target="_blank" rel="noopener noreferrer">Abrir consulta no WhatsApp ${icon('arrow')}</a>
      <p class="quick-hint">A equipe confirma a disponibilidade. CEP e referência constam no link do WhatsApp, mesmo sem enviar a mensagem.${whatsappUrl('') ? '' : ' WhatsApp oficial ainda indisponível.'} <a href="/privacidade.html">Privacidade</a></p><p id="quick-load-message" class="quick-hint">Ative o JavaScript para consultar aqui ou <a href="/cobertura.html">acesse a página de cobertura</a>.</p>
    </form></div>
  </section>`;
}
