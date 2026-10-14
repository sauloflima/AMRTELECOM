# Atendimento humano flutuante da AMR

Implementado nas 12 páginas, sem deploy e sem novas dependências. Revisão mobile de 26/09/2026: resultados e capturas em [MOBILE_QA.md](MOBILE_QA.md).

## Componente e configuração

`WhatsAppAssistant` gera o HTML no build. `mountSupportAssistant` cuida do comportamento no navegador; os estilos ficam em um CSS próprio. A implementação reutiliza os ícones, a tipografia e os tokens de cores, bordas, radius e sombras existentes.

- WhatsApp encontrado em `src/config.mjs`, campo `contact.whatsapp`: **5581993467014**, ou **(81) 99346-7014**.
- URL gerada pelo helper existente `src/lib/whatsapp.mjs`, com `encodeURIComponent`.
- Mensagem centralizada em `messages.assistant`: “Olá! Vim pelo site da AMR Telecom e gostaria de atendimento.”
- No desktop, avatar e CTA abrem o mesmo destino em nova aba, com `target="_blank"` e `rel="noopener noreferrer"`. Até 800 px, o avatar é um botão com `aria-expanded` e `aria-controls`, que abre o card; o WhatsApp fica no CTA.
- Não há chatbot, coleta de dados ou envio automático de mensagens.

## Delay por abertura da página

No desktop, o convite em cada abertura ou recarregamento aguarda **11.000 ms**, com entrada de **420 ms**, sem bounce ou pulsação contínua. O botão X fecha somente o balão e devolve o foco ao avatar.

No desktop, o balão e o avatar aguardam 11 segundos a cada abertura, recarregamento ou retorno pelo histórico. Fechar o balão conserva apenas o avatar até a próxima abertura. No mobile, somente o avatar aparece após esse atraso, inclusive em recarga e histórico. O card abre exclusivamente por interação, e permanece recolhido após fechar, rolar ou tocar fora. Tab alcança o fechamento e o CTA; Escape fecha e devolve o foco ao avatar. A antiga chave `amrSupportPromptShown` não é mais lida nem gravada. O comportamento também funciona com armazenamento bloqueado. Nenhum dado de formulário é armazenado.

## Imagem e apresentação

Foi reutilizado o JPG já existente da mesma personagem: `public/assets/generated/amr-atendimento-humano-3d.jpg` (1536 × 1024, aproximadamente 302 KB). O PNG original e o JPG não foram modificados.

O recorte é exclusivamente por CSS: janela circular com `overflow:hidden`, imagem ampliada e deslocada para enquadrar cabelo, rosto, headset e microfone, sobre o azul já presente. Não foram criados rosto ou cenário novos. Notebook, balcão, casa e plantas ficam fora do recorte.

A imagem tem dimensões declaradas, decodificação assíncrona e `fetchpriority="low"`. Carrega durante o intervalo inicial para reduzir a chance de um círculo vazio na entrada. O widget usa posição fixa e não desloca o conteúdo da página. Core Web Vitals não foram medidos.

## Desktop, mobile e conflitos

- Desktop: avatar de **64 px**, margens-base de **24 px**, balão branco à esquerda, borda azul e indicador verde de 13 px. Hover discreto de 1,04 apenas com mouse e movimento permitido.
- Mobile até 800 px: avatar de **52 px**, margens-base de **16 px**, safe-area e card de até 292 px, limitado também à altura da viewport visual.
- O antigo botão `.mobile-whatsapp` foi substituído para evitar duplicação.
- A barra `.coverage-dock` foi preservada; o widget fica acima dela considerando sua altura real.
- No desktop, a proteção de sobreposição existente continua reposicionando o widget. No mobile, só o card procura espaço acima dos controles; o avatar fica fixo e é temporariamente oculto quando conflita com uma ação essencial. Rolar recolhe o card, evitando saltos durante a navegação.
- Menu aberto, diálogo, formulário em uso e rodapé visível suspendem temporariamente o widget. Os canais existentes no rodapé permanecem disponíveis.

A revisão mobile ajusta o hero, o cabeçalho e a lógica de mídia; textos institucionais, planos, preços, destinos e regras comerciais foram preservados. `customerPortalUrl` continua vazio.

## Acessibilidade

Links e botão nativos, rótulos acessíveis, foco visível, uso por Tab/Shift+Tab/Enter, botão de fechar com área de 44 × 44 px e contraste AA. O indicador visual é decorativo e não anuncia horário ou disponibilidade em tempo real. O widget respeita `prefers-reduced-motion` e a pausa de efeitos existente.

## Validação da implementação original

Os números e screenshots desta seção registram a etapa anterior. A validação atual está em [MOBILE_QA.md](MOBILE_QA.md).

- `npm test`: **50 testes aprovados**, incluindo destino configurado, ausência de número e contraste do verde com texto branco.
- `npm run build`: **12 páginas geradas**.
- `npm run check:dist`: **40 arquivos permitidos**, aprovado.
- `scripts/check-support-browser.mjs`: delay real, entrada, textos, fechamento, foco, clique no CTA e Enter no avatar, URL e mensagem, sessão, recarga, histórico, nova sessão, armazenamento bloqueado e ausência de JavaScript.
- Widget validado em **320, 375, 430, 768, 1024 e 1440 px**, sem overflow horizontal nem sobreposição dos botões e campos verificados; barra de cobertura, menu, rodapé e formulário também exercitados.
- `scripts/check-pages-browser.mjs`: 12 rotas em seis larguras, 18 destinos internos e 42 botões de contato.
- `scripts/check-form-browser.mjs`: modo normal, sem JavaScript e falha do script.
- `scripts/check-security-browser.mjs`: verificações existentes de CSP, iframe, arquivos privados e menu sem JavaScript aprovadas.
- Nenhum erro no console nos cenários testados. As aberturas do WhatsApp foram interceptadas localmente para verificar a URL, sem enviar mensagens.

O teste antigo de páginas esperava três cartões de planos, embora o catálogo já tivesse quatro (incluindo empresa). A expectativa foi atualizada para o catálogo existente; nenhum plano foi alterado.

Capturas estão em `support-assistant-qa/`. As pendências anteriores de pré-publicação permanecem; nenhum deploy foi executado.

## Arquivos criados

- [src/components/support-assistant.mjs](</Users/saulolima/projeto AMR provedor/src/components/support-assistant.mjs>)
- [src/lib/support-assistant.mjs](</Users/saulolima/projeto AMR provedor/src/lib/support-assistant.mjs>)
- [src/support-assistant.css](</Users/saulolima/projeto AMR provedor/src/support-assistant.css>)
- [scripts/check-support-browser.mjs](</Users/saulolima/projeto AMR provedor/scripts/check-support-browser.mjs>)
- [SUPPORT_ASSISTANT.md](</Users/saulolima/projeto AMR provedor/SUPPORT_ASSISTANT.md>)

Também foram geradas capturas de QA em `support-assistant-qa/` e a saída local em `dist/`.

## Arquivos alterados

- [src/config.mjs](</Users/saulolima/projeto AMR provedor/src/config.mjs>)
- [src/client.mjs](</Users/saulolima/projeto AMR provedor/src/client.mjs>)
- [src/components/home-sections.mjs](</Users/saulolima/projeto AMR provedor/src/components/home-sections.mjs>)
- [src/home-refresh.css](</Users/saulolima/projeto AMR provedor/src/home-refresh.css>)
- [scripts/build.mjs](</Users/saulolima/projeto AMR provedor/scripts/build.mjs>)
- [scripts/check-publication.mjs](</Users/saulolima/projeto AMR provedor/scripts/check-publication.mjs>)
- [scripts/check-pages-browser.mjs](</Users/saulolima/projeto AMR provedor/scripts/check-pages-browser.mjs>)
- [scripts/check-form-browser.mjs](</Users/saulolima/projeto AMR provedor/scripts/check-form-browser.mjs>)
- [tests/home.test.mjs](</Users/saulolima/projeto AMR provedor/tests/home.test.mjs>)
- [tests/design-system.test.mjs](</Users/saulolima/projeto AMR provedor/tests/design-system.test.mjs>)
- [README.md](</Users/saulolima/projeto AMR provedor/README.md>)

## Refinamento visual solicitado

Balão reduzido de 280 para 248 px no desktop e de 264 para 232 px no mobile, com padding e tipografia menores. A mensagem agora diz “A equipe AMR Telecom está aqui para ajudar.” A logo PNG transparente existente (`config.brand.logoLight`) aparece como marca-d’água a 5,5% de opacidade, decorativa e sem capturar cliques. O espaço até o avatar foi reduzido para 10 px; a proteção de CTAs permanece.

Referências consultadas: [Intercom: identidade, logo e margens do Messenger](https://www.intercom.com/help/en/articles/6612589-set-up-and-customize-the-messenger) e [Tidio: aparência e posicionamento por dispositivo](https://help.tidio.com/hc/en-us/articles/5398825058588-Customize-your-chat-widget). A marca-d’água é uma adaptação ao pedido da AMR, não uma recomendação atribuída às referências.

Validação deste refinamento: 50 testes unitários, build e verificação dos 40 arquivos publicados no diretório local aprovados. Sem deploy.
