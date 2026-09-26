# Redesenho da página inicial AMR Telecom

## Entrega

Hero claro em painel arredondado, casa 3D original, formulário de cobertura centralizado, três planos com fotos, benefícios, bloco empresarial com diagrama tecnológico, cartões por perfil e rodapé escuro em colunas. Barra de cobertura discreta: oculta junto ao formulário, ao rodapé e durante o aviso modal. Efeitos pausam fora da tela e respeitam movimento reduzido.

A referência local `public/assets/references/site de referencia para layout .png` foi inspecionada para proporção, ritmo e hierarquia. Não foi incorporada ao site. Nenhum conteúdo, asset, cor verde ou marca da Nio foi utilizado.

As 12 páginas, preços, benefícios configurados, consultas e canais existentes foram preservados. `src/config.mjs` recebeu apenas os campos vazios `testimonials` e `mostChosenPlanId`, com instruções de confirmação. Depoimentos não aprovados não aparecem. Sem comprovação de popularidade, o destaque permanece “Para uso intenso”, não “Mais escolhido”.

## Arquivos

- `src/components/hero.mjs`: nova composição clara e consulta integrada.
- `src/components/plans.mjs`: fotos, seleção de plano e detalhes expansíveis com contato direto.
- `src/components/home-sections.mjs`: benefícios, depoimentos configuráveis, empresas, perfis e barra fixa.
- `src/components/shared.mjs`: rodapé em colunas e dados oficiais configuráveis.
- `src/home.css` e `src/styles.css`: acabamento responsivo, acessibilidade e efeitos.
- `src/client.mjs`: pausa fora da tela e comportamento da barra de cobertura.
- `src/config.mjs`: configuração responsável de prova social e popularidade.
- `scripts/build.mjs`: montagem da home, tema e cópia dos novos assets.
- `tests/routes.test.mjs` e `tests/home.test.mjs`: estrutura, conteúdo aprovado e preservação dos planos.
- `README.md`, este relatório e `ASSETS_HOME.md`.
- `dist/`: build atualizado. `redesign-home/`: capturas e backup anterior em `baseline/`.

## Validação

- 23 testes automatizados aprovados.
- Build estático das 12 páginas concluído.
- Home verificada em 320, 390, 768, 1024 e 1440 px. Sem rolagem horizontal ou transbordamento das métricas dos planos e formulário.
- Prioridade móvel: viewport 390 × 844, correspondente ao tamanho CSS do iPhone 13 Pro. Não foi usado aparelho físico.
- Demais 11 páginas verificadas em 320 e 1440 px: um H1 por página, sem rolagem horizontal ou imagens quebradas.
- Erros acessíveis, máscara de CEP e foco no primeiro campo inválido verificados.
- Consulta válida sem WhatsApp oficial informa que nada foi enviado.
- Detalhes de 500 Mega, contato direto e seleção com preservação do plano verificados.
- Menu móvel, Escape e retorno da barra fixa ao CEP verificados.
- Pausa automática das animações fora da tela verificada. `prefers-reduced-motion` mantido no CSS e JavaScript, sem emulação do sistema.
- Diagrama móvel corrigido e validado sem sobreposição dos elementos.
- Console sem erros/avisos nas verificações. Destinos e arquivos locais com resposta HTTP válida.

## Limites e pendências

O WhatsApp oficial permanece vazio na configuração. A geração da mensagem/URL foi testada sem envio a terceiros. Confirmação comercial, domínio, contatos e depoimentos reais continuam pendentes. Nenhum dado foi inventado e não houve publicação externa.

As skills Sites e Imagegen orientaram a preservação da estrutura existente e a criação de assets originais. Três imagens foram geradas; duas chamadas falharam por limite de uso. A foto de trabalho foi substituída por uma imagem licenciada e o bloco empresarial usa um diagrama vetorial original, não uma falsa imagem 3D. Não foi usada a alternativa de geração por CLI/API, que exigiria autorização e chave própria.
