import { config } from '../config.mjs';
import { escape, icon } from './shared.mjs';

export const customerAvatar = '/assets/generated/amr-perfil-cliente.jpg';

export function customerArea({ home = false } = {}) {
  const cardHeading = home ? 'h3' : 'h2';
  const portal = config.customerPortalUrl.trim();
  if (portal) {
    const url = new URL(portal);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Use o endereço HTTPS oficial da Área do cliente, sem credenciais.');
  }
  const access = home
    ? `<a class="button primary customer-access" href="/area-do-cliente.html">Conhecer minha área ${icon('arrow')}</a>`
    : portal
      ? `<a class="button primary customer-access" href="${escape(portal)}">Entrar na central do cliente ${icon('arrow')}</a>`
      : `<button class="button primary customer-access" type="button" disabled>Acesso em breve ${icon('user')}</button>`;
  return `<section class="customer-section" aria-label="Área do cliente"><div class="container customer-layout">
    <div class="customer-copy"><p class="customer-kicker">ÁREA DO CLIENTE</p><h2>Sua área<br>na AMR.</h2><p>Quer consultar sua conta? Entre na central do cliente. Se precisar de ajuda, conte com a nossa equipe.</p><a class="text-link customer-help" href="/suporte.html">${icon('headset')} Precisa de ajuda? Fale com a equipe ${icon('arrow')}</a></div>
    <div class="customer-card"><div class="customer-card-top"><img src="${config.brand.logo}" alt="AMR Telecom" width="160" height="80" loading="lazy" decoding="async"><span class="customer-status">${portal ? 'Central do cliente' : 'Em preparação'}</span></div>
      <div class="customer-card-body"><span class="customer-symbol" aria-hidden="true"><img src="${customerAvatar}" alt="" width="256" height="256" decoding="async"></span><div><${cardHeading}>Que bom ter você aqui.</${cardHeading}><p>${portal ? 'Entre na central para consultar as informações da sua conta.' : 'Estamos preparando seu acesso. Assim que estiver disponível, você poderá entrar por aqui.'}</p></div></div>
      ${access}<p class="customer-caption">${portal ? 'Você será direcionado ao portal oficial da AMR.' : 'Enquanto isso, nossa equipe atende pelo suporte.'}</p>
    </div>
  </div></section>`;
}
