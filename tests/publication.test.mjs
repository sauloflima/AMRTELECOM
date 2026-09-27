import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.mjs';
import { privacy, terms } from '../src/legal.mjs';
import { publicationIssues, withPagesBase } from '../scripts/publication.mjs';

test('indexação exige domínio HTTPS e aprovações separadas dos textos e do comercial', () => {
  assert.equal(publicationIssues(config, privacy, terms).length, 4);
  const approved = { ...config, siteUrl: 'https://amr-provedor.com.br', publicationApprovals: { commercial: 'registro comercial', privacy: 'registro privacidade', terms: 'registro termos' } };
  assert.equal(publicationIssues(approved, privacy, terms).length, 2);
  const reviewedPrivacy = privacy.replace('PENDENTE DE REVISÃO', 'REVISADO');
  const reviewedTerms = terms.replace('PENDENTE DE REVISÃO', 'REVISADO');
  assert.deepEqual(publicationIssues(approved, reviewedPrivacy, reviewedTerms), []);
  assert.ok(publicationIssues({ ...approved, commercialConfirmed: false }, reviewedPrivacy, reviewedTerms).length);
  assert.ok(publicationIssues({ ...approved, siteUrl: 'http://amr.example.org' }, reviewedPrivacy, reviewedTerms).length);
  assert.ok(publicationIssues({ ...approved, siteUrl: 'https://localhost' }, reviewedPrivacy, reviewedTerms).length);
});

test('preparação do Pages é idempotente e preserva URLs externas, hashes e imports relativos', () => {
  const source = '<a href="/">Início</a><a href="/planos.html?plano=500#explicar-500">Plano</a>' +
    '<a href="https://wa.me/5581993467014">Contato</a><img src="//cdn.example/image.png">' +
    '<a href="#conteudo">Pular</a> import "./lib/whatsapp.mjs"; url(\'/assets/logo.png\')';
  const prepared = withPagesBase(source);
  assert.ok(prepared.includes('href="/AMRTELECOM/"'));
  assert.ok(prepared.includes('/AMRTELECOM/planos.html?plano=500#explicar-500'));
  assert.ok(prepared.includes("url('/AMRTELECOM/assets/logo.png')"));
  for (const url of ['https://wa.me/5581993467014', '//cdn.example/image.png', '#conteudo', './lib/whatsapp.mjs']) assert.ok(prepared.includes(url));
  assert.equal(withPagesBase(prepared), prepared);
  assert.equal(withPagesBase('`/AMRTELECOM/planos.html#explicar-${id}`'), '`/AMRTELECOM/planos.html#explicar-${id}`');
});
