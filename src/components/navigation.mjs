import { routeFor } from '../routes.mjs';
import { escape, icon } from './shared.mjs';

export function homeNavigation() {
  const groups = [
    ['Planos e contratação', ['/planos.html', '/cobertura.html', '/solucoes.html', '/wifi.html', '/empresas.html']],
    ['Atendimento ao cliente', ['/area-do-cliente.html', '/suporte.html', '/perguntas.html', '/contato.html']],
  ];
  return `<section class="section home-navigation" aria-labelledby="explore-title">
    <div class="container">
      <p class="eyebrow">CONHEÇA A AMR</p>
      <h2 id="explore-title">O que você procura?</h2>
      <div class="directory-groups">${groups.map(([title, paths]) => `<div><h3>${title}</h3><div class="page-directory">${paths.map(path => {
        const route = routeFor(path);
        return `<a href="${route.path}">${icon(route.icon)}<span>${escape(route.label)}</span>${icon('arrow')}</a>`;
      }).join('')}</div></div>`).join('')}</div>
    </div>
  </section>`;
}

export function breadcrumb(pathname) {
  const route = routeFor(pathname);
  if (pathname === '/area-do-cliente.html') return '<nav class="container breadcrumb" aria-label="Voltar"><a href="/">Voltar ao início</a></nav>';
  return `<nav class="container breadcrumb" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span>${pathname.startsWith('/empresas-') ? '<a href="/empresas.html">Empresas</a><span aria-hidden="true">/</span>' : ''}<span aria-current="page">${escape(route.label)}</span></nav>`;
}

export function nextPages(pathnames) {
  return `<nav class="container related-pages" aria-label="Continue navegando">${pathnames.map(pathname => {
    const route = routeFor(pathname);
    return `<a href="${route.path}">${escape(route.label)} ${icon('arrow')}</a>`;
  }).join('')}</nav>`;
}

export function interiorPage(pathname, content, related = ['/planos.html', '/cobertura.html']) {
  // Cada página recebe uma única H1, aproveitando o título de sua seção.
  const withHeading = content.replace('<h2>', '<h1>').replace('</h2>', '</h1>');
  return `<main id="conteudo" class="inner-page" tabindex="-1">${breadcrumb(pathname)}${withHeading}${nextPages(related.filter(path => path !== pathname))}</main>`;
}
