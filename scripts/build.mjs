import { mkdir, writeFile, copyFile, stat, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { config } from '../src/config.mjs';
import { header, footer, escape } from '../src/components/shared.mjs';
import { hero, heroAssets } from '../src/components/hero.mjs';
import { plans } from '../src/components/plans.mjs';
import { homeAssets, testimonials, homeBusiness, homeRoutine, homeSupport, homeFaq, pendingStories, homeContactBand, coverageDock } from '../src/components/home-sections.mjs';
import { routines, wifi, business } from '../src/components/benefits.mjs';
import { WhatsAppAssistant, supportAvatar } from '../src/components/support-assistant.mjs';
import { customerArea } from '../src/components/customer.mjs';
import { coverage, support, faq, contactPage } from '../src/components/contact.mjs';
import { routes, routeFor } from '../src/routes.mjs';
import { homeNavigation, interiorPage } from '../src/components/navigation.mjs';
import { contentSecurityPolicy } from './security.mjs';
import { publicationIssues } from './publication.mjs';
import { privacy, terms } from '../src/legal.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const assetRevision = '20260926-icons-v2';
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const issues = publicationIssues(config, privacy, terms);
const indexable = issues.length === 0;
const origin = indexable ? config.siteUrl.replace(/\/$/, '') : '';
function page(title, content, route='/') {
  const description = escape(routeFor(route).description);
  const visualStyles = ['/', '/planos.html'].includes(route) ? `<link rel="stylesheet" href="/home-refresh.css?v=${assetRevision}">` : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}"><meta name="referrer" content="no-referrer"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#020B18"><title>${escape(title)}</title><meta name="description" content="${description}"><meta name="robots" content="${indexable ? 'index, follow':'noindex, nofollow'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR">${origin ? `<link rel="canonical" href="${origin}${route}">` : ''}<link rel="icon" type="image/png" href="${config.brand.favicon}"><link rel="stylesheet" href="/styles.css?v=${assetRevision}">${visualStyles}<link rel="stylesheet" href="/support-assistant.css?v=${assetRevision}"><script type="module" src="/src/client.mjs?v=${assetRevision}"></script></head><body>${header(route)}<noscript><div class="no-script">Ative o JavaScript para usar o menu compacto e a consulta por formulário. Os planos, perguntas e links de navegação continuam disponíveis.</div><style>@media(max-width:800px){.header nav{display:flex;position:static;flex-direction:row;overflow:auto}.header-inner{height:auto;flex-wrap:wrap;padding-bottom:10px}.menu-toggle{display:none}}</style></noscript>${content}${footer(route)}${WhatsAppAssistant()}</body></html>`;
}
const pages = {
  'index.html': page('AMR Telecom | Internet por fibra óptica', `<main id="conteudo" tabindex="-1">${hero()}${plans({home:true})}${homeRoutine()}${homeBusiness()}${homeSupport()}${testimonials()}${pendingStories()}${homeFaq()}${homeContactBand()}</main>${coverageDock()}`),
  ...Object.fromEntries([
    ['/planos.html', plans(), ['/cobertura.html', '/perguntas.html']],
    ['/area-do-cliente.html', customerArea(), ['/suporte.html', '/contato.html']],
    ['/solucoes.html', routines(), ['/planos.html', '/empresas.html']],
    ['/wifi.html', wifi(), ['/suporte.html', '/cobertura.html']],
    ['/empresas.html', business(), ['/contato.html', '/cobertura.html']],
    ['/cobertura.html', coverage(), ['/planos.html', '/perguntas.html']],
    ['/suporte.html', support(), ['/wifi.html', '/perguntas.html']],
    ['/perguntas.html', faq(), ['/planos.html', '/suporte.html']],
    ['/contato.html', contactPage(), ['/cobertura.html', '/suporte.html']],
  ].map(([pathname, content, related]) => {
    const route = routeFor(pathname);
    return [route.file, page(route.title, interiorPage(pathname, content, related), pathname)];
  })),
  'privacidade.html': page('Política de Privacidade | AMR Telecom', privacy, '/privacidade.html'),
  'termos.html': page('Termos de Uso | AMR Telecom', terms, '/termos.html')
};
for (const [name, html] of Object.entries(pages)) {
  if (/[\u2012-\u2015]/u.test(html)) throw new Error(`Travessão encontrado em ${name}`);
  await writeFile(path.join(output, name), name==='index.html' ? html.replace('<body>', '<body class="home-page">') : html);
}
await copyFile(path.join(root,'src/styles.css'),path.join(output,'styles.css'));
await copyFile(path.join(root,'src/home-refresh.css'),path.join(output,'home-refresh.css'));
await copyFile(path.join(root,'src/support-assistant.css'),path.join(output,'support-assistant.css'));
await mkdir(path.join(output,'src/lib'),{recursive:true});
for(const file of ['client.mjs','config.mjs','lib/whatsapp.mjs','lib/carousel.mjs','lib/hero-video.mjs','lib/support-assistant.mjs']) await copyFile(path.join(root,'src',file),path.join(output,'src',file));
for(const asset of [config.brand.logo,config.brand.logoLight,config.brand.favicon,...heroAssets,...homeAssets,supportAvatar]) {
  if (!asset.startsWith('/assets/') || asset.includes('..')) throw new Error('Caminho de mídia inválido: '+asset);
  const source=path.join(root,'public',asset);
  await stat(source);
  const target=path.join(output,asset);
  await mkdir(path.dirname(target),{recursive:true});
  await copyFile(source,target);
}
await writeFile(path.join(output,'robots.txt'), `User-agent: *\n${indexable?'Allow: /':'Disallow: /'}\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : '# Defina siteUrl em src/config.mjs para ativar o sitemap.\n'}`);
await writeFile(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable ? routes.map(item => item.path).map(route=>`<url><loc>${origin}${route}</loc></url>`).join('') : ''}</urlset>\n`);
console.log(`Build concluído: ${output}\n${Object.keys(pages).length} páginas estáticas. ${indexable ? 'Indexação habilitada.' : 'Pré-publicação: indexação desativada (' + issues.length + ' pendências).'}`);
