import { createHash } from 'node:crypto';

// A única folha inline é o fallback de navegação sem JavaScript, autorizada pelo conteúdo exato.
export const noScriptStyle = '@media(max-width:800px){.header nav{display:flex;position:static;flex-direction:row;overflow:auto}.header-inner{height:auto;flex-wrap:wrap;padding-bottom:10px}.menu-toggle{display:none}}';
const noScriptHash = createHash('sha256').update(noScriptStyle).digest('base64');
export const contentSecurityPolicy = `default-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'sha256-${noScriptHash}'; style-src-attr 'none'; img-src 'self'; media-src 'self'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; worker-src 'none'; manifest-src 'none'`;

export const hostingHeaders = {
  'Content-Security-Policy': `${contentSecurityPolicy}; frame-ancestors 'none'`,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};
