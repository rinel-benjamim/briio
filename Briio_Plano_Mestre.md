# Briio --- Plano Mestre do Produto e Desenvolvimento

> Documento de referência para desenvolvimento assistido por IA.\
> Toda IA ou desenvolvedor que trabalhar no Briio deve ler este
> documento antes de implementar funcionalidades.

## 1. Visão do produto

**Briio** é uma aplicação mobile **offline-first** para engenheiros
civis e profissionais de construção que precisam produzir diariamente
Relatórios Diários de Obras (RDO).

O fluxo principal é:

**Obra → Novo RDO → Preencher dados → Fotografias → Revisar → Gerar PDF
→ Partilhar**

O Briio deve reduzir tempo de preenchimento, repetição de dados, erros
de transcrição e trabalho manual de montagem do relatório.

## 2. Contexto de negócio

O caso inicial é uma engenheira de construção civil que:

-   trabalha em várias obras;
-   normalmente produz um RDO por dia e por obra;
-   usa sempre o mesmo modelo;
-   recolhe os dados diretamente da obra;
-   preenche os campos diariamente;
-   normalmente tira fotografias depois do preenchimento;
-   pode assinar o relatório ou definir o chefe/responsável para
    assinatura;
-   envia o PDF digitalmente para posterior impressão e assinatura
    física.

O MVP é inicialmente **single-user**, mas a arquitetura deve permitir
evolução para vários utilizadores e empresas.

------------------------------------------------------------------------

# 3. Princípio arquitetural: Offline First

## Regra fundamental

> A internet nunca pode ser necessária para criar, editar, consultar ou
> gerar um RDO no MVP.

Não haverá backend, API ou banco remoto no MVP.

Arquitetura:

``` text
Utilizador
    ↓
React Native + Expo
    ↓
Application Services
    ↓
Repositories
    ↓
SQLite local
    +
Filesystem local
    ↓
PDF local
    ↓
Share Sheet do sistema
```

A aplicação deve funcionar em modo avião.

------------------------------------------------------------------------

# 4. Stack tecnológica

  -----------------------------------------------------------------------
  Área                    Tecnologia              Finalidade
  ----------------------- ----------------------- -----------------------
  Mobile                  React Native            Aplicação Android/iOS

  Tooling/runtime         Expo                    APIs nativas, builds e
                                                  distribuição

  Linguagem               TypeScript              Código principal

  Navegação               Expo Router             Rotas e navegação

  Banco                   expo-sqlite / SQLite    Dados estruturados
                                                  offline

  Filesystem              expo-file-system        Fotografias e PDFs

  Câmera                  Expo Camera             Captura de fotografias

  Galeria                 Expo Image Picker       Seleção de fotografias

  PDF                     Expo Print              Geração local

  Partilha                Expo Sharing            Share Sheet nativo

  Estado                  React state/hooks;      Estado de UI
                          solução leve se         
                          necessária              

  Formulários             Biblioteca compatível   Validação e formulários
                          com React Native,       
                          somente se justificar   

  IDs                     UUID                    Identificadores
                                                  preparados para futura
                                                  sincronização
  -----------------------------------------------------------------------

### Regra de dependências

Antes de instalar uma biblioteca, verificar se Expo/React Native já
resolve o problema. Não adicionar dependências apenas por conveniência.

------------------------------------------------------------------------

# 5. Arquitetura de código

A separação recomendada é:

``` text
Screens / UI
      ↓
Hooks / View Models
      ↓
Application Services
      ↓
Repositories
      ↓
SQLite / Filesystem
```

As telas **não devem executar SQL diretamente**.

Errado:

``` ts
await db.runAsync(...)
```

dentro de uma screen.

Correto:

``` ts
await rdoService.update(...)
```

com:

``` text
rdoService
    ↓
rdoRepository
    ↓
SQLite
```

Estrutura sugerida:

``` text
src/
├── app/
├── components/
│   ├── ui/
│   ├── forms/
│   └── rdo/
├── features/
│   ├── dashboard/
│   ├── projects/
│   ├── rdos/
│   ├── workforce/
│   ├── materials/
│   ├── equipment/
│   ├── tasks/
│   ├── occurrences/
│   ├── observations/
│   ├── photographs/
│   └── pdf/
├── services/
├── repositories/
├── database/
│   ├── sqlite.ts
│   └── migrations/
├── storage/
│   ├── photographs/
│   └── pdfs/
├── hooks/
├── types/
├── constants/
└── utils/
```

A estrutura exata pode evoluir, mas a separação de responsabilidades
deve ser preservada.

------------------------------------------------------------------------

# 6. Banco de dados

SQLite é a **fonte de verdade dos dados estruturados** no MVP.

Não usar:

-   JSON gigante;
-   AsyncStorage como banco principal;
-   estado React como persistência.

AsyncStorage, se necessário, fica limitado a pequenas preferências.

## Entidades

``` text
Profile
Project
RDO
RDOConfiguration
RDOWeatherCondition
WorkforceEntry
MaterialEntry
EquipmentEntry
Task
Occurrence
Observation
Photograph
AppSettings
```

------------------------------------------------------------------------

# 7. Modelo de dados

## Profile

``` text
profiles
- id UUID
- name
- role
- company
- phone
- email
- created_at
- updated_at
```

O MVP não possui autenticação online.

## Project / Obra

``` text
projects
- id UUID
- name
- reference
- location
- province
- start_date
- expected_end_date
- responsible_name
- client_name
- contractor_name
- inspector_name
- status
- created_at
- updated_at
- archived_at nullable
```

Estados:

``` text
active
completed
archived
```

## RDO

``` text
rdos
- id UUID
- project_id UUID
- number
- report_date
- status
- progress_percentage
- generated_pdf_uri nullable
- created_at
- updated_at
- completed_at nullable
- generated_at nullable
```

Estados do MVP:

``` text
draft
completed
generated
```

Futuramente podem existir:

``` text
shared
archived
```

## Configuração do RDO

``` text
rdo_configurations
- id UUID
- project_id UUID
- default_responsible
- signature_person
- signature_type
- template
- created_at
- updated_at
```

## Condições meteorológicas

``` text
rdo_weather_conditions
- id UUID
- rdo_id UUID
- period
- condition
- notes
- created_at
- updated_at
```

Períodos:

``` text
morning
afternoon
night
```

Condições iniciais:

``` text
sunny
cloudy
rain
```

## Mão de obra

``` text
workforce_entries
- id UUID
- rdo_id UUID
- function
- people_count
- hours_per_person
- total_hours
- observation
- created_at
- updated_at
```

Regra:

``` text
total_hours = people_count × hours_per_person
```

O sistema calcula o total.

## Materiais

``` text
material_entries
- id UUID
- rdo_id UUID
- material
- quantity
- unit
- status
- observation
- created_at
- updated_at
```

Status:

``` text
received
used
missing
in_transit
```

## Equipamentos

``` text
equipment_entries
- id UUID
- rdo_id UUID
- equipment
- quantity
- hours_used
- status
- observation
- created_at
- updated_at
```

Status:

``` text
operational
stopped
maintenance
unavailable
```

## Tarefas

``` text
tasks
- id UUID
- rdo_id UUID
- description
- location
- quantity
- unit
- progress_percentage
- status
- observation
- created_at
- updated_at
```

Estados:

``` text
in_progress
completed
paused
```

O progresso da tarefa é diferente do progresso geral da obra.

## Ocorrências

``` text
occurrences
- id UUID
- rdo_id UUID
- title
- occurred_at
- location
- description
- impact
- action_taken
- created_at
- updated_at
```

Impactos:

``` text
none
low
relevant
stoppage
```

## Observações

No MVP, uma observação geral é suficiente:

``` text
rdo_observations
- id UUID
- rdo_id UUID
- content
- created_at
- updated_at
```

## Fotografias

SQLite guarda apenas metadata:

``` text
photographs
- id UUID
- rdo_id UUID
- file_uri
- thumbnail_uri nullable
- caption
- location
- type
- sort_order
- created_at
- updated_at
```

A imagem fica no filesystem.

------------------------------------------------------------------------

# 8. Filesystem

Não guardar imagens binárias no SQLite.

Estrutura conceptual:

``` text
Briio/
├── photographs/
│   └── {rdoId}/
│       ├── {photoId}.jpg
│       └── {photoId}-thumb.jpg
└── pdfs/
    └── {rdoId}.pdf
```

Fotografias devem ser redimensionadas/comprimidas adequadamente e devem
possuir thumbnails para listas.

O PDF deve ser guardado localmente.

------------------------------------------------------------------------

# 9. IDs e timestamps

Usar UUIDs para entidades de domínio.

Todas as entidades relevantes devem possuir:

``` text
created_at
updated_at
```

Quando houver benefício real:

``` text
deleted_at
```

IDs UUID são importantes porque a futura API poderá sincronizar dados
criados offline sem depender de IDs incrementais.

------------------------------------------------------------------------

# 10. Migrations

O schema SQLite deve ser versionado:

``` text
database/
└── migrations/
    ├── 001_initial_schema
    ├── 002_...
    └── ...
```

Nunca modificar a base manualmente.

Toda alteração estrutural precisa de migration.

------------------------------------------------------------------------

# 11. Como os dados entram no sistema

Existem três fontes.

## 11.1 Utilizador

-   dados da obra;
-   mão de obra;
-   materiais;
-   equipamentos;
-   tarefas;
-   ocorrências;
-   observações;
-   configurações.

## 11.2 Dispositivo

-   fotografias;
-   data/hora;
-   localização opcional;
-   ficheiros.

## 11.3 Reutilização

O RDO anterior pode servir como ponto de partida.

Dados normalmente reutilizáveis:

-   mão de obra;
-   atividades;
-   materiais;
-   equipamentos.

Dados específicos do novo dia:

-   condições meteorológicas;
-   ocorrências;
-   observações;
-   fotografias.

A reutilização deve copiar os dados selecionados para o novo RDO; nunca
transformar o RDO antigo no novo RDO.

------------------------------------------------------------------------

# 12. Autosave

Autosave é requisito obrigatório.

Fluxo:

``` text
Utilizador altera campo
        ↓
React state
        ↓
Debounce ~300–500ms
        ↓
Service
        ↓
Repository
        ↓
SQLite
```

O botão "Continuar" nunca deve ser o único momento em que os dados são
persistidos.

Se o app for fechado, o rascunho deve continuar disponível.

------------------------------------------------------------------------

# 13. RDO diário

Normalmente deve existir no máximo um RDO por:

``` text
project_id + report_date
```

Antes de criar um RDO, verificar se já existe um.

Se existir, oferecer continuar o RDO existente em vez de criar outro
acidentalmente.

------------------------------------------------------------------------

# 14. Fluxo completo do RDO

``` text
Obra
 ↓
Novo RDO
 ↓
Começar do zero
     ou
Usar RDO anterior
 ↓
Condições do dia
 ↓
Mão de obra
 ↓
Materiais
 ↓
Equipamentos
 ↓
Tarefas
 ↓
Ocorrências
 ↓
Observações
 ↓
Fotografias
 ↓
Revisão
 ↓
Gerar PDF
 ↓
RDO Gerado
 ↓
Abrir / Guardar / Partilhar
```

------------------------------------------------------------------------

# 15. Revisão

Antes da geração:

``` text
RDO
 ↓
Verificar seções obrigatórias
 ↓
Tudo preenchido?
 ├─ Não → indicar o que falta
 └─ Sim → gerar PDF
```

Campos opcionais não devem bloquear o relatório.

A revisão deve mostrar claramente:

-   Condições;
-   Mão de obra;
-   Materiais;
-   Equipamentos;
-   Tarefas;
-   Ocorrências;
-   Observações;
-   Fotografias.

------------------------------------------------------------------------

# 16. PDF

A geração será local.

Fluxo:

``` text
SQLite
 ↓
RDO DTO
 ↓
PDF renderer
 ↓
HTML/CSS
 ↓
expo-print
 ↓
PDF local
```

O renderer deve ser separado das telas.

Estrutura possível:

``` text
features/pdf/
├── rdo.template.ts
├── styles.ts
├── renderer.ts
└── types.ts
```

O PDF deve reproduzir o modelo de RDO aprovado e conter:

-   identificação da obra;
-   data;
-   responsável;
-   condições meteorológicas;
-   mão de obra;
-   materiais;
-   equipamentos;
-   tarefas;
-   ocorrências;
-   observações;
-   fotografias;
-   legendas;
-   paginação;
-   cabeçalho/rodapé;
-   campos de assinatura.

## Regra crítica

Se a geração do PDF falhar, os dados do RDO continuam intactos.

Nunca apagar ou corromper o RDO por causa de erro de PDF.

Se o RDO for alterado depois da geração, o PDF deve ser marcado como
potencialmente desatualizado e poderá ser gerado novamente.

------------------------------------------------------------------------

# 17. Partilha

Não implementar WhatsApp/email diretamente.

Usar o Share Sheet do sistema:

``` text
PDF local
 ↓
expo-sharing
 ↓
Share Sheet
 ↓
WhatsApp / Email / Drive / etc.
```

------------------------------------------------------------------------

# 18. Assinatura

O MVP não possui assinatura digital.

O fluxo é:

``` text
Gerar PDF
 ↓
Partilhar
 ↓
Imprimir
 ↓
Assinar fisicamente
```

A interface pode indicar:

> Assinatura física pendente

Assinatura digital fica para uma versão futura.

------------------------------------------------------------------------

# 19. Permissões

Pedir permissões somente quando necessárias.

Exemplo:

``` text
Tocar "Tirar fotografia"
 ↓
Solicitar câmera
 ↓
Abrir câmera
```

Não pedir câmera ou localização no primeiro arranque sem motivo.

Localização é opcional e nunca deve bloquear o uso do app.

------------------------------------------------------------------------

# 20. Performance

O Briio pode ser usado em Androids modestos.

Prioridades:

1.  inicialização rápida;
2.  UI responsiva;
3.  gravação local eficiente;
4.  baixo consumo de memória;
5.  bom tratamento de fotografias;
6.  nenhuma dependência de rede;
7.  queries SQLite específicas.

Evitar:

-   carregar todos os RDOs de todas as obras;
-   imagens originais em listas;
-   queries em cada render;
-   cálculos pesados a cada tecla;
-   PDFs gigantes;
-   estado global contendo todo o banco.

Usar:

-   FlatList/virtualização;
-   thumbnails;
-   memoização quando justificar;
-   debounce;
-   queries específicas;
-   carregamento sob demanda.

------------------------------------------------------------------------

# 21. Formulários

Formulários devem:

-   possuir labels claras;
-   validar dados;
-   ter touch targets grandes;
-   funcionar bem com teclado;
-   salvar automaticamente;
-   recuperar rascunhos;
-   não exigir dados já conhecidos pelo sistema.

As telas de adicionar e editar devem reutilizar o mesmo componente
quando possível.

------------------------------------------------------------------------

# 22. Design e UX

O design aprovado no Banani é a referência.

Características:

-   fundo off-white;
-   azul-marinho como cor principal;
-   branco para superfícies;
-   Inter;
-   bordas discretas;
-   cantos arredondados;
-   cards compactos;
-   labels pequenas;
-   botões navy;
-   chips de estado;
-   navegação inferior;
-   aparência profissional e minimalista.

Não criar uma nova linguagem visual durante a implementação.

O app deve ser utilizável em contexto de obra:

-   com uma mão;
-   em ambientes claros;
-   com pouco tempo;
-   com conexão inexistente;
-   com teclado aberto;
-   com diferentes tamanhos de ecrã.

------------------------------------------------------------------------

# 23. Telas do MVP

Já desenhadas:

-   Dashboard;
-   Obras;
-   Detalhes da obra;
-   Informações da obra;
-   Nova obra;
-   Configuração do RDO;
-   Obra criada;
-   Novo RDO;
-   Usar RDO anterior;
-   Configuração de reutilização;
-   Overview do RDO;
-   Condições do dia;
-   Mão de obra;
-   Materiais;
-   Equipamentos;
-   Tarefas;
-   Ocorrências;
-   Observações;
-   Fotografias;
-   Revisão;
-   RDO gerado;
-   Histórico de RDOs;
-   Detalhe do RDO.

Formulários:

-   Adicionar/editar mão de obra;
-   Adicionar/editar material;
-   Adicionar/editar equipamento;
-   Adicionar/editar tarefa;
-   Adicionar/editar ocorrência;
-   Adicionar fotografia;
-   Editar obra.

Não criar telas adicionais sem uma necessidade funcional clara.

------------------------------------------------------------------------

# 24. Fora do MVP

Não implementar agora:

-   API;
-   Laravel;
-   PostgreSQL remoto;
-   login online;
-   cloud sync;
-   multiutilizador;
-   gestão empresarial;
-   dashboard web;
-   pagamentos;
-   subscrições;
-   assinatura digital;
-   chat;
-   IA;
-   OCR;
-   classificação automática de fotografias;
-   meteorologia online obrigatória;
-   localização obrigatória;
-   integrações diretas com WhatsApp/email;
-   analytics complexos.

------------------------------------------------------------------------

# 25. Preparação para a futura API

Mesmo sem backend, a arquitetura deve permitir:

``` text
UI
 ↓
Application Service
 ↓
Repository
 ↓
SQLite
```

No futuro:

``` text
UI
 ↓
Application Service
 ↓
Repository
 ├── Local SQLite
 └── Remote API
```

Possível arquitetura futura:

``` text
React Native + Expo
        ↓
Laravel API
        ↓
PostgreSQL
        +
Object Storage
```

O objetivo é que a UI não precise ser reescrita quando a sincronização
chegar.

------------------------------------------------------------------------

# 26. Sincronização futura

Quando existir API:

``` text
SQLite
 ↓
Sync Queue
 ↓
Internet disponível?
 ├─ Não → continuar offline
 └─ Sim
      ↓
     API
      ↓
   PostgreSQL
```

Estados futuros possíveis:

``` text
local
pending
synced
failed
```

Não implementar resolução de conflitos complexa no MVP.

------------------------------------------------------------------------

# 27. Segurança

Mesmo offline:

-   não colocar segredos no código;
-   validar entradas;
-   não logar dados sensíveis;
-   não expor dados desnecessariamente;
-   usar armazenamento seguro quando houver tokens no futuro.

A segurança da cloud será definida quando a API existir.

------------------------------------------------------------------------

# 28. Tratamento de erros

Mensagens devem ser úteis e simples.

Exemplo:

> Não foi possível guardar a fotografia. Tentar novamente.

PDF:

> Não foi possível gerar o RDO. Os dados continuam guardados. Tentar
> novamente.

Erros técnicos devem ser registrados sem incluir dados sensíveis.

------------------------------------------------------------------------

# 29. Transações

Usar transações quando uma operação altera várias entidades.

Exemplo de criação de RDO:

``` text
BEGIN
  criar RDO
  criar dados padrão
COMMIT
```

Se algo falhar:

``` text
ROLLBACK
```

------------------------------------------------------------------------

# 30. Testes

## Unitários

Testar:

-   cálculos;
-   validações;
-   regras de negócio;
-   transformações;
-   reutilização de dados;
-   estados.

Exemplo:

``` text
5 pessoas × 8 h = 40 h
```

## Repository

Testar:

-   criar;
-   editar;
-   consultar;
-   eliminar;
-   relações;
-   migrations.

## Integração

Testar:

``` text
Criar obra
 ↓
Criar RDO
 ↓
Preencher
 ↓
Guardar
 ↓
Reabrir
```

## E2E

Priorizar:

``` text
Criar obra
Criar RDO
Preencher
Adicionar fotos
Revisar
Gerar PDF
Partilhar
```

------------------------------------------------------------------------

# 31. Testes offline obrigatórios

Testar em modo avião:

1.  abrir app;
2.  criar obra;
3.  criar RDO;
4.  reutilizar RDO;
5.  preencher todos os campos;
6.  adicionar fotografias;
7.  fechar app;
8.  reabrir;
9.  continuar;
10. gerar PDF;
11. abrir PDF.

Tudo deve funcionar sem internet.

------------------------------------------------------------------------

# 32. Dispositivos reais

Não confiar apenas em simuladores.

Prioridade:

-   Android real;
-   diferentes tamanhos de ecrã;
-   dispositivos com pouca memória;
-   câmera real;
-   armazenamento limitado;
-   modo avião;
-   conexão lenta/intermitente.

------------------------------------------------------------------------

# 33. Git e qualidade

Usar Git.

Commits pequenos e claros.

Antes de concluir uma feature:

-   lint;
-   typecheck;
-   testes;
-   verificar navegação;
-   verificar persistência;
-   testar fluxo offline quando relevante.

------------------------------------------------------------------------

# 34. Desenvolvimento com IA

Qualquer IA que implemente código para o Briio deve:

1.  ler este documento;
2.  inspecionar o código existente;
3.  entender o domínio;
4.  identificar a feature correta;
5.  reutilizar componentes;
6.  reutilizar services/repositories;
7.  não duplicar lógica;
8.  não escrever SQL diretamente em screens;
9.  preservar offline-first;
10. preservar autosave;
11. validar dados;
12. considerar performance;
13. testar alterações;
14. não instalar dependências sem justificar;
15. não implementar funcionalidades fora do escopo.

A IA não deve alterar decisões arquiteturais silenciosamente.

------------------------------------------------------------------------

# 35. Roadmap de implementação

## Fase 0 --- Fundação

-   [x] Repositório
-   [x] Expo + React Native
-   [x] TypeScript
-   [x] Expo Router
-   [x] Lint/format
-   [x] Design tokens (light + dark mode)
-   [x] SQLite (expo-sqlite)
-   [x] Migrations (12 entidades)
-   [x] Filesystem (fotografias + PDFs)

## Fase 1 --- Obras

-   [x] Dashboard
-   [x] Lista de obras
-   [x] Criar obra
-   [x] Editar obra
-   [x] Detalhes
-   [x] Informações da obra
-   [x] Arquivar obra
-   [x] Repository layer (CRUD SQLite)
-   [x] Validações

## Fase 2 --- RDO

-   [x] Criar RDO
-   [x] Overview
-   [x] Condições do dia
-   [x] Mão de obra
-   [x] Materiais
-   [x] Equipamentos
-   [x] Tarefas
-   [x] Ocorrências
-   [x] Observações
-   [x] Fotografias
-   [x] Revisão
-   [x] RDO gerado (PDF básico)
-   [x] Repository layer (CRUD SQLite)
-   [x] Autosave real com debounce
-   [x] Validações
-   [x] Validação de RDO duplicado

## Fase 3 --- Reutilização

-   [x] Selecionar RDO anterior
-   [x] Selecionar dados
-   [x] Copiar para novo RDO
-   [x] Editar dados copiados

## Fase 4 --- PDF

-   [x] Revisão
-   [x] Validação
-   [x] Template
-   [x] HTML/CSS
-   [x] Fotografias
-   [x] Paginação
-   [x] Cabeçalho/rodapé
-   [x] Geração local
-   [x] Abrir
-   [x] Partilhar

## Fase 5 --- Qualidade

-   [x] Unit tests (59 tests — validation, uuid, repositories, services)
-   [x] Repository tests
-   [ ] Integration tests
-   [ ] E2E
-   [ ] Offline tests
-   [ ] PDF tests
-   [ ] Performance
-   [ ] Android real

## Fase 6 --- Beta

-   [ ] Usar em obra real
-   [ ] Produzir RDOs reais
-   [ ] Comparar PDF com modelo original
-   [ ] Medir tempo de preenchimento
-   [ ] Corrigir fricções
-   [ ] Corrigir bugs
-   [ ] Build de produção

------------------------------------------------------------------------

# 36. Critérios de aceitação do MVP

O MVP estará funcional quando uma utilizadora conseguir:

``` text
Abrir Briio
 ↓
Abrir/criar obra
 ↓
Criar RDO
 ↓
Começar do zero ou reutilizar RDO anterior
 ↓
Preencher RDO
 ↓
Adicionar fotografias
 ↓
Fechar app
 ↓
Reabrir
 ↓
Continuar sem perda de dados
 ↓
Revisar
 ↓
Gerar PDF
 ↓
Abrir PDF
 ↓
Partilhar PDF
```

Tudo isso deve funcionar sem internet.

------------------------------------------------------------------------

# 37. Métricas de sucesso

Medir:

### Tempo

Tempo necessário para produzir um RDO.

### Erros

Quantidade de correções necessárias após gerar o PDF.

### Reutilização

Percentagem de dados aproveitados do RDO anterior.

### Confiabilidade

Percentagem de RDOs gerados sem erro.

### Offline

Percentagem do fluxo completo que funciona sem internet.

O objetivo do produto não é ter muitas funcionalidades. É tornar a
produção diária do RDO **mais rápida, confiável e simples**.

------------------------------------------------------------------------

# 38. Evolução futura

Depois de validar o MVP:

## Versão 2

-   conta online;
-   API;
-   sincronização;
-   backup;
-   múltiplos dispositivos;
-   utilizadores;
-   empresas;
-   permissões;
-   cloud storage.

## Versão 3

-   dashboard web;
-   gestão de equipas;
-   aprovação;
-   assinatura digital;
-   analytics;
-   notificações.

## IA futura

Somente depois de validar o fluxo principal:

-   preenchimento assistido;
-   resumo de ocorrências;
-   classificação de fotografias;
-   OCR;
-   sugestões;
-   deteção de inconsistências.

IA não deve ser adicionada apenas porque é possível.

------------------------------------------------------------------------

# 39. Decisões definitivas do MVP

  Área              Decisão
  ----------------- ---------------------------------
  Plataforma        Mobile
  Framework         React Native
  Runtime           Expo
  Linguagem         TypeScript
  Navegação         Expo Router
  Banco             SQLite local
  Fotos             Filesystem local
  PDFs              Filesystem local
  Backend           Nenhum
  API               Nenhuma
  Cloud             Nenhuma dependência obrigatória
  Auth              Perfil local
  PDF               Geração local
  Partilha          Share Sheet
  Câmera            Expo Camera
  Galeria           Expo Image Picker
  Offline           Obrigatório
  Autosave          Obrigatório
  IDs               UUID
  Migrations        Obrigatórias
  Sync              Futuro
  Laravel           Futuro
  PostgreSQL        Futuro
  Multiutilizador   Futuro

------------------------------------------------------------------------

# 40. Princípio final

> **O Briio deve ser um excelente aplicativo offline antes de ser um
> produto cloud.**

Prioridade das decisões:

``` text
Confiabilidade
    ↓
Offline-first
    ↓
Integridade dos dados
    ↓
Experiência do utilizador
    ↓
Performance
    ↓
Manutenibilidade
    ↓
Simplicidade
```

Qualquer alteração futura deve respeitar essa ordem.

Quando houver uma dúvida técnica, a solução mais simples que preserve
esses princípios deve ser preferida à solução mais sofisticada.
