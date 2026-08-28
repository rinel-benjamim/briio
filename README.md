<div align="center">

# Briio

### Relatórios de obra simplificados

![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-000000?style=for-the-badge&logo=sqlite&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-000000?style=for-the-badge)

</div>

---

<br>

<div align="center">
  <img src="assets/images/splash-logo.png" width="120" alt="Briio Logo" />
  <br><br>
  <p><strong>Briio</strong> é uma aplicação mobile offline-first para engenheiros civis produzirem Relatórios Diários de Obras (RDO). Sem backend, sem complicação — tudo fica guardado no seu dispositivo.</p>
</div>

---

<br>

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Gestão de Obras | Criar, editar, arquivar e eliminar obras |
| Relatórios Diários (RDO) | 9 secções: Condições, Mão de obra, Materiais, Equipamentos, Tarefas, Ocorrências, Observações, Fotografias, Review |
| Reutilização de RDO | Copiar dados de um relatório anterior para novo RDO |
| Geração de PDF | Exportar relatórios profissionais em PDF com fotos embutidas |
| Onboarding | Fluxo guiado para novos utilizadores |
| Temas | Modo claro, escuro e automático |
| Backup | Exportar/importar dados em JSON |
| Offline | 100% funcional sem ligação à internet |

---

<br>

## Screenshots

### Onboarding

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Splash</strong></td>
      <td align="center"><strong>Bem-vindo</strong></td>
      <td align="center"><strong>Passo 1</strong></td>
    </tr>
    <tr>
      <td><img src="assets/images/splash-logo.png" width="150" alt="Splash" /></td>
      <td><img src="assets/images/splash-logo.png" width="150" alt="Welcome" /></td>
      <td><img src="assets/images/onboarding-img1.png" width="150" alt="Step 1" /></td>
    </tr>
    <tr>
      <td align="center">Logo animado + barra de loading</td>
      <td align="center">Briio + botão Começar</td>
      <td align="center">Registe o progresso da obra</td>
    </tr>
  </table>
</div>

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Passo 2</strong></td>
      <td align="center"><strong>Passo 3</strong></td>
      <td align="center"><strong>Registar Perfil</strong></td>
    </tr>
    <tr>
      <td><img src="assets/images/onboarding-img2.png" width="150" alt="Step 2" /></td>
      <td><img src="assets/images/onboarding-img3.png" width="150" alt="Step 3" /></td>
      <td><img src="assets/images/splash-logo.png" width="150" alt="Register" /></td>
    </tr>
    <tr>
      <td align="center">Gerencie a sua equipa</td>
      <td align="center">Gere PDF em segundos</td>
      <td align="center">Nome, Cargo, Empresa, Telefone</td>
    </tr>
  </table>
</div>

---

<br>

### Dashboard

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Com RDO</strong></td>
      <td align="center"><strong>Sem RDO</strong></td>
    </tr>
    <tr>
      <td><img src="assets/images/onboarding-img3.png" width="200" alt="Dashboard with RDO" /></td>
      <td><img src="assets/images/onboarding-img3.png" width="200" alt="Dashboard empty" /></td>
    </tr>
    <tr>
      <td align="center">Card RDO com progresso + ações rápidas</td>
      <td align="center">Imagem + botão Criar novo relatório</td>
    </tr>
  </table>
</div>

---

<br>

### Obras

- **Lista de Obras**: busca, filtros, cards com status
- **Detalhe da Obra**: informações, entidades, RDOs recentes
- **Criar/Editar Obra**: formulário multi-secção

---

<br>

### Relatórios (RDO)

- **9 secções** organizadas em cards
- **Autosave** com debounce em Condições e Observações
- **Toggle de secções vazias** — marque secções sem dados
- **Review** antes de gerar PDF
- **Reutilização** — copie dados de RDOs anteriores

---

<br>

## Arquitetura

```
Screens (app/)
  → Components (components/)
  → Features (features/)
  → Hooks (hooks/)
  → Services (services/)
  → Repositories (repositories/)
  → Database (database/)
  → Storage (storage/)
```

### Camadas

| Camada | Responsabilidade |
|---|---|
| `app/` | Rotas e layouts (Expo Router) |
| `features/` | Lógica de ecrãs |
| `components/` | UI reutilizável |
| `hooks/` | Lógica customizada |
| `services/` | Business logic, validações, PDF |
| `repositories/` | CRUD SQLite |
| `database/` | migrations, DatabaseProvider |
| `contexts/` | Theme, RDO, Profile |
| `types/` | Interfaces TypeScript |

---

<br>

## Stack

| Tecnologia | Uso |
|---|---|
| Expo SDK 57 | Framework React Native |
| Expo Router | File-based routing |
| SQLite (expo-sqlite) | Base de dados local |
| Lucide React Native | Ícones |
| React Native Reanimated | Animações |
| expo-print | Geração de PDF |
| expo-file-system | Leitura/escrita de ficheiros |
| expo-image-picker | Seleção/câmara de fotos |
| expo-system-ui | Status bar background |

---

<br>

## Design System

### Cores (Dark Mode)

| Token | Cor |
|---|---|
| `bgMain` | `#0B0E0C` |
| `bgSurface` | `#141A17` |
| `primary` | `#1EA87D` |
| `textMain` | `#F0F5F2` |
| `textMuted` | `#A3B4AF` |

### Cores (Light Mode)

| Token | Cor |
|---|---|
| `bgMain` | `#F5F7F6` |
| `bgSurface` | `#FFFFFF` |
| `primary` | `#176B50` |
| `textMain` | `#13201C` |
| `textMuted` | `#687770` |

### Tipografia

- **Inter**: Regular (400), SemiBold (600), Bold (700), ExtraBold (800)
- **Sora**: Regular (400), SemiBold (600), ExtraBold (800)

---

<br>

## Estrutura de Ficheiros

```
src/
├── app/
│   ├── _layout.tsx                    ← Root Stack
│   ├── onboarding/                    ← 6 ecrãs de onboarding
│   └── (tabs)/
│       ├── index.tsx                  ← Dashboard
│       ├── more.tsx                   ← Mais
│       ├── reports/                   ← RDO (12 rotas)
│       └── projects/                  ← Obras (5 rotas)
├── components/
│   ├── ui/                            ← Componentes partilhados
│   ├── rdo/                           ← Componentes RDO
│   └── onboarding/                    ← SplashScreen, Guard, Illustration
├── contexts/
│   ├── ThemeContext.tsx                ← Toggle light/dark/system
│   └── RdoContext.tsx                 ← Estado partilhado do RDO
├── features/
│   ├── rdo/                           ← 15 ecrãs RDO
│   └── projects/                      ← 6 ecrãs de obras
├── hooks/                             ← Custom hooks
├── services/                          ← Business logic + PDF
├── repositories/                      ← CRUD SQLite (10 repos)
├── database/                          ← Migrations + Provider
├── types/                             ← Interfaces TypeScript
└── constants/                         ← Tokens de design
```

---

<br>

## Começar

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Android Studio ou Xcode

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/briio.git
cd briio

# Instalar dependências
npm install

# Iniciar o desenvolvimento
npx expo start
```

### Build de Produção

```bash
# Android
npx expo prebuild --clean
npx expo run:android

# iOS
npx expo prebuild --clean
npx expo run:ios
```

---

<br>

## Testes

```bash
# Executar todos os testes
npx jest

# Executar testes específicos
npx jest --testPathPattern="validation"
npx jest --testPathPattern="repositories"
npx jest --testPathPattern="services"
```

**59 testes** unitários a passar:
- 24 testes de validação
- 4 testes de UUID
- 14 testes de repositórios
- 17 testes de serviços

---

<br>

## Roadmap

### Concluído

- [x] Fase 0: Fundação (Expo, TypeScript, SQLite, migrations)
- [x] Fase 1: Dashboard + Lista de Obras
- [x] Fase 2: RDO completa (9 secções, review, PDF)
- [x] Fase 3: Reutilização de RDO anterior
- [x] Fase 4: PDF com dados reais
- [x] Fase 5: Testes unitários (59 tests)
- [x] Onboarding (splash, welcome, 3 passos, registo)
- [x] Temas (light, dark, system)
- [x] Gestão de dados (export, import, reset)
- [x] Delete em todas as secções RDO
- [x] Secções vazias (skip sections)
- [x] Fotos 1:1 + display
- [x] PDF com fotos embutidas

### Pendente

- [ ] Fase 6: Beta (validação em obra real)
- [ ] Testes de integração
- [ ] Histórico de RDOs

---

<br>

## Licença

MIT © 2024 Briio

---

<br>

<div align="center">
  <img src="assets/images/splash-logo.png" width="60" alt="Briio" />
  <br>
  <p><strong>Briio</strong> — Relatórios de obra simplificados</p>
  <p>Angola & Portugal</p>
</div>
