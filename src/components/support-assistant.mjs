import { action, escape, icon } from './shared.mjs';
import { messageFor, whatsappUrl } from '../lib/whatsapp.mjs';
import { config } from '../config.mjs';

export const supportAvatar = '/assets/generated/amr-atendimento-humano-3d.jpg';

export function WhatsAppAssistant() {
  const href = whatsappUrl(messageFor('assistant'));
  if (!href) return '';
  const portrait = `<span class="support-portrait"><img src="${supportAvatar}" alt="" width="1536" height="1024" decoding="async" fetchpriority="low"></span><span class="support-status" aria-hidden="true"></span>`;
  return `<aside class="support-assistant" aria-label="Atendimento humano da AMR Telecom" hidden>
    <button class="support-avatar support-avatar-toggle" type="button" aria-label="Abrir atendimento da AMR Telecom" aria-controls="support-prompt" aria-expanded="false">${portrait}</button>
    <div class="support-prompt" id="support-prompt" hidden>
      <img class="support-watermark" src="${escape(config.brand.logoLight)}" alt="" aria-hidden="true" width="480" height="229" decoding="async" fetchpriority="low">
      <button class="support-close" type="button" aria-label="Fechar mensagem de atendimento">${icon('close')}</button>
      <p class="support-title"><span class="support-greeting">Olá! <span aria-hidden="true">👋</span><br></span>Precisa de ajuda?</p>
      <p class="support-description"><span class="support-description-detail">A equipe </span><strong>${escape(config.brand.name)}</strong><span class="support-description-detail"> está aqui para ajudar.</span></p>
      ${action('Falar no WhatsApp', 'assistant', '', 'support-cta support-cta-desktop')}
      <a class="support-cta-mobile" href="${escape(href)}" target="_blank" rel="noopener noreferrer">Posso ajudar?</a>
    </div>
    <a class="support-avatar support-avatar-link" href="${escape(href)}" target="_blank" rel="noopener noreferrer" aria-label="Falar com atendimento da AMR Telecom pelo WhatsApp">${portrait}</a>
  </aside>`;
}
