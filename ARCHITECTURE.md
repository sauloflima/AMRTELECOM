# Arquitetura — AMR Telecom

## Visão geral

Site institucional de 12 páginas estáticas. Node gera HTML, seleciona recursos e verifica o artefato; o navegador executa módulos JavaScript nativos. Não há API, banco de dados ou estado persistido pelo site. O portal do cliente e o WhatsApp são serviços externos acessados por links.

```text
src/config.mjs ────────────────┬─> componentes HTML ─> scripts/build.mjs ─> dist/
       └─> src/lib/whatsapp.mjs │           ↑                 ↑
src/routes.mjs ────────────────┘           │          scripts/build-files.mjs
                               scripts/security.mjs          │
dist/src/client.mjs ─> client/{navigation,contact,media}.mjs + lib/ ─> DOM
```

`src/config.mjs` é dado público de negócio; `src/routes.mjs` define as URLs e seus metadados. Componentes geram HTML somente no build. `src/lib/whatsapp.mjs` contém validação e mensagens sem DOM; os outros módulos de `src/lib/` encapsulam carrossel, reprodução e atendimento no navegador. Não há importação circular no grafo publicado.

## Estrutura de diretórios

| Local | Responsabilidade |
|---|---|
| `src/config.mjs`, `src/routes.mjs`, `src/legal.mjs` | Dados comerciais públicos, catálogo de páginas e textos legais |
| `src/components/` | Templates semânticos de páginas, seções e elementos compartilhados; ícones Iconoir incorporados no build |
| `src/lib/` | Regras de contato e controladores reutilizados pelo navegador |
| `src/client.mjs`, `src/client/` | Entrada única e comportamentos de navegação, contato e mídia |
| `src/*.css` | Base/páginas internas, Home/planos e atendimento; `home.css` e `editorial.css` são históricos e não publicados |
| `scripts/` | Build, allowlist, prévia, preparação do Pages, publicação e verificações |
| `tests/` | Testes Node de regras, HTML, rotas e fronteira dos módulos |
| `public/assets/` | Originais e derivados; somente mídias da allowlist entram em `dist/` |
| `dist/` | Resultado gerado e ignorado pelo Git; nunca editar manualmente |

## Fluxo de build

`npm run build` recria `dist/`, gera HTML com `src/routes.mjs` como fonte de títulos e descrições, incorpora a política de `scripts/security.mjs` e copia os recursos declarados em `scripts/build-files.mjs`. A mesma allowlist alimenta `npm run check:dist`, que exige o conjunto exato de arquivos e rejeita entradas especiais. A revisão de cache deriva do SHA-256 dos CSS e módulos publicados; o build a aplica aos links de CSS, ao módulo de entrada e aos imports relativos dos módulos gerados. O código-fonte permanece sem sufixos de versão. O build é determinístico com os mesmos arquivos, dependências e ano civil (o rodapé mostra o ano atual).

`src/components/shared.mjs` concentra cabeçalho, rodapé, escape e ícones. `hero.mjs`, `plans.mjs` e `home-sections.mjs` compõem a Home; `benefits.mjs`, `customer.mjs`, `contact.mjs` e `navigation.mjs` compõem as páginas internas. A composição explícita das 12 páginas fica no build para tornar a ordem visível.

## Runtime no navegador

Cada página importa `src/client.mjs` uma vez como módulo. Ele monta `mountSupportAssistant`, `mountCarousel`, `mountPageMotion`, `mountNavigation`, `mountContact`, `mountMedia` e `mountCoverageDock`, nessa ordem. Cada comportamento registra listeners uma vez por documento; este site navega por recarga de página, sem roteador de cliente nem remontagem dinâmica. Componentes opcionais são testados antes de usar o DOM. Menu, diálogo de contato e cabeçalho são elementos compartilhados presentes nas páginas.

`client/navigation.mjs` lida com menu, âncoras de explicação, cabeçalho e marca de reserva. `client/contact.mjs` liga WhatsApp, diálogo, formulários e barra de cobertura às regras puras de `lib/whatsapp.mjs`. Os formulários só habilitam envio depois de instalar seus handlers; sem JavaScript ou com falha de importação, continuam desabilitados. `client/media.mjs` monta movimento, vídeos e preferência de redução de movimento. `lib/carousel.mjs`, `lib/hero-video.mjs` e `lib/support-assistant.mjs` mantêm seus próprios estados locais.

Menu aberto aparece em classe e `aria-expanded`; slide ativo em classe, `inert`, ARIA e `data-active-slide`. Vídeos acompanham pausa, preferência do sistema, economia de dados, visibilidade e falha em closures próprias. Formulários exibem erros e prévia com `textContent`; o link externo só surge após validação e confirmação do visitante. O atendimento guarda apenas estado em memória, inclusive seu atraso de 11 segundos. Não há gerenciador de estado central porque as interações não compartilham um ciclo de vida complexo.

## Configuração

`src/config.mjs` contém preços residenciais, textos, contatos, cobertura, marca e referências de aprovação. É copiado para `dist/src/` e deve conter somente dados públicos. `src/routes.mjs` guarda caminhos, títulos, descrições e participação no menu. `scripts/security.mjs` guarda a política técnica de entrega; revisão de cache e base do Pages são decisões de build/publicação, não dados comerciais.

## Componentes

Os templates retornam HTML no build, sem depender de `window` ou `document`. A divisão acompanha páginas e seções existentes, sem framework de componentes. Repetições pequenas de marcação foram mantidas quando a alternativa criaria uma abstração sem regra compartilhada. Imagens e vídeos de um componente devem constar em seus arrays/exportações de assets usados por `scripts/build-files.mjs`.

## Bibliotecas internas

`lib/whatsapp.mjs` mantém parsing de plano, validação e composição de mensagens testáveis isoladamente. `lib/carousel.mjs` controla o carrossel; `lib/hero-video.mjs` mantém poster e fallback de reprodução; `lib/support-assistant.mjs` controla o widget humano. Os três últimos acessam DOM apenas ao montar seus componentes. O grafo de imports do navegador é verificado para não incluir módulos Node, ciclos ou módulos órfãos.

## Segurança relevante

[SECURITY_AUDIT.md](SECURITY_AUDIT.md) é o baseline. A CSP, o hash do fallback sem JavaScript, os headers locais e o gate de publicação permanecem em vigor. O cliente usa `textContent` para dados do visitante e não usa sinks de HTML ou execução dinâmica. Os módulos novos entram na mesma allowlist restrita de `dist/`. O certificado do portal externo e os headers da hospedagem pública continuam pendências externas; o build local não os corrige.

## Testes

Execute `npm test`, `npm run build` e `npm run check:dist`. Os 56 testes Node cobrem regras comerciais, rotas, HTML, mídia, publicação, preparação idempotente do Pages, grafo de módulos e revisão de cache. Com a prévia ativa (`npm run preview`), execute os cinco `scripts/check-*-browser.mjs` usando `AMR_ORIGIN` e `AMR_PLAYWRIGHT_ROOT` conforme o README e a auditoria. Eles cobrem navegação, formulários, mídia, atendimento e regressões de segurança. `dist/` deve conter 44 arquivos selecionados: 12 HTML, três CSS, nove JS, 18 mídias e dois de indexação.

## Publicação

`npm run prepublish:check` exige domínio HTTPS, aprovações e textos legais completos antes da liberação. O workflow fixa as Actions, separa build e deploy e envia só `dist/`. `scripts/prepare-pages.mjs` adapta caminhos locais à base `/AMRTELECOM/` sem duplicá-la em execuções repetidas. A hospedagem final ainda deve aplicar os headers de `scripts/security.mjs` e passar em `npm run check:hosting` depois de configurada.

## Como adicionar uma nova página

1. Acrescente caminho, arquivo, título e descrição em `src/routes.mjs`.
2. Crie o conteúdo em um componente adequado e acrescente a composição em `scripts/build.mjs`; use `interiorPage()` para uma página interna comum.
3. Acrescente apenas as mídias realmente usadas à lista de assets do componente, se houver.
4. Ajuste navegação/testes conforme a página e rode os checks de build e navegador.

## Como adicionar um novo componente

Coloque a geração de HTML no arquivo de domínio já existente quando couber. Extraia um arquivo apenas se a seção tiver responsabilidade própria. Use `escape()` para texto de configuração inserido em HTML e registre mídias usadas na allowlist. Não acrescente JavaScript ao template se um comportamento existente resolver a interação.

## Como adicionar comportamento JS

Escolha o módulo de `src/client/` ou `src/lib/` que possui a interação. Mantenha regras de transformação puras em `lib/` quando forem compartilhadas ou testadas sem DOM. Monte o comportamento uma vez pela entrada `src/client.mjs`, preserve o fallback sem JS, registre novos módulos em `scripts/build-files.mjs` e cubra o fluxo relevante em testes de navegador. A CSP não deve ser afrouxada para adicionar um comportamento.

## Decisão sobre o CSS

As regras repetidas inspecionadas atuam em larguras distintas: tablet e celular precisam de valores diferentes. Os `!important` examinados preservam estados de pausa, movimento reduzido ou elementos ocultos. O CSS permanece intacto para conservar a apresentação. Revise uma seção por vez se ela precisar mudar no futuro, com comparação visual nas larguras afetadas.
