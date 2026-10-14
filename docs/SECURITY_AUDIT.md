# Auditoria de segurança — AMR Telecom

Data: 26/09/2026 (America/Recife). Base inspecionada: commit `75fbf18`, com árvore de trabalho limpa no início. Auditoria do código, correções locais, testes de regressão e segunda revisão na mesma sessão. Nenhum commit, push, deploy, alteração de DNS ou mensagem para terceiros foi realizado.

## Resumo executivo

| Indicador | Resultado |
|---|---:|
| Vulnerabilidades críticas | 0 identificadas |
| Vulnerabilidades altas | 0 identificadas |
| Vulnerabilidades médias | 1 |
| Vulnerabilidades baixas | 2 |
| Hardening / achados informativos | 3 |
| Achados corrigidos no código | 4 |
| Achados pendentes de infraestrutura externa | 2 |

Os seis registros abaixo incluem falhas de configuração e melhorias preventivas; não representam seis explorações demonstradas. Não foi identificado fluxo explorável de XSS, credencial real exposta ou API própria vulnerável. O maior problema observado é o HTTPS inválido do portal externo do cliente. A publicação existente também aceita enquadramento por outra origem e não entrega os headers de proteção definidos no servidor local.

Os 51 testes Node, o build, a lista dos 41 arquivos publicáveis e os cinco scripts de regressão em Chrome passaram. A pré-publicação falha deliberadamente enquanto faltam domínio e aprovações. As correções estão no repositório local: a versão pública anterior continua servindo a política antiga.

**Status: REQUER CORREÇÕES ANTES DO DEPLOY.** O build pode ser avaliado localmente, mas isso não libera a produção.

## Arquitetura e escopo real

**Adendo de arquitetura (26/09/2026):** os números de 51 testes, seis módulos JS e 41 arquivos abaixo documentam o estado desta auditoria de segurança. A refatoração posterior dividiu o código de `src/client.mjs` em `src/client/navigation.mjs`, `contact.mjs` e `media.mjs`. O build atual publica nove módulos JS e 44 arquivos; `scripts/build-files.mjs` fornece a mesma lista explícita ao build e ao verificador. A lógica de atrasos de animação citada em SEC-004 agora reside em `src/client/media.mjs`. A CSP, os headers, o workflow e os gates de segurança continuam iguais à versão aprovada nesta auditoria. Veja `ARCHITECTURE.md` para a estrutura atual.

**Adendo de integridade do build:** a revisão de cache agora deriva do conteúdo de CSS e JS e acompanha os imports relativos gerados em `dist/`. `check:dist` exige a mesma revisão e os módulos esperados, tanto no build normal quanto após a preparação para Pages. A allowlist, a CSP e os gates permanecem restritos; o portal externo em migração não foi alterado.

- `scripts/build.mjs` gera 12 HTMLs, copia três CSSs, seis módulos JavaScript, 18 mídias selecionadas e dois arquivos de indexação para `dist/`.
- `src/routes.mjs` define as páginas. `src/components/` gera HTML no build; `src/client.mjs` e `src/lib/` controlam menu, consultas, carrossel, vídeos e atendimento.
- `src/config.mjs` contém dados comerciais públicos e é copiado integralmente para o navegador. Não é um lugar para segredos, credenciais ou referências confidenciais de aprovação.
- Node.js fornece geração e um servidor de desenvolvimento/prévia em `scripts/dev.mjs`, por padrão em `127.0.0.1:4173`. Ele serve arquivos, HEAD e intervalos de vídeo; não implementa uma API de negócio.
- Não há backend de aplicação, banco de dados, endpoint receptor de formulários, login local, painel administrativo, upload, webhook, OAuth, service worker ou PWA.
- `.github/workflows/pages.yml` publica `dist/` no GitHub Pages. `scripts/prepare-pages.mjs` adapta os caminhos para `/AMRTELECOM/`. A versão pública observada foi `https://sauloflima.github.io/AMRTELECOM/`.
- `siteUrl` está vazio. As referências comercial, privacidade e termos também estão vazias; os dois textos legais conservam o marcador de revisão. Isso controla a liberação e a indexação, não o acesso ao site.
- Runtime local: Node `24.19.0`, npm `11.17.0`; CI configurado para Node `22`. O manifesto ainda declara compatibilidade mínima com Node 20, mas essa versão não foi utilizada nesta validação.
- Dependência instalada de produção/build: `iconoir@7.11.0`, sem dependências transitivas instaladas. O pacote só fornece SVGs incorporados durante a geração; não há JavaScript de fornecedor executado no navegador.

Foram inspecionados arquivos ativos, saída compilada, workflow, testes, scripts, arquivos ocultos, históricos locais, ZIP, TAR e objetos do histórico Git disponível. A análise de segredos examinou 203 arquivos textuais do workspace, 1.798 entradas textuais do ZIP, 29 do TAR e 1.930 blobs Git, incluindo repetições históricas. As mídias binárias não foram tratadas como arquivos de código ou submetidas a análise esteganográfica.

O portal externo recebeu somente verificação pública de TLS. Não foram testados login, contas, sessões, endpoints internos ou dados de clientes desse serviço. Configurações privadas do GitHub, CDN, DNS e hospedagem não foram acessadas.

## Modelo de ameaça

| Entrada / fronteira | Controle do visitante | Destino e proteção observados |
|---|---|---|
| Consulta rápida na Home | CEP e número/referência | Validação local, prévia por `textContent`, link HTTPS fixo para `wa.me`, mensagem codificada por `encodeURIComponent` |
| Consulta completa | Nome, cidade, bairro, rua/referência | Mesmo fluxo; nenhum POST ou armazenamento local; limites de 100/200 caracteres |
| `?plano=` | Qualquer parâmetro GET, inclusive repetido ou malformado | `selectedPlan()` aceita somente IDs do catálogo; preço e descrição vêm da configuração local |
| Hash de URL | Fragmento arbitrário | `getElementById()` seguido de teste `details.plan-details`; não vira HTML ou seletor CSS construído com o hash |
| Links de contato e portal | Clique no destino | Destinos vêm do código/configuração, não da URL do visitante; WhatsApp recebe dados na query somente após continuação |
| Configuração e templates | Mantenedor do repositório | Conteúdo de build confiável; quem pode alterar esses módulos já pode alterar o programa |
| npm e GitHub Actions | Fornecedores e mantenedores da cadeia de build | Lockfile e integridade npm; Actions fixadas por commit e privilégios de deploy isolados após esta auditoria |
| Hospedagem | Operador do serviço | TLS, headers, acesso ao artefato e logs não podem ser assegurados por JavaScript da página |

Ativos relevantes: integridade dos contatos oficiais, dados pessoais preenchidos, conteúdo comercial, artefato publicado e credenciais da cadeia de publicação. Principais riscos: TLS do portal, configuração efetiva do servidor, comprometimento da cadeia de build e divulgação de endereço pelo link do WhatsApp.

Cookies, `localStorage`, `sessionStorage`, `document.referrer`, mensagens `postMessage`, APIs, iframes, scripts externos, arquivos enviados e credenciais não são entradas usadas pela aplicação atual. O widget de atendimento usa apenas estado em memória; referências a armazenamento encontradas nos testes simulam uma implementação antiga ou bloqueios do navegador.

## Vulnerabilidades e hardening encontrados

| ID | Severidade / prioridade | Categoria | Arquivo ou componente | Situação |
|---|---|---|---|---|
| SEC-001 | Média / P2 | HTTPS do portal externo | `src/config.mjs:6`; `www.amrfibra.com.br:443` | PENDENTE |
| SEC-002 | Baixa / P3 | Headers e clickjacking | `scripts/security.mjs:8`; respostas do GitHub Pages | PENDENTE |
| SEC-003 | Baixa / P3 | Bloqueio de publicação ignorado | `.github/workflows/pages.yml:25` | CORRIGIDO no código |
| SEC-004 | Informativa / P3 | CSP mais permissiva que o necessário | `scripts/security.mjs:6`; `scripts/build.mjs:29`; `src/components/hero.mjs:18` | CORRIGIDO no código |
| SEC-005 | Informativa / P3 | Cadeia de build e privilégios | `.github/workflows/pages.yml:6` | CORRIGIDO no código |
| SEC-006 | Informativa / P4 | Verificação incompleta de headers | `scripts/check-hosting.mjs:14` | CORRIGIDO no código |

### SEC-001 — certificado inválido no portal do cliente

**Problema e evidência:** o endereço oficial configurado, `https://www.amrfibra.com.br/central/`, falhou na validação HTTPS por incompatibilidade do hostname. A inspeção apenas do certificado apresentado com SNI mostrou `CN=cabox.com.br`, SAN `DNS:cabox.com.br`, emitido em 23/04/2026 e vencido em **22/07/2026 às 01:52:20 UTC**. Portanto, há tanto domínio incompatível quanto expiração. Não foi feito login nem acessado conteúdo HTTP com validação TLS desativada.

**Cenário realista:** navegadores bloqueiam ou alertam sobre o acesso. Se um cliente ignorar o alerta para entrar na conta, a identidade do servidor deixa de ser validada adequadamente. Não foi demonstrada interceptação, furto de credenciais ou comprometimento do portal.

**Correção necessária:** a hospedagem deve corrigir o virtual host/SNI e instalar uma cadeia válida e vigente para `www.amrfibra.com.br`, com renovação automática. Confirmar resolução DNS e apontamento do domínio caso levem ao virtual host errado. Repetir a validação sem exceções TLS e verificar o funcionamento do portal antes do lançamento. O link oficial foi preservado; não foi substituído por HTTP ou outro domínio presumido.

**Status:** PENDENTE, depende do provedor do portal. Não corrigível neste frontend.

### SEC-002 — proteção local não está nos headers públicos

**Problema e evidência:** as 12 páginas públicas responderam HTTP 200, todas sem CSP em cabeçalho, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP ou CORP. O HTML contém meta CSP e meta referrer, portanto não está completamente sem essas políticas. Porém, `frame-ancestors` não funciona em meta. Um teste em navegador confirmou o carregamento da Home pública em iframe com origem diferente.

**Cenário realista:** outro site pode sobrepor controles à página legítima e induzir cliques em contatos ou formulários. A severidade é baixa porque esta aplicação não realiza transações autenticadas nem mudanças de conta. Não se trata de tomada de conta do portal. As ausências de COOP/CORP/permissões são defesa adicional, não explorações demonstradas isoladamente.

**Correção necessária:** aplicar os headers abaixo no servidor/CDN que responderá pelo domínio final. O workflow de upload não configura esses headers no GitHub Pages. Não foi criado um `_headers` ou `.htaccess` fictício para uma plataforma que não o aplica. Uma camada de entrega que permita controlar os headers, ou hospedagem compatível, precisa ser configurada e validada pela resposta real.

**Status:** PENDENTE em produção; a prévia local passou nos testes de bloqueio de iframe. A publicação existente mantém seus headers anteriores.

### SEC-003 — workflow não executava o bloqueio de pré-publicação

**Problema:** o workflow anterior executava `build` e `check:dist`, mas não a opção `--release` utilizada por `prepublish:check`. Assim, conseguia publicar com quatro pendências que o próprio projeto dizia bloquear. As páginas públicas de privacidade e termos foram encontradas com `PENDENTE DE REVISÃO`, apesar de `noindex`.

**Cenário realista:** um push em `main` expunha conteúdo ainda não revisado e o fluxo de compartilhamento de dados sem completar a informação institucional prevista. É uma falha do processo de liberação, não bypass de autenticação. `robots.txt` e `noindex` não tornam uma homologação privada.

**Correção:** o build exige `npm run prepublish:check` antes da adaptação e do upload, e o deploy depende do sucesso desse job. O comando foi executado e bloqueou as quatro pendências esperadas. Nenhuma aprovação foi inventada ou preenchida automaticamente.

**Status:** CORRIGIDO no workflow local. Completar domínio e revisões continua pendente; esse bloqueio não retira o site anterior do ar. A execução no GitHub não foi disparada nesta auditoria.

### SEC-004 — reduzir a CSP sem alterar a apresentação

**Problema:** a política permitia qualquer estilo inline, conexões à própria origem e submissão nativa de formulários, embora o site não necessite desses dois últimos canais. Frames, fontes, workers e manifests herdavam permissões de `default-src 'self'`.

**Cenário realista:** em uma futura falha de injeção HTML/CSS, a política antiga ofereceria menos contenção. Não foi encontrada entrada atual que explorasse isso. `form-action 'self'` também permitia serialização nativa acidental dos campos para a URL do próprio site.

**Correção:** `default-src 'none'` com permissões explícitas para scripts, CSS, imagens e vídeos locais. A política bloqueia estilos/eventos inline, fetch/XHR, frames, fontes, workers, manifests, objetos, base URL e envio nativo de formulários. O CSS do menu sem JavaScript conserva o conteúdo original e recebe um hash SHA-256 específico. Os atrasos de letras passam de atributos `style` para atributos numéricos, aplicados por `style.setProperty` no módulo local. Tempos, textos, mídias e CSS visual foram preservados; não foi adicionada biblioteca de sanitização.

**Status:** CORRIGIDO no build local. Verificados bloqueios reais de script, CSS inline e submissão nativa, além de menu sem JavaScript, vídeos, suporte e animações.

### SEC-005 — endurecer a cadeia de publicação

**Problema:** cinco Actions usavam tags mutáveis, checkout mantinha credenciais no ambiente, instalação permitia scripts de ciclo de vida e o mesmo job de build já tinha permissões de Pages/OIDC. Não houve evidência de pacote ou Action comprometido.

**Cenário realista:** uma alteração indevida em uma referência externa ou futura dependência poderia executar código durante o build com privilégios desnecessários. O checksum do lockfile protege a integridade do download fixado; não atesta que o conteúdo é benigno.

**Correção:** as cinco Actions foram fixadas nos commits oficiais das mesmas versões principais, consultados pela API pública do GitHub. `persist-credentials: false`, `npm ci --ignore-scripts`, auditoria npm com falha a partir de severidade baixa e jobs separados: build com leitura do repositório; somente deploy com `pages: write` e `id-token: write`. O npm audit pode bloquear o build também se seu serviço estiver indisponível, de forma conservadora.

**Status:** CORRIGIDO no workflow local. Regras de proteção de `main`, revisores do ambiente, MFA e políticas da organização não foram verificadas. Os pins exigem revisão periódica; não garantem a integridade de toda a infraestrutura/transitividade das Actions.

### SEC-006 — checker podia aprovar política mais fraca

**Problema:** a verificação de hospedagem procurava apenas substrings de três diretivas. Por exemplo, `script-src 'self' *` continha o trecho esperado e não era rejeitado pela checagem anterior. Tampouco havia validação automatizada do redirecionamento HTTP.

**Cenário realista:** o mantenedor poderia receber uma aprovação do checker apesar de uma CSP excessivamente permissiva. Isso não cria uma exploração no site sozinho.

**Correção:** comparar todos os headers com os valores integrais auditados e exigir redirecionamento HTTP para a URL HTTPS oficial. URLs relativas no `Location` são resolvidas contra a resposta HTTP original, evitando aprovar um redirecionamento que continue em HTTP. A comparação é intencionalmente exata: políticas equivalentes com ordem/espaçamento diferentes devem ser alinhadas à configuração auditada ou revisadas explicitamente.

**Status:** CORRIGIDO no código. O checker de produção continua bloqueado por `publicationIssues`; não foi apresentado como teste aprovado da hospedagem final. As respostas públicas atuais foram verificadas separadamente e falham nos requisitos de headers.

## Resultado das demais áreas

| Área | Resultado e evidência no projeto |
|---|---|
| Stored e reflected XSS | Nenhum armazenamento/servidor que reflita entrada do visitante. Depoimentos aprovados são escapados no build por `escape()` em `home-sections.mjs`. Não foi identificado fluxo explorável. |
| DOM XSS | Nenhum `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function` ou timer com string na aplicação publicada. Formulários usam `textContent`; payloads com HTML permanecem texto. |
| DOM clobbering | Seletores explícitos e variáveis de módulo; `form.elements.namedItem()` em vez de confiança em propriedades criadas por IDs. Nenhum ID duplicado nas 12 páginas. Não há entrada de HTML do visitante. |
| Parsing, coerção e prototype pollution | Não há parsing de JSON externo, merges recursivos, criação de objetos por caminhos arbitrários ou escrita em protótipos. Consultas por propriedade em mensagens recebem atributos do HTML gerado, não parâmetros externos. |
| Validação no cliente | Serve à preparação da mensagem e à UX. Não autoriza conta, preço, cobertura ou contratação; valores oficiais vêm do catálogo, e a disponibilidade depende da equipe. O visitante pode editar a mensagem no WhatsApp. Um futuro endpoint precisará validar no servidor. |
| Segredos | Nenhuma credencial real detectada pelos padrões e revisão de configuração. Três ocorrências eram a mesma URL fictícia `user:password` em testes atual/históricos. Nenhum `.env`, chave privada, SQL ou source map encontrado no conjunto local pesquisado. Varredura por padrões não é prova de ausência absoluta. |
| CORS | Sem chamadas de API. O GitHub Pages retorna `Access-Control-Allow-Origin: *` para conteúdo estático público, sem credenciais: não foi classificado como vazamento autenticado. CORS não é autorização. |
| CSRF, cookies e sessões | NÃO APLICÁVEL ao site: sem sessão, ações autenticadas, cookies, JWT, logout ou mutação por GET. `Secure`, `HttpOnly`, `SameSite`, expiração e fixation pertencem ao portal externo, cujo backend não foi auditado. |
| Autenticação, autorização, IDOR/BOLA e administração | NÃO APLICÁVEL neste repositório. A Área do cliente contém apenas navegação para outro sistema, sem formulário de senha ou proteção falsa por CSS. |
| localStorage/sessionStorage | Nenhuma chave é gravada pela aplicação atual, inclusive pelo atendimento. Teste do navegador confirmou ambos vazios em sessão limpa. Nenhum token ou dado pessoal persistido por esses mecanismos. |
| Open redirect e links | Não há atribuição de `location` baseada em entrada. Host de WhatsApp fixo, número restrito a dígitos e tamanho, mensagem codificada. Portal exige HTTPS sem credenciais. Links `_blank` têm `noopener noreferrer`. Destinos de redes sociais são configuração do mantenedor. |
| postMessage e iframes | Nenhum uso pela aplicação. `frame-src 'none'` bloqueia futuros frames; `frame-ancestors 'none'` no servidor bloqueia incorporação da página. A diferença entre essas diretivas foi testada localmente e identificada na publicação. |
| Mixed content | Recursos do site são locais; contatos externos usam HTTPS. Nenhum recurso `http://`, `ws://`, `javascript:` ou `data:` na saída ativa. HTTP do GitHub Pages retornou 301 para HTTPS; HSTS já está presente nesse domínio. |
| Service workers/cache | Não há worker, Cache API, manifesto ou cache de dados pessoais. Preview usa `no-cache`; produção tem cache de estáticos da hospedagem. A revisão de assets foi atualizada para evitar reaproveitar o módulo de entrada antigo após publicação. |
| Formulários | Dois; limites reais em JS e HTML, tipos textuais adequados, autocomplete de endereço/nome, nenhuma senha/telefone/documento pedido. Campos começam desabilitados e só são habilitados após handlers. Continuação explícita e prévia antes do WhatsApp. Nova CSP proíbe submit nativo. |
| Upload | NÃO APLICÁVEL: nenhum input de arquivo ou endpoint de upload. |
| Path traversal | Aplicável somente ao servidor local. `path.resolve` e comparação de limite de diretório bloqueiam a saída de `dist`; teste com `/%2e%2e%2fpackage.json` retornou 403. Outros caminhos privados retornaram 404. O verificador de artefato rejeita links simbólicos. Não usar esse servidor de desenvolvimento como servidor público. |
| SQL/NoSQL/command/LDAP/template/header injection e SSRF | Nenhum banco, interpretador de templates de entrada externa ou serviço que busque URL do visitante. O `execFileSync` de desenvolvimento executa somente o build fixo, sem shell e sem entrada HTTP nos argumentos. O checker busca a configuração do mantenedor, não uma URL de usuário da aplicação. |
| Erros e console | Servidor local retorna erro genérico; não imprime caminhos ou stack ao visitante. Os logs de scripts são de build/teste, sem PII ou tokens. Não há logs de formulário no cliente; nenhum erro inesperado nos testes de navegação/mídia. |
| HTML e CSS | HTML gerado sem handlers inline, scripts inline executáveis ou IDs duplicados. CSS ativo sem imports/fontes remotas; apenas URLs de imagens locais. O único bloco de estilo inline tem hash específico. |
| Configuração e ambiente | `HOST`/`PORT` pertencem à prévia; `AMR_ORIGIN`, `AMR_PLAYWRIGHT_ROOT`, `AMR_MOBILE_EVIDENCE`, `AMR_SUPPORT_EVIDENCE` aos testes. Não há segredo em variáveis de ambiente do aplicativo. Não existe ambiente de staging protegido neste repositório. |
| Técnicas que não protegem | Não há bloqueio de F12, botão direito, ofuscação ou Base64 como segurança. `robots.txt` e noindex são tratados somente como controles de indexação. |

## Dados pessoais e serviços externos

| Serviço | Forma de integração | Privilégios / dados e risco residual |
|---|---|---|
| WhatsApp (`wa.me`) | Link HTTPS acionado pelo visitante; essencial ao fluxo atual | Recebe os campos no parâmetro `text` antes do envio no app. Esses dados podem ficar no histórico/URL e ser tratados pelo serviço. Não executa script dentro da página AMR. Testes de nova aba interceptaram o destino; nenhuma mensagem foi enviada. |
| Instagram (`www.instagram.com`) | Link externo no rodapé | Somente navegação; não há embed, pixel ou SDK. `noopener noreferrer` impede acesso ao opener e envio de referrer pelo link. |
| Portal (`www.amrfibra.com.br`) | Link na Área do cliente | Sistema independente; nenhuma senha passa pelo site estático. TLS pendente em SEC-001. Autorização, sessão e cookies do portal não foram avaliados. |
| GitHub Pages | Hospedagem do artefato | Processa requisições e pode manter logs técnicos. A retenção e os controles privados não foram verificados. Headers em SEC-002. |
| npm / GitHub Actions | Somente instalação/build/deploy | Código e SVGs devem ser considerados confiáveis apenas dentro da cadeia revisada. Pins e lockfile reduzem mutabilidade; a possibilidade de comprometimento de fornecedor continua existindo. |

**Scripts de terceiros no navegador: zero.** Não há analytics, pixels, mapas, chats externos, fontes CDN, widgets remotos ou bibliotecas CDN. SRI não se aplica a um recurso externo inexistente. SVGs locais selecionados de Iconoir não continham scripts, event handlers, `foreignObject` ou referências remotas nos arquivos examinados.

A coleta de nome/endereço é explícita, limitada à consulta e não é armazenada pelo aplicativo. A AMR ainda deve completar identificação, canal de privacidade e regras de retenção das mensagens e logs nos textos já previstos. Esta auditoria técnica não certifica conformidade com a LGPD nem presume contratos ou configurações de terceiros. Navegador, histórico, autofill, WhatsApp e hospedagem têm tratamento próprio de dados.

## Dependências e cadeia de fornecimento

```text
Dependências npm auditadas: 1 direta, 0 transitivas instaladas
Pacote: iconoir 7.11.0
Vulnerabilidades reportadas pelo npm audit: 0
Dependências npm atualizadas: 0
Atualização obrigatória por vulnerabilidade conhecida: nenhuma identificada
Atualização disponível: iconoir 7.12.1 (opcional, não aplicada)
GitHub Actions revisadas e fixadas: 5
Dependências novas: 0
```

Foi mantido Iconoir 7.11.0 porque não houve vulnerabilidade reportada, há versão exata e integridade SHA-512 no lockfile, e trocar SVGs sem necessidade poderia mudar a apresentação. O pacote é usado e não apresenta scripts `preinstall`, `install`, `postinstall` ou `prepare` em seu manifesto. Seus próprios devDependencies não fazem parte da árvore instalada deste site. A auditoria npm não cobre todas as Actions, o runtime, a hospedagem ou código malicioso ainda sem advisory.

Pins consultados nas mesmas versões principais oficiais:

| Action | Commit |
|---|---|
| checkout v4 | `11d5960a326750d5838078e36cf38b85af677262` |
| setup-node v4 | `49933ea5288caeca8642d1e84afbd3f7d6820020` |
| upload-pages-artifact v3 | `56afc609e74202658d3ffba0e8f6dda462b719fa` |
| configure-pages v5 | `983d7736d9b0ae728b81ab479565c72886d7745b` |
| deploy-pages v4 | `d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e` |

## Headers e CSP para produção

Fonte executável dos valores: `scripts/security.mjs`. Aplicar no servidor/CDN, não em JavaScript do navegador. A CSP da meta é a mesma abaixo sem `frame-ancestors`, que exige header HTTP.

```http
Content-Security-Policy: default-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'sha256-EpNCeij0EINbPfGHb/UDAlEsp5BT31CtULrD2+2bqs0='; style-src-attr 'none'; img-src 'self'; media-src 'self'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; worker-src 'none'; manifest-src 'none'; frame-ancestors 'none'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

Depois de verificar o HTTPS de todo o domínio definitivo, configurar também:

```http
Strict-Transport-Security: max-age=31536000
```

Não habilitar `includeSubDomains` ou preload sem verificar cada subdomínio. O domínio GitHub observado já enviava `max-age=31556952`; isso não corrige o certificado do portal em outro domínio. Nenhum HSTS foi simulado na prévia HTTP local.

`Cross-Origin-Embedder-Policy` foi avaliado e deixado sem exigência: o site não precisa de isolamento para SharedArrayBuffer e não usa embeds externos. Sua ausência não foi classificada, isoladamente, como vulnerabilidade. COOP/CORP acrescentados à configuração foram testados com os links de nova aba existentes.

`upgrade-insecure-requests` foi avaliado, mas não acrescentado: não há subrecursos HTTP, a CSP bloqueia recursos não permitidos e a entrega final deve redirecionar HTTP e usar HSTS. Essa diretiva não conserta certificado inválido ou garante navegação externa segura.

O hash autoriza somente o CSS literal do menu sem JavaScript; mudanças nesse texto exigem atualizar o header com o hash recalculado pelo módulo. A política permite os recursos usados pelo projeto e passou em enforcement local. A CSP é uma camada adicional: scripts maliciosos servidos da própria origem ainda exigem proteção da cadeia de publicação. Não há nonce estático fingindo ser proteção dinâmica.

No domínio final, validar inicialmente em homologação com os mesmos recursos. Se for necessário observar incompatibilidades de infraestrutura, usar temporariamente `Content-Security-Policy-Report-Only` no servidor; não há endpoint de relatórios neste projeto e nenhum foi inventado. Depois aplicar enforcement e conferir respostas reais. A meta já existente continua sendo enforcement durante esse procedimento.

## Arquivos que não devem entrar no diretório público

| Arquivo / diretório | Motivo e estado |
|---|---|
| `.git/`, `.github/`, `.claude/`, `AGENTS.md`, `.gitignore` | Metadados, automação e instruções de desenvolvimento; excluídos de `dist` |
| `.codex-backups/`, `Arquivo.zip`, diretórios `*/baseline/` | Histórico e backups; excluídos do artefato |
| `tests/`, `scripts/`, `node_modules/`, `package*.json` | Ferramentas de desenvolvimento; não são servidos pelo site |
| `README.md`, `SECURITY_AUDIT.md` e demais relatórios internos | Documentação do repositório; não entra no site gerado |
| `mobile-qa/`, `support-assistant-qa/`, `visual-audit-*/` e outras galerias/logs de revisão | Evidências locais; não publicadas pelo build |
| `src/components/`, `src/legal.mjs`, `src/routes.mjs`, CSSs históricos | Fontes de geração/rascunhos; não copiados como arquivos públicos |
| Mídias originais e variantes de `public/assets/` fora da lista do build | Materiais não selecionados; somente as 18 mídias necessárias são copiadas |
| `.env*`, chaves, credenciais, dumps SQL, source maps | Não encontrados; proibidos no artefato por sua allowlist de arquivos |

Os seis módulos em `dist/src/`, inclusive `config.mjs`, são públicos intencionalmente. Arquivos de documentação também poderão ser vistos pelo acesso ao próprio repositório, dependendo de sua visibilidade: exclusão do site não os transforma em documentos confidenciais.

O checker verificou exatamente 41 arquivos e rejeita arquivos especiais/links simbólicos. Na publicação existente, requisições a `.env`, `.git/config`, `Arquivo.zip`, `README.md`, `SECURITY_AUDIT.md`, `package-lock.json`, `src/client.mjs.map` e ao TAR de backup retornaram 404.

## Arquivos alterados nesta auditoria

| Arquivo | Alteração |
|---|---|
| `.github/workflows/pages.yml` | Gate de pré-publicação, pins, instalação sem lifecycle scripts, auditoria npm e separação de privilégios |
| `scripts/security.mjs` | CSP compatível mais restritiva, hash do fallback, COOP/CORP |
| `scripts/build.mjs` | Usa o CSS/hash compartilhado e nova revisão do módulo/CSS no HTML |
| `src/components/hero.mjs` | Atrasos em atributo de dados, sem `style` inline no HTML |
| `src/client.mjs` | Aplica os mesmos atrasos de animação por propriedade CSS |
| `scripts/check-hosting.mjs` | Comparação integral de headers e validação de redirecionamento HTTPS |
| `scripts/check-security-browser.mjs` | Regressão de XSS, CSP, formulários, armazenamento, links, IDs, headers, arquivos privados e traversal |
| `README.md` | Corrige estado da publicação/portal e documenta os novos controles |
| `SECURITY_AUDIT.md` | Histórico, evidências, achados e pendências desta auditoria |

`dist/` foi regenerado como saída ignorada pelo Git. Nenhum CSS visual, mídia, preço, conteúdo comercial ou endereço oficial foi modificado. Evidências temporárias ficaram em `/private/tmp/amr-security-20260926/`.

## Testes executados

| Verificação | Resultado |
|---|---|
| `npm test`, antes e após correções | 51/51 aprovados |
| `npm run build` | 12 páginas geradas |
| `npm run check:dist` | 41 arquivos exatos, nenhum arquivo extra |
| `npm audit --json --ignore-scripts` | 0 vulnerabilidades reportadas pelo registro npm |
| `npm outdated --json` / `npm view` | Iconoir 7.12.1 disponível; atualização não necessária para corrigir advisory conhecido |
| `scripts/check-security-browser.mjs` | 12 páginas com headers esperados; scripts/estilos injetados e submit nativo bloqueados; XSS tratado como texto; plano adulterado rejeitado; preço oficial preservado; limite JS; armazenamento vazio; sem IDs duplicados; iframe local bloqueado; arquivos privados/traversal bloqueados; menu sem JS funcional |
| `scripts/check-form-browser.mjs` | Modo normal, JS desativado e falha de carregamento do script; nenhuma navegação com dados pessoais ou abertura automática de WhatsApp |
| `scripts/check-pages-browser.mjs` | 12 páginas × 6 larguras (320–1440 px), 18 destinos internos, 42 botões de contato, menu, voltar, reload, accordion e foco; nenhum erro no console |
| `scripts/check-mobile-browser.mjs` | 360×640, 390×844, 430×932, 768×1024, 1440×950 e 390×400; três slides, quatro vídeos, entrada, pausa/retomada, mídia fora da tela, movimento reduzido, economia de dados, falha de MP4 e autoplay bloqueado; nenhum erro inesperado |
| `scripts/check-support-browser.mjs` | Delay real de 11 s, sete larguras, foco, modal, viewport curta, nova aba interceptada, retorno/navegação, armazenamento bloqueado e sem JS; nenhum erro inesperado |
| Inspeção visual | Capturas pós-correção do slide empresarial em 390 e 1440 px examinadas; estrutura, texto, vídeo e controles preservados |
| `node scripts/prepare-pages.mjs` + `check:dist` | Adaptação `/AMRTELECOM/`, referências e lista de arquivos aprovadas; build normal restaurado depois |
| `npm run prepublish:check` | Falha esperada: domínio + referências/revisões comercial, privacidade e termos |
| `npm run check:hosting` | Bloqueio esperado antes de fazer requisições: pré-publicação incompleta; não é aprovação de produção |
| Leitura das 12 páginas públicas | HTTP 200; meta CSP e noindex; headers ausentes registrados em SEC-002 |
| HTTP público | 301 para o mesmo caminho HTTPS; HSTS presente |
| Iframe público em navegador | Home carregou dentro de outra origem; confirma SEC-002 |
| Portal oficial | Falha TLS; certificado incompatível e expirado confirmado |
| Workflow YAML e `git diff --check` | YAML válido, build/deploy separados, gate presente; sem erros de whitespace |

Os testes de navegador usaram o Playwright já disponível em `/Users/saulolima/.cache/codex-runtimes/codex-primary-runtime/dependencies/node`, via `AMR_PLAYWRIGHT_ROOT`, e uma prévia isolada em `http://127.0.0.1:4181`. Não foi adicionada dependência de testes. Chrome precisou executar fora do sandbox restrito; a consulta inicial ao npm também precisou de acesso de rede. Ambas foram concluídas. A emulação mobile não substitui testes em aparelhos físicos, e não foi executada a pipeline real de deploy no GitHub.

Para repetir, gerar o build, iniciar a prévia e apontar `AMR_ORIGIN`/`AMR_PLAYWRIGHT_ROOT` para o ambiente disponível. Executar os cinco scripts `check-*-browser.mjs` listados acima. Usar `AMR_MOBILE_EVIDENCE` e `AMR_SUPPORT_EVIDENCE` para manter evidências fora de `dist/`.

## Segunda auditoria após as correções

Foi revisado o diff e reexaminado o artefato gerado. Confirmado novamente:

- Os 12 HTMLs têm apenas o módulo externo local de entrada, sem handlers de eventos ou atributos `style` serializados, e o único CSS inline corresponde exatamente ao hash autorizado.
- Não há sinks de HTML/código, APIs, armazenamento, service workers ou URLs externas de CSS nos módulos/estilos publicados.
- Formulários mantêm prévia por texto e encoding de URL, a allowlist de planos continua ativa e nenhum dado entra em armazenamento do navegador. Links de terceiros são navegação deliberada.
- A CSP não exige fonte externa, não quebra o menu sem JS e preserva a mutação de propriedades CSS usada pelos vídeos/atendimento. Os cinco testes de navegador terminaram aprovados.
- A adaptação de caminhos para Pages continua funcionando. Somente `dist` é enviado, após o gate, e a allowlist permanece com 41 arquivos.
- Lockfile e versão do pacote não mudaram; a consulta npm sem vulnerabilidades permanece aplicável à árvore auditada. Nenhum segredo ou serviço externo foi acrescentado pelo diff.
- O checker resolve `Location` relativo a partir do HTTP original; um redirect que permaneça em HTTP não satisfaz a comparação com o destino HTTPS.
- Não foi confundida a proteção local com a publicada: os dois achados externos continuam abertos, e as correções de código ainda precisam ser integradas e publicadas após os pré-requisitos.

Não foi encontrada nova vulnerabilidade nas alterações examinadas. Isso não é garantia de ausência de falhas fora dos fluxos, navegadores e configurações testados.

## Pendências e riscos residuais

| Responsável / camada | Ação necessária |
|---|---|
| Hospedagem do portal | Corrigir certificado/SNI de `www.amrfibra.com.br`, renovar e testar sem bypass de TLS (SEC-001) |
| DNS do portal, se necessário | Confirmar que o domínio aponta ao virtual host correto; não foi concluído que a causa é DNS |
| Servidor/CDN do site | Aplicar CSP/headers HTTP e comprovar o bloqueio de iframe nas respostas reais (SEC-002) |
| AMR / responsáveis pelo conteúdo | Definir domínio final e completar referências comerciais e revisão dos textos de privacidade/termos, identificação, canal e retenção |
| Publicação | Integrar as correções, executar os checks e publicar somente após resolver os itens anteriores; adaptar `/AMRTELECOM/` se o domínio final servir a raiz |
| Configuração fora do repositório | Conferir permissões do repositório, proteção de branch e ambiente de deploy; não houve acesso a essas configurações |
| Provedores externos | Tratamento e retenção no WhatsApp/portal/hospedagem permanecem fora desta auditoria do frontend |
| Backend | Nenhuma correção de backend próprio: não existe neste repositório. Segurança interna do portal requer escopo e validação separados |

O build aprovado não desfaz a publicação antiga nem impede um administrador de publicar manualmente outro artefato. HSTS de um domínio não valida outro domínio. A política baseada em `'self'` confia nos arquivos entregues pela própria origem; proteger repositório/build/hospedagem continua necessário. Não há alertas de segurança no cliente nem serviço de recebimento de relatórios CSP, pois também não há infraestrutura correspondente no projeto.

## Referências e relação com OWASP

A análise usa a taxonomia atual do [OWASP Top 10:2025](https://top10.owasp.org/2025/0x00_2025-Introduction/): A02 relaciona-se aos headers, CSP e gates; A03 à cadeia de Actions/npm; A04 ao TLS do portal. A05 foi investigado nos fluxos de URL e formulário sem encontrar XSS/injeção explorável. A01/A07 não se aplicam a autenticação local inexistente. A06 envolve a decisão explícita de encaminhar dados por WhatsApp; A08, a integridade do artefato; A09, logs fora do frontend; A10, falhas de scripts/mídias com fallback e validação conservadora de publicação. Não são alegações de conformidade integral ou de presença de todas as categorias.

Foram usados conceitos do [OWASP ASVS](https://owasp.org/projects/asvs?tab=main) para entradas, configuração, dados e dependências, sem alegar certificação/nível ASVS. A preferência por destinos DOM textuais está alinhada ao [DOM based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html). CSP foi tratada como defesa adicional conforme o [CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html), e os headers segundo o [HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

O uso de propriedades CSS pelo módulo confiável, sem liberar atributos inline, segue o comportamento documentado em [MDN: style-src-attr](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src-attr). Os pins e a limitação de privilégios seguem a orientação de [uso seguro de GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use). A distinção entre HTTPS e acesso público no Pages está documentada em [GitHub: HTTPS no Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https). As conclusões sobre os headers ausentes e o certificado são medições diretas desta sessão.

## STATUS DE SEGURANÇA DO PROJETO

- [ ] BLOQUEADO PARA PRODUÇÃO
- [x] REQUER CORREÇÕES ANTES DO DEPLOY
- [ ] APTO PARA HOMOLOGAÇÃO
- [ ] APTO PARA PRODUÇÃO COM RISCOS DOCUMENTADOS

Justificativa: o código corrigido e suas regressões passaram, mas o portal oficial segue com TLS inválido, a hospedagem pública não aplica os headers exigidos e a liberação comercial/legal está incompleta. A conclusão se limita ao escopo e às evidências acima; o projeto não foi declarado invulnerável.
