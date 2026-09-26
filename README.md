# AMR Telecom

Site institucional estático, responsivo e em português brasileiro. HTML gerado no build, CSS e JavaScript nativos. Node.js 20 ou superior; execute `npm ci` antes de gerar o site. O build usa `iconoir` para incluir os ícones no HTML.

## Páginas independentes

O site tem 12 páginas reais, com navegação por URL. A página inicial reúne um carrossel de três cenas (casa, empresas e atendimento), consulta rápida por CEP, três planos residenciais, uma opção empresarial sob consulta e acesso à Área do cliente. As demais páginas continuam independentes.

| Página | Endereço |
| --- | --- |
| Início | `/` |
| Planos | `/planos.html` |
| Área do cliente | `/area-do-cliente.html` |
| Soluções para sua rotina | `/solucoes.html` |
| Wi-Fi | `/wifi.html` |
| Internet para empresas | `/empresas.html` |
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

`build` recria a versão estática em `dist`, removendo o conteúdo anterior dessa pasta. `preview` serve o último build na mesma porta. Rode apenas um servidor por vez.

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
- `customerPortalUrl`: link HTTPS oficial da Área do cliente. Ainda pendente; até recebê-lo, a página informa que o acesso está em preparação e mantém o botão do portal desabilitado.

Recompile após editar a configuração. A indexação só é habilitada quando há domínio HTTPS válido, `commercialConfirmed`, referências das três aprovações e textos legais sem o marcador `PENDENTE DE REVISÃO`. Enquanto houver pendências, `robots.txt` e meta robots bloqueiam a indexação e `sitemap.xml` fica vazio. Uma referência preenchida não comprova, por si só, que a AMR realmente aprovou o conteúdo.

## Vídeo e materiais

Veja `ASSET_AUDIT.md` para a auditoria individual das 11 mídias originais. O vídeo original `AMR Telecom.mp4` contém textos promocionais, alegações não aprovadas e telefone ilustrativo; permanece preservado em `public/assets/videos`, mas não entra no build. As oito artes de `references` serviram somente como referência.

As aplicações atuais da marca usam `logo-amr-light-transparent.png` no cabeçalho claro e `logo-amr-relief.png` nas demais superfícies previstas pela configuração; o favicon é `favicon-amr.png`. Os arquivos de origem e derivados anteriores foram preservados. Uma fonte vetorial oficial continua recomendada para futuras aplicações.

O build inclui quatro vídeos MP4: `hero-amr-integrado-corrigido.mp4` para a casa no primeiro slide, `amr-empresa-hero.mp4` para o prédio comercial no segundo, `atendimento-amr.mp4` para o atendimento no terceiro e `amr-empresas.mp4` para o escritório na seção empresarial. O vídeo do segundo slide tem aproximadamente 10 segundos, 1280 × 720 px, sem áudio, com a marca AMR integrada ao final; usa `amr-empresa-hero-poster.jpg` como imagem de reserva. As bordas desse vídeo se misturam suavemente ao fundo do slide. Os vídeos carregam sob demanda e pausam conforme a visibilidade, a preferência por movimento reduzido e a economia de dados. Os originais fora da lista selecionada não entram no build.

O carrossel avança automaticamente a cada 10 segundos e oferece controles de navegação e pausa. Nos planos, “Detalhes do plano” abre uma explicação por vez, inclusive no catálogo da página inicial; a opção empresarial apresenta soluções e contato, sem mensalidade anunciada.

## Estrutura

```text
src/
  config.mjs                Dados editáveis
  routes.mjs                Catálogo das 12 páginas e metadados
  client.mjs                Menu, formulário, contato, carrossel e vídeos
  styles.css                Base compartilhada e páginas internas
  home-refresh.css          Início e catálogo de planos
  support-assistant.css     Widget flutuante de atendimento humano
  lib/whatsapp.mjs           Links, mensagens e validação
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
  build.mjs                 Geração de HTML e cópia de mídias selecionadas
  dev.mjs                   Servidor local e atualização do build
tests/contact.test.mjs
tests/routes.test.mjs
public/assets/              Originais preservados e derivados selecionados
dist/                       Saída estática
```

`src/home.css` e `src/editorial.css` são rascunhos históricos: o build não os referencia nem os copia para `dist`.

## Pendências antes de publicar

O WhatsApp, os preços e benefícios residenciais desta versão e as cidades Gravatá e Amaraji já estão configurados. Antes de publicar, confirmar os demais contatos, endereço, horários, bairros, domínio, condições de instalação e equipamentos, registrar as aprovações comerciais e legais e fornecer o link oficial da Área do cliente. Cobertura e condições específicas continuam sujeitas à consulta. A solução empresarial não exibe preço: a equipe avalia a necessidade e apresenta uma proposta. O selo “Para uso intenso” destaca editorialmente 700 Mega; não foi usada a alegação “Mais escolhido” sem dados que a comprovem.

As páginas de privacidade e termos descrevem a versão atual e precisam de revisão e complementação com os dados da empresa antes da publicação. Nenhuma mensagem foi enviada a terceiros e o site não foi publicado.

O formulário não utiliza banco de dados, cookies ou armazenamento local/sessionStorage. A consulta completa usa nome, cidade, bairro e rua ou referência; a rápida usa CEP e número ou referência. Nenhuma pede telefone. Após a validação, o visitante vê a mensagem preparada. Só o clique no link de continuação abre o WhatsApp: nesse momento os dados entram na URL do serviço, antes de qualquer envio da mensagem no aplicativo. Sem número oficial configurado, o site informa a indisponibilidade.

Os campos e o botão são habilitados somente depois que o tratamento de envio estiver pronto. Sem JavaScript ou se o script falhar, permanecem desabilitados com orientação visível. Isso impede o envio padrão do navegador, que colocaria os dados na URL.

## Atendimento humano flutuante

O componente `WhatsAppAssistant` aguarda 11 segundos. Até 800 px, mostra somente o avatar de 52 px; um toque abre o card, e fechar, rolar ou interagir fora dele o recolhe. O avatar mantém a posição e cede espaço quando conflita com controles essenciais. No desktop, o convite automático e o link do avatar para WhatsApp foram preservados. O widget não depende de sessionStorage; os formulários continuam sem armazenar campos. O número vem de `contact.whatsapp` e a mensagem de `messages.assistant`. O antigo atalho móvel foi substituído; a barra de cobertura foi preservada. Veja [SUPPORT_ASSISTANT.md](SUPPORT_ASSISTANT.md) para comportamento, arquivos e validação. O teste de navegador é `scripts/check-support-browser.mjs`, com `AMR_PLAYWRIGHT_ROOT` apontando ao Playwright já disponível.

## Publicação segura

Publique somente o conteúdo de `dist/`. Não configure a raiz do repositório nem `public/` como diretório público: ali há originais, históricos e um backup que não pertencem ao site. `src/config.mjs` é copiado para o navegador; não coloque senhas ou chaves nele. Rode `npm run check:dist` para validar a lista exata de arquivos gerados e `npm run prepublish:check` antes de preparar qualquer deploy. O segundo comando deve falhar enquanto as pendências acima existirem.

Quando a plataforma de hospedagem for escolhida, configure nela os valores de `hostingHeaders` em `scripts/security.mjs`: CSP com `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` e `Permissions-Policy: camera=(), microphone=(), geolocation=()`. O HTML já traz a parte da CSP que funciona em meta tag; `frame-ancestors` exige cabeçalho HTTP. A CSP ainda permite estilos inline porque removê-los bloqueou a animação do título e o menu móvel sem JavaScript em teste local. Não remova `unsafe-inline` sem migrar esses estilos e repetir os testes.

Após configurar a hospedagem, execute `npm run check:hosting` para testar as 12 respostas reais via HTTPS. Os cabeçalhos de `npm run preview` não comprovam a configuração de produção. Verifique também que HTTP redireciona para HTTPS e que todo o domínio funciona por HTTPS antes de habilitar HSTS. Depois de configurar HSTS, execute `node scripts/check-hosting.mjs --require-hsts`. Não habilite `includeSubDomains` ou `preload` sem confirmar cada subdomínio.

Antes da publicação, defina `siteUrl` com o domínio HTTPS definitivo e revise os textos de privacidade e termos com a identificação e o canal oficial da empresa. Enquanto o domínio estiver vazio, o build mantém `noindex` e `Disallow: /` de propósito.

## Validação

O estado visual mais recente e a validação do segundo slide estão em [design-qa.md](design-qa.md). [REDESIGN_HOME.md](REDESIGN_HOME.md), [REDESIGN_HERO.md](REDESIGN_HERO.md), [AUDITORIA_PREMIUM.md](AUDITORIA_PREMIUM.md) e [VALIDACAO.md](VALIDACAO.md) registram etapas anteriores. Assets e proveniência estão em [ASSETS_HOME.md](ASSETS_HOME.md). `testimonials` e `mostChosenPlanId` devem receber somente dados reais confirmados; sem depoimentos aprovados, a seção permanece oculta.

Selecionar um plano residencial abre a consulta de cobertura com `?plano=ID` e preserva a opção na mensagem preparada. Apenas IDs existentes no catálogo são aceitos. A opção empresarial leva ao contato para uma avaliação sem preço anunciado. Na última revisão funcional, `npm test` aprovou 50 testes, `npm run build` gerou as 12 páginas e `npm run check:dist` passou; houve inspeção visual em 1440 e 390 px, sem rolagem horizontal ou erros no console. Core Web Vitals não foram medidos.

As verificações opcionais `scripts/check-pages-browser.mjs` e `scripts/check-form-browser.mjs` usam Playwright já disponível no ambiente, indicado por `AMR_PLAYWRIGHT_ROOT`. Execute com o servidor local ativo. Elas não instalam dependências.

## Correção mobile de 26/09/2026

Diagnóstico, arquivos alterados, capturas comparativas e resultados estão em [MOBILE_QA.md](MOBILE_QA.md) e [galeria visual](mobile-qa/index.html). `scripts/check-mobile-browser.mjs` verifica os três slides, avanço real dos vídeos, entrada, pausa e retomada, movimento reduzido, economia de dados, bloqueio de autoplay e falha de MP4, usando o mesmo `AMR_PLAYWRIGHT_ROOT` dos demais testes de navegador. Nenhuma dependência foi adicionada.
