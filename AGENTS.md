# Briio — Contexto do Projeto

> Ficheiro de referência para IA. Ler antes de qualquer alteração.

## 1. Visão geral

**Briio** é app mobile offline-first para engenheiros civis produzirem Relatórios Diários de Obras (RDO). MVP single-user, sem backend.

**Stack:** React Native + Expo SDK 57, TypeScript, Expo Router, SQLite (expo-sqlite), Lucide React Native, React Native Reanimated.

## 2. Arquitetura

```
Screens (app/)
  → Components (components/)
  → Features (features/)
  → Contexts (contexts/)
  → Services (services/)
  → Repositories (repositories/) [futuro]
  → Database (database/)
  → Storage (storage/)
  → Mocks (mocks/)
```

- Nenhum SQL direto nas telas
- Autosave com debounce (300-500ms)
- UUIDs para todas as entidades
- Migrations obrigatórias
- Componentes compartilhados em `components/ui/`
- Formulários parametrizados com `mode: "add" | "edit"`

## 3. Estrutura de ficheiros

```
src/
├── app/
│   ├── _layout.tsx                    ← Root Stack (DatabaseProvider + StatusBar)
│   └── (tabs)/
│       ├── _layout.tsx                ← Tabs com tabBar customizado
│       ├── index.tsx                  ← Dashboard (Início)
│       ├── more.tsx                   ← Mais (placeholder)
│       ├── reports/
│       │   ├── _layout.tsx
│       │   ├── index.tsx              ← Lista de Relatórios
│       │   ├── new.tsx                ← Novo RDO
│       │   ├── reuse.tsx              ← Usar RDO anterior
│       │   └── [id]/
│       │       ├── _layout.tsx
│       │       ├── index.tsx          ← Visão geral do RDO
│       │       ├── detail.tsx         ← Detalhe do RDO Gerado
│       │       ├── weather.tsx        ← Condições do dia
│       │       ├── workforce.tsx      ← Mão de obra
│       │       ├── add-workforce.tsx  ← 3 linhas (importa WorkforceForm)
│       │       ├── edit-workforce.tsx ← 3 linhas (importa WorkforceForm)
│       │       ├── materials.tsx      ← Materiais
│       │       ├── add-material.tsx   ← 3 linhas (importa MaterialForm)
│       │       ├── edit-material.tsx  ← 3 linhas (importa MaterialForm)
│       │       ├── equipment.tsx      ← Equipamentos
│       │       ├── add-equipment.tsx  ← 3 linhas (importa EquipmentForm)
│       │       ├── edit-equipment.tsx ← 3 linhas (importa EquipmentForm)
│       │       ├── tasks.tsx          ← Tarefas
│       │       ├── add-task.tsx       ← 3 linhas (importa TaskForm)
│       │       ├── edit-task.tsx      ← 3 linhas (importa TaskForm)
│       │       ├── occurrences.tsx    ← Ocorrências
│       │       ├── add-occurrence.tsx ← 3 linhas (importa OccurrenceForm)
│       │       ├── edit-occurrence.tsx ← 3 linhas (importa OccurrenceForm)
│       │       ├── observations.tsx   ← Observações
│       │       ├── photos.tsx         ← Fotografias
│       │       ├── add-photo.tsx      ← 3 linhas (importa PhotoForm)
│       │       ├── edit-photo.tsx     ← 3 linhas (importa PhotoForm)
│       │       ├── review.tsx         ← Revisar RDO
│       │       └── generated.tsx      ← RDO Gerado (PDF)
│       └── projects/
│           ├── _layout.tsx
│           ├── index.tsx              ← Lista de obras
│           ├── create.tsx             ← Criar nova obra (passo 1)
│           └── [id]/
│               ├── _layout.tsx
│               ├── index.tsx          ← Detalhe da obra
│               ├── info.tsx           ← Informações completas da obra
│               ├── edit.tsx           ← Editar obra
│               ├── configure-rdo.tsx  ← Configurar RDO (passo 2)
│               └── created.tsx        ← Obra criada com sucesso
├── components/
│   ├── ui/
│   │   ├── PressableOpacity.tsx       ← Wrapper animado (opacity 0.7→1)
│   │   ├── TabBar.tsx                 ← Tab bar customizada (Expo Router tabBar prop)
│   │   ├── ScreenHeader.tsx           ← Header com botão voltar + título
│   │   ├── ContextBar.tsx             ← Barra de contexto (data + projeto)
│   │   ├── SummaryCard.tsx            ← Card de resumo
│   │   ├── PrimaryButton.tsx          ← Botão primário (accessível)
│   │   ├── SecondaryButton.tsx        ← Botão secundário (accessível)
│   │   ├── AddItemButton.tsx          ← Botão para adicionar item
│   │   ├── AutosaveStatus.tsx         ← Indicador de auto-save
│   │   ├── ProgressBadge.tsx          ← Badge de progresso
│   │   ├── Stepper.tsx                ← Componente stepper
│   │   ├── Dropdown.tsx               ← Dropdown genérico
│   │   ├── SegmentedControl.tsx       ← Controle segmentado
│   │   ├── StatusBadge.tsx            ← Badge de status
│   │   ├── EmptyState.tsx             ← Estado vazio
│   │   └── Form/
│   │       ├── index.ts               ← Barrel export
│   │       ├── Field.tsx              ← Label + TextInput (accessível)
│   │       ├── TextArea.tsx           ← Label + TextInput multiline
│   │       ├── StepperField.tsx       ← Label + [-] [valor] [+] (accessível)
│   │       ├── SelectField.tsx        ← Label + dropdown (accessível)
│   │       └── SegmentedField.tsx     ← Label + opções horizontais (accessível)
│   ├── rdo/
│   │   ├── ProjectSelector.tsx        ← Select de obra (modal bottom sheet)
│   │   ├── RDOCard.tsx                ← Card do RDO com progresso
│   │   └── RecentReports.tsx          ← Lista de relatórios recentes
│   └── projects/
│       ├── SearchBar.tsx              ← Input de busca (TextInput)
│       ├── ProjectCard.tsx            ← Card de projeto na lista
│       ├── ProjectHeader.tsx          ← Header com badge de status
│       ├── InfoCard.tsx               ← Grid 2x2 de informações
│       └── RecentRdoList.tsx          ← Lista simplificada de RDOs
├── contexts/
│   └── RdoContext.tsx                 ← Estado partilhado do RDO (rdoId, projectId)
├── features/
│   ├── rdo/
│   │   ├── ReportsScreen.tsx          ← Lista de Relatórios
│   │   ├── RdoDetailScreen.tsx        ← Detalhe do RDO Gerado
│   │   ├── RdoOverviewScreen.tsx      ← Visão geral do RDO
│   │   ├── NewRdoScreen.tsx           ← Novo RDO
│   │   ├── ReuseRdoScreen.tsx         ← Usar RDO anterior
│   │   ├── WeatherConditionsScreen.tsx ← Condições do dia
│   │   ├── WorkforceScreen.tsx        ← Mão de obra
│   │   ├── WorkforceFormScreen.tsx    ← Formulário unificado (add/edit)
│   │   ├── MaterialsScreen.tsx        ← Materiais
│   │   ├── MaterialFormScreen.tsx     ← Formulário unificado (add/edit)
│   │   ├── EquipmentScreen.tsx        ← Equipamentos
│   │   ├── EquipmentFormScreen.tsx    ← Formulário unificado (add/edit)
│   │   ├── TasksScreen.tsx            ← Tarefas
│   │   ├── TaskFormScreen.tsx         ← Formulário unificado (add/edit)
│   │   ├── OccurrencesScreen.tsx      ← Ocorrências
│   │   ├── OccurrenceFormScreen.tsx   ← Formulário unificado (add/edit)
│   │   ├── ObservationsScreen.tsx     ← Observações
│   │   ├── PhotosScreen.tsx           ← Fotografias
│   │   ├── PhotoFormScreen.tsx        ← Formulário unificado (add/edit)
│   │   ├── ReviewRdoScreen.tsx        ← Revisar RDO
│   │   └── RdoGeneratedScreen.tsx     ← RDO Gerado (PDF)
│   └── projects/
│       ├── ProjectDetailScreen.tsx    ← Detalhe da obra
│       ├── ProjectInfoScreen.tsx      ← Informações completas
│       ├── CreateProjectScreen.tsx    ← Criar nova obra (passo 1)
│       ├── ConfigureRdoScreen.tsx     ← Configurar RDO (passo 2)
│       ├── EditProjectScreen.tsx      ← Editar obra
│       └── ProjectCreatedScreen.tsx   ← Obra criada com sucesso
├── mocks/
│   ├── index.ts                       ← Barrel export
│   ├── projects.ts                    ← Dados de projetos
│   ├── rdo-context.ts                 ← Contexto do RDO
│   ├── rdo-sections.ts                ← Seções do RDO
│   ├── workforce.ts                   ← Dados de mão de obra
│   ├── materials.ts                   ← Dados de materiais
│   ├── equipment.ts                   ← Dados de equipamentos
│   ├── tasks.ts                       ← Dados de tarefas
│   ├── occurrences.ts                 ← Dados de ocorrências
│   ├── observations.ts                ← Observações rápidas
│   ├── photos.ts                      ← Dados de fotografias
│   ├── reports.ts                     ← Dados de relatórios
│   └── reuse.tsx                      ← Itens reutilizáveis
├── services/
│   └── pdf-generator.ts              ← Geração de PDF (expo-print)
├── constants/
│   ├── colors.ts                      ← Cores (dark mode, indigo)
│   ├── typography.ts                  ← Fonte Inter, presets
│   ├── spacing.ts                     ← Espaçamentos, border radius
│   ├── shadows.ts                     ← Sombras
│   ├── database.ts                    ← Nome da DB
│   ├── statuses.ts                    ← Configs de status (Project, RDO)
│   └── index.ts
├── database/
│   ├── index.tsx                      ← DatabaseProvider com migrations
│   └── migrations/
│       ├── index.ts                   ← Runner (PRAGMA user_version)
│       └── 001_initial_schema.ts      ← 12 entidades
├── storage/
│   ├── filesystem.ts                  ← CRUD fotografias e PDFs
│   └── index.ts
└── types/
    ├── database.ts                    ← Todas as interfaces
    └── index.ts
```

## 4. Design tokens (Pencil)

Cores do design dark mode:
- `surfaceBg: #0F172A`
- `brandPrimary: #6366F1`
- `textPrimary: #F8FAFC`
- `textSecondary: #94A3B8`
- `textTertiary: #64748B`
- `surfaceCard: rgba(30, 41, 59, 0.7)`
- `overlay: rgba(0, 0, 0, 0.5)`

Ficheiro de design: `/home/codespace/Documentos/briio-design/briio.pen`

## 5. Convenções

- **Ícones:** Lucide React Native (nunca emojis)
- **Animações:** react-native-reanimated (PressableOpacity)
- **Navegação:** Expo Router Tabs com tabBar customizado
- **Status bar:** expo-status-bar style="light"
- **Formulários:** Usar componentes de `components/ui/Form/` (Field, TextArea, StepperField, SelectField, SegmentedField)
- **Inputs:** height 48, backgroundColor `rgba(148, 163, 184, 0.1)`, borderRadius 12, borderWidth 1, borderColor `rgba(148, 163, 184, 0.12)`, paddingHorizontal 14
- **Modais:** Bottom sheets com overlay + Pressable
- **Nomes:** Componentes em PascalCase, ficheiros em camelCase
- **Botões:** PrimaryButton e SecondaryButton com accessibility props
- **Forms Add/Edit:** Componentes parametrizados com `mode: "add" | "edit"`
- **RdoContext:** Usar `useRdo()` para aceder ao estado partilhado do RDO

## 6. Estado atual

### Concluído
- [x] Fase 0: Fundação (Expo, TypeScript, SQLite, migrations, filesystem)
- [x] Design tokens (dark mode, indigo)
- [x] DatabaseProvider com migrations
- [x] Tab bar customizada (Expo Router tabBar prop)
- [x] Dashboard (Início) — FAB para criar novo RDO, modal de seleção de obra
- [x] Lista de Obras — SearchBar, ProjectCard, filtros
- [x] Detalhe da Obra — ProjectHeader, InfoCard, RecentRdoList, overflow menu
- [x] Informações da Obra — Dados, Entidades, Referência, Localização
- [x] Criar Obra — Formulário multi-secção
- [x] Editar Obra — Formulário com dados preenchidos
- [x] Excluir Obra — Confirmação com modal de alerta
- [x] Fase 2: RDO (todas as secções, review, geração PDF, detalhe RDO)
- [x] Lista de Relatórios — Search, filtros, FAB com modal de seleção de obra
- [x] Refatoração Fase 1-9: Componentes UI, mocks, tipos, forms, acessibilidade
- [x] Dark mode — arquitetura useThemedStyles, paleta Figma, 44+ ficheiros convertidos
- [x] Micro-interações — PressOpacity, AnimatedFAB, TabBar animada
- [x] Screen transitions — slide_from_right, slide_from_bottom, fade
- [x] Lazy loading — LoadingScreen, FadeInView
- [x] Repository layer — 10 repositórios CRUD (project, rdo, weather, workforce, material, equipment, task, occurrence, observation, photograph)
- [x] Services layer — project.service + rdo.service + reuse.service + pdf-generator (business logic, validations)
- [x] Custom hooks — useProjects, useRdoData, useAutosave, useThemedStyles
- [x] SQLite integration — todas as telas usam repositórios reais (mocks removidos)
- [x] Form validations — 7 form screens + ErrorMessage component
- [x] Autosave — Weather (on select) + Observations (400ms debounce) com AutosaveIndicator
- [x] Fase 3: Reutilização de RDO anterior (selecionar dados, copiar com transação)
- [x] Fase 4: PDF com dados reais (HTML/CSS template, geração, partilha, impressão)
- [x] Arquivar obra (alternativa a excluir)
- [x] Fase 5: Testes unitários (28 tests — validation, uuid)

### Em progresso
- [ ] Testes de integração

### Pendente
- [ ] Fase 6: Beta (validação em obra real)

## 7. Dependências instaladas

```json
{
  "expo": "~57.0.14",
  "expo-router": "~57.0.14",
  "expo-sqlite": "~57.0.1",
  "expo-file-system": "latest",
  "expo-image-picker": "~57.0.1",
  "expo-print": "latest",
  "expo-sharing": "latest",
  "expo-status-bar": "latest",
  "lucide-react-native": "latest",
  "react-native-svg": "latest",
  "react-native-reanimated": "4.5.1",
  "react-native-gesture-handler": "~2.32.0",
  "@react-native-community/datetimepicker": "latest"
}
```

## 8. Telas do design (Pencil)

- [x] Dashboard (`QFLC5`)
- [x] Obras (`IOvAc`)
- [x] Relatórios (`lu8nF`)
- [x] Detalhe da Obra (`G2Qye`)
- [x] Informações da Obra (`YocpP`)
- [x] Nova Obra (`Xu0Jj`)
- [x] Obra Criada (`1Bg8l`)
- [x] Overview do RDO (`S8h7J`)
- [x] Detalhe RDO (`Zz2Ck`)
- [x] Novo RDO (`fNlGE`)
- [x] Usar RDO anterior (`ioE6o`)
- [x] Condições do dia (`UnvC7`)
- [x] Mão de obra (`VNvbJ`)
- [x] Materiais (`FABv8`)
- [x] Equipamentos (`bgYe8`)
- [x] Tarefas (`D1WKx`)
- [x] Ocorrências (`JGbtQ`)
- [x] Observações (`RZAI4`)
- [x] Fotografias (`dHtnv`)
- [x] Revisão (`RdyB1`)
- [x] RDO gerado (`sMpvh`)
- [ ] Histórico de RDOs

## 9. Regras importantes

- Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/
- Nunca SQL direto nas telas
- Sempre autosave
- Offline-first sempre
- Não instalar dependências sem justificar
- Não implementar fora do escopo MVP
- Verificar design no Pencil antes de implementar
- Usar Context7 para docs de bibliotecas
- Usar componentes de `components/ui/` sempre que possível
- Forms Add/Edit devem usar componentes parametrizados
- Acessibilidade: accessibilityLabel, accessibilityRole, testID em elementos interativos
