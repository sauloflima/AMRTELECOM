import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { config } from '../src/config.mjs';
import { organizationJson, serializeOrganization } from '../scripts/seo.mjs';
import { contentSecurityPolicy, hostingHeaders } from '../scripts/security.mjs';

test('schema identifica a AMR sem inventar endereço, horário, avaliação ou oferta', () => {
  const schema = JSON.parse(organizationJson);
  assert.equal(schema['@type'], 'Organization');
  assert.equal(schema.name, config.brand.name);
  assert.equal(schema.url, config.siteUrl);
  assert.equal(schema.logo, new URL(config.brand.logo, config.siteUrl).href);
  assert.equal(schema.contactPoint.telephone, `+${config.contact.whatsapp}`);
  assert.deepEqual(schema.sameAs, [config.social.instagram]);
  for (const field of ['address', 'openingHours', 'aggregateRating', 'offers', 'areaServed']) assert.ok(!(field in schema));
});

test('schema omite domínio e contato não configurados e impede encerramento da tag script', () => {
  for (const siteUrl of ['', 'invalido', 'http://example.com/', 'https://user:password@example.com/']) {
    const json = serializeOrganization({ ...config, siteUrl, brand: { ...config.brand, name: '</script><script>alert(1)</script>' }, contact: { whatsapp: '' }, social: { instagram: '' } });
    assert.ok(!json.includes('<'));
    const schema = JSON.parse(json);
    assert.equal(schema.name, '</script><script>alert(1)</script>');
    assert.ok(!('url' in schema));
    assert.ok(!('logo' in schema));
    assert.ok(!('contactPoint' in schema));
    assert.deepEqual(schema.sameAs, []);
  }
});

test('CSP libera somente o hash exato do JSON-LD sem permitir scripts inline arbitrários', () => {
  const hash = createHash('sha256').update(organizationJson).digest('base64');
  assert.ok(contentSecurityPolicy.includes(`script-src 'self' 'sha256-${hash}';`));
  assert.equal(hostingHeaders['Content-Security-Policy'], `${contentSecurityPolicy}; frame-ancestors 'none'`);
  assert.doesNotMatch(contentSecurityPolicy, /unsafe-inline|unsafe-eval/);
});
