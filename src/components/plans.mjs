import { config } from '../config.mjs';
import { action, escape, icon } from './shared.mjs';
import { profileImages } from './home-sections.mjs';

export function plans({ home = false } = {}) {
  const profiles = { '200': ['home', 'Uso essencial'], '500': ['work', 'Casa conectada'], '700': ['game', 'Uso intenso'] };
  const heading = home ? 'h3' : 'h2';
  return `<section id="planos" class="plans-catalog ${home ? 'plans-home' : 'plans-page'}"><div class="container">
    <div class="section-intro plans-intro"><div><p class="section-kicker">Planos AMR</p><h2>Encontre a velocidade que combina com a sua rotina.</h2></div><p>Compare os planos para casa ou converse sobre uma solução para sua empresa. Cobertura e condições são confirmadas pela equipe.</p></div>
    ${!config.commercialConfirmed ? '<p class="commercial-note">Valores e benefícios em confirmação. Consulte as condições com a equipe antes de contratar.</p>' : ''}
    <nav class="plan-compare" aria-label="Comparação rápida de planos">
      <p>Compare os preços <span>Toque para ver o plano</span></p>
      ${config.plans.map(plan => `<a href="#plano-${escape(plan.id)}"><strong>${escape(plan.speed)} Mega</strong><span>R$ ${plan.price.toFixed(2).replace('.', ',')}<small>/mês</small></span>${icon('arrow')}</a>`).join('')}
      <a href="#plano-empresarial"><strong>Empresarial</strong><span>Sob consulta</span>${icon('arrow')}</a>
    </nav>
    <div class="plan-grid">${config.plans.map(plan => {
      const [whole, cents] = plan.price.toFixed(2).split('.');
      const [symbol, label] = profiles[plan.id] || ['home', 'Para a sua rotina'];
      const badge = config.mostChosenPlanId===plan.id ? 'Mais escolhido' : plan.highlighted ? plan.badge : '';
      const isFeatured = plan.highlighted || config.mostChosenPlanId === plan.id;
      return `<article class="plan-card plan-${symbol} ${isFeatured ? 'featured' : ''}" id="plano-${escape(plan.id)}" aria-label="Plano ${plan.speed} Mega"><div class="plan-media"><img src="${profileImages[symbol]}" alt="" width="1536" height="1024" loading="lazy" decoding="async">${badge ? `<strong class="plan-badge">${escape(badge)}</strong>` : ''}</div><div class="plan-content"><p class="plan-label">${label}</p><${heading} class="plan-speed"><strong>${plan.speed}</strong><span>Mega</span></${heading}><div class="plan-price" aria-label="R$ ${whole},${cents} por mês"><span class="plan-price-currency">R$</span><strong>${whole}</strong><span class="plan-price-fraction">,${cents}<small>por mês</small></span></div>${!config.commercialConfirmed ? '<p class="price-note">Valor em confirmação</p>' : ''}<div class="plan-use">${icon(plan.profile.icon)}<div><strong>${escape(plan.profile.headline)}</strong><p>${escape(plan.use)}</p></div></div><ul>${config.benefits.map(benefit => `<li>${icon('check')}${escape(benefit)}</li>`).join('')}</ul><a class="button primary" aria-label="Selecionar plano de ${plan.speed} Mega" href="/cobertura.html?plano=${encodeURIComponent(plan.id)}">Selecionar plano ${icon('arrow')}</a><details name="plan-details" class="plan-details" id="explicar-${plan.id}"><summary>Detalhes do plano<span class="sr-only"> de ${plan.speed} Mega</span>${icon('plus')}</summary><div><p class="plan-explanation-title">${plan.speed} Mega para a sua rotina</p><ul class="plan-examples">${plan.profile.examples.map(([symbol,text])=>`<li>${icon(symbol)}<span>${escape(text)}</span></li>`).join('')}</ul><p class="plan-fit-note">Todos os planos permitem navegar, assistir e jogar. A escolha depende do uso simultâneo, dos aparelhos e do Wi-Fi. Streaming exige assinatura própria quando aplicável; mais Mega não garante menor ping.</p><p>A equipe ajuda a escolher e confirma cobertura e condições. Tire suas dúvidas antes de decidir.</p>${action(`Falar de ${plan.speed} Mega`, 'plan', plan.id, 'text-link plan-contact')}</div></details></div></article>`;
    }).join('')}
    <article class="plan-card plan-enterprise" id="plano-empresarial" aria-label="Plano empresarial"><div class="plan-media"><img src="/assets/generated/amr-empresa-card.jpg" alt="" width="1280" height="720" loading="lazy" decoding="async"></div><div class="plan-content">
      <p class="plan-label">AMR para negócios</p><${heading} class="plan-business-title">Empresarial</${heading}>
      <div class="plan-business-proposal">${icon('building')}<span>Uma solução para<br><strong>a sua operação</strong></span></div>
      <div class="plan-use">${icon('work')}<div><strong>Atenda. Venda. Produza.</strong><p>Conexão avaliada para lojas, escritórios e equipes, conforme a rotina do seu negócio.</p></div></div>
      <ul><li>${icon('chat')} Atendimento e vendas online</li><li>${icon('work')} Sistemas e reuniões da equipe</li><li>${icon('headset')} Suporte técnico empresarial</li></ul>
      ${action('Falar sobre minha empresa','business')}
      <details name="plan-details" class="plan-details" id="explicar-empresarial"><summary>Soluções para empresas ${icon('plus')}</summary><div><p class="plan-explanation-title">Sua empresa tem um ritmo próprio.</p><p>Conte quantas pessoas usam a conexão e quais sistemas fazem parte do seu dia. A equipe avalia a velocidade e a cobertura para orientar a escolha, com atendimento humano para dúvidas técnicas.</p><p class="plan-fit-note">Proposta, equipamentos e condições definidos após avaliação. Aplicativos e sistemas não estão incluídos.</p><a class="text-link" href="/empresas.html">Conhecer a solução empresarial ${icon('arrow')}</a></div></details>
    </div></article></div><p class="plans-footnote">${icon('pin')} Selecionar um plano inicia uma consulta, sem compromisso de contratação.</p>
  </div></section>`;
}
