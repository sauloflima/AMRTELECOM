# Design QA da Home AMR Telecom

## Evidências

- Fonte visual: `/Users/saulolima/projeto AMR provedor/public/assets/references/site de referencia para layout .png`.
- Dimensão original da fonte: 2838 × 9114 px.
- Implementação: `http://127.0.0.1:4173/`.
- Captura da implementação: `/Users/saulolima/projeto AMR provedor/final-polish/desktop-final.png`, viewport 1440 × 1000 CSS px, densidade 1x.
- Mobile: viewport do iPhone 13 Pro em 390 × 844 CSS px, densidade 1x.
- Estado: Home pública, slide inicial, sem dados comerciais adicionais e sem depoimentos não aprovados.
- Comparação conjunta: `final-refinement/compare.html`, com a referência original e `final-polish/desktop-final.png` abertas lado a lado no mesmo passe visual.
- Regiões focadas: hero e consulta, cartões de planos, benefícios, cartões de rotina, empresas, atendimento e rodapé foram inspecionados separadamente em desktop. Hero, formulário, menu e cartões de planos foram inspecionados no iPhone 13 Pro.

## Superfícies verificadas

- Tipografia: hierarquia forte, pesos coerentes, títulos com quebra controlada e corpo com 16 px nas áreas principais. Rótulos e textos auxiliares permanecem legíveis.
- Espaçamento e layout: hero mais horizontal, consulta imediatamente conectada à mensagem, planos visíveis mais cedo, três cartões alinhados e ritmo posterior próximo à referência sem reproduzir seu layout.
- Cores e tokens: azul-marinho, azul elétrico, branco e azul-claro próprios da AMR. Contraste automatizado aprovado.
- Imagens: casa 3D, perfis de rotina, escritório e atendimento usam assets originais do projeto, com recorte nítido e sem reaproveitar imagens da referência.
- Conteúdo: preços, velocidades, benefícios, disponibilidade e fluxo de WhatsApp preservados. Depoimentos continuam ocultos por ausência de conteúdo aprovado.
- Ícones e controles: família de ícones consistente, setas e indicadores com área mínima de 44 px, foco visível e estados ativos claros.
- Responsividade: sem rolagem horizontal em 1440, 768, 390 e 360 px; menu abre e fecha com Escape; formulário concentra foco no primeiro campo inválido.
- Movimento: carrossel manual preservado e `prefers-reduced-motion` mantém animações e transições decorativas desligadas.

## Histórico de comparação

### Rodada 1

- [P2] Hero ainda alto em relação à proximidade entre mensagem, consulta e planos da referência. Implementação com cerca de 641 px até o início dos planos.
- [P2] Cartões de planos com aproximadamente 666 px e catálogo ainda mais longo do que o necessário.
- [P1] No mobile, `overflow:hidden` permitia que o foco do carrossel deslocasse internamente o painel e escondesse parte do slide.

Correções: altura-base do carrossel reduzida, preenchimentos e mídia dos planos compactados, preço e velocidade preservados em destaque, e painel alterado para `overflow:clip`.

### Rodada 2

- Hero desktop reduzido para aproximadamente 621 px incluindo cabeçalho visual, painel e formulário; o título dos planos já aparece na primeira dobra de 720 px.
- Cartões desktop reduzidos para aproximadamente 613 px, mantendo benefícios e botões completos.
- Carrossel mobile sem deslocamento interno, com `scrollTop` do painel igual a zero.
- Nenhuma diferença P0, P1 ou P2 restante. As diferenças de marca, cor, copy, dados comerciais e ausência de depoimentos são intencionais e necessárias.

### Rodada 3: refinamento de ícones

- [P2] O carrossel ainda exibia numeração junto aos indicadores e os ícones desenhados no projeto tinham pesos e geometrias diferentes entre componentes.
- [P2] No primeiro passe mobile, o novo ícone de menu ficou com contraste insuficiente sobre o cabeçalho azul-marinho.

Correções: a numeração visual foi removida sem perder os nomes acessíveis dos slides; todos os ícones de interface passaram a usar a mesma família Iconoir; setas, indicadores, selos e ícones de benefícios receberam escala e contraste mais discretos; o menu mobile e os controles do slide escuro tiveram o contraste corrigido.

Evidência posterior: captura ao vivo no navegador integrado em 1280 × 720 e 390 × 844, sem números visíveis nos indicadores, com controles de 44 × 44 px, sem rolagem horizontal e com ícones consistentes. A região de benefícios foi inspecionada em aproximação para verificar peso de traço e alinhamento.

### Rodada 4: refinamento final comercial

- [P2] A numeração ainda aparecia sobre as fotografias dos planos e o selo do plano destacado herdava largura excessiva de uma regra antiga.
- [P2] Links de suporte tinham altura visual menor que a área recomendada para toque.
- [P2] Benefícios, vídeo institucional e FAQ precisavam de uma composição mais sólida e compacta.

Correções: números removidos dos cartões; selo convertido em pílula curta no canto; áreas de toque ampliadas; benefícios reorganizados em painel editorial com divisórias e ícones maiores; vídeo com poster, controles, `playsInline` e carregamento por metadados; FAQ compacta adicionada antes do CTA. A comparação final manteve a proximidade entre hero, consulta e planos observada na referência, com identidade, composição, cores, imagens e conteúdo próprios da AMR.

Nenhuma diferença P0, P1 ou P2 restante.

### Rodada 5: polimento final da Home

- [P2] O slide de velocidades apresentava 200, 500 e 700 Mega como números soltos, competindo com o título e a casa.
- [P2] Preços, textos auxiliares e detalhes dos planos tinham peso e alinhamento óptico irregulares.
- [P2] O botão do vídeo ficava no canto e o título quebrava em linhas curtas demais.
- [P2] A FAQ dependia apenas de divisórias horizontais e tinha resposta visual discreta em foco.

Correções: velocidades reunidas em um seletor visual compacto; título do segundo slide reescrito sem alterar dados comerciais; números com alinhamento tabular; benefícios e CTAs alinhados; textos pequenos ampliados; vídeo mantido em 16:9 com botão central e coluna de texto rebalanceada; FAQ convertida em itens compactos com foco, hover e estado aberto consistentes.

Evidências focadas: `final-polish/plans-final.png`, `final-polish/video-final.png` e `final-polish/faq-final.png`. Foram verificadas tipografia, ritmo, tokens, qualidade das mídias, ícones Iconoir, conteúdo preservado, estados e responsividade.

Pós-correção: sem diferenças P0, P1 ou P2 restantes. As diferenças de marca, paleta, texto e imagens em relação à referência são intencionais.

## Interações testadas

- Menu mobile abre, fecha com Escape e atualiza `aria-expanded`.
- Formulário vazio marca CEP e referência como inválidos, informa o erro e move o foco para CEP.
- Carrossel responde ao teclado e mantém slides inativos fora da navegação.
- Console sem avisos ou erros nos estados verificados.
- Carrossel sem numeração visível, com três indicadores acessíveis e áreas de toque de 44 px.
- Ícones oficiais da mesma família conferidos no cabeçalho, hero, formulário, benefícios e botões.
- Vídeo institucional iniciou pelo controle personalizado e expôs controles nativos.
- FAQ nativa abriu e fechou sem JavaScript adicional.
- `npm test`: 35 testes aprovados.
- `npm run build`: 12 páginas estáticas geradas.

## Resultado final

final result: passed

## Refinamento do slide 2 — 26/09/2026

Referências consultadas: https://www.niointernet.com.br/ e https://fiber.google.com/internet/. Usadas para hierarquia de ofertas e diferenciação por uso, sem copiar conteúdo, marca ou imagens.

Fonte visual: slide 2 existente em http://127.0.0.1:4173/, capturado antes da edição. Implementação: mesma URL e slide, após a edição. As duas capturas de 1280 × 720 pixels, viewport 1280 × 720 CSS px (1x), foram abertas juntas na conversa pela ferramenta CUA, sob “Comparar antes e depois e verificar erros”. As capturas desta rodada estão na conversa, não foram exportadas para arquivos locais. Carrossel pausado apenas na aba temporária para comparação; autoplay padrão continua em 10 segundos.

- Tipografia: família e título existentes preservados. Hierarquia explícita entre velocidade, mensalidade e tipo de uso.
- Layout: três cartões com ações alinhadas; mesma altura do hero no desktop. O bloco visual no celular ganhou espaço para os preços e os ícones. Estrutura de rolagem preservada.
- Cores: fundo branco preservado; plano destacado em azul com texto branco. Contraste mínimo do novo gradiente: 4,86:1.
- Assets: casa e logo PNG originais reutilizados, com transparência; ícones Iconoir já instalados. Vídeos preservados.
- Conteúdo: valores provenientes de config.plans, incluindo aviso acessível quando commercialConfirmed é falso; títulos, destinos e condições preservados.
- Movimento: entrada escalonada, ícones ascendentes com ciclo de 6,8 s, reflexo na marca e pulso na linha existente. Movimento restrito ao slide ativo e à ausência de prefers-reduced-motion. Controle de pausa verificado no navegador: todos os novos efeitos computados como animation-name: none.

Histórico da revisão:
1. [P2] A casa concorria com o controle de pausa no desktop; escala e posição corrigidas.
2. [P2] Em 320 px, o valor de 700 Mega e os rodapés quebravam de forma desigual; tamanho do preço, setas e alinhamento corrigidos.
3. Comparação posterior em 320 px: sem overflow, três preços com altura de 43,90 px e três ações na mesma coordenada vertical. Casa inteira acima das ofertas.
4. Comparação conjunta antes/depois em 1280 px: sem corte de mídia ou sobreposição com controles; alterações de cartões, logo e cores são intencionais. Regiões de preços e ações inspecionadas nas capturas ampliadas de celular e tablet.
5. Novo gradiente ajustado após cálculo de contraste (de 4,29:1 para 4,86:1 no extremo mais claro).

Validação: 47 testes aprovados, build das 12 páginas concluído; console sem erros na aba de revisão. Link de 500 Mega abre a consulta com o plano correto. Conferidos desktop 1280 px, tablet 768 px, celulares 390 e 320 px. Não houve medição de Core Web Vitals nem emulação do movimento reduzido do sistema nesta rodada; essa proteção foi conferida no CSS e nos testes existentes. Nenhuma biblioteca, vídeo ou raster novo foi adicionado.

final result: passed

## Slide empresarial e suporte — 26/09/2026

Esta rodada substitui o slide residencial de velocidades descrito em “Refinamento do slide 2” acima. As notas anteriores permanecem como histórico; os preços de 200, 500 e 700 Mega continuam nos cartões residenciais da Home e em `/planos.html`.

- O segundo slide agora apresenta um prédio comercial em vídeo, com a mensagem “Sua empresa conectada. Suporte por perto.” e convite para conversar sobre as necessidades da operação. Não anuncia preço empresarial.
- O vídeo `amr-empresa-hero.mp4` usa o material enviado para esta rodada, sem áudio, com a marca AMR integrada aos segundos finais e poster estático. A transição nas bordas foi reduzida a uma sangria suave, sem moldura ou sombra grossa. Os vídeos dos outros slides e a estrutura de rolagem foram preservados.
- O texto do hero, do cartão empresarial, da seção empresarial da Home e da página `/empresas.html` reforça o suporte técnico com atendimento humano. A solução é avaliada por consulta; equipamentos, condições e cobertura dependem de confirmação da equipe.
- O vídeo só é ativado quando o slide está visível. A reprodução respeita a pausa dos efeitos, aba oculta, economia de dados e `prefers-reduced-motion`. O carrossel mantém avanço automático de 10 segundos e controles manuais.

Validação desta rodada: 50 testes aprovados, build das 12 páginas e `check:dist` concluídos. Inspeção em 1440 e 390 px sem rolagem horizontal nem erros no console; o vídeo tocou no slide ativo. Core Web Vitals não foram medidos.
