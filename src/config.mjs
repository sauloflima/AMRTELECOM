// Única fonte de dados comerciais. Campos vazios não são publicados.
// WhatsApp: somente números, código do país + DDD + número. Ex.: formato 55DDDNÚMERO.
export const config = {
  brand: { name: 'AMR Telecom', slogan: 'Conectando você ao que importa', logo: '/assets/brand/logo-amr-relief.png', logoLight: '/assets/brand/logo-amr-light-transparent.png', favicon: '/assets/brand/favicon-amr.png' },
  siteUrl: '', // Preencher com o domínio HTTPS definitivo para gerar sitemap e canonical.
  customerPortalUrl: 'https://www.amrfibra.com.br/central/', // Endereço oficial fornecido; certificado HTTPS precisa ser renovado.
  commercialConfirmed: true,
  // Referências dos registros de aprovação da AMR; não preencher sem revisão real.
  publicationApprovals: { commercial: '', privacy: '', terms: '' },
  contact: { whatsapp: '5581993467014', phone: '', email: '', address: '', hours: '' },
  social: { instagram: 'https://www.instagram.com/amrtelecomltda/', facebook: '' },
  // Preencher apenas após confirmação da empresa. Vazio: não exibir “Mais escolhido”.
  mostChosenPlanId: '',
  // Antes da publicação, incluir SOMENTE depoimentos reais com autorização.
  // Formato: { name: 'Nome autorizado', quote: 'Relato real', approved: true }.
  // Sem dados aprovados, a seção não aparece. Não publicar exemplos fictícios.
  testimonials: [],
  coverage: { cities: ['Gravatá (PE)', 'Amaraji (PE)'], neighborhoods: [] },
  benefits: ['100% fibra óptica', 'Sem contrato de fidelização', 'Suporte local'],
  plans: [
    { id: '200', speed: 200, price: 65, use: 'Para mensagens, redes sociais, estudos e vídeos no dia a dia. Comece com uma opção que cabe na sua rotina.', profile: { icon: 'mobile', label: 'Celular', headline: 'O essencial para estar perto.', examples: [['mobile', 'Converse e acompanhe suas redes sociais.'], ['work', 'Navegue, pesquise e estude online.'], ['play', 'Aproveite vídeos nos momentos de pausa.']] }, highlighted: false, badge: '' },
    { id: '500', speed: 500, price: 80, use: 'Filmes, séries e uma casa com diferentes rotinas online. Mais velocidade para compartilhar a conexão.', profile: { icon: 'streaming', label: 'Streaming', headline: 'Sua casa tem muitos momentos.', examples: [['streaming', 'Curta filmes e séries nos seus aplicativos.'], ['work', 'Alterne entre trabalho, estudos e videochamadas.'], ['wifi', 'Considere esta opção para vários aparelhos em uso.']] }, highlighted: false, badge: '' },
    { id: '700', speed: 700, price: 100, use: 'Para quem joga, baixa arquivos grandes e faz transmissões. A maior velocidade entre os planos apresentados.', profile: { icon: 'game', label: 'Gamer', headline: 'Leve sua rotina gamer além.', examples: [['game', 'Mais velocidade disponível para baixar jogos e atualizações.'], ['streaming', 'Converse sobre suas necessidades para lives e transmissões.'], ['wifi', 'Uma opção para uma rotina de uso mais intenso.']] }, highlighted: true, badge: 'Para uso intenso' }
  ],
  // Só usar “Mais escolhido” quando houver confirmação da empresa.
  messages: {
    assistant: 'Olá! Vim pelo site da AMR Telecom e gostaria de atendimento.',
    general: 'Olá, AMR Telecom! Gostaria de saber mais sobre os serviços de internet.',
    plan: 'Olá, AMR Telecom! Tenho interesse no plano de {speed} Mega, anunciado por {price}/mês. Podem confirmar o valor, as condições e a disponibilidade para meu endereço?',
    coverage: 'Olá, AMR Telecom! Gostaria de consultar a cobertura para este endereço:',
    business: 'Olá, AMR Telecom! Gostaria de conversar sobre internet para minha empresa e avaliar as opções disponíveis.',
    wifi: 'Olá, AMR Telecom! Gostaria de orientação para melhorar a cobertura do Wi-Fi no meu imóvel.',
    support: {
      offline: 'Olá, sou cliente AMR Telecom e estou sem conexão. Preciso de suporte.',
      slow: 'Olá, sou cliente AMR Telecom e minha internet está lenta. Podem me ajudar?',
      wifi: 'Olá, sou cliente AMR Telecom e preciso de ajuda com meu Wi-Fi.',
      payment: 'Olá, sou cliente AMR Telecom e tenho uma dúvida sobre pagamento.',
      other: 'Olá, sou cliente AMR Telecom e preciso de atendimento.'
    }
  }
};
