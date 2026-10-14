# Materiais visuais da AMR Telecom

Esta pasta organiza os materiais visuais da AMR Telecom. Preserve sempre os arquivos originais. O site pode usar cópias derivadas e otimizadas, inclusive vídeos e posters, sem substituir os originais. A lista exata de mídias publicadas é definida em `scripts/build.mjs` e descrita no README da raiz.

## Pastas

### `brand/`

Guarde os arquivos oficiais da identidade visual da marca:

- logotipo principal;
- logotipo branco;
- logotipo com fundo transparente;
- símbolo ou ícone da AMR Telecom;
- arquivos PNG, SVG ou WebP da identidade visual.

Exemplos:

- `brand/logo-amr-principal.png`
- `brand/logo-amr-branca.png`
- `brand/logo-amr-icone.png`

### `references/`

Guarde artes publicitárias que servirão somente como referência visual e de comunicação:

- imagem dos planos;
- arte sobre jogos;
- arte sobre suporte;
- arte sobre internet empresarial;
- arte sobre Wi-Fi;
- identidade do veículo;
- outras publicações da AMR Telecom.

Exemplos:

- `references/referencia-planos.jpg`
- `references/referencia-gamer.jpg`
- `references/referencia-suporte.jpg`
- `references/referencia-wifi.jpg`
- `references/referencia-empresa.jpg`
- `references/referencia-veiculo.jpg`

### `photos/`

Guarde fotografias reais que poderão aparecer no site:

- fachada;
- equipe;
- técnicos;
- instalação de fibra;
- equipamentos;
- veículo;
- escritório;
- região atendida.

Exemplos:

- `photos/fachada-amr.jpg`
- `photos/equipe-amr.jpg`
- `photos/instalacao-fibra.jpg`
- `photos/veiculo-amr.jpg`

### `videos/`

Guarde o vídeo institucional e futuros vídeos da empresa.

Exemplo:

- `videos/apresentacao-amr.mp4`

## Regras de preservação e uso

- Não apagar os materiais originais.
- Usar nomes de arquivo sem acentos, espaços ou caracteres especiais.
- Utilizar letras minúsculas e hífens.
- Não inventar informações comerciais com base nas artes.
- Não considerar telefones e endereços presentes nas imagens como verdadeiros sem confirmação.
- Não utilizar automaticamente todas as imagens no site.
- Manter o vídeo original preservado.
- Faça conversões, recortes e ajustes apenas em cópias derivadas; mantenha a fonte original intacta.

## Fotos das cidades atendidas (carrossel da Home)

O segundo slide da Home reúne Gravatá e Amaraji, lado a lado no computador e empilhadas no celular; Casa abre o carrossel. Cidade sem foto com permissão verificada aparece como um bloco neutro com ícone de localização e o nome logo abaixo, nunca com a foto de outra cidade. Para publicar as fotos, coloque em `photos/`:

| Arquivo | Igreja (referência para buscar a foto, não vai para a legenda) | Dimensões |
| --- | --- | --- |
| `public/assets/photos/igreja-matriz-gravata-800.webp` | Igreja Matriz de Sant’Ana, Centro, Gravatá (PE); confirmar o nome com a paróquia | 800 × 500 (presente) |
| `public/assets/photos/igreja-matriz-gravata-1600.webp` | mesma foto de Gravatá | 1600 × 1000 (presente) |
| `public/assets/photos/igreja-matriz-amaraji-800.webp` | Igreja Matriz de São José, Centro, Amaraji (PE); confirmar o nome com a paróquia | 800 × 500 (falta) |
| `public/assets/photos/igreja-matriz-amaraji-1600.webp` | mesma foto de Amaraji | 1600 × 1000 (falta) |

### Situação das fotos (10/10/2026)

| Cidade | Foto escolhida | Autor e data | Licença | Situação |
| --- | --- | --- | --- | --- |
| Gravatá | [Commons: BRUNO LIMA IGREJA MATRIZ DE SANTANA GRAVATÁ PE.jpg](https://commons.wikimedia.org/wiki/File:BRUNO_LIMA_IGREJA_MATRIZ_DE_SANTANA_GRAVAT%C3%81_PE.jpg), original no Flickr MTur Destinos, 4961 × 3508 px | Bruno Lima/MTur, tirada em 09/03/2018 | Uso comercial permitido com crédito obrigatório. Crédito a usar: `Bruno Lima - MTUR` | Incorporada em 10/10/2026. Recorte 16:10 da versão 3840 × 2715 do Commons (o original de 8 MB foi recusado por limite de requisições), cores preservadas. No Flickr do MTur: Public Domain Mark 1.0, tirada em 09/03/2018, publicada em 19/03/2018, sem a etiqueta “fotos humanizadas” |
| Amaraji | [Flickr: Amaraji - Igreja Matriz de São José](https://www.flickr.com/photos/145397692@N06/32019817496), resolução não verificada | Sergio Falcetti, tirada em 01/02/2012, publicada em 02/01/2017; geolocalizada no centro de Amaraji (-8,3787; -35,4522) | Todos os direitos reservados; tem marcas-d’água “viajandotodoobrasil”, e a fachada aparece rosa (pintura antiga) | Sem autorização: o slide mantém o espaço reservado. Para usar, é preciso permissão por escrito do fotógrafo; a aprovação visual não substitui essa autorização. Uma foto recente com autorização substitui esta candidata |

Fotos e páginas conferidas diretamente no Commons e no Flickr em 10/10/2026.

- Recorte 16:10 com a fachada e a torre inteiras, da cruz à porta.
- WebP com qualidade entre 75 e 82. Exemplo: `convert original.jpg -resize 1600x1000^ -gravity center -extent 1600x1000 -quality 80 igreja-matriz-amaraji-1600.webp`.
- Abaixo de cada imagem aparece só o nome da cidade, por exemplo `Gravatá, PE`. O crédito foi retirado do slide a pedido da AMR (10/10/2026) e aparece em Termos de Uso, seção “Créditos de imagens” (`src/legal.mjs`), com link para a fonte; o rodapé tem acesso direto. Continua obrigatório em `credit`: a página da foto no MTur diz “Crédito obrigatório: Bruno Lima - MTUR”. Ao incluir a foto de Amaraji, acrescente o crédito dela na mesma seção.
- Preencha `credit` em `src/components/hero.mjs` com autor e licença (por exemplo, `Nome do fotógrafo (CC BY 4.0)` ou `Prefeitura de Gravatá, uso autorizado`). Sem crédito preenchido, a foto não é publicada.
- Com os dois arquivos e o crédito de uma cidade, a foto entra automaticamente no build. Casa continua abrindo o carrossel até que as duas fotos sejam aprovadas; para levar as cidades ao início, mude a ordem em `slideNames` e nos slides de `src/components/hero.mjs`, e as posições `videoSlides` em `scripts/check-mobile-browser.mjs`.
- Guarde a autorização por escrito ou o link da licença. Licenças NC (não comercial) não servem para o site da AMR. Não remova marcas-d’água.
