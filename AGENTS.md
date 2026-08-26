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
  → Services (services/)
  → Repositories (repositories/) [futuro]
  → Database (database/)
  → Storage (storage/)
```

- Nenhum SQL direto nas telas
- Autosave com debounce (300-500ms)
- UUIDs para todas as entidades
- Migrations obrigatórias

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
│       │       ├── add-workforce.tsx  ← Adicionar mão de obra
│       │       ├── edit-workforce.tsx ← Editar mão de obra
│       │       ├── materials.tsx      ← Materiais
│       │       ├── add-material.tsx   ← Adicionar material
│       │       ├── edit-material.tsx  ← Editar material
│       │       ├── equipment.tsx      ← Equipamentos
│       │       ├── add-equipment.tsx  ← Adicionar equipamento
│       │       ├── edit-equipment.tsx ← Editar equipamento
│       │       ├── tasks.tsx          ← Tarefas
│       │       ├── add-task.tsx       ← Adicionar atividade
│       │       ├── edit-task.tsx      ← Editar atividade
│       │       ├── occurrences.tsx    ← Ocorrências
│       │       ├── add-occurrence.tsx ← Adicionar ocorrência
│       │       ├── edit-occurrence.tsx ← Editar ocorrência
│       │       ├── observations.tsx   ← Observações
│       │       ├── photos.tsx         ← Fotografias
│       │       ├── add-photo.tsx      ← Adicionar fotografia
│       │       ├── edit-photo.tsx     ← Editar fotografia
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
│   │   └── TabBar.tsx                 ← Tab bar customizada (Expo Router tabBar prop)
│   ├── rdo/
│   │   ├── ProjectSelector.tsx        ← Select de obra (modal bottom sheet)
│   │   ├── RDOCard.tsx                ← Card do RDO com progresso
│   │   └── RecentReports.tsx          ← Lista de relatórios recentes
│   ├── projects/
│   │   ├── SearchBar.tsx              ← Input de busca (TextInput)
│   │   ├── ProjectCard.tsx            ← Card de projeto na lista
│   │   ├── ProjectHeader.tsx          ← Header com badge de status
│   │   ├── InfoCard.tsx               ← Grid 2x2 de informações
│   │   └── RecentRdoList.tsx          ← Lista simplificada de RDOs
├── features/
│   ├── dashboard/
│   │   └── DashboardScreen.tsx        ← Tela inicial
│   ├── rdo/
│   │   ├── ReportsScreen.tsx          ← Lista de Relatórios
│   │   ├── RdoDetailScreen.tsx        ← Detalhe do RDO Gerado
│   │   ├── RdoOverviewScreen.tsx      ← Visão geral do RDO
│   │   ├── NewRdoScreen.tsx           ← Novo RDO
│   │   ├── ReuseRdoScreen.tsx         ← Usar RDO anterior
│   │   ├── WeatherConditionsScreen.tsx ← Condições do dia
│   │   ├── WorkforceScreen.tsx        ← Mão de obra
│   │   ├── AddWorkforceScreen.tsx     ← Adicionar mão de obra
│   │   ├── EditWorkforceScreen.tsx    ← Editar mão de obra
│   │   ├── MaterialsScreen.tsx        ← Materiais
│   │   ├── AddMaterialScreen.tsx      ← Adicionar material
│   │   ├── EditMaterialScreen.tsx     ← Editar material
│   │   ├── EquipmentScreen.tsx        ← Equipamentos
│   │   ├── AddEquipmentScreen.tsx     ← Adicionar equipamento
│   │   ├── EditEquipmentScreen.tsx    ← Editar equipamento
│   │   ├── TasksScreen.tsx            ← Tarefas
│   │   ├── AddTaskScreen.tsx          ← Adicionar atividade
│   │   ├── EditTaskScreen.tsx         ← Editar atividade
│   │   ├── OccurrencesScreen.tsx      ← Ocorrências
│   │   ├── AddOccurrenceScreen.tsx    ← Adicionar ocorrência
│   │   ├── EditOccurrenceScreen.tsx   ← Editar ocorrência
│   │   ├── ObservationsScreen.tsx     ← Observações
│   │   ├── PhotosScreen.tsx           ← Fotografias
│   │   ├── AddPhotoScreen.tsx         ← Adicionar fotografia
│   │   ├── EditPhotoScreen.tsx        ← Editar fotografia
│   │   ├── ReviewRdoScreen.tsx        ← Revisar RDO
│   │   └── RdoGeneratedScreen.tsx     ← RDO Gerado (PDF)
│   └── projects/
│       ├── ProjectDetailScreen.tsx    ← Detalhe da obra
│       ├── ProjectInfoScreen.tsx      ← Informações completas
│       ├── CreateProjectScreen.tsx    ← Criar nova obra (passo 1)
│       ├── ConfigureRdoScreen.tsx     ← Configurar RDO (passo 2)
│       ├── EditProjectScreen.tsx      ← Editar obra
│       └── ProjectCreatedScreen.tsx   ← Obra criada com sucesso
├── services/
│   └── pdf-generator.ts              ← Geração de PDF (expo-print)
├── constants/
│   ├── colors.ts                      ← Cores (dark mode, indigo)
│   ├── typography.ts                  ← Fonte Inter, presets
│   ├── spacing.ts                     ← Espaçamentos, border radius
│   ├── shadows.ts                     ← Sombras
│   ├── database.ts                    ← Nome da DB
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

Ficheiro de design: `/home/codespace/Documentos/briio-design/briio.pen`

## 5. Convenções

- **Ícones:** Lucide React Native (nunca emojis)
- **Animações:** react-native-reanimated (PressableOpacity)
- **Navegação:** Expo Router Tabs com tabBar customizado
- **Status bar:** expo-status-bar style="light"
- **Formulários:** TextInput nativo (nunca Text)
- **Inputs:** height 48, backgroundColor `rgba(30, 41, 59, 0.6)`, borderRadius lg, borderWidth 1.5, borderColor `rgba(148, 163, 184, 0.12)`, paddingHorizontal 16
- **Modais:** Bottom sheets com overlay + Pressable
- **Nomes:** Componentes em PascalCase, ficheiros em camelCase

## 6. Estado atual (Fase 1 — Obras)

### Concluído
- [x] Fase 0: Fundação (Expo, TypeScript, SQLite, migrations, filesystem)
- [x] Design tokens (dark mode, indigo)
- [x] DatabaseProvider com migrations
- [x] Tab bar customizada (Expo Router tabBar prop)
- [x] Dashboard (Início) — FAB para criar novo RDO, modal de seleção de obra
- [x] Lista de Obras — SearchBar, ProjectCard, filtros
- [x] Detalhe da Obra — ProjectHeader, InfoCard, RecentRdoList, overflow menu
- [x] Informações da Obra — Dados, Entidades, Referência, Localização
- [x] Criar Obra — Formulário multi-secção (Identificação, Localização, Planeamento, Responsabilidade, Entidades)
- [x] Editar Obra — Formulário com dados preenchidos
- [x] Excluir Obra — Confirmação com modal de alerta
- [x] Fase 2: RDO (todas as secções, review, geração PDF, detalhe RDO)
- [x] Lista de Relatórios — Search, filtros, FAB com modal de seleção de obra

### Pendente (Fase 1)
- [ ] Arquivar obra (alternativa a excluir)

### Próximas fases
- Fase 3: Reutilização de RDO anterior
- Fase 4: PDF (review, template, geração, partilha)
- Fase 5: Qualidade (testes)
- Fase 6: Beta (validação em obra real)

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
