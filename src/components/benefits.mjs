import { icon, action } from './shared.mjs';
export function routines() {
  return `<section class="section routines"><div class="container"><p class="eyebrow">DO SEU JEITO</p><h2>Internet para os diferentes<br>momentos da casa.</h2><div class="routine-grid"><article class="routine home-routine"><span class="routine-number">01</span>${icon('home')}<div><p class="eyebrow">CASA E FAMÍLIA</p><h3>Uma casa.<br>Muitas conexões.</h3><p>Para assistir, conversar e estudar, mesmo quando mais de uma pessoa está conectada.</p><a href="/planos.html" class="text-link">Encontrar meu plano ${icon('arrow')}</a></div></article><article class="routine work-routine"><span class="routine-number">02</span>${icon('work')}<div><p class="eyebrow">TRABALHO E ESTUDO</p><h3>Espaço para<br>se concentrar.</h3><p>Videochamadas, aulas e arquivos pedem uma velocidade adequada à sua rotina.</p><a href="/planos.html" class="text-link">Comparar velocidades ${icon('arrow')}</a></div></article><article class="routine game-routine"><span class="routine-number">03</span>${icon('game')}<div><p class="eyebrow">JOGOS E ENTRETENIMENTO</p><h3>Seu tempo livre.<br>Bem conectado.</h3><p>Para filmes e jogos, compare os planos. Nos jogos, usar cabo pode ajudar na estabilidade.</p><a href="/planos.html" class="text-link">Ver opções ${icon('arrow')}</a></div></article></div></div></section>`;
}
export function wifi() {
  return `<section class="section wifi-section"><div class="container wifi-layout"><div><p class="eyebrow">CADA AMBIENTE CONTA</p><h2>Entenda o alcance<br>do seu Wi-Fi.</h2><p>Paredes, distância e posição do roteador podem mudar o sinal em cada cômodo. Fale com a equipe para avaliar seu ambiente e as opções disponíveis.</p>${action('Avaliar meu Wi-Fi','wifi')}</div><div class="wifi-factors"><h3>O que influencia o sinal?</h3>${[['home','Tamanho do imóvel e paredes'],['wifi','Distância e posição do roteador'],['work','Equipamento e aparelhos conectados']].map(([i,t],n)=>`<div><span class="factor-number">0${n+1}</span>${icon(i)}<span>${t}</span></div>`).join('')}<p class="small">O alcance varia de um imóvel para outro. A equipe pode orientar você após conhecer o local.</p></div></div></section>`;
}

const enterpriseOfferings = {
  cloud: {
    title: 'Cloud', image: 'cloud', alt: 'Corredor de servidores em ambiente de datacenter',
    summary: 'Infraestrutura em nuvem para aplicações, dados e continuidade da operação.',
    intro: 'Ambientes em nuvem exigem decisões sobre capacidade, acesso, proteção dos dados e recuperação. A AMR avalia o cenário técnico da sua empresa para definir uma proposta adequada.',
    topics: [
      ['Capacidade da carga', 'Processamento, memória, armazenamento e padrão de leitura e escrita são avaliados junto ao crescimento previsto. Esse perfil orienta o dimensionamento de cada aplicação.'],
      ['Backup e recuperação', 'RPO indica a perda máxima de dados tolerável; RTO, o tempo desejado para retomar a operação. Esses objetivos orientam periodicidade, retenção e testes de restauração.'],
      ['Acesso e conectividade', 'Mapeamos usuários, origem do tráfego, autenticação e dependência do link entre escritório e nuvem. A latência pode ser decisiva para sistemas sensíveis.'],
      ['Operação e responsabilidades', 'Monitoramento, atualizações, gestão dos acessos e resposta a incidentes precisam ter responsáveis definidos no escopo da proposta.'],
    ],
    inputs: 'Tenha em mãos os sistemas utilizados, volume aproximado de dados, número de usuários e requisitos de recuperação.'
  },
  ti: {
    title: 'Outsourcing de TI', image: 'ti', alt: 'Especialista de TI avaliando equipamentos de rede com um notebook',
    summary: 'Apoio técnico para organizar, acompanhar e sustentar a infraestrutura de TI.',
    intro: 'O suporte de TI funciona melhor quando há clareza sobre o ambiente, os responsáveis e as prioridades. A AMR conversa com sua equipe para delimitar o escopo de acompanhamento técnico.',
    topics: [
      ['Inventário e dependências', 'Estações, servidores, ativos de rede e sistemas são mapeados com suas relações. Assim, uma falha pode ser priorizada pelo impacto real na operação.'],
      ['Incidentes e solicitações', 'Separamos falhas que interrompem o serviço de pedidos de acesso, configuração ou mudança. Categorias, prioridades e escalonamento são definidos na proposta.'],
      ['Monitoramento', 'Avaliamos quais indicadores e alertas fazem sentido para os ativos críticos, como disponibilidade, capacidade e eventos recorrentes.'],
      ['Mudanças e documentação', 'Atualizações, registros de configuração e histórico de intervenções ajudam a reduzir retrabalho e tornam o ambiente mais previsível.'],
    ],
    inputs: 'Compartilhe o tamanho da equipe, os principais sistemas e os desafios recorrentes do ambiente.'
  },
  seguranca: {
    title: 'Cibersegurança', image: 'seguranca', alt: 'Profissional analisando painéis de segurança digital em computadores',
    summary: 'Avaliação de riscos, acessos e proteção dos ativos digitais da empresa.',
    intro: 'Proteger a operação começa por entender seus ativos, acessos e pontos de exposição. A AMR avalia as necessidades da empresa e define, sob consulta, o escopo técnico aplicável.',
    topics: [
      ['Superfície de ataque', 'Inventariamos serviços expostos, dispositivos, aplicações e acessos remotos. A prioridade parte do impacto de cada ativo e da exposição observada.'],
      ['Identidade e permissões', 'Autenticação multifator, revisão de privilégios e separação de perfis limitam o alcance de uma conta comprometida.'],
      ['Rede e dispositivos', 'Avaliamos segmentação, regras de acesso e proteção de endpoints para reduzir movimento indevido entre sistemas e setores.'],
      ['Resposta e continuidade', 'Cópias restauráveis, responsáveis e procedimentos de contenção devem ser definidos antes de um incidente, conforme a criticidade dos sistemas.'],
    ],
    inputs: 'Informe quantidade de usuários e unidades, sistemas críticos e requisitos internos de segurança.'
  },
  conectividade: {
    title: 'Conectividade', image: 'conectividade', alt: 'Equipe trabalhando conectada em um escritório',
    summary: 'Rede empresarial planejada para os usuários, equipamentos e aplicações do negócio.',
    intro: 'A qualidade da conexão depende do endereço, da distribuição da rede e do perfil de tráfego. A AMR analisa esses fatores para indicar uma arquitetura e condições compatíveis com a operação.',
    topics: [
      ['Perfil de tráfego', 'Número de usuários, aplicações simultâneas, upload, download, latência e horários de pico ajudam a estimar a capacidade necessária.'],
      ['Acesso e topologia', 'A viabilidade da fibra no endereço e a distribuição física da rede orientam pontos de instalação, cabeamento e equipamentos.'],
      ['Wi-Fi no ambiente', 'Planta, paredes, interferências e densidade de dispositivos influenciam a posição e a quantidade de pontos de acesso.'],
      ['Segmentação e prioridade', 'Redes separadas para equipes e visitantes e políticas de QoS podem ser avaliadas quando aplicações críticas disputam a mesma conexão.'],
    ],
    inputs: 'Envie o endereço, quantidade de usuários, planta ou descrição dos ambientes e aplicações principais.'
  }
};

export function business() {
  const solutions = [
    ['fiber', 'Internet em fibra óptica', 'Avaliamos viabilidade no endereço, quantidade de usuários, aplicações e capacidade necessária para a operação.', 'fibra', 'Técnico conectando uma fibra óptica em um escritório'],
    ['wifi', 'Rede no ambiente', 'Cobertura Wi-Fi, pontos de acesso e distribuição do sinal precisam acompanhar a planta e a densidade de dispositivos.', 'ambiente', 'Equipe de um pequeno negócio usando a internet no trabalho'],
    ['headset', 'Suporte técnico humano', 'Para incidentes e dúvidas técnicas, fale com a equipe AMR pelo canal oficial de atendimento.', 'suporte', 'Profissional de suporte orientando uma cliente diante do computador'],
  ];
  return `<section class="company-page">
    <div class="company-hero"><div class="container company-hero-inner"><div>
      <p class="eyebrow">AMR PARA EMPRESAS</p><h2>Conexão para o seu negócio seguir em movimento.</h2>
      <p class="company-lead">Conectividade, infraestrutura e suporte técnico dimensionados a partir do seu ambiente. Conte à AMR sobre usuários, aplicações e requisitos da operação para avaliarmos uma solução.</p>
      <div class="company-actions">${action('Conversar sobre minha empresa','business','','button primary')}<a href="/cobertura.html">Consultar cobertura ${icon('arrow')}</a></div>
    </div><div class="company-hero-media"><img src="/assets/generated/amr-empresas-equipe.jpg" alt="Equipe de uma empresa trabalhando em conjunto com computadores" width="1586" height="992" fetchpriority="high" decoding="async"><span>AMR para empresas</span></div></div></div>
    <div class="container company-solutions"><div class="company-section-heading"><p class="eyebrow">PRODUTOS E SERVIÇOS</p><h2>Soluções para a rotina da sua empresa.</h2><p>Conectividade e atendimento próximos do seu negócio, com opções avaliadas pela equipe.</p></div>
      <div class="company-solution-grid">${solutions.map(([symbol, title, description, photo, alt]) => `<article><img src="/assets/generated/amr-empresas-${photo}.jpg" alt="${alt}" width="1586" height="992" loading="lazy" decoding="async"><div class="company-solution-body"><span class="company-solution-icon">${icon(symbol)}</span><h3>${title}</h3><p>${description}</p></div></article>`).join('')}</div>
      <div class="company-solutions-action">${action('Conversar sobre as soluções','business','','button primary')}<span>Disponibilidade e condições confirmadas pela equipe.</span></div>
    </div>
    <div class="company-integrated" id="solucoes-integradas"><div class="container"><div class="company-section-heading"><p class="eyebrow">SOLUÇÕES INTEGRADAS</p><h2>Tecnologia alinhada à sua operação.</h2><p>Explore cada frente técnica. Arquitetura, capacidade, escopo de suporte e condições são definidos após avaliação do ambiente.</p></div>
      <div class="company-integrated-grid">${Object.entries(enterpriseOfferings).map(([key, offer], index) => `<article class="company-integrated-card${index === 0 ? ' company-integrated-wide' : ''}"><img src="/assets/generated/amr-empresas-${offer.image}.jpg" alt="${offer.alt}" width="${index === 0 ? 1672 : 1024}" height="${index === 0 ? 941 : 1536}" loading="lazy" decoding="async">${index === 0 ? '<img class="company-cloud-logo" src="/assets/brand/logo-amr-relief.png" alt="" aria-hidden="true" width="640" height="320" loading="lazy" decoding="async">' : ''}<div class="company-integrated-copy"><span>0${index + 1} / SOLUÇÕES AMR</span><h3>${offer.title}</h3><p>${offer.summary}</p><a href="/empresas-${key}.html">Saiba mais ${icon('arrow')}</a></div></article>`).join('')}</div>
    </div></div>
    <div class="company-approach"><div class="container"><div class="company-section-heading"><p class="eyebrow">O JEITO AMR</p><h2>Do diagnóstico à proposta técnica.</h2></div><ol><li><span>01</span><h3>Mapeamos o ambiente</h3><p>Usuários, aplicações, equipamentos e pontos críticos da operação.</p></li><li><span>02</span><h3>Verificamos a viabilidade</h3><p>Endereço, infraestrutura existente e requisitos de capacidade.</p></li><li><span>03</span><h3>Definimos o escopo</h3><p>Arquitetura, serviços, condições e responsabilidades em proposta.</p></li></ol></div></div>
    <div class="company-story"><div class="container company-story-inner"><div class="company-story-copy"><p class="eyebrow">CONHEÇA A AMR</p><h2>Por trás da conexão, pessoas prontas para conversar.</h2><p>Vamos entender seu endereço, o perfil de uso e as necessidades da operação antes de apresentar uma opção para a sua empresa.</p>${action('Falar com a equipe','business','','button primary')}</div>
      <figure class="company-video-slot"><img src="/assets/generated/amr-empresa-card.jpg" alt="Prédio comercial iluminado com a marca AMR Telecom" width="1280" height="720" loading="lazy" decoding="async"><figcaption>Espaço reservado para o vídeo da AMR para empresas</figcaption></figure>
    </div></div>
  </section>`;
}

export function businessDetail(key) {
  const offer = enterpriseOfferings[key];
  return `<section class="company-detail"><div class="company-detail-hero"><div class="container company-detail-hero-inner"><div><p class="eyebrow">AMR PARA EMPRESAS / ${offer.title.toUpperCase()}</p><h2>${offer.title} para a sua operação.</h2><p>${offer.intro}</p><div class="company-actions">${action('Solicitar avaliação técnica','business',offer.title,'button primary')}<a href="/empresas.html#solucoes-integradas">Todas as soluções ${icon('arrow')}</a></div></div><img src="/assets/generated/amr-empresas-${offer.image}.jpg" alt="${offer.alt}" width="1672" height="941" fetchpriority="high" decoding="async"></div></div>
    <div class="container company-detail-content"><div class="company-section-heading"><p class="eyebrow">ESCOPO TÉCNICO</p><h2>O que analisamos com a sua equipe.</h2><p>Os itens abaixo orientam a conversa técnica. A solução e os serviços incluídos são definidos em proposta, conforme viabilidade e necessidade.</p></div><div class="company-detail-grid">${offer.topics.map(([title, text], index) => `<article><span>0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div><div class="company-detail-next"><div><p class="eyebrow">PREPARE SUA CONSULTA</p><h2>Vamos entender o ambiente?</h2><p>${offer.inputs}</p></div>${action('Falar com a equipe técnica','business',offer.title,'button primary')}</div></div></section>`;
}
