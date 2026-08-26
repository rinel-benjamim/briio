# Plano de Refatoração — Briio

> Ficheiro de acompanhamento. Atualizar sempre que uma fase for concluída.

## Estado Atual

| Fase | Descrição | Estado |
|------|-----------|--------|
| 1 | Extrair componentes UI partilhados | ✅ Concluída |
| 2 | Consolidar mock data em `src/mocks/` | ⏳ Pendente |
| 3 | Corrigir tipos (`ProjectStatus`, `statusConfig`) | ⏳ Pendente |
| 4 | Unificar Add/Edit screens (12 → 6) | ⏳ Pendente |
| 5 | Extrair Form Fields (Field, DateField, SelectField) | ⏳ Pendente |
| 6 | Criar RdoContext + corrigir rotas hardcoded | ⏳ Pendente |
| 7 | Corrigir bugs e erros de estilo | ⏳ Pendente |
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

## Fase 2 — Consolidar Mock Data ⏳

**Objetivo:** Ficheiro único para cada tipo de dado, eliminar duplicação.

### Estrutura pretendida

```
src/mocks/
├── index.ts
├── projects.ts        ← MOCK_PROJECTS, PROJECTS
├── rdo-context.ts     ← MOCK_CONTEXT
├── rdo-sections.ts    ← RDO_SECTIONS, SECTION_ROUTES
├── workforce.ts       ← MOCK_WORKFORCE, MOCK_ROLES, MOCK_SUMMARY
├── materials.ts       ← MOCK_MATERIALS, MOCK_UNITS, MOCK_SUMMARY
├── equipment.ts       ← MOCK_EQUIPMENT, MOCK_SUMMARY
├── tasks.ts           ← MOCK_ACTIVITIES, STATUS_LABELS
├── occurrences.ts     ← MOCK_OCCURRENCES, IMPACT_OPTIONS
├── observations.ts    ← QUICK_SUGGESTIONS
├── photos.ts          ← MOCK_PHOTOS, PHOTO_TYPES
├── reports.ts         ← MOCK_REPORTS
└── pdf-data.ts        ← getMockRdoData (movido de pdf-generator)
```

---

## Fase 3 — Corrigir Tipos ⏳

**Objetivo:** Type safety consistente.

1. Remover `ProjectStatus` de `ProjectCard.tsx` — usar `types/database.ts`
2. Criar `src/constants/statuses.ts` com configs partilhados
3. Criar `StatusBadge` atualizado para usar status configs

---

## Fase 4 — Unificar Add/Edit Screens ⏳

**Objetivo:** 12 ecrãs → 6 ecrãs parametrizados.

| Par | Resultado |
|-----|-----------|
| AddWorkforce + EditWorkforce | `WorkforceFormScreen.tsx` |
| AddMaterial + EditMaterial | `MaterialFormScreen.tsx` |
| AddEquipment + EditEquipment | `EquipmentFormScreen.tsx` |
| AddTask + EditTask | `TaskFormScreen.tsx` |
| AddOccurrence + EditOccurrence | `OccurrenceFormScreen.tsx` |
| AddPhoto + EditPhoto | `PhotoFormScreen.tsx` |

---

## Fase 5 — Extrair Form Fields ⏳

**Objetivo:** Reutilizar campos de formulário.

- `Field` → `src/components/ui/Form/Field.tsx`
- `DateField` → `src/components/ui/Form/DateField.tsx`
- `SelectField` → `src/components/ui/Form/SelectField.tsx`

---

## Fase 6 — RdoContext + Rotas ⏳

**Objetivo:** Estado partilhado, IDs dinâmicos.

1. Criar `src/contexts/RdoContext.tsx`
2. Substituir hardcoded IDs por dinâmicos
3. Todos os sub-ecrãs RDO usam o contexto

---

## Fase 7 — Bugs e Estilo ⏳

**Objetivo:** Corrigir erros existentes.

- Adicionar `colors.overlay` ao `colors.ts`
- Corrigir `textGrowth` / `width: "fill_container"` em OccurrencesScreen
- Remover `console.log` de pdf-generator.ts
- Remover imports não usados
- Substituir `error: any` por `error: unknown`
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
