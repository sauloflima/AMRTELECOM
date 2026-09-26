import test from 'node:test';
import assert from 'node:assert/strict';
import { validateQuickCoverage, quickCoverageMessage, whatsappUrl } from '../src/lib/whatsapp.mjs';
import { hero } from '../src/components/hero.mjs';

test('consulta rápida valida CEP e número ou referência sem afirmar cobertura', () => {
  assert.deepEqual(Object.keys(validateQuickCoverage({})), ['cep', 'reference']);
  for(const cep of ['123', '00000-000', '11111111', 'ABCDE-123', '123456789']) {
    assert.ok(validateQuickCoverage({cep,reference:'120'}).cep);
  }
  assert.deepEqual(validateQuickCoverage({cep:'50030-230',reference:'120'}),{});
  assert.deepEqual(validateQuickCoverage({cep:'50030230',reference:'Sem número, próximo à praça'}),{});
  assert.ok(validateQuickCoverage({cep:'50030230',reference:'   '}).reference);
  assert.ok(validateQuickCoverage({cep:'50030230',reference:'a'.repeat(161)}).reference);
});

test('WhatsApp preserva CEP e referência com acentos e caracteres especiais', () => {
  const text=quickCoverageMessage({cep:'50030230',reference:'  Casa B & portão #2  '});
  assert.ok(text.includes('CEP: 50030-230'));
  assert.ok(text.includes('Número ou referência: Casa B & portão #2'));
  assert.ok(text.includes('confirmar a disponibilidade'));
  const url=new URL(whatsappUrl(text,'5581912345678'));
  assert.equal(url.searchParams.get('text'),text);
  assert.equal(whatsappUrl(text,''),null);
});

test('formulário do hero permanece seguro sem inicialização do JavaScript', () => {
  const html=hero();
  assert.equal((html.match(/<input[^>]+disabled/g)||[]).length,2);
  assert.ok(html.includes('type="submit" disabled'));
  assert.ok(html.includes('id="quick-load-message"'));
  assert.ok(html.includes('aria-describedby="quick-cep-error"'));
  assert.ok(html.includes('aria-describedby="quick-reference-error"'));
});
