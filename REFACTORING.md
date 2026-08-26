# Plano de Refatoração — Briio

> Ficheiro de acompanhamento. Atualizar sempre que uma fase for concluída.

## Estado Atual

| Fase | Descrição | Estado |
|------|-----------|--------|
| 1 | Extrair componentes UI partilhados | ✅ Concluída |
| 2 | Consolidar mock data em `src/mocks/` | ✅ Concluída |
| 3 | Corrigir tipos (`ProjectStatus`, `statusConfig`) | ✅ Concluída |
| 4 | Unificar Add/Edit screens (12 → 6) | ✅ Concluída |
| 5 | Extrair Form Fields (Field, DateField, SelectField) | ✅ Concluída |
| 6 | Criar RdoContext + corrigir rotas hardcoded | ✅ Concluída |
| 7 | Corrigir bugs e erros de estilo | ✅ Concluída |
| 8 | Limpar código morto | ⏳ Pendente |
| 9 | Adicionar acessibilidade básica | ⏳ Pendente |
| 10 | Atualizar AGENTS.md | ⏳ Pendente |

---

## Fase 1 — Componentes UI Partilhados ✅

**Objetivo:** Eliminar ~15.000 linhas de duplicação extraindo componentes reutilizáveis.

### Componentes criados

| Componente | Ficheiro | Descrição |
|------------|----------|-----------|
| `ScreenHeader` | `src/components/ui/ScreenHeader.tsx` | Nav bar com voltar + título + slot direito |
| `ContextBar` | `src/components/ui/ContextBar.tsx` | Data + nome do projeto |
| `SummaryCard` | `src/components/ui/SummaryCard.tsx` | Card com 2 valores (label + valor) |
| `PrimaryButton` | `src/components/ui/PrimaryButton.tsx` | Botão principal (brand, height 56) com loading/disabled |
| `SecondaryButton` | `src/components/ui/SecondaryButton.tsx` | Botão secundário (text, height 44) |
| `AddItemButton` | `src/components/ui/AddItemButton.tsx` | "Adicionar X" com ícone + |
| `AutosaveStatus` | `src/components/ui/AutosaveStatus.tsx` | Check + "Salvo automaticamente" |
| `ProgressBadge` | `src/components/ui/ProgressBadge.tsx` | Badge "X de Y" |
| `Stepper` | `src/components/ui/Stepper.tsx` | `[-]` valor `[+]` com label opcional |
| `Dropdown` | `src/components/ui/Dropdown.tsx` | Selector + modal (componente + sub-componente `DropdownOptions`) |
| `SegmentedControl` | `src/components/ui/SegmentedControl.tsx` | Opções horizontais (2-5 items) |
| `StatusBadge` | `src/components/ui/StatusBadge.tsx` | Badge com variantes (success/warning/info/default) |
| `EmptyState` | `src/components/ui/EmptyState.tsx` | Ícone + título + descrição + ação |

### Ficheiros afetados
- Nenhum ecrã foi alterado ainda — os componentes estão prontos a ser integrados nas fases seguintes.

### Testes
- ✅ TypeScript compilation: zero erros novos
- ✅ Erros pré-existentes mantidos (PressableOpacity `Style` type, TabBar `BottomTabBarProps`)

---

## Fase 2 — Consolidar Mock Data ✅

**Objetivo:** Ficheiro único para cada tipo de dado, eliminar duplicação.

### Ficheiros criados

| Ficheiro | Conteúdo |
|----------|----------|
| `src/mocks/projects.ts` | PROJECTS, MOCK_PROJECTS, MOCK_PROJECT_DETAIL, MOCK_PROJECT_INFO, MOCK_PROJECT_EDIT, MOCK_PROJECT_CREATED, MOCK_CONFIGURE_RDO, PROVINCES |
| `src/mocks/rdo-context.ts` | MOCK_RDO_CONTEXT, MOCK_RDO, MOCK_RDO_REVIEW, MOCK_PREVIOUS_RDO, MOCK_SOURCE_RDO, MOCK_RDO_ACTIVE |
| `src/mocks/rdo-sections.ts` | RDO_SECTIONS, RDO_SECTIONS_WITH_ROUTES, SECTION_ROUTES |
| `src/mocks/workforce.ts` | MOCK_WORKFORCE, MOCK_WORKFORCE_SUMMARY, MOCK_ROLES, MOCK_WORKFORCE_DATA |
| `src/mocks/materials.ts` | MOCK_MATERIALS_LIST, MOCK_MATERIALS_SUMMARY, MOCK_MATERIALS_OPTIONS, MOCK_UNITS, MATERIAL_STATUS_OPTIONS, MATERIAL_STATUS_LABELS, MOCK_MATERIALS_DATA |
| `src/mocks/equipment.ts` | MOCK_EQUIPMENT, MOCK_EQUIPMENT_SUMMARY, MOCK_EQUIPMENT_OPTIONS, EQUIPMENT_STATUS_OPTIONS, EQUIPMENT_STATUS_LABELS, MOCK_EQUIPMENT_DATA |
| `src/mocks/tasks.ts` | MOCK_ACTIVITIES, MOCK_TASKS_SUMMARY, MOCK_TASK_UNITS, TASK_STATUS_OPTIONS, TASK_STATUS_LABELS, TASK_SCREEN_STATUS_LABELS, MOCK_TASKS_DATA |
| `src/mocks/occurrences.ts` | MOCK_OCCURRENCES, IMPACT_OPTIONS, MOCK_OCCURRENCES_DATA |
| `src/mocks/observations.ts` | QUICK_SUGGESTIONS |
| `src/mocks/photos.ts` | MOCK_PHOTOS, PHOTO_TYPES, MOCK_PHOTOS_DATA |
| `src/mocks/reports.ts` | MOCK_REPORTS, MOCK_DASHBOARD_REPORTS, MOCK_RECENT_RDOS |
| `src/mocks/reuse.tsx` | INITIAL_REUSABLE_ITEMS |
| `src/mocks/index.ts` | Barrel export com todos os tipos |

### Testes
- ✅ TypeScript compilation: zero erros novos

---

## Fase 3 — Corrigir Tipos ✅

**Objetivo:** Type safety consistente.

### Alterações

1. Criado `src/constants/statuses.ts` com:
   - `PROJECT_STATUS_CONFIG` (active/completed/archived)
   - `PROJECT_STATUS_CONFIG_UPPERCASE` (ATIVA/CONCLUÍDA/ARQUIVADA)
   - `RDO_STATUS_CONFIG` (draft/generated)
   - Tipos `StatusConfig`, `RdoStatus`, `RdoStatusConfig`

2. `ProjectCard.tsx`:
   - Removido `ProjectStatus` local ("paused" → "archived")
   - Importa de `@/types` (database type)
   - Usa `PROJECT_STATUS_CONFIG` de `@/constants/statuses`

3. `ProjectHeader.tsx`:
   - Importa `ProjectStatus` de `@/types` (não de ProjectCard)
   - Usa `PROJECT_STATUS_CONFIG_UPPERCASE`

4. `src/constants/index.ts`:
   - Adicionados exports de `statuses.ts`

### Testes
- ✅ TypeScript compilation: zero erros novos

---

## Fase 4 — Unificar Add/Edit Screens ✅

**Objetivo:** 12 ecrãs → 6 form componentes parametrizados.

| Par | Resultado | Linhas eliminadas |
|-----|-----------|-------------------|
| AddWorkforce + EditWorkforce | `WorkforceFormScreen.tsx` | ~887 → ~130 |
| AddMaterial + EditMaterial | `MaterialFormScreen.tsx` | ~1004 → ~190 |
| AddEquipment + EditEquipment | `EquipmentFormScreen.tsx` | ~1010 → ~195 |
| AddTask + EditTask | `TaskFormScreen.tsx` | ~1121 → ~215 |
| AddOccurrence + EditOccurrence | `OccurrenceFormScreen.tsx` | ~793 → ~175 |
| AddPhoto + EditPhoto | `PhotoFormScreen.tsx` | ~802 → ~175 |

- Route files: 12 ficheiros → 3 linhas cada
- Todos usam `ScreenHeader`, `ContextBar`, `PrimaryButton`, `SecondaryButton`, `AutosaveStatus`
- Mock data consolidada de `@/mocks` (Fase 2)
- Economia total: ~5600 linhas eliminadas

---

## Fase 5 — Extrair Form Fields ✅

**Objetivo:** Reutilizar campos de formulário.

### Componentes criados

| Componente | Ficheiro | Descrição |
|------------|----------|-----------|
| `Field` | `src/components/ui/Form/Field.tsx` | Label + TextInput (height 48) |
| `TextArea` | `src/components/ui/Form/TextArea.tsx` | Label + TextInput multiline |
| `StepperField` | `src/components/ui/Form/StepperField.tsx` | Label + [-] [valor] [+] |
| `SelectField` | `src/components/ui/Form/SelectField.tsx` | Label + dropdown com opções |
| `SegmentedField` | `src/components/ui/Form/SegmentedField.tsx` | Label + opções horizontais |
| `index.ts` | `src/components/ui/Form/index.ts` | Barrel export |

### Testes
- ✅ TypeScript compilation: zero erros novos

---

## Fase 6 — RdoContext + Rotas ✅

**Objetivo:** Estado partilhado, IDs dinâmicos.

### Alterações

1. Criado `src/contexts/RdoContext.tsx`:
   - `RdoProvider` com estado partilhado (rdoId, projectId, projectName, date)
   - `useRdo()` hook para aceder ao contexto

2. Rotas corrigidas (hardcoded → dinâmicas):
   - `src/app/(tabs)/index.tsx`: Dashboard usa `rdoId` do contexto
   - `src/features/rdo/ReportsScreen.tsx`: Navegação usa `rdoId`
   - `src/features/projects/ProjectDetailScreen.tsx`: "Continuar RDO" usa `rdoId`
   - `src/features/rdo/ReuseRdoScreen.tsx`: "Continuar" usa `rdoId`
   - `src/features/rdo/NewRdoScreen.tsx`: "Começar do zero" usa `rdoId`

### Testes
- ✅ TypeScript compilation: zero erros novos

---

## Fase 7 — Bugs e Estilo ✅

**Objetivo:** Corrigir erros existentes.

### Alterações

1. `src/constants/colors.ts`:
   - Adicionado `overlay: "rgba(0, 0, 0, 0.5)"` — resolve erros `Property 'overlay' does not exist`

2. `src/features/rdo/OccurrencesScreen.tsx`:
   - Removido `textGrowth: "fixed-width"` e `width: "fill_container"` (propriedades inválidas)
   - Substituído por `flex: 1`

3. `src/services/pdf-generator.ts`:
   - Removidos 3 `console.log` em `generateRdoPdf`

4. `src/features/rdo/RdoDetailScreen.tsx`:
   - Substituídos 3 `error: any` por `error: unknown` com type guard

5. `src/features/rdo/RdoGeneratedScreen.tsx`:
   - Substituídos 3 `error: any` por `error: unknown` com type guard
   - Removidos 3 `console.error`

### Erros restantes (pré-existentes, fora do escopo)
- CreateProjectScreen/EditProjectScreen: DateTimePicker type mismatch
- Criar projeto: estilo TextInput com `0` no array

### Testes
- ✅ TypeScript compilation: erros `overlay` resolvidos
- Corrigir PanResponder stale closure
- Adicionar `useMemo` / `useCallback`

---

## Fase 8 — Código Morto ⏳

**Objetivo:** Remover o que não existe.

- Apagar `src/features/dashboard/DashboardScreen.tsx`
- Remover `getMockRdoData` de `pdf-generator.ts`
- Limpar storage functions não usadas
- Standardizar import patterns

---

## Fase 9 — Acessibilidade ⏳

**Objetivo:** Nível mínimo para App Store.

- `accessibilityLabel` em todos os elementos interativos
- `accessibilityRole` (button, link, search)
- `accessibilityState` (selected, disabled)
- `testID` para testes

---

## Fase 10 — Atualizar AGENTS.md ⏳

**Objetivo:** Documentação consistente.

- Atualizar estrutura de ficheiros
- Atualizar lista de componentes
- Atualizar convenções
- Atualizar estado atual
