# Auditoria de materiais da AMR Telecom

Data: 11/09/2026. Inspeção dos 11 arquivos de mídia originais de `public/assets`. Os arquivos originais e o README existente foram preservados. Não havia aplicação, package.json, dependências ou scripts no projeto. A pasta `photos` está vazia.

## Inventário

Os tamanhos abaixo são os tamanhos exatos em bytes. Todas as imagens foram abertas e inspecionadas visualmente.

| Arquivo relativo a public/assets | Tipo | Dimensões | Bytes | Qualidade percebida | Texto incorporado | Informações provisórias | Uso recomendado e posição | Otimização |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| brand/Logo principal.jpeg | JPEG | 1556 × 1593 | 71892 | Média; marca legível, acabamento rasterizado e fundo decorativo | AMR Telecom | Sem contatos ou preços | Usar uma cópia reduzida no cabeçalho e rodapé; favicon derivado | Sim, reduzir peso e margens em cópia, sem redesenhar a marca |
| brand/Logo transparente.jpeg | JPEG | 1536 × 1024 | 130001 | Boa; fundo branco, sem transparência real, pois JPEG não tem canal alfa | Marca e slogan | Sem contatos ou preços | Referência da assinatura; não usar sobre fundo escuro | Necessária uma versão oficial PNG/SVG transparente para uso futuro |
| references/Artes dos planos.jpeg | JPEG | 1536 × 1024 | 320555 | Boa para referência; texto denso para celular | Sim, velocidades, valores, benefícios, mais escolhido | Todos os preços, ausência de fidelização, benefícios e popularidade precisam de confirmação | Somente referência para a seção Planos; reconstruir tudo em HTML | Não publicar a arte; não precisa otimizar |
| references/jogos.jpeg | JPEG | 853 × 1280 | 88901 | Boa como peça promocional vertical | Sim, inclui promessa de zero lag | Promessas absolutas não serão reproduzidas | Somente referência cromática e temática para jogos | Não publicar a arte |
| references/WhatsApp Image 2026-09-09 at 12.37.21.jpeg | JPEG | 1254 × 1254 | 235030 | Boa como prancha de identidade; mockups não comprovam instalações reais | Sim, marca, slogan e cartão com contatos | Telefone, e-mail, domínio e endereço não confirmados | Somente referência de identidade; não usar como foto real da empresa | Não publicar a arte |
| references/WhatsApp Image 2026-09-09 at 12.37.22 (2).jpeg | JPEG | 1536 × 1024 | 249495 | Boa como prancha horizontal de identidade | Sim, marca, slogan, contatos | Telefone, e-mail, domínio e endereço não confirmados | Somente referência; variante da prancha anterior | Não publicar a arte |
| references/WhatsApp Image 2026-09-09 at 12.37.23 (2).jpeg | JPEG | 1280 × 853 | 75349 | Boa como publicidade, com personagem ilustrado | Sim, suporte humano | Forma de atendimento a confirmar | Somente referência para suporte; não usar emoji ou personagem no site | Não publicar a arte |
| references/WhatsApp Image 2026-09-09 at 12.37.23 (4).jpeg | JPEG | 853 × 1280 | 80825 | Boa como publicidade; notebook ilustrativo, não comprova escritório real | Sim, proposta empresarial e marca | Serviços empresariais precisam de avaliação | Somente referência para seção Empresas | Não publicar a arte |
| references/WhatsApp Image 2026-09-09 at 12.37.24.jpeg | JPEG | 853 × 1280 | 103593 | Boa como publicidade; planta ilustrativa | Sim, cobertura total e consultoria grátis | Cobertura total e gratuidade não confirmadas | Somente referência temática para Wi-Fi; não repetir garantias | Não publicar a arte |
| references/WhatsApp Image 2026-09-09 at 12.37.24 (2).jpeg | JPEG | 1536 × 1024 | 309422 | Boa como mockup de adesivagem; não comprova frota real | Sim, marca e benefícios | Propriedade do veículo e benefícios não confirmados | Somente referência de identidade; não usar como foto de veículo real | Não publicar a arte |
| videos/AMR Telecom.mp4 | MP4 | 1920 × 1080; 60 segundos | 34332974 | Resolução boa, motion graphics escuro com textos promocionais; amostragem de 13 quadros entre 0 e 59 s | Sim, slogan, serviços, promessa de zero lag, telefone e domínio | Telefone ilustrativo, domínio e promessas não confirmados | Somente referência; inadequado como fundo do hero por conter texto, alegações proibidas e contatos ilustrativos | Não publicar ou carregar o original; futuro vídeo aprovado deve ser exportado como nova versão |

## Decisões de implementação

- Nenhuma arte publicitária será incorporada como seção principal ou banner.
- O nome “Logo transparente” não significa que exista transparência. Não remover fundo nem reinventar o logotipo.
- Não há fotografias reais disponíveis. Não apresentar mockups como fachada, equipe, escritório ou veículo reais.
- Dados dos planos ficam em configuração com confirmação desativada. O destaque de 700 Mega será editorial (“Para uso intenso”), sem afirmar popularidade sem confirmação.
- WhatsApp, telefone, e-mail, endereço, horários e áreas atendidas ficam vazios até confirmação. Nenhum dado do cartão ilustrado será copiado.
- Toda otimização gera um novo arquivo de nome normalizado. Originais mantêm seus nomes e bytes.
- A ausência de número de WhatsApp deve produzir uma mensagem clara, nunca um link para um número inventado.

## Derivados selecionados

- `brand/logo-amr-web.webp`: recorte e redução do logotipo principal fornecido, sem redesenho. Cabeçalho e rodapé. 480 × 264 pixels.
- `brand/favicon-amr.png`: redução da imagem oficial original para 64 × 64 pixels.
- Hero: grafismo vetorial abstrato de linhas de fibra, sem mídia promocional incorporada. Não há vídeo carregado na configuração entregue.
- O usuário confirmou que os dados comerciais e contatos continuam pendentes nesta etapa. A entrega será local, sem publicação.
