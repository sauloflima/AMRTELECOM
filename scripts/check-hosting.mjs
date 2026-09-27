import assert from 'node:assert/strict';
import { config } from '../src/config.mjs';
import { routes } from '../src/routes.mjs';
import { privacy, terms } from '../src/legal.mjs';
import { publicationIssues } from './publication.mjs';
import { hostingHeaders } from './security.mjs';

const issues = publicationIssues(config, privacy, terms);
if (issues.length) {
  console.error('Hospedagem ainda não verificável: execute e resolva npm run prepublish:check primeiro.');
  process.exit(1);
}

const origin = config.siteUrl.replace(/\/$/, '');
const redirect = await fetch(origin.replace('https:', 'http:') + '/', { redirect: 'manual', signal: AbortSignal.timeout(10000) });
assert.ok([301, 302, 303, 307, 308].includes(redirect.status), 'HTTP deve redirecionar para HTTPS.');
assert.equal(new URL(redirect.headers.get('location'), redirect.url).href, origin + '/', 'Redirecionamento HTTP deve apontar ao HTTPS oficial.');
await redirect.body?.cancel();
for (const route of routes) {
  const response = await fetch(origin + route.path, { redirect: 'follow', signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 200, route.path);
  assert.equal(new URL(response.url).origin, origin, `Redirecionamento inesperado em ${route.path}`);
  assert.equal(new URL(response.url).protocol, 'https:');
  for (const [name, expected] of Object.entries(hostingHeaders)) {
    // Compara a política completa: substrings aceitavam, por exemplo, script-src 'self' *.
    assert.equal(response.headers.get(name), expected, `${name} ausente ou diferente da configuração auditada em ${route.path}`);
  }
  assert.match(await response.text(), /<meta name="robots" content="index, follow"/);
}
console.log('HTTPS e cabeçalhos verificados nas 12 URLs publicadas.');
if (process.argv.includes('--require-hsts')) {
  const response = await fetch(origin + '/', { signal: AbortSignal.timeout(10000) });
  assert.match(response.headers.get('strict-transport-security') || '', /(?:^|;)\s*max-age=[1-9]\d*/i);
  console.log('HSTS verificado na URL publicada.');
} else console.log('HSTS ainda requer confirmação de HTTPS e configuração pela hospedagem.');
