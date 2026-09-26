# AMR Telecom: auditoria visual e refinamento

Auditoria feita no site em execução no Chrome, com capturas integrais das 12 páginas em 1440 e 390 px. As páginas principais também foram conferidas em 320, 768 e 1024 px. As capturas ficam em [`visual-audit-20260925/`](visual-audit-20260925/); nas comparações abaixo, **antes** está à esquerda e **depois** à direita.

## Problemas encontrados e decisões

| Problema observado | Ajuste aplicado |
| --- | --- |
| Marca cinza e pouco nítida no cabeçalho claro das 12 páginas. | Versão clara recortada da arte oficial da AMR; versão original mantida no cabeçalho escuro e rodapé. |
| Home com brilho de fundo, linhas decorativas e sombras fortes nos planos. | Removidos brilhos, linhas animadas e faixas superiores; cartões usam borda e sombra discreta. O plano de 700 Mega conserva seu destaque. |
| Fotos de rotina tinham um segundo cartão escuro sobre cada imagem. | Legendas integradas à própria fotografia, com contraste concentrado na base. |
| Animações de entrada e ícones em áreas informativas não acrescentavam orientação. | Removidos observer e animações de entrada. Permanecem controles e transições funcionais, respeitando `prefers-reduced-motion`. |
| Textos de privacidade do formulário e observações do rodapé eram pequenos no celular. | Escala mínima de 14 px e entrelinha mais confortável nesses textos. |
| Erros de campo e instruções de carregamento da consulta tinham corpo de 12 a 13 px. | Texto de 14 px nos avisos e erros, preservando foco, validação e estados desabilitados já existentes. |
| Consulta fixa e botão flutuante do WhatsApp se sobrepunham no celular; o botão também podia cobrir um CTA de plano durante a rolagem. | WhatsApp flutuante compacto, oculto junto ao formulário, catálogo, rodapé ou consulta fixa. Links diretos continuam nas seções de atendimento. |
| A primeira correção do logotipo mostrou duas versões no rodapé e criou 8 px de rolagem horizontal em 320 px. | Corrigida a visibilidade por contexto e adicionada verificação de navegador; o reflow voltou a passar. |

O azul e o azul-marinho da AMR, a tipografia do sistema e a escala de containers existente orientaram o acabamento. Cobertura e planos continuam como ações prioritárias; WhatsApp mantém o verde de canal de atendimento. Preços, benefícios, localidades, número, textos comerciais e mensagens não foram alterados.

## CSS e manutenção

`src/styles.css` serve as 12 páginas; `src/home-refresh.css` entra apenas em Início e Planos. `src/home.css` e `src/editorial.css` são rascunhos históricos e **não entram no build**. A folha compartilhada ainda contém regras antigas de tema escuro e de cartões `.plan` sobrepostas pelas regras claras mais recentes; removê-las em bloco exigiria uma migração separada das páginas internas. Nesta revisão foram removidas as regras decorativas e de movimento relacionadas aos componentes alterados, sem mexer na base de segurança ou nos fluxos.

## Comparações

- [Início, 1440 px](visual-audit-20260925/compare-inicio-1440.png): marca, consulta e início dos planos.
- [Planos, 390 px](visual-audit-20260925/compare-planos-390.png): logotipo, preço e cartão.
- [Cobertura, 768 px](visual-audit-20260925/compare-cobertura-768.png): cabeçalho e formulário.
- [Contato, 390 px](visual-audit-20260925/compare-contato-390.png): identidade e caminhos de atendimento.

As capturas integrais `before-*.png` e `after-*.png` cobrem as 12 páginas em desktop e celular. Os arquivos de métricas registram largura, altura e H1; `after-metrics.json` também verifica imagens quebradas.

## Arquivos alterados

`src/styles.css`, `src/home-refresh.css`, `src/client.mjs`, `src/components/shared.mjs`, `src/components/hero.mjs`, `src/config.mjs`, `scripts/build.mjs`, `scripts/check-publication.mjs`, `scripts/check-pages-browser.mjs`, `public/assets/brand/logo-amr-light.jpg`, `README.md`, este relatório e as capturas em `visual-audit-20260925/`.

## Verificação

| Verificação | Resultado |
| --- | --- |
| `npm test` | 46 testes aprovados. |
| `npm run build` | 12 páginas estáticas geradas. |
| `npm run check:dist` | 35 arquivos permitidos; sem fonte, backup ou credencial no build. |
| `check-pages-browser.mjs` | 12 páginas × 6 larguras (320, 375, 390, 768, 1024, 1440 px), sem rolagem horizontal; menu, FAQ, links, logotipos e ações fixas aprovados; sem erros de console. |
| `check-form-browser.mjs` | Fluxos normal, sem JavaScript e com falha de script aprovados. |
| `check-security-browser.mjs` | CSP, bloqueio de iframe e arquivos fora do build aprovados. |

## Decisões pendentes da AMR

Para comunicar presença local com mais força, vale substituir as fotografias ilustrativas de atendimento e rotina por fotos autorizadas da equipe, instalações ou clientes reais de Gravatá e Amaraji. Não foi criada nem atribuída uma foto local sem essa confirmação. A publicação continua bloqueada pelas quatro pendências já previstas no projeto: domínio HTTPS definitivo, registro de aprovação comercial, política de privacidade e termos de uso revisados pela AMR.
