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
for (const route of routes) {
  const response = await fetch(origin + route.path, { redirect: 'follow', signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 200, route.path);
  assert.equal(new URL(response.url).origin, origin, `Redirecionamento inesperado em ${route.path}`);
  assert.equal(new URL(response.url).protocol, 'https:');
  for (const [name, expected] of Object.entries(hostingHeaders)) {
    const actual = response.headers.get(name);
    assert.ok(actual, `${name} ausente em ${route.path}`);
    if (name === 'Content-Security-Policy') {
      for (const directive of ["script-src 'self'", "object-src 'none'", "frame-ancestors 'none'"]) assert.ok(actual.includes(directive), `${directive} ausente em ${route.path}`);
      assert.doesNotMatch(actual, /script-src[^;]*(?:'unsafe-inline'|'unsafe-eval'|data:)/, `Scripts inseguros na CSP de ${route.path}`);
    } else assert.equal(actual, expected, `${name} incorreto em ${route.path}`);
  }
  assert.match(await response.text(), /<meta name="robots" content="index, follow"/);
}
console.log('HTTPS e cabeçalhos verificados nas 12 URLs publicadas.');
if (process.argv.includes('--require-hsts')) {
  const response = await fetch(origin + '/', { signal: AbortSignal.timeout(10000) });
  assert.match(response.headers.get('strict-transport-security') || '', /(?:^|;)\s*max-age=[1-9]\d*/i);
  console.log('HSTS verificado na URL publicada.');
} else console.log('HSTS ainda requer confirmação de HTTPS e configuração pela hospedagem.');
