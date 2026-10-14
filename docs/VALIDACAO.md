# Validação da implementação

Registro da implementação anterior. Os resultados da revisão premium atual, com 17 testes automatizados aprovados e novas verificações no navegador, estão em [AUDITORIA_PREMIUM.md](</Users/saulolima/projeto AMR provedor/AUDITORIA_PREMIUM.md>).

Data: 11/09/2026. Testes locais em Chrome instalado, controlado por Playwright disponível no ambiente. Nenhuma dependência foi instalada no projeto.

## Resultado

| Verificação | Resultado |
| --- | --- |
| `npm run build` | Aprovado; 12 páginas estáticas independentes em `dist` |
| `npm test` | 13 testes aprovados, 0 falhas |
| Console e execução da página | Nenhum erro na configuração entregue |
| 320, 375, 390, 768, 1024 e 1440 px | Todas as 12 páginas sem rolagem horizontal |
| Navegação multipágina | 12 destinos internos respondem HTTP 200; nenhum link antigo de seção no menu |
| Metadados e hierarquia | Títulos e descrições próprios; uma H1 por página |
| Menu atual, recarregamento e Voltar | Destino correto, menu mobile fechado após navegar e conteúdo preservado ao recarregar |
| Contatos na estrutura multipágina | 42 botões distribuídos pelas páginas abrem corretamente o aviso de contato pendente |
| Texto ampliado a 200% em 390 px | Sem rolagem horizontal |
| Menu mobile | Abre, fecha após navegar e fecha com Escape devolvendo o foco ao botão |
| Teclado | Primeiro foco no link de pular conteúdo; foco nos erros do formulário; accordion acionável por Enter; diálogo fecha com Escape |
| Formulário vazio | Cinco erros identificados, primeiro campo recebe foco |
| Formulário inválido | Telefone, campos vazios e limites de tamanho validados |
| Formulário válido com contato pendente | Aviso claro; não abre contato fictício nem simula envio |
| Links de WhatsApp com configuração de teste (validação inicial) | 19 links da versão inicial testados com destino correto e mensagens específicas; rede externa interceptada. A função central foi preservada na versão multipágina |
| Formulário com configuração de teste | WhatsApp recebe os cinco campos, incluindo acentos, `&` e `#` preservados |
| Accordion | Sete perguntas abrem e fecham com teclado |
| Armazenamento | localStorage e sessionStorage vazios após o fluxo; nenhuma persistência implementada |
| Sem JavaScript | Conteúdo, planos, navegação e accordion nativo continuam disponíveis; formulário orienta ativação do JavaScript |
| Formulário sem JavaScript ou com falha no script | Cinco campos e botão permanecem desabilitados com aviso visível; nenhum envio nativo por GET |
| Envio por Enter com JavaScript ativo | Validação e aviso de WhatsApp pendente funcionam; nenhum dado aparece na URL |
| Vídeo na entrega | Ausente por decisão da auditoria; original não é baixado pelo site |
| Componente de vídeo opcional | Reprodução e pausa aprovadas com fixture interceptada somente no teste |
| Falha no vídeo opcional | Capa estática e conteúdo permanecem visíveis |
| `prefers-reduced-motion` | Nenhum download do vídeo e nenhuma reprodução no teste |
| Política, termos, robots e sitemap | Todos respondem HTTP 200 |
| Texto visível | Português brasileiro; nenhum travessão encontrado nas seis larguras |
| Arquivos originais | Mantidos nas pastas de origem; nenhum original excluído ou substituído |

## Limites e pendências

Teste adicional de regressão em `scripts/check-form-browser.mjs`: aprovado nos modos normal, JavaScript desativado e falha de carregamento do script. Usa Playwright existente no ambiente, indicado por `AMR_PLAYWRIGHT_ROOT`, com o servidor local ativo. Não instala dependências.

Após a divisão em páginas, `scripts/check-pages-browser.mjs` validou as 12 páginas nas seis larguras, 12 destinos internos, 42 botões de contato pendente, menu mobile, página atual, recarregamento direto, Voltar, teclado e os sete accordions. O teste de formulário foi atualizado para `/cobertura.html` e passou novamente nos três modos.

- A verificação em celular usa larguras de viewport e testes automatizados em Chrome. Não foi feito teste físico em iPhone 13 Pro ou Android, nem teste nativo de Safari/VoiceOver.
- A estrutura usa HTML semântico, foco visível, labels, erros associados, dialog nativo, details/summary, SVGs decorativos e paleta de alto contraste. Isso não constitui certificação independente de acessibilidade.
- Nenhuma mensagem foi enviada. Os testes de contato configurado usaram um número exclusivamente em respostas interceptadas no navegador, sem editar a configuração comercial e sem acessar o WhatsApp real.
- Os testes do componente de vídeo foram feitos por injeção local de elementos e mídia somente nas respostas de teste. Não ativam nem publicam o vídeo original.
- WhatsApp, contatos, áreas atendidas e informações comerciais aguardam confirmação do responsável. O site informa a indisponibilidade atual do canal de atendimento.
- Sem domínio confirmado, o sitemap não contém URLs inventadas. Indexação permanece desativada até preencher `siteUrl` e confirmar os dados comerciais.
- Termos e política devem ser complementados e revisados pela empresa antes da publicação.
- Nenhum serviço externo, analytics ou fonte remota foi incluído. A publicação não foi realizada.
