# AMR Telecom: hero com casa conectada

Implementação local concluída em 11/09/2026, preservando a arquitetura estática, as 12 páginas, os materiais originais e `src/config.mjs`.

## Melhorias

- Casa 3D original, com transparência, iluminação noturna e fibra azul. Sem texto, preços ou marca incorporada.
- Hero com mensagem curta e consulta por CEP e número ou referência. Máscara de CEP, mensagens acessíveis, foco no primeiro erro e proteção contra envio acidental sem JavaScript.
- Integração com o fluxo existente de WhatsApp. A consulta nunca afirma cobertura automática. Não armazena os dados preenchidos.
- Halo, três linhas de fibra, três pontos luminosos e brilho suave. Movimento discreto pelo mouse somente em desktop, botão de pausa e respeito a `prefers-reduced-motion`.
- Planos imediatamente após o hero e também na página própria, com superfícies branco, azul-claro e azul-marinho, fundos abstratos por perfil, velocidade/preço lado a lado e um único destaque.
- Preservados 200 Mega/R$ 65, 500 Mega/R$ 80 e 700 Mega/R$ 100, assim como condições, avisos e links de consulta por plano.
- Ajustes finais de legibilidade e alinhamento em tablet. Casa abaixo do formulário no celular, inteira dentro da composição.

## Arquivos alterados e novos

- `src/components/hero.mjs`: nova composição e formulário rápido.
- `src/components/plans.mjs`: apresentação editorial compartilhada entre início e planos.
- `src/home.css`: estilos responsivos e efeitos isolados das demais páginas.
- `src/client.mjs`: validação, máscara, continuidade no WhatsApp e controles de movimento.
- `src/lib/whatsapp.mjs`: validação e mensagem da consulta rápida.
- `scripts/build.mjs`: planos na home, cópia do asset/estilos e privacidade correspondente ao novo formulário.
- `tests/routes.test.mjs`: ordem do hero/planos e estrutura da home.
- `tests/quick-coverage.test.mjs`: CEP, referência, mensagem, URL e segurança sem JavaScript.
- `public/assets/generated/amr-casa-conectada-3d.png`: imagem original gerada, 1254 × 1254 pixels, PNG com canal alfa.
- `README.md` e este relatório.
- `dist/`: saída atualizada pelo build.
- `redesign-hero/`: capturas de verificação e cópia de segurança anterior em `baseline/`.

## Testes e evidências

- `npm test`: 20 testes aprovados.
- `npm run build`: 12 páginas geradas sem erro.
- Site executado em `http://127.0.0.1:4173/`.
- Home verificada em 320, 390, 768, 1024 e 1440 pixels de largura. Sem rolagem horizontal, transbordamento do formulário ou sobreposição das métricas dos planos.
- Botão da consulta rápida visível sem rolagem nas telas móveis verificadas. Em 320 pixels, sua borda inferior fica aproximadamente a 528 pixels do topo.
- Todas as outras 11 páginas verificadas em 320 e 1440 pixels: um H1 por página, sem rolagem horizontal ou imagens quebradas. Nenhum travessão nos textos gerados.
- Consulta vazia: erros associados aos campos, aviso anunciado e foco no CEP. Consulta válida: CEP formatado e indisponibilidade do canal apresentada sem simular envio.
- Seleção de 700 Mega encaminha à cobertura e mantém o plano de interesse.
- Pausa dos efeitos verificada na interface e no estado das animações. A regra de movimento reduzido foi conferida no código; não houve emulação da preferência do sistema.
- Console sem avisos ou erros durante as verificações.
- Capturas: `redesign-hero/desktop.png`, `mobile.png`, `mobile-320.png`, `planos-desktop.png`, `planos-mobile.png` e `tablet.png`.

As verificações móveis foram realizadas por dimensões de viewport no navegador, não em aparelhos físicos. O envio real de WhatsApp não foi testado: o número oficial permanece vazio na configuração. A montagem da URL e da mensagem foi validada em testes automatizados, sem enviar mensagens a terceiros.

## Asset e proveniência

Modo: ferramenta nativa de geração de imagem, uma geração original. Integração realizada conforme a skill Imagegen. O fluxo de Sites orientou a preservação do projeto e da prévia local, sem publicação.

Destino solicitado: `public/assets/generated/amr-casa-conectada-3d.png`.

Prompt utilizado:

> Use case: stylized-concept. Create one original high-resolution 3D architectural illustration for the AMR Telecom website hero, NOT a webpage mockup. Subject: a contemporary two-story Brazilian residence in three-quarter perspective, complete freestanding house fully visible with generous margins and a modest thin ground plinth. Sophisticated nighttime lighting, navy blue architectural walls with white stone and glass, controlled electric-blue light accents, discreet warm-white illuminated interior rooms. Elegant abstract Wi-Fi signal above the roof made of three slender glasslike blue arcs, and a few fine blue fiber-optic light strands arriving from the lower left into the residence. Restrained refined glow, realistic premium architectural materials, excellent anti-aliased details, physically plausible proportions, high-end art-directed 3D render. Entire house, Wi-Fi arcs and fibers must fit inside the image, no clipped edges. Composition roughly square, house occupies about 75 percent of image; camera sees front and right side. Background deep uniform midnight navy #020B18, seamless and easily blended into a website hero. Prefer actual transparent background if supported. No text, no prices, no lettering, no logos, no watermark, no people, no extra floating household objects, no game controllers, no neon green, no magenta, no smoke, no glitter. This is an original architectural concept, not based on or copying any competitor asset. Output a high resolution PNG, ideally 2048 by 2048.

## Pendências já existentes

WhatsApp, demais contatos oficiais, domínio e confirmação comercial continuam pendentes. Não foram inventados nem alterados. O site mantém os avisos e o bloqueio de indexação até a configuração definitiva. Nenhuma publicação foi realizada.
