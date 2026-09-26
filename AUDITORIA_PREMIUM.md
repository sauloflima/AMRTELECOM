# AMR Telecom: revisão de qualidade

Revisão concluída em 11/09/2026. [Prévia local](http://127.0.0.1:4173/).

A auditoria de Product Design orientou ajustes pontuais a partir de capturas do site e testes da jornada. A [Nio Fibra](https://www.niointernet.com.br/) foi observada como referência de clareza comercial, consulta de endereço e separação de atendimento. Sua apresentação visual e seus materiais não foram incorporados à AMR.

As 12 páginas, a marca, os tons de azul, as referências à fibra e as funcionalidades existentes foram preservados. Nenhum dado comercial foi criado ou alterado. O arquivo de configuração permanece idêntico ao original.

## Resultado nos dez critérios

| Critério | Diagnóstico e melhoria |
| --- | --- |
| 1. Primeira tela | Mensagem e consulta de cobertura já eram claras. Reduzido o excesso de espaço no celular. |
| 2. Cobertura | Aviso de canal indisponível agora aparece antes dos campos. Instruções explicam revisão, envio e confirmação humana. |
| 3. Planos | Botões alinhados, preços provisórios identificados em cada cartão e composição mais legível no tablet. |
| 4. Contratação | Plano escolhido acompanha a consulta e a mensagem preparada. Troca de plano disponível. Contato direto sobre cada plano preservado. |
| 5. Contratação e suporte | Acessos existentes agrupados por finalidade. Suporte direto no cabeçalho mobile. |
| 6. Hierarquia | Espaçamentos refinados e títulos dos planos e formulário corrigidos para H2 após a H1 da página. |
| 7. Botões | Rótulos identificam o plano. Cabeçalho não promete WhatsApp quando o número está ausente. |
| 8. Mobile | Menu rolável em telas baixas, fechamento ao sair com teclado e links do rodapé com área mínima de 44 px de altura. |
| 9. Contato | Corrigida a limpeza do número no link de telefone, que removia os dígitos. Aviso antecipado também no suporte. |
| 10. Confiança | Identidade e acabamento mantidos. Pendências comerciais continuam explícitas, sem depoimentos, números ou promessas inventados. |

## Jornada verificada

1. **Início e navegação: aprovados.** Cobertura e planos continuam destacados; suporte mobile acessível diretamente.
2. **Comparação de planos: aprovada.** Três opções preservadas; seleção de 200, 500 e 700 Mega verificada, incluindo troca e recarregamento.
3. **Consulta de cobertura: interface aprovada, encaminhamento real pendente.** Campos vazios e telefone inválido recebem erros e foco. Erros desaparecem quando corrigidos. Enter funciona e dados não aparecem na URL. Sem número oficial, não há simulação de envio.
4. **Suporte: interface aprovada, atendimento real pendente.** Assuntos específicos preservados, aviso de indisponibilidade e diálogo funcional.
5. **Contato e dúvidas: aprovados na configuração atual.** Destinos separados e sete perguntas abrem e fecham pelo teclado.

## Testes aprovados

- `npm test`: 17 testes, nenhuma falha.
- `npm run build`: 12 páginas estáticas geradas com sucesso em `dist`.
- 12 páginas inspecionadas em 320 e 1440 px: sem rolagem horizontal, imagens quebradas, links visíveis sem destino ou travessões; uma H1 por página.
- 40 verificações adicionais nas páginas de início, planos, cobertura e contato, em 360, 390, 600, 601, 768, 800, 801, 900, 901 e 1024 px: sem estouro horizontal ou cabeçalho fora da tela.
- Menu em 667 × 375 px: rolagem interna e foco acessíveis.
- Teclado: pular conteúdo, menu por Enter/Escape, fechamento ao sair com Tab, formulário e sete perguntas frequentes.
- 19 URLs internas, incluindo páginas, mídia, estilos, script e consultas por plano: HTTP 200.
- Nenhum aviso ou erro de console observado nas páginas percorridas.
- Geração das mensagens, seleção restrita ao catálogo, telefone configurado e proteção inicial do formulário verificadas nos testes automatizados.

Os testes mobile usam dimensões simuladas no navegador integrado. Não houve teste em aparelho físico, auditoria completa WCAG ou envio real pelo WhatsApp. A alternativa de link para reabrir a consulta foi implementada para permitir continuar se a nova janela não abrir; seu uso real depende do canal oficial.

## Arquivos alterados

- [shared.mjs](</Users/saulolima/projeto AMR provedor/src/components/shared.mjs>): cabeçalho e acesso mobile ao suporte.
- [navigation.mjs](</Users/saulolima/projeto AMR provedor/src/components/navigation.mjs>): organização dos acessos existentes.
- [plans.mjs](</Users/saulolima/projeto AMR provedor/src/components/plans.mjs>): cartões, rótulos, títulos e seleção.
- [contact.mjs](</Users/saulolima/projeto AMR provedor/src/components/contact.mjs>): formulário, avisos, preenchimento automático e telefone.
- [client.mjs](</Users/saulolima/projeto AMR provedor/src/client.mjs>): foco, plano escolhido, correção dos erros e continuidade da consulta.
- [whatsapp.mjs](</Users/saulolima/projeto AMR provedor/src/lib/whatsapp.mjs>): seleção segura do plano e mensagem contextual.
- [styles.css](</Users/saulolima/projeto AMR provedor/src/styles.css>): acabamento, hierarquia e responsividade.
- [quality.test.mjs](</Users/saulolima/projeto AMR provedor/tests/quality.test.mjs>): quatro testes de regressão novos.
- Documentação: este relatório, README e referência à revisão atual em VALIDACAO. Saída de produção regenerada em `dist`.

Os fontes anteriores foram copiados para [baseline](</Users/saulolima/projeto AMR provedor/audit-premium/baseline>) antes das alterações. Capturas da auditoria estão em [audit-premium](</Users/saulolima/projeto AMR provedor/audit-premium>), fora do build público.

## Evidências da jornada

**1. Início, desktop.** Identidade preservada e consulta destacada.

![Início final em desktop](</Users/saulolima/projeto AMR provedor/audit-premium/20-inicio-final-desktop.png>)

**2. Planos, desktop.** Comparação, valores em confirmação e botões alinhados.

![Planos finais em desktop](</Users/saulolima/projeto AMR provedor/audit-premium/21-planos-final-desktop.png>)

**3. Consulta, celular.** Plano identificado e validação com foco no primeiro erro.

![Consulta e erros no celular](</Users/saulolima/projeto AMR provedor/audit-premium/18-validacao-mobile.png>)

**4. Suporte, celular.** Aviso sobre canal pendente antes da seleção do assunto.

![Suporte no celular](</Users/saulolima/projeto AMR provedor/audit-premium/15-suporte-depois-mobile.png>)

**5. Contato, celular.** Acesso a cobertura e ajuda em caminhos distintos.

![Contato no celular](</Users/saulolima/projeto AMR provedor/audit-premium/16-contato-mobile.png>)

## Pendência para operação comercial

Cadastrar e confirmar os contatos oficiais e as condições comerciais em [config.mjs](</Users/saulolima/projeto AMR provedor/src/config.mjs>). WhatsApp e demais contatos estão vazios, e `commercialConfirmed` continua `false`. O site não foi publicado. Essa configuração impede concluir uma contratação ou atendimento real, mas não impede conferir a revisão entregue.
