import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.mjs';
import { privacy, terms } from '../src/legal.mjs';
import { publicationIssues } from '../scripts/publication.mjs';

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
