import { routes } from '../routes.mjs';
import { config } from '../config.mjs';
import { messageFor, whatsappUrl } from '../lib/whatsapp.mjs';
import { readFileSync } from 'node:fs';
export const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const displayWhatsapp = number => String(number).replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
const iconFiles = {
  arrow: 'nav-arrow-right',
  check: 'check-circle',
  wifi: 'wifi',
  mobile: 'smartphone-device',
  streaming: 'tv',
  fiber: 'antenna-signal',
  headset: 'headset',
  pin: 'map-pin',
  home: 'home-simple',
  work: 'laptop',
  cloud: 'cloud',
  game: 'gamepad',
  shield: 'shield-check',
  server: 'server',
  restore: 'database-restore',
  lock: 'lock',
  settings: 'settings',
  alert: 'warning-circle',
  report: 'stats-report',
  document: 'doc-star',
  inspect: 'shield-search',
  key: 'key',
  network: 'network',
  refresh: 'refresh-circle',
  user: 'user',
  building: 'building',
  chat: 'chat-bubble',
  play: 'play',
  whatsapp: 'whatsapp',
  instagram: 'instagram',
  plus: 'plus',
  menu: 'menu-scale',
  close: 'xmark'
};
const iconMarkup = Object.fromEntries(Object.entries(iconFiles).map(([name,file]) => [name, readFileSync(new URL(import.meta.resolve(`iconoir/icons/${file}.svg`)), 'utf8').trim()]));
export const icon = (name, cls = '') => {
  const safeClass = String(cls).replace(/[^a-z0-9 _-]/gi, '');
  const symbol = Object.hasOwn(iconMarkup,name) ? name : 'arrow';
  return iconMarkup[symbol].replace('<svg ', `<svg class="icon icon-${symbol}${safeClass.trim() ? ` ${safeClass.trim()}` : ''}" aria-hidden="true" focusable="false" `);
};
export function action(label, kind = 'general', detail = '', cls = 'button primary', symbol = 'whatsapp') {
  const href = whatsappUrl(messageFor(kind, detail));
  return `<a class="${cls}${href ? ' whatsapp-action' : ''}" href="${escape(href || '/contato.html')}" data-whatsapp="${kind}" data-detail="${escape(detail)}"${href ? ' target="_blank" rel="noopener noreferrer"' : ''}>${href ? icon(symbol) + escape(label) : escape(label) + icon('arrow')}</a>`;
}
export function logo() {
  return `<a class="brand" href="/" aria-label="AMR Telecom, início"><img class="brand-dark" src="${config.brand.logo}" alt="" width="160" height="80" fetchpriority="high"><img class="brand-light" src="${config.brand.logoLight}" alt="" width="160" height="76" fetchpriority="high"><span class="brand-fallback" hidden>AMR <small>TELECOM</small></span></a>`;
}
export function header(pathname = '/') {
  const contact = whatsappUrl(messageFor('general'));
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a><header class="header"><div class="container header-inner">${logo()}<a class="mobile-support" href="/suporte.html">${icon('headset')} Suporte</a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation" aria-label="Abrir menu">${icon('menu')}</button><nav id="navigation" aria-label="Navegação principal">${routes.filter(route => route.primary).map(route => `<a href="${route.path}"${route.path === pathname || (route.path === '/empresas.html' && pathname.startsWith('/empresas-')) ? ' aria-current="page"' : ''}>${route.label}</a>`).join('')}</nav>${contact ? action('Falar no WhatsApp','general','','button header-cta','whatsapp') : '<a class="button header-cta" href="/contato.html">Canais de contato</a>'}</div></header>`;
}
export function footer(pathname = '/') {
  const c = config.contact;
  const fields = [c.phone && `<a href="tel:${escape(c.phone.replace(/[^\d+]/g,''))}">${escape(c.phone)}</a>`,c.email && `<a href="mailto:${escape(c.email)}">${escape(c.email)}</a>`,c.address && `<span>${escape(c.address)}</span>`,c.hours && `<span>${escape(c.hours)}</span>`].filter(Boolean).join('');
  const contactUrl = whatsappUrl(messageFor('general'));
  const contact = contactUrl ? `<a class="footer-channel footer-channel-whatsapp whatsapp-action" href="${escape(contactUrl)}" data-whatsapp="general" data-detail="" target="_blank" rel="noopener noreferrer" aria-label="Conversar com a equipe da AMR pelo WhatsApp: ${escape(displayWhatsapp(c.whatsapp))}"><span class="footer-channel-icon">${icon('whatsapp')}</span><span class="footer-channel-copy"><small>Atendimento · WhatsApp</small><strong>${escape(displayWhatsapp(c.whatsapp))}</strong></span>${icon('arrow')}</a>` : action('Canais de contato');
  const social = Object.entries(config.social).filter(([,url])=>/^https:\/\//.test(url)).map(([name,url]) => {
    const instagram = name === 'instagram';
    const handle = instagram ? `@${new URL(url).pathname.split('/')[1]}` : name;
    return `<a class="footer-channel" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="${instagram ? 'Instagram da AMR Telecom, ' : ''}${escape(handle)}">${instagram ? `<span class="footer-channel-icon instagram-icon">${icon('instagram')}</span>` : ''}<span class="footer-channel-copy"><small>${instagram ? 'Acompanhe no Instagram' : 'Redes sociais'}</small><strong>${escape(handle)}</strong></span>${icon('arrow')}</a>`;
  }).join('');
  const navigation = paths => paths.map(path => { const route=routes.find(item=>item.path===path);return `<a href="${path}"${path===pathname?' aria-current="page"':''}>${escape(route.label)}</a>`; }).join('');
  return `<footer class="amr-footer"><div class="container footer-brand-row"><div>${logo()}<p>${escape(config.brand.slogan)}.</p><p class="footer-summary">Internet por fibra óptica para residências e empresas, com consulta de cobertura e atendimento próximo.</p></div></div><div class="container footer-columns"><div class="footer-links"><h3>Internet para você</h3>${navigation(['/planos.html','/solucoes.html','/wifi.html','/empresas.html'])}</div><div class="footer-links"><h3>Planos em fibra</h3>${config.plans.map(p=>`<a href="/planos.html#explicar-${encodeURIComponent(p.id)}" aria-label="Detalhes do plano: ${p.speed} Mega, ${escape(p.profile.label)}">${icon(p.profile.icon)} ${p.speed} Mega · ${escape(p.profile.label)}</a>`).join('')}<a href="/cobertura.html">${icon('pin')} Consultar cobertura</a></div><div class="footer-links"><h3>Já sou cliente</h3>${navigation(['/area-do-cliente.html','/suporte.html','/perguntas.html','/contato.html'])}<a href="/privacidade.html">Privacidade</a><a href="/termos.html">Termos de uso</a></div><div class="footer-contact"><h3>Fale com a AMR</h3><div class="footer-channels">${contact}${social}</div>${config.coverage.cities.length ? `<div class="footer-coverage"><div class="footer-coverage-heading">${icon('pin')}<strong>Onde atendemos</strong></div><ul>${config.coverage.cities.map(city=>`<li>${escape(city)}</li>`).join('')}</ul><a href="/cobertura.html">Consultar meu endereço ${icon('arrow')}</a></div>` : ''}${!c.whatsapp ? '<p class="small">O canal oficial de atendimento será disponibilizado em breve.</p>' : ''}${fields}</div></div><div class="container footer-bottom"><div><span>© ${new Date().getFullYear()} AMR Telecom.</span><small>Planos, valores, condições e disponibilidade dependem de confirmação da equipe.</small></div><div><a href="/privacidade.html">Política de Privacidade</a><a href="/termos.html">Termos de Uso</a></div></div><div class="container footer-credit">Desenvolvido por © Saulo Ferreira Technology</div></footer><dialog id="contact-dialog" aria-labelledby="dialog-title"><div class="dialog-inner"><button class="dialog-close" aria-label="Fechar aviso">${icon('close')}</button>${icon('chat')}<h2 id="dialog-title">Atendimento em breve</h2><p>O WhatsApp oficial da AMR Telecom ainda não está disponível neste site. Tente novamente mais tarde.</p><p class="small">Nenhuma mensagem foi enviada. Os dados preenchidos não foram salvos.</p><button class="button primary" data-close-dialog>Entendi</button></div></dialog>`;
}
