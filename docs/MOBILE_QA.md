# Correção mobile da AMR Telecom

26/09/2026. Implementação e validação local concluídas. Sem novas dependências ou publicação.

## Causas confirmadas

1. O atendimento abria o card após 11 segundos em qualquer largura. O cálculo de colisões movia o widget inteiro durante a rolagem. Em 390 px, o card automático cobria boa parte da casa.
2. `inView`, calculado pela `.hero-house`, controlava a pausa geral do hero. Em 390 × 400 px, o texto empresarial estava visível e a casa fora da tela: `.enterprise-stage` ficava com `animation-play-state: paused`.
3. Os três vídeos já reproduziam no Chrome mobile emulado quando tinham área visível. Não havia uma regra CSS que proibisse todos os vídeos no celular. O cabeçalho de 84 px, os espaçamentos e a casa pequena dificultavam perceber a mídia.
4. A rejeição de autoplay mantinha o poster, mas não oferecia um botão específico para iniciar o vídeo. Além disso, erros de `<source>` não chegavam ao listener de erro de `<video>`. O poster do atendimento também precisava voltar a ficar visível ao ativar economia de dados depois da reprodução.
5. A função `coverageDock()` existia, mas não era incluída pelo build atual. Foi reconectada para cumprir o requisito da barra fixa e testar a convivência com o atendimento.

A cascata ativa é `styles.css` → `home-refresh.css` → `support-assistant.css`. `home.css` é histórico, não é carregado nem copiado pelo build, e não foi alterado. O anexo disponível continha somente o brief em texto; a referência visual foi capturada no site local antes da edição.

## Correções

- Até 800 px: avatar de 52 px após 11 s, botão semântico com nome acessível, `aria-controls` e `aria-expanded`. Card abre por toque, clique, Enter ou Espaço; WhatsApp permanece dentro do card. Tab alcança o fechamento e a ação. Escape e o fechamento devolvem o foco.
- O card respeita largura, altura visual, áreas seguras e barra de cobertura. Só o card procura uma posição acima dos controles. Rolar ou tocar fora recolhe o card; o avatar mantém sua posição e é temporariamente oculto quando conflita com controles essenciais. Menu, modal, formulário em uso e rodapé têm prioridade. Não há armazenamento de dados ou reabertura automática do card mobile durante a sessão, recarga ou retorno pelo histórico.
- Desktop: convite automático, avatar de 64 px e link direto para WhatsApp preservados.
- Cabeçalho da Home em celular/tablet reduzido a 68 px; espaçamento do hero reduzido, casa ampliada e controles ajustados nas telas estreitas. Mesmos títulos, paleta, vídeos e composição desktop. A altura comum dos slides mantém a estrutura de rolagem estável.
- Visibilidade dos efeitos acompanha texto, mídia e ícones separadamente. Vídeos continuam condicionados a slide ativo, visibilidade, aba, pausa, movimento reduzido e economia de dados. Parallax fica restrito ao mouse; o toque mantém vídeos, entradas e gestos do carrossel.
- O controlador de vídeo compartilhado oferece “Reproduzir vídeo” após bloqueio, evita tentativas repetidas e mantém o poster em erro. Atende aos três slides e ao vídeo da seção empresarial.

Conteúdo comercial, preços residenciais, formulário, URLs e mídias preservados. O segundo slide continua empresarial, com prédio comercial, suporte humano e solução sob consulta. `customerPortalUrl` permanece vazio.

## Capturas

[Galeria comparativa](mobile-qa/index.html)

| Referência | Resultado |
| --- | --- |
| [Mobile antes, card automático](mobile-qa/before/390-support.png) | [Mobile recolhido](mobile-qa/after/390-support-closed.png) · [Mobile aberto por toque](mobile-qa/after/390-support-open.png) |
| [Desktop antes](mobile-qa/before/1440-support.png) | [Desktop depois, aberto](mobile-qa/after/1440-support-open.png) · [Recolhido](mobile-qa/after/1440-support-closed.png) |
| [Empresarial antes](mobile-qa/before/390-slide-2.png) | [Empresarial depois](mobile-qa/after/390x844-slide-2-b.png) |
| Pouca altura | [Atendimento em 390 × 400](mobile-qa/support/short-390x400.png) |

As capturas preservam os frames reais; quadros diferentes do mesmo vídeo não representam mudança de asset.

## Animações em execução

Chrome 153.0.8010.53, sem congelar relógio ou animações nos testes de mídia. Foram salvos dois frames por slide e viewport. Exemplo em 390 × 844 px:

| Slide | Reprodução observada | Pausa | Retomada |
| --- | --- | --- | --- |
| 1 | 0.874 → 1.426 s | 1.491 s (inalterado por 250 ms) | 1.801 s |
| 2 | 1.386 → 1.955 s | 2.032 s (inalterado por 250 ms) | 2.348 s |
| 3 | 0.382 → 1.014 s | 1.140 s (inalterado por 250 ms) | 1.469 s |

Os tempos das animações CSS de entrada também avançaram enquanto o texto estava visível, inclusive em 390 × 400. Após “Pausar efeitos”, nenhum efeito do hero ficou em estado `running`. Ao sair da tela, os vídeos e ícones pararam. O quarto vídeo, na seção empresarial, também foi verificado com seu controle próprio.

[Todos os tempos e estados](mobile-qa/after/animation-measurements.json). [Log de mídia](mobile-qa/motion.log) · [log do atendimento](mobile-qa/support.log). [Frames da casa](mobile-qa/after/390x844-slide-1-a.png) · [frame seguinte](mobile-qa/after/390x844-slide-1-b.png).

Safari 27.2 no macOS foi conferido pela interface nativa: três slides, reprodução, pausa e retomada. Duas capturas da região do vídeo da casa durante a pausa tiveram SSIM 1,000000 (região idêntica); após a retomada, 0,710415. As regiões dos vídeos empresarial e de atendimento também mudaram entre as capturas. Esses valores documentam mudança de frames, não são uma nota de qualidade. [Registro e regiões comparadas](mobile-qa/after/safari-pixel-measurements.json).

## Resultado dos testes

| Verificação | Resultado |
| --- | --- |
| `npm test` | 51 testes aprovados |
| `npm run build` | 12 páginas geradas |
| `npm run check:dist` | 40 arquivos permitidos, aprovado |
| `check-mobile-browser.mjs` | 360 × 640, 390 × 844, 430 × 932, 768 × 1024, 1440 × 950 e 390 × 400; três slides, mídia, entrada, pausa/retomada, posters, toque, preferências e falhas |
| `check-support-browser.mjs` | 320, 360, 390, 430, 768, 1024 e 1440 px, mais 390 × 400; delay real de 11 s, toque/teclado, foco, sessão, menu, modal, formulários, barra e limites |
| `check-pages-browser.mjs` | 12 rotas em seis larguras; 18 destinos e 42 ações de contato; menu e teclado |
| `check-form-browser.mjs` | Normal, sem JavaScript e falha de script |
| `check-security-browser.mjs` | CSP, iframe, arquivos fora do build, menu sem JavaScript |

Sem rolagem horizontal ou erros inesperados de JavaScript/console nos cenários verificados. Falhas de MP4 e bloqueio de autoplay foram provocados deliberadamente em contextos de teste. Os links WhatsApp foram interceptados localmente para conferir número e mensagem, sem enviar mensagens.

## Arquivos alterados

- `src/components/support-assistant.mjs`, `src/lib/support-assistant.mjs`, `src/support-assistant.css`: semântica, abertura e posicionamento.
- `src/components/hero.mjs`, `src/lib/hero-video.mjs`: recuperação acessível e tratamento de falhas de vídeo.
- `src/client.mjs`, `src/home-refresh.css`, `src/styles.css`: visibilidade independente, layout e estados de movimento.
- `scripts/build.mjs`: inclusão do componente de cobertura já existente.
- `tests/hero-video.test.mjs`, `scripts/check-support-browser.mjs`: regressões de autoplay, erro, foco, sessão e mobile.
- `scripts/check-mobile-browser.mjs`: nova verificação de mídia e movimento no navegador.
- `README.md`, `SUPPORT_ASSISTANT.md`, este relatório e `mobile-qa/`: documentação e evidências.

`src/lib/carousel.mjs` foi inspecionado e testado; não precisou de alteração. [Diff desta tarefa](mobile-qa/changes.patch).

## Reprodução e limites

Com o servidor local ativo, defina `AMR_PLAYWRIGHT_ROOT` para a pasta que já contém Playwright e execute `node scripts/check-mobile-browser.mjs` e `node scripts/check-support-browser.mjs`. Neste ambiente foi usado `/Users/saulolima/.cache/codex-runtimes/codex-primary-runtime/dependencies/node`. Não houve instalação de pacote.

- Chrome: navegador real com viewport e toque emulados; não é aparelho físico.
- Safari: navegador nativo do Mac. O WebDriver recusou a sessão porque “Allow remote automation” está desativado; nenhuma configuração foi alterada. A conferência foi feita pela UI.
- Não foi possível testar Safari/iOS em iPhone físico. Teclado virtual e recortes físicos da tela não foram testados em aparelho: foram verificados foco de formulário, redução da viewport e limites CSS/VisualViewport.
- Não foram medidos Core Web Vitals, consumo de bateria nem rede celular real.
- As quatro pendências de pré-publicação existentes continuam com indexação desativada; não houve deploy.
