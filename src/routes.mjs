// Catálogo único das páginas: navegação, títulos, descrições e sitemap.
export const routes = [
  { path: '/', file: 'index.html', label: 'Início', title: 'AMR Telecom | Internet por fibra óptica', description: 'Internet por fibra óptica da AMR Telecom. Conheça os planos, consulte a cobertura e encontre atendimento.', primary: true },
  { path: '/planos.html', file: 'planos.html', label: 'Planos', title: 'Planos de internet | AMR Telecom', description: 'Compare as velocidades dos planos da AMR Telecom e consulte preços, disponibilidade e condições.', primary: true, icon: 'fiber' },
  { path: '/area-do-cliente.html', file: 'area-do-cliente.html', label: 'Área do cliente', title: 'Área do cliente | AMR Telecom', description: 'Encontre o acesso ao portal do cliente AMR Telecom e o canal de suporte para sua conexão.', primary: true, icon: 'user' },
  { path: '/solucoes.html', file: 'solucoes.html', label: 'Para sua rotina', title: 'Internet para sua rotina | AMR Telecom', description: 'Encontre uma conexão para casa e família, trabalho, estudo, jogos e entretenimento.', icon: 'home' },
  { path: '/wifi.html', file: 'wifi.html', label: 'Wi-Fi', title: 'Orientação sobre Wi-Fi | AMR Telecom', description: 'Entenda o que influencia o sinal do Wi-Fi e converse sobre a cobertura nos ambientes do seu imóvel.', icon: 'wifi' },
  { path: '/empresas.html', file: 'empresas.html', label: 'Para empresas', title: 'Internet para empresas | AMR Telecom', description: 'Converse com a AMR Telecom sobre internet para escritórios e pequenos negócios, conforme sua necessidade.', icon: 'building' },
  { path: '/cobertura.html', file: 'cobertura.html', label: 'Cobertura', title: 'Consultar cobertura | AMR Telecom', description: 'Informe seu endereço e prepare uma consulta de disponibilidade de internet por fibra óptica à AMR Telecom.', primary: true, icon: 'pin' },
  { path: '/suporte.html', file: 'suporte.html', label: 'Suporte', title: 'Suporte ao cliente | AMR Telecom', description: 'Encontre atendimento para conexão, lentidão, Wi-Fi, pagamento e outras dúvidas sobre sua internet.', primary: true, icon: 'headset' },
  { path: '/perguntas.html', file: 'perguntas.html', label: 'Perguntas frequentes', title: 'Perguntas frequentes | AMR Telecom', description: 'Tire dúvidas sobre fibra óptica, cobertura, planos, fidelidade, roteadores e suporte da AMR Telecom.', icon: 'chat' },
  { path: '/contato.html', file: 'contato.html', label: 'Contato', title: 'Fale com a AMR Telecom', description: 'Encontre os canais oficiais de contato e atendimento da AMR Telecom.', primary: true, icon: 'user' },
  { path: '/privacidade.html', file: 'privacidade.html', label: 'Política de Privacidade', title: 'Política de Privacidade | AMR Telecom', description: 'Saiba como funciona o uso dos dados nas consultas e nos contatos preparados pelo site da AMR Telecom.', legal: true },
  { path: '/termos.html', file: 'termos.html', label: 'Termos de Uso', title: 'Termos de Uso | AMR Telecom', description: 'Consulte as condições de uso do site de apresentação e consulta de serviços da AMR Telecom.', legal: true },
];

export const routeFor = pathname => routes.find(route => route.path === pathname);
