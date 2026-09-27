// Navegador real com viewport/toque emulados; não substitui um aparelho iOS.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(path.join(process.env.AMR_PLAYWRIGHT_ROOT || process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel:'chrome', headless:true });
const origin = process.env.AMR_ORIGIN || 'http://127.0.0.1:4173';
const evidence = process.env.AMR_MOBILE_EVIDENCE || 'mobile-qa/after';
const samples = [], errors = [];
await mkdir(evidence, { recursive:true });
const mediaSelectors = ['.hero-house', '.enterprise-media', '.service-photo'];
const pauseEffects = page => page.locator('.effects-toggle').dispatchEvent('click');
async function newPage(width=390, height=844, options={}) {
  const page = await browser.newPage({ viewport:{width,height}, isMobile:width<=800, hasTouch:width<=800, ...options });
  page.on('pageerror', error => errors.push(error.message));
  return page;
}
async function snapshot(page, name) {
  await page.screenshot({path:path.join(evidence, name + '.png')});
}
async function visibleVideo(page, index) {
  const media = page.locator(mediaSelectors[index]);
  await media.scrollIntoViewIfNeeded();
  const video = media.locator('video');
  await page.waitForFunction(selector => {
    const video=document.querySelector(selector).querySelector('video');
    return !video.paused && video.currentTime > 0 && video.readyState >= 2;
  }, mediaSelectors[index]);
  return video;
}
try {
  for (const [width,height] of [[360,640],[390,844],[430,932],[768,1024],[1440,950],[390,400]]) {
    const page = await newPage(width,height);
    page.on('console', message => { if (message.type()==='error') errors.push(message.text()); });
    await page.goto(origin);
    await page.locator('.carousel-rotation').click();
    await page.waitForTimeout(600);
    await snapshot(page, `${width}x${height}-home`);
    for(let index=0;index<3;index++) {
      await page.locator(`[data-slide="${index}"]`).dispatchEvent('click');
      await page.evaluate(() => scrollTo({top:0,behavior:'instant'}));
      await page.waitForTimeout(80);
      const letter=page.locator('.carousel-slide.is-active .arrival-letter').first();
      if (index) {
        const start=await letter.evaluate(el => ({opacity:getComputedStyle(el).opacity,time:el.getAnimations()[0]?.currentTime}));
        await page.waitForTimeout(220);
        const end=await letter.evaluate(el => ({opacity:getComputedStyle(el).opacity,time:el.getAnimations()[0]?.currentTime}));
        assert.ok(end.time > start.time, `${width} slide ${index+1}: entrada progride com texto visível`);
        samples.push({width,height,slide:index+1,entry:{start,end}});
      }
      const video=await visibleVideo(page,index);
      const t0=await video.evaluate(v=>v.currentTime);
      await snapshot(page, `${width}x${height}-slide-${index+1}-a`);
      await page.waitForTimeout(500);
      const t1=await video.evaluate(v=>v.currentTime);
      await snapshot(page, `${width}x${height}-slide-${index+1}-b`);
      assert.ok(t1 > t0 || t0 > 7, 'Relógio do vídeo avança (ou completa um loop)');
      assert.equal(await video.evaluate(v=>v.muted && v.playsInline),true);
      assert.equal(await page.locator('.hero-frame video').evaluateAll(videos=>videos.filter(v=>!v.paused).length),1);
      await pauseEffects(page);
      await page.waitForTimeout(120);
      const pausedAt=await video.evaluate(v=>v.currentTime);
      await page.waitForTimeout(250);
      assert.equal(await video.evaluate(v=>v.currentTime),pausedAt);
      assert.equal(await video.evaluate(v=>v.paused),true);
      assert.equal(await page.locator('.hero-frame').evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0);
      await pauseEffects(page);
      await page.waitForTimeout(300);
      const resumedAt=await video.evaluate(v=>v.currentTime);
      assert.ok(resumedAt!==pausedAt);
      samples.push({width,height,slide:index+1,video:{t0,t1,pausedAt,resumedAt}});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
    }
    await page.locator('.routine-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('.hero-frame video').evaluateAll(videos=>videos.every(v=>v.paused)),true);
    assert.equal(await page.locator('.hero-proof .icon').first().evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
    // A ilustração mantém controle sobre os efeitos da marca.
    await page.locator('[data-office-motion]').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('[data-office-motion]').classList.contains('office-motion-active'));
    await page.locator('.office-motion-toggle').click();
    assert.equal(await page.locator('[data-office-motion]').evaluate(el=>el.classList.contains('office-motion-active')),false);
    await page.locator('.office-motion-toggle').click();
    await page.waitForFunction(()=>document.querySelector('[data-office-motion]').classList.contains('office-motion-active'));
    await page.close();
    console.log(`Aprovado: ${width}x${height}, três slides, vídeos, entrada, pausa/retomada, mídia fora da tela e efeitos da ilustração.`);
  }

  // Preferências iniciais e alteradas durante a reprodução.
  for(const mode of ['reduced','save-data']) {
    const page=await newPage(390,844,{reducedMotion:mode==='reduced'?'reduce':'no-preference'});
    if(mode==='save-data') await page.addInitScript(()=>{
      const connection=Object.assign(new EventTarget(),{saveData:true});
      Object.defineProperty(navigator,'connection',{value:connection});
    });
    await page.goto(origin);
    for(let index=0;index<3;index++) {
      await page.locator(`[data-slide="${index}"]`).dispatchEvent('click');
      await page.locator(mediaSelectors[index]).scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const media=page.locator(mediaSelectors[index]);
      assert.equal(await media.locator('video').evaluate(v=>v.paused && v.currentTime===0),true);
      assert.equal(await media.locator('img').evaluate(img=>getComputedStyle(img).visibility),'visible');
      assert.equal(await media.locator('.video-play').isVisible(),false);
      assert.equal(await page.locator('.carousel-slide.is-active .hero-copy').evaluate(el=>getComputedStyle(el).opacity),'1');
      if(index) assert.equal(await page.locator('.carousel-slide.is-active .arrival-letter').first().evaluate(el=>getComputedStyle(el).opacity),'1');
    }
    await snapshot(page, mode);
    if(mode==='reduced') await page.emulateMedia({reducedMotion:'no-preference'});
    else await page.evaluate(()=>{navigator.connection.saveData=false;navigator.connection.dispatchEvent(new Event('change'));});
    await visibleVideo(page,2);
    if(mode==='reduced') await page.emulateMedia({reducedMotion:'reduce'});
    else await page.evaluate(()=>{navigator.connection.saveData=true;navigator.connection.dispatchEvent(new Event('change'));});
    await page.waitForFunction(()=>document.querySelector('.service-photo').classList.contains('video-static'));
    assert.equal(await page.locator('.service-photo img').evaluate(img=>getComputedStyle(img).visibility),'visible','Poster retorna mesmo após vídeo já ter tocado');
    assert.equal(await page.locator('[data-service-video]').evaluate(v=>v.paused),true);
    await page.close();console.log(`Aprovado: ${mode}, sem autoplay e sem texto invisível; preferência alterada em execução.`);
  }

  const page=await newPage();
  await page.addInitScript(()=>{
    const play=HTMLMediaElement.prototype.play;
    window.autoplayAttempts=0;
    HTMLMediaElement.prototype.play=function(){
      window.autoplayAttempts++;
      return window.allowVideo ? play.call(this) : Promise.reject(new DOMException('Bloqueio simulado','NotAllowedError'));
    };
  });
  await page.goto(origin);
  await page.locator('.carousel-rotation').click();
  for(let index=0;index<3;index++) {
    await page.evaluate(()=>{window.allowVideo=false;});
    await page.locator(`[data-slide="${index}"]`).dispatchEvent('click');
    await page.locator(mediaSelectors[index]).scrollIntoViewIfNeeded();
    const retry=page.locator(`${mediaSelectors[index]} .video-play`);
    await retry.waitFor({state:'visible'});
    assert.equal(await retry.getAttribute('type'),'button');
    assert.equal(await retry.evaluate(el=>!!el.closest('[aria-hidden="true"]')),false);
    assert.equal(await page.locator(`${mediaSelectors[index]} img`).evaluate(img=>getComputedStyle(img).visibility),'visible');
    const attempts=await page.evaluate(()=>window.autoplayAttempts);
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(()=>window.autoplayAttempts),attempts,'Sem repetição de play bloqueado');
    await snapshot(page, `autoplay-blocked-${index+1}`);
    await page.evaluate(()=>{window.allowVideo=true;});
    await retry.press('Enter');
    await visibleVideo(page,index);
    assert.equal(await retry.isVisible(),false);
  }
  // Toque horizontal navega; rolagem vertical não troca o slide.
  await page.locator('.hero-frame').dispatchEvent('pointerdown',{clientX:320,clientY:200,pointerType:'touch'});
  await page.locator('.hero-frame').dispatchEvent('pointerup',{clientX:100,clientY:205,pointerType:'touch'});
  assert.equal(await page.locator('[data-carousel]').getAttribute('data-active-slide'),'1');
  await page.locator('.hero-frame').dispatchEvent('pointerdown',{clientX:100,clientY:200,pointerType:'touch'});
  await page.locator('.hero-frame').dispatchEvent('pointerup',{clientX:102,clientY:350,pointerType:'touch'});
  assert.equal(await page.locator('[data-carousel]').getAttribute('data-active-slide'),'1');
  await page.close();
  console.log('Aprovado: bloqueio simulado de autoplay, posters, recuperação por teclado nos três slides e gestos de toque.');

  const failed=await newPage();
  await failed.route('**/*.mp4', route=>route.fulfill({status:404,body:''}));
  await failed.goto(origin);
  await failed.locator('.carousel-rotation').click();
  for(let index=0;index<3;index++) {
    await failed.locator(`[data-slide="${index}"]`).dispatchEvent('click');
    const media=failed.locator(mediaSelectors[index]);
    await media.scrollIntoViewIfNeeded();
    await failed.waitForFunction(selector=>document.querySelector(selector).classList.contains('video-failed'),mediaSelectors[index]);
    assert.equal(await media.locator('img').evaluate(img=>getComputedStyle(img).visibility),'visible');
  }
  await snapshot(failed,'media-failed');await failed.close();
  assert.deepEqual(errors,[]);
  await writeFile(path.join(evidence,'animation-measurements.json'),JSON.stringify({browser:await browser.version(),samples,errors},null,2));
  console.log('Aprovado: falha simulada de mídia. Nenhum erro inesperado de JavaScript ou console.');
} finally { await browser.close(); }
