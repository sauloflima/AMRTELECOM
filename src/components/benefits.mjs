import { icon, action } from './shared.mjs';
export function routines() {
  return `<section class="section routines"><div class="container"><p class="eyebrow">DO SEU JEITO</p><h2>Internet para os diferentes<br>momentos da casa.</h2><div class="routine-grid"><article class="routine home-routine"><span class="routine-number">01</span>${icon('home')}<div><p class="eyebrow">CASA E FAMÍLIA</p><h3>Uma casa.<br>Muitas conexões.</h3><p>Para assistir, conversar e estudar, mesmo quando mais de uma pessoa está conectada.</p><a href="/planos.html" class="text-link">Encontrar meu plano ${icon('arrow')}</a></div></article><article class="routine work-routine"><span class="routine-number">02</span>${icon('work')}<div><p class="eyebrow">TRABALHO E ESTUDO</p><h3>Espaço para<br>se concentrar.</h3><p>Videochamadas, aulas e arquivos pedem uma velocidade adequada à sua rotina.</p><a href="/planos.html" class="text-link">Comparar velocidades ${icon('arrow')}</a></div></article><article class="routine game-routine"><span class="routine-number">03</span>${icon('game')}<div><p class="eyebrow">JOGOS E ENTRETENIMENTO</p><h3>Seu tempo livre.<br>Bem conectado.</h3><p>Para filmes e jogos, compare os planos. Nos jogos, usar cabo pode ajudar na estabilidade.</p><a href="/planos.html" class="text-link">Ver opções ${icon('arrow')}</a></div></article></div></div></section>`;
}
export function wifi() {
  return `<section class="section wifi-section"><div class="container wifi-layout"><div><p class="eyebrow">CADA AMBIENTE CONTA</p><h2>Entenda o alcance<br>do seu Wi-Fi.</h2><p>Paredes, distância e posição do roteador podem mudar o sinal em cada cômodo. Fale com a equipe para avaliar seu ambiente e as opções disponíveis.</p>${action('Avaliar meu Wi-Fi','wifi')}</div><div class="wifi-factors"><h3>O que influencia o sinal?</h3>${[['home','Tamanho do imóvel e paredes'],['wifi','Distância e posição do roteador'],['work','Equipamento e aparelhos conectados']].map(([i,t],n)=>`<div><span class="factor-number">0${n+1}</span>${icon(i)}<span>${t}</span></div>`).join('')}<p class="small">O alcance varia de um imóvel para outro. A equipe pode orientar você após conhecer o local.</p></div></div></section>`;
}

export function business() {
  const solutions = [
    ['fiber', 'Internet em fibra óptica', 'Uma conexão para acompanhar a rotina do escritório, da loja ou da sua equipe. Consulte a disponibilidade para o seu endereço.', 'fibra', 'Técnico conectando uma fibra óptica em um escritório'],
    ['wifi', 'Conexão no ambiente', 'Converse com a equipe sobre o espaço, os equipamentos e a forma como as pessoas usam a rede no dia a dia.', 'ambiente', 'Equipe de um pequeno negócio usando a internet no trabalho'],
    ['headset', 'Suporte com gente de verdade', 'Quando precisar de orientação técnica, fale com a equipe da AMR pelo canal oficial de atendimento.', 'suporte', 'Profissional de suporte orientando uma cliente diante do computador'],
  ];
  return `<section class="company-page">
    <div class="company-hero"><div class="container company-hero-inner"><div>
      <p class="eyebrow">AMR PARA EMPRESAS</p><h2>Conexão para o seu negócio seguir em movimento.</h2>
      <p class="company-lead">Cada operação tem uma rotina. Conte à AMR como a sua empresa trabalha para avaliarmos a conexão disponível e a melhor forma de atender você.</p>
      <div class="company-actions">${action('Conversar sobre minha empresa','business','','button primary')}<a href="/cobertura.html">Consultar cobertura ${icon('arrow')}</a></div>
    </div><div class="company-hero-media"><img src="/assets/generated/amr-empresas-equipe.jpg" alt="Equipe de uma empresa trabalhando em conjunto com computadores" width="1586" height="992" fetchpriority="high" decoding="async"><span>AMR para empresas</span></div></div></div>
    <div class="container company-solutions"><div class="company-section-heading"><p class="eyebrow">PRODUTOS E SERVIÇOS</p><h2>Soluções para a rotina da sua empresa.</h2><p>Conectividade e atendimento próximos do seu negócio, com opções avaliadas pela equipe.</p></div>
      <div class="company-solution-grid">${solutions.map(([symbol, title, description, photo, alt]) => `<article><img src="/assets/generated/amr-empresas-${photo}.jpg" alt="${alt}" width="1586" height="992" loading="lazy" decoding="async"><div class="company-solution-body"><span class="company-solution-icon">${icon(symbol)}</span><h3>${title}</h3><p>${description}</p></div></article>`).join('')}</div>
      <div class="company-solutions-action">${action('Conversar sobre as soluções','business','','button primary')}<span>Disponibilidade e condições confirmadas pela equipe.</span></div>
    </div>
    <div class="company-approach"><div class="container"><div class="company-section-heading"><p class="eyebrow">O JEITO AMR</p><h2>Da conversa à indicação, com clareza.</h2></div><ol><li><span>01</span><h3>Entendemos sua rotina</h3><p>Conte como sua equipe usa a internet no trabalho.</p></li><li><span>02</span><h3>Conferimos seu endereço</h3><p>A disponibilidade é avaliada para o local da empresa.</p></li><li><span>03</span><h3>Orientamos a escolha</h3><p>A equipe conversa sobre as opções e condições aplicáveis.</p></li></ol></div></div>
    <div class="company-story"><div class="container company-story-inner"><div class="company-story-copy"><p class="eyebrow">CONHEÇA A AMR</p><h2>Por trás da conexão, pessoas prontas para conversar.</h2><p>Vamos entender seu endereço, o perfil de uso e as necessidades da operação antes de apresentar uma opção para a sua empresa.</p>${action('Falar com a equipe','business','','button primary')}</div>
      <figure class="company-video-slot"><img src="/assets/generated/amr-empresa-card.jpg" alt="Prédio comercial iluminado com a marca AMR Telecom" width="1280" height="720" loading="lazy" decoding="async"><figcaption>Espaço reservado para o vídeo da AMR para empresas</figcaption></figure>
    </div></div>
  </section>`;
}
