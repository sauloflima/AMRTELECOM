# Revisão CSS e design system da AMR Telecom

Data: 12/09/2026. Escopo: apresentação visual, sem alterações em conteúdo comercial, estrutura de páginas, JavaScript ou integrações.

## Evidências e comparação antes da implementação

Site local em execução, HTTP 200. Inspeção em 1440 × 1000 e viewport do iPhone 13 Pro, 390 × 844.

Foram abertas a referência `public/assets/references/site de referencia para layout .png` e a captura fornecida `redesign-home/pagina-desktop.png`. A captura antiga da AMR contém trechos repetidos de composição, portanto não foi usada para atribuir defeitos à versão atual. As capturas novas abaixo documentam a versão realmente executada.

A referência demonstra boa proximidade entre mensagem, ação e catálogo. A AMR preserva sua composição original, casa 3D, fotografias, azul-marinho e azul elétrico. Nenhum material ou conteúdo da referência será incorporado ao site.

1. Hero desktop: boa presença da casa, mas formulário mais estreito e distante da mensagem. [Captura](css-review/01-antes-desktop.png).
2. Planos: velocidade e preço em blocos empilhados, cartões com 868 px de altura no desktop. [Captura](css-review/02-antes-planos.png).
3. iPhone: hero com 878 px; formulário começa a 962 px do topo. CTA fixo ajuda, mas ocupa parte da imagem. Indicadores com largura de 40 px. [Captura](css-review/03-antes-iphone.png).
4. Benefícios: títulos legíveis, porém cabeçalho com grande intervalo entre etiqueta e título. [Captura](css-review/04-antes-beneficios.png).
5. Empresas e rotina: imagem empresarial expressiva; etiquetas brancas de rotina passam sobre áreas variáveis das fotos. [Captura](css-review/05-antes-rotina.png).
6. Rodapé: todos os links presentes; excesso de altura na faixa de marca e espaços pouco uniformes. [Captura](css-review/06-antes-rodape.png).

## Problemas e correções recomendadas

| ID | Problema encontrado | Impacto | Arquivo ou componente | Correção recomendada | Prioridade |
| --- | --- | --- | --- | --- | --- |
| 01 | Cores, raios, alturas e larguras repetidos; três gerações de regras do cabeçalho e rodapé da home. | Variações difíceis de controlar e regressões de cascata. | `src/styles.css`, `src/home.css` | Criar tokens semânticos compartilhados, consumir nos componentes e remover regras redundantes de cabeçalho/rodapé da home. Manter CSS de páginas internas fora da refatoração ampla. | média |
| 02 | Foco global azul-claro sobre superfícies claras; estados de desabilitado pouco distintos. | Controles pouco reconhecíveis por teclado e aparente disponibilidade durante carregamento. | Botões, formulário e links, ambos os CSS | Foco azul-escuro com contraste no tema claro; halo duplo nos cartões com fotos; estado desabilitado legível, sem deslocamento em hover. | alta |
| 03 | Texto branco sobre parte variável das fotos de rotina e etiqueta familiar. | Contraste depende da imagem e da quebra de texto. | `.profile-card`, `.lifestyle-label` | Conter o fundo de contraste na área textual, preservando a parte superior clara da fotografia. | alta |
| 04 | Hero mobile longo e formulário distante; margem inferior e mídia acumulam altura. | Mais rolagem antes da consulta. | `.connected-layout`, `.connected-house`, `.quick-coverage` | Reduzir espaços internos ociosos no celular, manter casa inteira e CTA inicial; integrar formulário mais largo no desktop, com borda azul e campos de pelo menos 56 px. | alta |
| 05 | Planos com preço separado verticalmente da velocidade, linhas e preenchimentos acumulados. | Comparação exige mais rolagem e aspecto de cartão genérico. | `.plan-metrics`, `.plan-body`, `.plan-cost` | Aproximar preço e velocidade onde há largura; usar números tabulares, reduzir linhas decorativas, preservar fotos e alinhamento de CTAs. | média |
| 06 | Cabeçalho usa alturas rígidas e menu expandido conserva cálculo antigo de 76 px. | Fragilidade em zoom, conteúdo ampliado e telas baixas. | Cabeçalho compartilhado | Altura mínima por token, links com área de toque, menu calculado pela altura vigente, suporte a conteúdo ampliado. | média |
| 07 | Espaçamentos entre seções não seguem escala única; título de benefícios isolado à direita. | Ritmo fragmentado apesar dos componentes grandes. | Containers, `.home-heading`, benefícios e empresas | Tokens de largura e respiro; compor etiqueta e título juntos; equilibrar seção empresarial com maior contraste e borda discreta. | média |
| 08 | Links secundários têm pouca resposta visual e controles do carrossel não compartilham estados claros. | Menor percepção de interatividade. | Resumos dos planos, navegação, setas, indicadores | Hover, ativo e foco consistentes, indicadores de pelo menos 44 px, sem depender exclusivamente de movimento. | média |
| 09 | Rodapé gasta altura na faixa de marca e repete regras da home. | Densidade baixa e manutenção duplicada. | `.amr-footer` | Uma única definição compartilhada, reduzir espaços da faixa de marca, manter texto 16 px e links com área de toque confortável. | média |
| 10 | Proteção de movimento reduzido existe, mas deve abranger os novos estados visuais. | Possível regressão de acessibilidade após polimento. | Regras de movimento e testes | Preservar carrossel manual, eliminar transições e transformações decorativas no modo reduzido; adicionar testes de regressão. | média |
| 11 | Folha global contém estilos legados de outras páginas. | Manutenção futura menos simples. | `src/styles.css` | Separar estilos de páginas internas em trabalho futuro, somente após inventário completo. Não necessário para este escopo. | baixa |

## Critérios preservados

- Valores, benefícios, confirmações comerciais, links e fluxo de WhatsApp inalterados.
- Um H1, slides inativos com `inert`, pausa e teclado mantidos.
- Inputs em 16 px ou mais para evitar zoom involuntário no iPhone.
- Sem esconder overflow horizontal como substituto de corrigir o layout.
- Sem introduzir fontes remotas, imagens, dependências ou travessões nos textos visíveis.
- A revisão visual não equivale a certificação WCAG. VoiceOver e aparelho físico não fazem parte da emulação de viewport.

## Implementação e validação

Relatório criado antes das correções. Itens 01 a 10, de prioridade alta e média, implementados. Item 11, de prioridade baixa, reservado para manutenção futura para evitar mudanças de arquitetura fora do escopo.

### Resultado das correções

- Tokens compartilhados para cor, texto, foco, largura, alturas de controles, raios e espaçamento. Removidas as definições repetidas de cabeçalho e rodapé da home.
- Hero desktop com título mais equilibrado e casa ampliada, mantendo cerca de 672 px de painel. Formulário alargado e integrado, com altura reduzida de 234 para 182 px em 1440 px de largura.
- Hero mobile reduzido de 878 para 796 px. Início do formulário passou de aproximadamente 962 para 880 px. Casa inteira preservada, CTA principal no conteúdo e campos de 56 px.
- Planos desktop reduzidos de 868 para cerca de 741 px, com preço e velocidade próximos, três CTAs exatamente alinhados e destaque único preservado.
- Segunda rodada: corrigida a largura interna do preço de três dígitos no celular, indicação de fibra em linha própria e borda do plano destacado uniformizada para eliminar desnível de 1 px nos botões.
- Cabeçalho com navegação de peso médio, altura mínima responsiva e cálculo correto do menu expandido. Rodapé com faixa da marca menor e links de pelo menos 44 px de área de toque.
- Benefícios com título e etiqueta reunidos; painel empresarial com gradação azul discreta; fotos de rotina preservadas com contraste concentrado na área textual.
- Foco azul de alto contraste sobre o tema claro, estados hover/ativo/desabilitado explícitos, indicadores de 44 px e movimento reduzido preservado.

### Testes aprovados

| Verificação | Resultado |
| --- | --- |
| Execução antes e depois | Servidor local respondendo HTTP 200; build de 12 páginas estáticas. |
| Desktop 1440 × 1000 | Hero, formulário, planos, benefícios, empresas, rotina e rodapé inspecionados visualmente. |
| iPhone 13 Pro, viewport 390 × 844 | Hero, formulário com erros, planos, menu, benefícios, empresas e rodapé inspecionados. Sem teste em aparelho físico ou Safari real. |
| Reflow em 320, 360, 390, 768, 1024 e 1440 px | Sem rolagem horizontal da página ou extravasamento interno das métricas dos planos após correção. |
| Tipografia da home | Corpo de texto com pelo menos 16 px; etiquetas, rótulos e links com pelo menos 14 px. |
| Formulário | Campos de 58 px no desktop e 56 px no celular; CEP mascarado, erros associados e foco no primeiro campo inválido. |
| Fluxo comercial | Consulta válida apresenta aviso de canal pendente. Nenhuma mensagem enviada e nenhum número inventado. Link do plano 700 mantém seleção na página de cobertura. |
| Carrossel | Setas, indicadores, ArrowRight, slides inativos com inert, pausa manual e gesto horizontal exercitados no navegador. |
| Navegação | Menu abre, fecha com Escape e mantém estado aria-expanded correto. 18 links do rodapé preservados. Detalhes nativos dos planos abrem normalmente. |
| Contraste | Testes automatizados dos tokens aprovados: texto/ação em superfícies sólidas com contraste mínimo de 4,5:1; foco com pelo menos 3:1. Não equivale a certificação de todas as combinações fotográficas. |
| Movimento reduzido | Testes de lógica comprovam ausência de autoplay quando a preferência está ativa; regressões CSS verificam ausência de animação/transição e transformação da casa. Preferência do sistema operacional não foi alterada. |
| Console | Nenhum aviso ou erro nos estados inspecionados. |
| Build e suíte final | `npm run build` aprovado; `npm test`: 30 testes aprovados, zero falhas. |

### Capturas após a revisão

As imagens foram inspecionadas com a referência, avaliando escala e densidade sem reproduzir sua identidade. A captura fornecida antiga permaneceu intacta.

![Hero desktop após a revisão](css-review/07-depois-desktop.png)

![Hero no iPhone 13 Pro](css-review/08-depois-iphone.png)

![Validação acessível do formulário](css-review/09-formulario-iphone.png)

![Plano no iPhone 13 Pro](css-review/10-planos-iphone.png)

Demais evidências: [planos desktop](css-review/11-planos-desktop.png), [empresas desktop](css-review/12-empresas-desktop.png), [rotina e rodapé desktop](css-review/13-rodape-desktop.png), [benefícios mobile](css-review/14-beneficios-iphone.png), [empresas mobile](css-review/15-empresas-iphone.png) e [rodapé mobile](css-review/16-rodape-iphone.png).

### Arquivos

- `src/styles.css`: tokens, cabeçalho e rodapé compartilhados, estados globais.
- `src/home.css`: hero, formulário, catálogo, benefícios, empresas, rotina, estados e responsividade.
- `tests/design-system.test.mjs`: três testes novos de tokens, contraste e proteções de acessibilidade.
- `CSS_REVIEW.md`: diagnóstico, prioridades, correções e evidências.
- `css-review/*.png`: capturas locais da revisão, fora da publicação.
- `dist/styles.css` e `dist/home.css`: cópias geradas pelo build.

Componentes HTML, configuração comercial, JavaScript, imagens originais e scripts de build não foram alterados.
