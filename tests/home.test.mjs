import test from 'node:test';
import assert from 'node:assert/strict';
import { testimonials, homeProfiles, homeBusiness, homeSupport, homeFaq, pendingStories } from '../src/components/home-sections.mjs';
import { plans } from '../src/components/plans.mjs';
import { config } from '../src/config.mjs';
import { hero } from '../src/components/hero.mjs';
import { coverage } from '../src/components/contact.mjs';
import { WhatsAppAssistant } from '../src/components/support-assistant.mjs';
import { footer } from '../src/components/shared.mjs';

test('artes comerciais confirmadas alimentam contatos, localidades e destaque',()=>{
  assert.equal(config.commercialConfirmed,true);
  assert.deepEqual(config.coverage.cities,['Gravatá (PE)','Amaraji (PE)']);
  assert.equal(config.social.instagram,'https://www.instagram.com/amrtelecomltda/');
  assert.equal(config.mostChosenPlanId,'');
  assert.ok(coverage().includes('Cidades para consulta: Gravatá (PE), Amaraji (PE).'));
  assert.ok(footer().includes('>@amrtelecomltda</strong>'));
  assert.ok(footer().includes('(81) 99346-7014'));
  assert.ok(!plans().includes('Valor em confirmação'));
});

test('prova social vazia ou não aprovada nunca é publicada',()=>{
  assert.equal(testimonials(), '');
  assert.equal(testimonials([{name:'Teste',quote:'Não publicar',approved:false}]),'');
  assert.equal(testimonials([{name:'',quote:'Sem autor',approved:true}]),'');
  const sample=testimonials([{name:'Autor <teste>',quote:'Texto <script> & teste',approved:true}]);
  assert.ok(sample.includes('Autor &lt;teste&gt;'));
  assert.ok(sample.includes('Texto &lt;script&gt; &amp; teste'));
  assert.ok(!sample.includes('<script>'));
});

test('rascunho de histórias permanece inerte até receber depoimento real aprovado',()=>{
  assert.match(pendingStories(),/^<template id="customer-stories-pending">/);
  assert.match(pendingStories([{name:'Teste',quote:'Não publicar',approved:false}]),/<template/);
  assert.match(pendingStories([{name:42,quote:'Inválido',approved:true}]),/<template/);
  assert.equal(pendingStories([{name:'Autor de teste',quote:'Texto de teste',approved:true}]),'');
});

test('novo bloco humano separa suporte da consulta comercial',()=>{
  const html=homeSupport();
  assert.match(html,/data-whatsapp="support"/);
  assert.match(html,/href="\/suporte.html"/);
  assert.match(html,/href="\/cobertura.html"/);
  assert.ok(html.includes('wa.me/5581993467014'));
});

test('planos preservam preços, detalhes nativos e contato direto',()=>{
  assert.deepEqual(config.plans.map(p=>[p.speed,p.price]),[[200,65],[500,80],[700,100]]);
  const html=plans({home:true});
  assert.equal((html.match(/<details/g)||[]).length,4);
  assert.equal((html.match(/Selecionar plano de/g)||[]).length,3);
  assert.equal((html.match(/data-whatsapp="plan"/g)||[]).length,3);
  assert.equal((html.match(/class="plan-badge"/g)||[]).length,1);
  assert.ok(html.includes('Para uso intenso'));
  assert.ok(!html.includes('Mais escolhido'));
  assert.ok(!html.includes('<span>01</span>'));
});

test('rotina e empresas usam mídias próprias e não usam referência Nio',()=>{
  const html=homeProfiles()+homeBusiness();
  assert.match(html,/\broutine-grid\b/);
  assert.match(html,/amr-perfil-familia\.jpg/);
  assert.match(html,/amr-perfil-trabalho\.jpg/);
  assert.match(html,/amr-perfil-entretenimento\.jpg/);
  assert.match(html,/poster="\/assets\/generated\/amr-escritorio-conectado-poster\.jpg"/);
  assert.match(html,/class="business-video-fallback" src="\/assets\/generated\/amr-escritorio-conectado-poster\.jpg"/);
  assert.match(html,/class="business-video"[^>]*muted loop playsinline preload="none"/);
  assert.match(html,/<source src="\/assets\/videos\/amr-empresas\.mp4" type="video\/mp4">/);
  assert.ok(html.includes('href="/empresas.html"'));
  assert.ok(html.includes('href="/solucoes.html"'));
  assert.ok(!html.includes('/assets/references/'));
  assert.doesNotMatch(html, /[\u2012-\u2015]/u);
});

test('primeiro slide usa vídeo da casa com poster e fallback compatível',()=>{
  const html=hero();
  assert.match(html,/class="hero-house-video"[^>]*muted loop playsinline preload="none"/);
  assert.match(html,/poster="\/assets\/generated\/amr-casa-fibra-3d\.png"/);
  assert.match(html,/hero-amr-integrado-corrigido\.mp4/);
  assert.match(html,/class="hero-house-fallback"/);
});

test('slide empresarial usa vídeo com marca no fechamento e oferece consulta sem preços',()=>{
  const slide=hero().match(/<article class="carousel-slide hero-slide hero-slide-enterprise"[\s\S]*?<\/article>/)[0];
  assert.match(slide,/amr-empresa-hero\.mp4/);
  assert.match(slide,/amr-empresa-hero-poster\.jpg/);
  assert.match(slide,/data-whatsapp="business"/);
  assert.match(slide,/Conversar sobre minha empresa/);
  assert.match(slide,/Suporte técnico para empresas, com gente de verdade/);
  assert.doesNotMatch(slide,/R\$|speed-price|200 Mega|500 Mega|700 Mega/);
});

test('FAQ essencial antecede a página completa sem inventar condições',()=>{
  const html=homeFaq();
  assert.equal((html.match(/<details>/g)||[]).length,4);
  assert.match(html,/href="\/perguntas\.html"/);
  assert.match(html,/confirma a disponibilidade/);
  assert.doesNotMatch(html, /[\u2012-\u2015]/u);
});

test('assistente humano aponta ao WhatsApp oficial confirmado',()=>{
  assert.equal(config.contact.whatsapp,'5581993467014');
  assert.ok(WhatsAppAssistant().includes('wa.me/5581993467014'));
  assert.ok(WhatsAppAssistant().includes(encodeURIComponent(config.messages.assistant)));
  const original=config.contact.whatsapp;
  try { config.contact.whatsapp=''; assert.equal(WhatsAppAssistant(),''); }
  finally { config.contact.whatsapp=original; }
});


test('explicações de planos conectam catálogo, rodapé e consulta',()=>{
  for(const plan of config.plans) {
    const target=`/planos.html#explicar-${plan.id}`;
    assert.ok(footer().includes(`href="${target}"`));
    assert.ok(plans().includes(`id="explicar-${plan.id}"`));
    for(const [,example] of plan.profile.examples) assert.ok(plans().includes(example));
    assert.ok(coverage().includes(`data-plan-profile="${plan.id}"`));
  }
  for(const home of [true,false]) assert.equal((plans({home}).match(/<details name="plan-details"/g)||[]).length,config.plans.length+1);
  assert.ok(plans().includes('mais Mega não garante menor ping'));
  assert.ok(!hero().includes('>Ver plano'));
});


test('catálogo inclui empresa sem preço e com contato comercial em ambas as páginas',()=> {
  for(const home of [true,false]) {
    const html=plans({home});
    assert.equal((html.match(/<article class="plan-card/g)||[]).length,4);
    const enterprise=html.match(/<article class="plan-card plan-enterprise"[\s\S]*?<\/article>/)[0];
    assert.doesNotMatch(enterprise,/R\$|plan-price|cobertura.html\?plano=/);
    assert.match(enterprise,/data-whatsapp="business"/);
    assert.match(enterprise,/Suporte técnico empresarial/);
    assert.match(enterprise,/wa.me\/5581993467014/);
    assert.match(enterprise,/href="\/empresas.html"/);
    assert.match(enterprise,/name="plan-details"/);
  }
});
