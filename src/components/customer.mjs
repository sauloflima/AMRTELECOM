import { config } from '../config.mjs';
import { escape, icon } from './shared.mjs';

export function customerArea({ home = false } = {}) {
  const cardHeading = home ? 'h3' : 'h2';
  const portal = config.customerPortalUrl.trim();
  if (portal) {
    const url = new URL(portal);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Use o endereço HTTPS oficial da Área do cliente, sem credenciais.');
  }
  const access = home
    ? `<a class="button primary customer-access" href="/area-do-cliente.html">Ir para Área do cliente ${icon('arrow')}</a>`
    : portal
      ? `<a class="button primary customer-access" href="${escape(portal)}">Acessar meu portal ${icon('arrow')}</a>`
      : `<button class="button primary customer-access" type="button" disabled>Acesso em breve ${icon('user')}</button>`;
  return `<section class="customer-section" aria-label="Área do cliente"><div class="container customer-layout">
    <div class="customer-copy"><p class="customer-kicker">ÁREA DO CLIENTE</p><h2>Sua conexão.<br>Seu espaço.</h2><p>Um caminho direto para consultar seus dados no portal do cliente AMR.</p><a class="text-link customer-help" href="/suporte.html">${icon('headset')} Precisa de ajuda? Acesse o suporte ${icon('arrow')}</a></div>
    <div class="customer-card"><div class="customer-card-top"><img src="${config.brand.logo}" alt="AMR Telecom" width="160" height="80" loading="lazy" decoding="async"><span class="customer-status">${portal ? 'Portal do cliente' : 'Em preparação'}</span></div>
      <div class="customer-card-body"><span class="customer-symbol" aria-hidden="true">${icon('user')}</span><div><${cardHeading}>Bem-vindo à sua área.</${cardHeading}><p>${portal ? 'Entre no portal para acessar as informações da sua conta.' : 'Estamos preparando seu acesso. Assim que estiver disponível, você poderá entrar por aqui.'}</p></div></div>
      ${access}<p class="customer-caption">${portal ? 'O acesso aos seus dados acontece no portal do cliente.' : 'Enquanto isso, nossa equipe atende pelo suporte.'}</p>
    </div>
  </div></section>`;
}
