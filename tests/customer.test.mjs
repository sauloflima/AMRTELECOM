import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.mjs';
import { routes } from '../src/routes.mjs';
import { customerArea } from '../src/components/customer.mjs';
import { header, footer } from '../src/components/shared.mjs';
import { interiorPage, homeNavigation } from '../src/components/navigation.mjs';

test('Área do cliente substitui Benefícios e só ativa o acesso com um portal HTTPS',()=> {
  const original=config.customerPortalUrl;
  try {
    config.customerPortalUrl='';
    const page=interiorPage('/area-do-cliente.html',customerArea());
    assert.match(page,/<h1>/);
    assert.match(page,/disabled>Acesso em breve/);
    assert.doesNotMatch(page,/<input|<form/);
    assert.ok(!routes.some(route=>route.path==='/beneficios.html'));
    for(const html of [customerArea({home:true}),header(),footer(),homeNavigation()]) {
      assert.match(html,/href="\/area-do-cliente.html"/);
      assert.doesNotMatch(html,/beneficios\.html/);
    }
    config.customerPortalUrl='https://portal.example.com/cliente?a=1&b=2';
    assert.match(customerArea(),/href="https:\/\/portal\.example\.com\/cliente\?a=1&amp;b=2"/);
    assert.doesNotMatch(customerArea(),/disabled|Em preparação/);
    for(const invalid of ['javascript:alert(1)','http://portal.example.com','https://user:password@portal.example.com']) {
      config.customerPortalUrl=invalid;
      assert.throws(()=>customerArea());
    }
  } finally { config.customerPortalUrl=original; }
});
