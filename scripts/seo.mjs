import { config } from '../src/config.mjs';

export function serializeOrganization(settings) {
  let site;
  try {
    const url = new URL(settings.siteUrl);
    if (url.protocol === 'https:' && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash) site = url;
  } catch { /* Domínio ausente: não inventar URLs no schema. */ }
  const whatsapp = settings.contact.whatsapp;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.brand.name,
    ...(site ? { url: site.href, logo: new URL(settings.brand.logo, site).href } : {}),
    sameAs: Object.values(settings.social).filter(url => url.startsWith('https://')),
    ...(/^55\d{10,11}$/.test(whatsapp) ? { contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${whatsapp}`,
      contactType: 'customer service',
      availableLanguage: 'pt-BR',
    } } : {}),
  }).replace(/</g, '\\u003c');
}

// Dados da organização real; a demonstração não representa outra empresa.
export const organizationJson = serializeOrganization(config);
