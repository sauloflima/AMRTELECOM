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
| Cloud | `/empresas-cloud.html` |
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
- `customerPortalUrl`: `https://cloud.amrfibra.com.br/central/`, conforme HTML enviado por Saulo em 20/10/2026. Histórico do endereço anterior, `https://www.amrfibra.com.br/central/`: em 26/09/2026 houve certificado vencido e hostname incompatível; em 13/10/2026, o HTTPS foi revalidado sem bypass, com certificado válido até 26/12/2026 e página pública de login HTTP 200. Essa verificação anterior não valida o novo subdomínio. Login autenticado e segurança interna não foram testados.

Recompile após editar a configuração. A indexação só é habilitada quando há domínio HTTPS válido, `commercialConfirmed`, referências das três aprovações e textos legais sem o marcador `PENDENTE DE REVISÃO`. Enquanto houver pendências, a meta robots mantém `noindex, nofollow` e `sitemap.xml` fica vazio. O `robots.txt` permite o rastreamento (`Allow: /`) para o buscador conseguir ler o `noindex`. Uma referência preenchida não comprova, por si só, que a AMR realmente aprovou o conteúdo.

## Vídeo e materiais

O carrossel tem quatro slides: Gravatá e Amaraji, Casa, Empresas e Atendimento. O primeiro slide usa as fotos de Gravatá e Amaraji. A imagem de Amaraji foi fornecida por Saulo para publicação, com remoção da marca lateral. Os créditos ficam em Termos de Uso, com acesso pelo rodapé.

Veja [ASSET_AUDIT.md](docs/historico/ASSET_AUDIT.md) para a auditoria individual das mídias originais. O vídeo original `AMR Telecom.mp4` contém textos promocionais, alegações não aprovadas e telefone ilustrativo; permanece preservado em `public/assets/videos`, mas não entra no build. As oito artes de `references` serviram somente como referência.

As aplicações atuais da marca usam `logo-amr-light-transparent.png` no cabeçalho claro e `logo-amr-relief.png` nas demais superfícies previstas pela configuração; o favicon é `favicon-amr.png`. Os arquivos de origem e derivados anteriores foram preservados. Uma fonte vetorial oficial continua recomendada para futuras aplicações.

Os posters transparentes `amr-casa-fibra-3d.webp` e `amr-pessoa-celular-parada.webp` substituem PNGs mais pesados no build. A conversão preserva dimensões e transparência; os arquivos originais permanecem em `public/`.

O build inclui os vídeos `hero-amr-integrado-corrigido.mp4` para Casa, `amr-empresa-flow-20261001.mp4` para Empresas, `atendimento-amr-bordado-tecido-20261001.mp4` para Atendimento e `amr-empresa-hero.mp4` para a seção empresarial. Os vídeos carregam sob demanda e pausam conforme a visibilidade, a preferência por movimento reduzido e a economia de dados. Os originais fora da lista selecionada não entram no build.

O carrossel oferece controles de navegação e pausa; o primeiro slide avança após 8 segundos e os demais após 10 segundos. Nos planos, “Detalhes do plano” abre uma explicação por vez, inclusive no catálogo da página inicial; a opção empresarial apresenta soluções e contato, sem mensalidade anunciada.

Com movimento reduzido, a rotação automática fica desativada e a navegação manual continua disponível. A preferência também desliga animações e transições decorativas e a rolagem suave, inclusive nas páginas internas. Nos três slides com vídeo, a imagem de segurança é o próprio fallback: ela carrega ao visitar a cena, sem um poster nativo redundante que anteciparia a transferência.

## Estrutura

```text
src/
  config.mjs                Dados editáveis
  routes.mjs                Catálogo das páginas e metadados
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
tests/contact.test.mjs
tests/routes.test.mjs
public/assets/              Originais preservados e derivados selecionados
dist/                       Saída estática
```

`src/home.css` e `src/editorial.css` são fontes antigas: o build não as referencia nem as copia para `dist`. Relatórios e registros datados ficam em [`docs/historico/`](docs/historico/); README e ARCHITECTURE são a documentação operacional atual.

[ARCHITECTURE.md](ARCHITECTURE.md) descreve as fronteiras, o runtime, a publicação e como acrescentar páginas, componentes e comportamentos.

## Pendências antes de publicar

O WhatsApp, os preços e benefícios residenciais desta versão e as cidades Gravatá e Amaraji já estão configurados. Antes de publicar, confirmar os demais contatos, endereço, horários, bairros, domínio, condições de instalação e equipamentos, registrar as aprovações comerciais e legais e revalidar o HTTPS do portal oficial da Área do cliente próximo da entrega. Cobertura e condições específicas continuam sujeitas à consulta. A solução empresarial não exibe preço: a equipe avalia a necessidade e apresenta uma proposta. O selo “Para uso intenso” destaca editorialmente 700 Mega; não foi usada a alegação “Mais escolhido” sem dados que a comprovem.

As páginas de privacidade e termos descrevem a versão atual e precisam de revisão e complementação com os dados da empresa antes da publicação. A versão anterior está pública no GitHub Pages. As correções desta auditoria são locais; nenhuma mensagem foi enviada a terceiros nem um novo deploy foi realizado.

O formulário não utiliza banco de dados, cookies ou armazenamento local/sessionStorage. A consulta completa usa nome, cidade, bairro e rua ou referência; a rápida usa CEP e número ou referência. Nenhuma pede telefone. Após a validação, o visitante vê a mensagem preparada. Só o clique no link de continuação abre o WhatsApp: nesse momento os dados entram na URL do serviço, antes de qualquer envio da mensagem no aplicativo. Sem número oficial configurado, o site informa a indisponibilidade.

Os campos e o botão são habilitados somente depois que o tratamento de envio estiver pronto. Sem JavaScript ou se o script falhar, permanecem desabilitados com orientação visível. Isso impede o envio padrão do navegador, que colocaria os dados na URL.

## Atendimento humano flutuante

O componente `WhatsAppAssistant` atual aguarda 11 segundos e mostra um convite compacto “Posso ajudar?”. Até 800 px, usa avatar de 52 px com link para WhatsApp; acima disso, o botão do avatar controla o convite. Fechar, rolar ou interagir fora recolhe o convite; o widget cede espaço aos controles essenciais. Não depende de sessionStorage e não armazena campos. O número vem de `contact.whatsapp` e a mensagem de `messages.assistant`. O componente atual não gera a antiga barra de cobertura. [SUPPORT_ASSISTANT.md](docs/historico/SUPPORT_ASSISTANT.md) registra etapas anteriores; a implementação e as limitações observadas atualmente estão na auditoria. `scripts/check-support-browser.mjs` usa Playwright fixado no lockfile e verifica o fechamento por teclado. `npm run test:browser` executa a suíte completa e guarda as capturas fora de `dist/`.

## Demonstração e publicação definitiva

Publique somente `dist/`. A raiz do repositório e `public/` contêm originais, históricos e backups. `src/config.mjs` vai ao navegador: nunca inclua senhas, chaves ou referências confidenciais. `check:dist` mantém a allowlist exata e procura padrões de credenciais conhecidas; isso não comprova ausência absoluta de segredos.

A demonstração autorizada está em [GitHub Pages](https://sauloflima.github.io/AMRTELECOM/). O workflow `pages.yml` roda em push para `main`, PR para `main` e acionamento manual. Executa instalação pelo lockfile sem lifecycle scripts, auditoria npm, testes Node, instalação explícita do Chromium, build de demonstração, preparação da base `/AMRTELECOM/`, `check:dist -- --demo` e os cinco scripts de navegador. Só então envia o mesmo `dist/` ao Pages. Uma falha impede o upload e o deploy dependente; PRs nunca fazem deploy. Os jobs têm limites de 20 minutos para build/testes e 10 para deploy. Actions estão fixadas por commit e só deploy recebe Pages/OIDC; checkout não persiste credenciais.

A demonstração conserva meta `noindex, nofollow`, rastreamento permitido para leitura dessa meta e sitemap vazio, inclusive se a configuração definitiva vier a ser aprovada. `noindex` não restringe acesso. O workflow de demonstração **não executa `prepublish:check`**: esse gate verifica domínio e aprovações comerciais/legais da publicação definitiva.

O gate separado está em `.github/workflows/release-readiness.yml`, somente manual e com `if: ${{ false }}`. Está desativado e não contém job de deploy. Depois da decisão de destino e das aprovações reais, sua ativação precisa ser revisada e autorizada; preencher referências não é prova de aprovação. O gate executará `prepublish:check` e a mesma suíte no build sem base do Pages. Hoje `prepublish:check` deve falhar nas três pendências de aprovação comercial, privacidade e termos; o domínio já está configurado. Nenhuma aprovação foi preenchida.

## Segurança efetivamente entregue

Em 13/10/2026, as 16 URLs do Pages responderam HTTP 200 por HTTPS, com meta CSP e noindex. HTTP redirecionou com 301 para HTTPS; HSTS veio com `max-age=31556952`. Os sete headers de `hostingHeaders` estavam ausentes. A prévia local aplica esses valores; seus testes não comprovam proteção pública.

`scripts/security.mjs` é a fonte da política: CSP restrita sem `unsafe-inline` ou `unsafe-eval`, hash do CSS de fallback e do JSON-LD da organização, proteção MIME, referrer, permissões, COOP e CORP. A meta CSP não aceita `frame-ancestors`; esse controle e `X-Frame-Options` exigem headers HTTP. O Pages não oferece configuração de headers personalizados; `_headers` e `.htaccess` não resolvem esse destino. A limitação está confirmada pelas respostas observadas e pela [resposta de mantenedor na comunidade GitHub](https://github.com/orgs/community/discussions/54257). Veja também [MDN: frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

Não há configuração de servidor alternativo neste projeto. As opções para decisão são manter o Pages como demonstração com a limitação registrada, aprovar uma camada de entrega com controle de headers em domínio próprio ou aprovar uma hospedagem estática compatível. Domínio, operador, custo, publicação e reversão precisam ser definidos antes de gerar a configuração específica. Não presumir que o Apache do portal é a hospedagem deste site.

Para extrair os valores vigentes para revisão, sem produzir configuração fictícia:

```sh
node --input-type=module -e "import { hostingHeaders } from './scripts/security.mjs'; console.log(JSON.stringify(hostingHeaders, null, 2))"
```

Somente quando `siteUrl`, aprovações e destino forem reais, configurar os headers nesse destino e executar `npm run check:hosting` contra suas 16 URLs HTTPS. Esse checker permanece bloqueado pelos requisitos de publicação e não deve ser contornado para auditar a demonstração. Confirmar redirecionamento HTTP e HTTPS em todo o domínio antes de configurar HSTS; depois executar `node scripts/check-hosting.mjs --require-hsts`. Não habilitar `includeSubDomains` ou `preload` sem verificar os subdomínios. [SECURITY_AUDIT.md](docs/historico/SECURITY_AUDIT.md) registra evidências atuais e o histórico datado.

## Procedimento de entrega e reversão para revisão

1. Registrar revisão/configuração candidata e Git atual, preservando mudanças locais. Para a demonstração, executar os comandos abaixo; para a definitiva, executar `npm run prepublish:check`, `npm run check:dist` e `npm run test:browser`, sem `prepare-pages` salvo base explicitamente aprovada.
2. Guardar o artefato aprovado fora de `dist/`, um manifesto SHA-256 e os relatórios, além da última versão pública recuperável. O build recria `dist/`; não colocar backups nessa pasta. Confirmar que o conteúdo testado é o mesmo entregue e que o upload continua limitado à allowlist.
3. Revisar diff, resultados, configuração de headers compatível com o destino e pendências. Solicitar autorização específica de publicação antes de commit, push, acionamento de workflow ou upload. Nenhuma dessas ações ocorreu nesta tarefa.
4. Após publicação autorizada, conferir HTTPS, headers, indexação e os fluxos públicos. Na definitiva, usar também `check:hosting`; não declarar homologação pelo build.
5. Para reverter, republicar o último artefato aprovado preservado, ou reconstruí-lo em checkout isolado da revisão anterior com seu lockfile e configuração. No Pages, a mesma pipeline testará esse artefato antes do deploy. Repetir os checks públicos após reversão; não usar reset/clean sobre o trabalho local. Na definitiva, o comando operacional de restauração depende do destino ainda não escolhido.

```sh
npm ci --ignore-scripts
npm audit --audit-level=low
npm test
npx --no-install playwright install chromium
npm run build -- --demo
node scripts/prepare-pages.mjs
npm run check:dist -- --demo
npm run test:browser
```

No Linux/CI a instalação explícita é `npx --no-install playwright install --with-deps chromium`. O runner inicia e encerra uma prévia própria em porta livre, detecta a base pelo artefato e não o recompila. Os testes têm limite de 180 segundos por script. Logs, resumo JSON, capturas de falha e evidências de mídia/atendimento ficam em uma pasta única sob `output/playwright/`, fora do artefato; o CI retém diagnósticos por sete dias. Somente dados fictícios entram nos testes e o WhatsApp é interceptado, sem envio. Não se exportam cookies ou estado autenticado.

## Validação

O estado visual mais recente e a validação do segundo slide estão em [design-qa.md](docs/historico/design-qa.md). [REDESIGN_HOME.md](docs/historico/REDESIGN_HOME.md), [REDESIGN_HERO.md](docs/historico/REDESIGN_HERO.md), [AUDITORIA_PREMIUM.md](docs/historico/AUDITORIA_PREMIUM.md) e [VALIDACAO.md](docs/historico/VALIDACAO.md) registram etapas anteriores. Assets e proveniência estão em [ASSETS_HOME.md](docs/historico/ASSETS_HOME.md). `testimonials` e `mostChosenPlanId` devem receber somente dados reais confirmados; sem depoimentos aprovados, a seção permanece oculta.

Selecionar um plano residencial abre a consulta de cobertura com `?plano=ID` e preserva a opção na mensagem preparada. Apenas IDs existentes no catálogo são aceitos. A opção empresarial leva ao contato para uma avaliação sem preço anunciado. Na revisão de 14/10/2026, `npm test` aprovou 63 testes, `npm run build` gerou 16 páginas e `npm run check:dist` aprovou 60 arquivos selecionados. A revisão visual anterior cobriu 1440 e 390 px, sem rolagem horizontal ou erros no console. Core Web Vitals não foram medidos.

Playwright 1.64.0 é dependência de desenvolvimento com versão exata e integridade no lockfile. `npm run test:browser` reaproveita os cinco `check-*-browser.mjs`; também testa CSP em enforcement local, XSS tratado como texto, falha de módulos, menu sem JS, modal pequeno e rejeição de arquivos privados. Para executar scripts isolados, iniciar a prévia e definir `AMR_ORIGIN` com a base completa. Para `dist/` preparado para Pages, usar `npm run preview -- --pages`; para o build na raiz, usar `npm run preview`. `AMR_PLAYWRIGHT_ROOT` permanece como alternativa local explícita; o CI usa a dependência instalada pelo lockfile.

## Correção mobile de 26/09/2026

Diagnóstico, arquivos alterados, capturas comparativas e resultados estão em [MOBILE_QA.md](docs/historico/MOBILE_QA.md) e [galeria visual](mobile-qa/index.html). `scripts/check-mobile-browser.mjs` verifica os quatro slides e três vídeos, avanço real dos vídeos, entrada, pausa e retomada, movimento reduzido, economia de dados, bloqueio de autoplay e falha de MP4, usando a mesma dependência dos demais testes de navegador. Esse registro é histórico; a integração ao CI em 13/10/2026 adicionou somente Playwright às dependências de desenvolvimento.

## SEO e compartilhamento

`src/routes.mjs` centraliza títulos e descrições exclusivos das 16 páginas. A Home descreve a oferta em Gravatá e Amaraji sem prometer cobertura integral. O build inclui Open Graph com nome do site, URL e logo existente como imagem, além de cartão social compacto. O build `--demo` usa URLs de compartilhamento do Pages; o build normal usa o domínio configurado. Canonical e sitemap preenchido continuam condicionados às aprovações de publicação.

`scripts/seo.mjs` gera JSON-LD `Organization` na Home com marca, domínio, logo, Instagram e contato confirmados, sem endereço, horário, avaliações ou ofertas inventados. O hash exato do JSON-LD é permitido pela CSP central, sem `unsafe-inline`. Após alterar esses dados, recompile e atualize os headers da hospedagem quando a publicação for autorizada. Dados estruturados e metatags não garantem posicionamento nem exibição especial no Google.

Validação local: `npm test`, `npm run build`, `npm run check:dist`; para a demonstração, `npm run build -- --demo`, `node scripts/prepare-pages.mjs` e `npm run check:dist -- --demo`. `npm run test:browser` verifica o artefato local e os metadados no DOM; isso não verifica indexação pública nem aparência real em redes sociais.
