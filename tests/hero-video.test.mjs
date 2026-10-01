import test from 'node:test';
import assert from 'node:assert/strict';
import { createHeroVideo } from '../src/lib/hero-video.mjs';
import { hero } from '../src/components/hero.mjs';
import { mountMedia } from '../src/client/media.mjs';

const active = { paused:false, reduced:false, saveData:false, hidden:false, inView:true, active:true };
function fixture() {
  const listeners = {};
  const classes = new Set();
  let retryClick;
  const retry = { addEventListener: (name,fn) => { retryClick=fn; } };
  const art = { append() {},classList:{add:n=>classes.add(n),remove:n=>classes.delete(n),toggle:(n,on)=>on?classes.add(n):classes.delete(n)} };
  let resolve, reject;
  const video = {
    paused:true, plays:0,
    ownerDocument:{createElement:()=>retry},
    querySelector:()=>({addEventListener:(name,fn)=>{listeners['source-error']=fn;}}),
    addEventListener:(name,fn)=>{listeners[name]=fn;},
    pause() { this.paused=true; },
    play() { this.plays++; return new Promise((yes,no)=>{resolve=()=>{this.paused=false;yes();};reject=no;}); }
  };
  return { video,art,classes,retry,click:()=>retryClick(),update:createHeroVideo(video,art),emit:n=>listeners[n](),resolve:()=>resolve(),reject:(name='NotAllowedError')=>reject(Object.assign(new Error('Autoplay blocked'),{name})) };
}
const flush = () => new Promise(resolve=>setImmediate(resolve));

test('HTML do hero aponta para o MP4 da casa e poster sem autoplay nativo',()=>{
  const html=hero();
  assert.match(html,/<video class="hero-house-video"[^>]*muted loop playsinline preload="none"/);
  assert.match(html,/<source src="\/assets\/videos\/hero-amr-integrado-corrigido\.mp4" type="video\/mp4">/);
  assert.doesNotMatch(html,/<source data-src=/);
  assert.match(html,/fetchpriority="high"/);
});

test('movimento reduzido, economia, pausa, aba oculta e slide invisível impedem reprodução',()=>{
  for (const change of [{reduced:true},{saveData:true},{paused:true},{hidden:true},{inView:false},{active:false}]) {
    const f=fixture();f.update({...active,...change});
    assert.equal(f.video.plays,0);
  }
});

test('evita play concorrente e só revela o primeiro quadro',async()=>{
  const f=fixture();f.update(active);f.update(active);
  assert.equal(f.video.plays,1);
  assert.equal(f.classes.has('video-ready'),false);
  f.resolve();await flush();f.emit('playing');assert.ok(f.classes.has('video-ready'));
  f.update({...active,paused:true});assert.ok(f.video.paused);
  f.update(active);assert.equal(f.video.plays,2);
});

test('pausa prevalece quando play resolve depois da troca de preferência ou de slide',async()=>{
  for(const change of [{paused:true},{reduced:true},{saveData:true},{hidden:true},{active:false},{inView:false}]) {
    const f=fixture();f.update(active);f.update({...active,...change});f.resolve();await flush();f.emit('playing');
    assert.ok(f.video.paused);assert.equal(f.classes.has('video-ready'),false);
  }
});

test('autoplay bloqueado mantém imagem e só tenta novamente por ação acessível',async()=>{
  const f=fixture();f.update(active);f.reject();await flush();
  assert.equal(f.classes.has('video-ready'),false);
  assert.equal(f.retry.hidden,false);
  f.update(active);assert.equal(f.video.plays,1);
  f.update({...active,inView:false});assert.equal(f.retry.hidden,true);
  f.update(active);f.click();assert.equal(f.video.plays,2);
  f.resolve();await flush();f.emit('playing');assert.equal(f.retry.hidden,true);
  f.update({...active,saveData:true});assert.ok(f.video.paused);assert.ok(f.classes.has('video-static'));
});

test('aborto causado por pausa permite retomar após a atualização de visibilidade',async()=>{
  const f=fixture();f.update(active);f.update({...active,inView:false});f.update(active);
  f.reject('AbortError');await flush();assert.equal(f.video.plays,2);
  f.resolve();await flush();f.emit('playing');assert.ok(f.classes.has('video-ready'));
});

test('falha de mídia conserva fallback e impede tentativas em loop',()=>{
  for(const event of ['error','source-error']) {
    const f=fixture();f.update(active);
    f.emit(event);
    f.update(active);assert.ok(f.classes.has('video-failed'));assert.ok(f.video.paused);assert.equal(f.video.plays,1);assert.equal(f.retry.hidden,true);
  }
});

test('cena empresarial respeita movimento reduzido, segura o final e reinicia ao voltar',async()=>{
  const f=fixture();
  let activeSlide=false, slideChanged, preferenceChanged;
  const motion={matches:true,addEventListener:(_,fn)=>{preferenceChanged=fn;}};
  const slide={classList:{contains:()=>activeSlide}};
  f.art.querySelector=()=>f.video;
  f.art.closest=()=>slide;
  f.video.currentTime=0;f.video.ended=false;
  const toggle={addEventListener(){},setAttribute(){}};
  const house={addEventListener(){},style:{setProperty(){}}};
  const root={querySelector:selector=>({'.hero-house':house,'.enterprise-media':f.art,'.effects-toggle':toggle}[selector]||null),classList:{toggle(){}}};
  const overrides={
    document:{hidden:false,querySelector:selector=>selector==='.home-hero'?root:null,addEventListener(){}},
    window:{},navigator:{},cancelAnimationFrame(){},
    matchMedia:query=>query.includes('prefers-reduced-motion')?motion:{matches:true,addEventListener(){}},
    MutationObserver:class { constructor(fn){slideChanged=fn;} observe(){} }
  };
  const before=Object.fromEntries(Object.keys(overrides).map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  try {
    for(const [key,value] of Object.entries(overrides))Object.defineProperty(globalThis,key,{value,configurable:true});
    mountMedia();
    assert.equal(f.video.plays,0);
    activeSlide=true;slideChanged();
    assert.equal(f.video.plays,0);
    assert.ok(f.classes.has('video-static'));
    motion.matches=false;preferenceChanged();
    assert.equal(f.video.plays,1);
    f.resolve();await flush();f.emit('playing');
    f.video.currentTime=7.25;f.video.ended=true;f.video.paused=true;
    f.emit('ended');preferenceChanged();
    assert.equal(f.video.plays,1);
    assert.ok(f.classes.has('video-ready'));
    activeSlide=false;slideChanged();
    activeSlide=true;f.video.ended=false;slideChanged();
    assert.equal(f.video.currentTime,0);
    assert.equal(f.video.plays,2);
    f.resolve();await flush();
    motion.matches=true;preferenceChanged();
    assert.ok(f.video.paused);assert.ok(f.classes.has('video-static'));
  } finally {
    for(const [key,descriptor] of Object.entries(before)) {
      if(descriptor)Object.defineProperty(globalThis,key,descriptor);
      else delete globalThis[key];
    }
  }
});
