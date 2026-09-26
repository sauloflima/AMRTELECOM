import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.mjs';
import { selectedPlan, coverageMessage, whatsappUrl, messageFor } from '../src/lib/whatsapp.mjs';
import { plans } from '../src/components/plans.mjs';
import { contactPage, coverage } from '../src/components/contact.mjs';

const values = { name: 'Pessoa de teste', city: 'Cidade de teste', neighborhood: 'Bairro de teste', street: 'Rua de teste' };

test('plano escolhido acompanha a consulta com preço vindo do catálogo', () => {
  for (const plan of config.plans) {
    assert.ok(plans().includes(`/cobertura.html?plano=${plan.id}`));
    assert.equal(selectedPlan(plan.id), plan);
    const text = coverageMessage(values, plan.id);
    assert.ok(text.includes(messageFor('plan', plan.id)));
    for (const value of Object.values(values)) assert.ok(text.includes(value));
    assert.equal(new URL(whatsappUrl(text, '5581912345678')).searchParams.get('text'), text);
  }
});

test('parâmetros desconhecidos não criam planos, preços ou conteúdo na consulta', () => {
  for (const id of [null, '', '999', '<script>alert(1)</script>', '500&price=1']) {
    assert.equal(selectedPlan(id), null);
    assert.equal(coverageMessage(values, id), coverageMessage(values));
  }
});

test('link de telefone mantém DDD e dígitos quando o contato é configurado', () => {
  const previous = config.contact.phone;
  try {
    config.contact.phone = '+55 (81) 3333-4444';
    assert.ok(contactPage().includes('href="tel:+558133334444"'));
  } finally {
    config.contact.phone = previous;
  }
});

test('aviso de indisponibilidade antecede os campos e desaparece com canal válido', () => {
  const previous = config.contact.whatsapp;
  try {
    config.contact.whatsapp = '';
    const html = coverage();
    assert.ok(html.indexOf('class="availability-note"') < html.indexOf('class="form-grid"'));
    assert.ok(html.includes('Preparar consulta'));
    assert.equal((html.match(/<input[^>]+disabled/g) || []).length, 4);
    config.contact.whatsapp = '5581912345678';
    assert.ok(!coverage().includes('class="availability-note"'));
    assert.ok(coverage().includes('Abrir consulta no WhatsApp'));
  } finally {
    config.contact.whatsapp = previous;
  }
});
