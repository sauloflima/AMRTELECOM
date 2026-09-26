import { isIP } from 'node:net';

export function publicationIssues(config, privacy, terms) {
  const issues = [];
  const approved = key => typeof config.publicationApprovals?.[key] === 'string' && config.publicationApprovals[key].trim().length > 0;
  let url;
  try { url = new URL(config.siteUrl); } catch { /* domínio ainda não definido */ }
  if (!url || url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash || !url.hostname.includes('.') || isIP(url.hostname) || /(^|\.)(localhost|local|test|invalid|example)$/.test(url.hostname) || /(^|\.)example\.(com|org|net)$/.test(url.hostname)) {
    issues.push('Defina siteUrl com o domínio HTTPS definitivo, sem caminho ou parâmetros.');
  }
  if (config.commercialConfirmed !== true || !approved('commercial')) issues.push('A AMR precisa revisar os dados comerciais e registrar a referência da aprovação.');
  if (!approved('privacy') || privacy.includes('PENDENTE DE REVISÃO')) issues.push('A AMR precisa completar e aprovar a política de privacidade.');
  if (!approved('terms') || terms.includes('PENDENTE DE REVISÃO')) issues.push('A AMR precisa completar e aprovar os termos de uso.');
  return issues;
}
