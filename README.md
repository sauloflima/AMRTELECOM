# AMR Telecom

Site institucional estático, responsivo e em português brasileiro. HTML gerado no build, CSS e JavaScript nativos. Node.js 20 ou superior; execute `npm ci` antes de gerar o site. O build usa `iconoir` para incluir os ícones no HTML.

## Páginas independentes

O site tem 16 páginas reais, com navegação por URL. A página inicial reúne um carrossel de três cenas (casa, empresas e atendimento), consulta rápida por CEP, três planos residenciais, uma opção empresarial sob consulta e acesso à Área do cliente. As demais páginas continuam independentes.

| Página | Endereço |
| --- | --- |
| Início | `/` |
| Planos | `/planos.html` |
| Área do cliente | `/area-do-cliente.html` |
| Soluções para sua rotina | `/solucoes.html` |
| Wi-Fi | `/wifi.html` |
| Internet para empresas | `/empresas.html` |
| Cloud para empresas | `/empresas-cloud.html` |
| Outsourcing de TI | `/empresas-ti.html` |
| Cibersegurança | `/empresas-seguranca.html` |
| Conectividade | `/empresas-conectividade.html` |
| Consulta de cobertura | `/cobertura.html` |
| Suporte | `/suporte.html` |
| Perguntas frequentes | `/perguntas.html` |
| Contato | `/contato.html` |
| Política de Privacidade | `/privacidade.html` |
| Termos de Uso | `/termos.html` |

`src/routes.mjs` centraliza endereços, títulos, descrições e itens de navegação. O menu indica a página atual e as páginas internas incluem caminho de navegação. Cabeçalho e rodapé são compartilhados. Cada URL pode ser aberta, recarregada ou compartilhada diretamente. O sitemap utiliza o mesmo catálogo quando domínio e dados comerciais forem confirmados.

## Executar

```sh
npm ci
npm run dev
```

Abra `http://127.0.0.1:4173`. As alterações em `src` recompilam o site; atualize a página para vê-las. Pare o servidor com Ctrl+C.

```sh
npm run build
npm run preview
npm test
```

`build` recria a versão estática em `dist`, removendo o conteúdo anterior dessa pasta. `preview` serve o último build na mesma porta padrão. Rode apenas um servidor por porta.

## Onde editar

Todos os dados comerciais ficam em `src/config.mjs`:

- `plans`: velocidades, preços, indicação de uso e plano em destaque.
- `benefits`: benefícios exibidos nos planos.
- `commercialConfirmed`: preços e benefícios das artes comerciais foram confirmados para esta versão; outras condições seguem sujeitas à consulta.
- `publicationApprovals`: referências dos registros de aprovação comercial, da política de privacidade e dos termos pela AMR. Deixe vazias até a revisão real.
- `contact.whatsapp`: país + DDD + número, somente dígitos. O número oficial foi confirmado para esta versão.
- `contact.phone`, `email`, `address`, `hours`: contatos e horário. Campos vazios não são exibidos.
- `coverage.cities`, `coverage.neighborhoods`: Gravatá e Amaraji foram confirmadas como cidades de atendimento; não presumem cobertura total.
- `social`: URLs HTTPS dos perfis oficiais.
- `messages`: mensagens de planos, cobertura, Wi-Fi, empresas, suporte e contato geral.
- `siteUrl`: domínio HTTPS definitivo. Vazio enquanto não confirmado.
- `customerPortalUrl`: link oficial `https://www.amrfibra.com.br/central/`. O certificado apresentado em 26/09/2026 está vencido e não corresponde ao domínio; a hospedagem do portal precisa corrigir o HTTPS antes do lançamento.

Recompile após editar a configuração. A indexação só é habilitada quando há domínio HTTPS válido, `commercialConfirmed`, referências das três aprovações e textos legais sem o marcador `PENDENTE DE REVISÃO`. Enquanto houver pendências, `robots.txt` e meta robots bloqueiam a indexação e `sitemap.xml` fica vazio. Uma referência preenchida não comprova, por si só, que a AMR realmente aprovou o conteúdo.

## Vídeo e materiais

Veja `docs/ASSET_AUDIT.md` para a auditoria individual das 11 mídias originais. O vídeo original `AMR Telecom.mp4` contém textos promocionais, alegações não aprovadas e telefone ilustrativo; permanece preservado em `public/assets/videos`, mas não entra no build. As oito artes de `references` serviram somente como referência.

As aplicações atuais da marca usam `logo-amr-light-transparent.png` no cabeçalho claro e `logo-amr-relief.png` nas demais superfícies previstas pela configuração; o favicon é `favicon-amr.png`. Os arquivos de origem e derivados anteriores foram preservados. Uma fonte vetorial oficial continua recomendada para futuras aplicações.

O build inclui quatro vídeos MP4: `hero-amr-integrado-corrigido.mp4` para a casa no primeiro slide, `amr-empresa-flow-20261001.mp4` (prédio 3D do Google Flow, com `amr-empresa-flow-poster.jpg` de reserva) no segundo, `atendimento-amr-bordado-tecido-20261001.mp4` no terceiro e `amr-empresa-hero.mp4` na seção “Conheça a AMR” da página Empresas, com reprodução manual. Os vídeos automáticos carregam sob demanda e ficam parados, mostrando o poster, com movimento reduzido, economia de dados, pausa de efeitos, aba oculta ou fora da tela. Com movimento reduzido, as animações CSS também são suspensas. A imagem da casa e a pessoa ao celular são publicadas em WebP com transparência; os PNG originais ficam em `public/`. Os originais fora da lista selecionada não entram no build.

O carrossel avança automaticamente a cada 10 segundos e oferece controles de navegação e pausa. Nos planos, “Detalhes do plano” abre uma explicação por vez, inclusive no catálogo da página inicial; a opção empresarial apresenta soluções e contato, sem mensalidade anunciada.

## Estrutura

```text
src/
  config.mjs                Dados editáveis
  routes.mjs                Catálogo das 16 páginas e metadados
  client.mjs                Composição dos comportamentos do navegador
  client/                   Navegação, contato e mídia/movimento
  styles.css                Base compartilhada e páginas internas
  home-refresh.css          Início e catálogo de planos
  support-assistant.css     Widget flutuante de atendimento humano
  lib/whatsapp.mjs           Links, mensagens e validação
  lib/carousel.mjs           Estado e controles do carrossel
  lib/hero-video.mjs         Reprodução com poster e fallback
  lib/support-assistant.mjs  Delay e visibilidade do atendimento
  components/
    shared.mjs              Cabeçalho, rodapé, botões e ícones
    support-assistant.mjs   Componente WhatsAppAssistant
    hero.mjs
    plans.mjs
    benefits.mjs
    customer.mjs            Área do cliente
    contact.mjs
    navigation.mjs          Acessos, caminho de navegação e páginas internas
scripts/
  build.mjs                 Geração das páginas e cópia de recursos
  build-files.mjs           Lista permitida de módulos, CSS e mídias
  check-publication.mjs     Verificação do conteúdo exato de dist
  dev.mjs                   Servidor local e atualização do build
  check-*-browser.mjs       Verificações opcionais em navegador real
tests/                      Testes Node (npm test)
docs/                       Auditorias, QA e registros de etapas anteriores
public/assets/              Originais preservados e derivados selecionados
dist/                       Saída estática
```

[ARCHITECTURE.md](ARCHITECTURE.md) descreve as fronteiras, o runtime, a publicação e como acrescentar páginas, componentes e comportamentos.

## Pendências antes de publicar

O WhatsApp, os preços e benefícios residenciais desta versão e as cidades Gravatá e Amaraji já estão configurados. Antes de publicar, confirmar os demais contatos, endereço, horários, bairros, domínio, condições de instalação e equipamentos, registrar as aprovações comerciais e legais e corrigir o certificado HTTPS do portal oficial da Área do cliente. Cobertura e condições específicas continuam sujeitas à consulta. A solução empresarial não exibe preço: a equipe avalia a necessidade e apresenta uma proposta. O selo “Para uso intenso” destaca editorialmente 700 Mega; não foi usada a alegação “Mais escolhido” sem dados que a comprovem.

As páginas de privacidade e termos descrevem a versão atual e precisam de revisão e complementação com os dados da empresa antes da publicação. A demonstração autorizada está pública no GitHub Pages, sem indexação.

O formulário não utiliza banco de dados, cookies ou armazenamento local/sessionStorage. A consulta completa usa nome, cidade, bairro e rua ou referência; a rápida usa CEP e número ou referência. Nenhuma pede telefone. Após a validação, o visitante vê a mensagem preparada. Só o clique no link de continuação abre o WhatsApp: nesse momento os dados entram na URL do serviço, antes de qualquer envio da mensagem no aplicativo. Sem número oficial configurado, o site informa a indisponibilidade.

Os campos e o botão são habilitados somente depois que o tratamento de envio estiver pronto. Sem JavaScript ou se o script falhar, permanecem desabilitados com orientação visível. Isso impede o envio padrão do navegador, que colocaria os dados na URL.

## Atendimento humano flutuante

O componente `WhatsAppAssistant` aguarda 11 segundos e abre um convite compacto, “Posso ajudar?”, que leva ao WhatsApp. Até 800 px, o avatar tem 52 px e é um link direto para o WhatsApp; o convite fica acima dele, e fechar, rolar ou tocar fora o recolhe. No desktop, o avatar de 64 px abre e fecha o convite. O widget some sobre o rodapé, com menu, diálogo ou formulário em foco, e cede espaço quando encostaria em textos ou controles. A entrada usa só opacidade, para não deslocar a medição de posição. Não usa sessionStorage. O número vem de `contact.whatsapp` e a mensagem de `messages.assistant`. A barra fixa de cobertura foi removida. O registro da implementação está em [docs/SUPPORT_ASSISTANT.md](docs/SUPPORT_ASSISTANT.md). O teste de navegador é `scripts/check-support-browser.mjs`, com `AMR_PLAYWRIGHT_ROOT` apontando ao Playwright já disponível.

## Publicação segura

Publique somente o conteúdo de `dist/`. Não configure a raiz do repositório nem `public/` como diretório público: ali há originais, históricos e um backup que não pertencem ao site. `src/config.mjs` é copiado para o navegador; não coloque senhas ou chaves nele. Rode `npm run check:dist` para validar a lista exata de arquivos gerados e `npm run prepublish:check` antes de preparar qualquer deploy. O segundo comando deve falhar enquanto as pendências acima existirem.

O workflow atual publica pelo GitHub Pages, que respondeu sem os headers de proteção configurados na prévia local. Configure os valores de `hostingHeaders` em `scripts/security.mjs` no servidor/CDN que servir a produção: CSP com `frame-ancestors 'none'`, proteção MIME, referrer, permissões, COOP e CORP. A meta CSP não substitui headers como `frame-ancestors`. A política não permite `unsafe-inline` nem `unsafe-eval` e bloqueia frames, conexões e envios nativos dos formulários; os links para WhatsApp continuam funcionando. O único `<style>` de fallback sem JavaScript tem hash calculado a partir de seu conteúdo, e as animações definem suas propriedades pelo JavaScript local. A configuração completa e as pendências estão em [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md).

Após configurar a hospedagem, execute `npm run check:hosting` para testar as 16 respostas reais via HTTPS. Os cabeçalhos de `npm run preview` não comprovam a configuração de produção. Verifique também que HTTP redireciona para HTTPS e que todo o domínio funciona por HTTPS antes de habilitar HSTS. Depois de configurar HSTS, execute `node scripts/check-hosting.mjs --require-hsts`. Não habilite `includeSubDomains` ou `preload` sem confirmar cada subdomínio.

O workflow separa build e deploy, fixa as Actions por commit, instala com `npm ci --ignore-scripts`, audita dependências, roda `npm test` e `npm run check:dist` e publica a demonstração a cada push na `main`. **Ele não roda `npm run prepublish:check`**: a demonstração foi autorizada com pendências, então não há trava automática. Antes de apontar o domínio definitivo, acrescente `npm run prepublish:check` ao job de build para bloquear o deploy enquanto houver pendências. `noindex` não restringe acesso ao site.

Antes da publicação, defina `siteUrl` com o domínio HTTPS definitivo e revise os textos de privacidade e termos com a identificação e o canal oficial da empresa. Enquanto o domínio estiver vazio, o build mantém `noindex` e `Disallow: /` de propósito.

## Validação

Auditorias, QA visual e registros de etapas anteriores ficam em [docs/](docs/); por serem registros datados, podem descrever versões antigas. Em caso de divergência, vale este README. `testimonials` e `mostChosenPlanId` devem receber somente dados reais confirmados; sem depoimentos aprovados, a seção permanece oculta.

Selecionar um plano residencial abre a consulta de cobertura com `?plano=ID` e preserva a opção na mensagem preparada. Apenas IDs existentes no catálogo são aceitos. A opção empresarial leva ao contato para uma avaliação sem preço anunciado. Em 14/10/2026, `npm test` aprovou 61 testes, `npm run build` gerou as 16 páginas e `npm run check:dist` aprovou os 56 arquivos selecionados. Core Web Vitals não foram medidos.

As verificações opcionais `scripts/check-{pages,form,security,support,mobile}-browser.mjs` usam o Playwright já disponível no ambiente, indicado por `AMR_PLAYWRIGHT_ROOT`, e o Google Chrome (`channel: 'chrome'`), necessário para tocar os MP4 em H.264. Execute com `npm run preview` ativo. Elas não rodam no CI e não instalam dependências; rode-as antes de mudanças visuais ou de comportamento.

## Correção mobile de 26/09/2026

Diagnóstico, arquivos alterados e resultados estão em [docs/MOBILE_QA.md](docs/MOBILE_QA.md); as capturas são geradas localmente em `mobile-qa/`, ignorada pelo Git. `scripts/check-mobile-browser.mjs` verifica os três slides, avanço real dos vídeos, entrada, pausa e retomada, movimento reduzido, economia de dados, bloqueio de autoplay e falha de MP4, usando o mesmo `AMR_PLAYWRIGHT_ROOT` dos demais testes de navegador. Nenhuma dependência foi adicionada.
