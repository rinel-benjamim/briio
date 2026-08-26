# RDO App — Master Design System & UI/UX Engineering Specification (v2.0 Elite)

> **Documento de Referência Absoluta:** Este Design System define o padrão visual, funcional e de experiência de utilizador (UX) de nível de elite para toda a aplicação RDO. Qualquer IA, engenheiro ou designer encarregado de refatorar ou criar telas deve seguir estritamente estas especificações para garantir uniformidade absoluta, sofisticação visual e usabilidade impecável em todas as vistas e componentes.

---

## 1. Filosofia de Design & Diretrizes de Experiência (UX)

O ecossistema visual da aplicação transita para um **Light Theme de Alta Performance e Luxo Industrial**, combinando a robustez exigida na engenharia civil/construção com a leveza, clareza e elegância dos melhores aplicativos móveis do mercado global.

### 1.1. Os 5 Pilares de UX de Elite
1. **Zero Fricção de Entrada (*Thumb-First Ergonomics*):** Todas as ações críticas (continuar relatórios, gravar dados, avançar etapas) situam-se na zona primária de alcance do polegar (parte inferior do ecrã).
2. **Hierarquia de Informação Radical:** O utilizador nunca deve adivinhar onde focar a atenção. O elemento mais importante tem contraste máximo (Verde Floresta Sólido); informações secundárias utilizam cinzas estruturados de alta legibilidade.
3. **Feedback Micro-Interativo Imediato:** Cada clique, seleção ou salvamento gera feedback visual instantâneo (ex: transições suaves de estado, indicadores de `✓ Salvo automaticamente`, estados ativos preenchidos).
4. **Respiro e Controlo Cognitivo (*Whitespace*):** Abandono total de interfaces densas e sobrecarregadas. Uso consistente de cartões com bordas suaves e espaçamento generoso para reduzir o cansaço visual sob luz solar direta em canteiro de obras.
5. **Previsibilidade e Contexto:** O cabeçalho de cada ecrã contextualiza claramente o utilizador sobre qual obra, data e estado de progresso em que se encontra.

---

## 2. Tokens de Design (Foundations)

### 2.1. Paleta de Cores Oficial (Semantic Color Palette)

| Categoria | Nome do Token | Valor Hex | Descrição de Uso |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | `--bg-main` | `#F4F6F4` | Fundo geral da aplicação (off-white limpo e antireflexo) |
| **Surface / Card** | `--bg-surface` | `#FFFFFF` | Cartões, contentores flutuantes, inputs e blocos de conteúdo |
| **Surface Elevated** | `--bg-elevated` | `#FAFAFA` | Modais, menus flutuantes ou estados de hover subtis |
| **Text Primary** | `--text-main` | `#1A2E22` | Títulos principais, labels ativas, texto de forte destaque |
| **Text Secondary** | `--text-muted` | `#5B6E63` | Subtítulos, descrições, metadados e texto inativo |
| **Primary / Brand** | `--primary` | `#134E32` | Verde Floresta Escuro: Botões principais, ícones ativos, barras de progresso |
| **Primary Hover** | `--primary-hover`| `#0D3823` | Estado de pressão/active do botão principal |
| **Primary Light** | `--primary-light`| `#E6F4EA` | Fundo para badges de sucesso, pílulas ativas e ícones destacados |
| **Success State** | `--success` | `#137333` | Texto e bordas de itens concluídos com sucesso |
| **Warning State** | `--warning` | `#B96A00` | Avisos, rascunhos, assinaturas pendentes |
| **Warning BG** | `--warning-bg` | `#FFF8F0` | Fundo de alertas e avisos subtis |
| **Border / Divider** | `--border-color`| `#E0E6E1` | Linhas delimitadoras de cartões, divisores e bordas de inputs |

### 2.2. Tipografia e Escala Modular

* **Família de Fontes:** `Inter`, `SF Pro Display`, `-apple-system`, `Roboto`, sans-serif.
* **Escala Tipográfica:**
  * **H1 (Screen Title):** `24px` / Line-height: `28px` — Weight: `700` (Bold) — Color: `var(--text-main)`
  * **H2 (Section Header):** `18px` / Line-height: `22px` — Weight: `600` (Semi-bold) — Color: `var(--text-main)`
  * **H3 (Card Title / Item):** `15px` / Line-height: `18px` — Weight: `600` (Semi-bold) — Color: `var(--text-main)`
  * **Body (Regular):** `14px` / Line-height: `20px` — Weight: `400` (Regular) — Color: `var(--text-main)`
  * **Body Medium:** `14px` / Line-height: `20px` — Weight: `500` (Medium) — Color: `var(--text-main)`
  * **Caption / Meta:** `12px` / Line-height: `16px` — Weight: `400` / `500` — Color: `var(--text-muted)`

### 2.3. Elevação, Bordas e Sombras (Elevation & Geometry)
* **Border-Radius:**
  * Contentores Principais / Cards: `16px` (`border-radius: 16px;`)
  * Botões de Ação, Inputs e Se_letores: `12px` (`border-radius: 12px;`)
  * Badges, Chips e Tags: `8px` ou Fully Rounded (`9999px`)
* **Box-Shadows:**
  * Cartões Standard: `0px 2px 8px rgba(0, 0, 0, 0.04)`
  * Cartões em Destaque / Hero: `0px 6px 20px rgba(19, 78, 50, 0.08)`
  * Modais / Bottom Sheets: `0px -4px 24px rgba(0, 0, 0, 0.08)`

---

## 3. Especificações Detalhadas por Componente de UI

### 3.1. Barra de Navegação Inferior (Bottom Navigation Bar)
* **Estrutura:** Fixa no fundo do ecrã (`position: fixed; bottom: 0;`), altura de `64px`, fundo totalmente branco (`#FFFFFF`) com borda superior subtil (`1px solid var(--border-color)`).
* **Itens (4 abas):** `Início`, `Obras`, `Relatórios`, `Mais`.
* **Estado Ativo:** Ícone e label preenchidos com `var(--primary)` (`#134E32`), encapsulados por um fundo em pílula subtil (`#E6F4EA`).
* **Estado Inativo:** Ícone e label em tom cinza neutro (`#7F8C83`).

### 3.2. Cartão de Obra Atual / Progresso (Hero Card)
* **Utilizado em:** Ecrã Inicial (`Início`) e Vistas de Gestão de Obra.
* **Estética:** Fundo preenchido inteiramente com Verde Floresta Escuro (`var(--primary)`), garantindo alto impacto visual imediato.
* **Elementos Internos:**
  * Nome da Obra e Localização em Branco (`#FFFFFF`) e verde translúcido.
  * **Barra de Progresso:** Fundo da barra em branco translúcido (`rgba(255,255,255,0.2)`), indicador de progresso preenchido a branco sólido (`#FFFFFF`), com percentagem legível em destaque.
  * **Botão de Ação Interno ("Continuar relatório"):** Fundo branco sólido (`#FFFFFF`), texto e seta em Verde Escuro (`#134E32`), altura `44px`, raio `12px`, posicionado no rodapé do cartão.

### 3.3. Secção de Ações Rápidas (Quick Actions)
* **Layout:** Grelha horizontal de cartões compactos (ícone superior centralizado + label descritiva em baixo).
* **Dimensões e Estilo:** Fundo branco (`#FFFFFF`), borda `1px solid var(--border-color)`, padding interno de `12px`.
* **Ícones de Ação:** Envoltos em círculos de fundo verde claro (`var(--primary-light)`) com o respetivo ícone em `var(--primary)`.

### 3.4. Grelhas de Seleção de Opções (Option Grid / Chips Interativos)
* **Utilizado em:** Formulários de clima, seleção de estados, categorias de materiais/equipamentos (ex: ecrã de Condições do dia com Sol, Nublado, Chuva).
* **Estados:**
  * **Não Selecionado:** Fundo branco (`#FFFFFF`), borda fina cinza (`var(--border-color)`), ícone e texto em `var(--text-muted)`.
  * **Selecionado:** Fundo totalmente preenchido com Verde Floresta (`var(--primary)`), texto, ícones e bordas em branco puro (`#FFFFFF`), aplicando uma sombra suave de profundidade (`0px 4px 12px rgba(19,78,50,0.15)`).

### 3.5. Campos de Formulário, Inputs & Dropdowns
* **Label Superior:** 13px, Semi-bold (`weight: 600`), cor `var(--text-main)`.
* **Input Box:** Altura mínima de `50px`, padding interno de `14px`, fundo branco (`#FFFFFF`), borda `1px solid var(--border-color)`, raio de curvatura `12px`.
* **Estados do Input:**
  * *Focus:* Borda muda para `var(--primary)` com um glow subtil (`0px 0px 0px 3px rgba(19,78,50,0.1)`).
  * *Preenchido:* Texto em `var(--text-main)` com alto contraste.
* **Indicador de Auto-Save:** Alinhado no rodapé de formulários ativos com o texto *"✓ Salvo automaticamente"* em tom neutro-verde.

### 3.6. Botões de Ação Principal (Primary CTA Buttons)
* **Estética:** Largura total (`width: 100%`), altura fixa de `52px`, fundo Verde Floresta (`var(--primary)`), texto em branco Bold (`15px`), raio de curvatura `12px`.
* **Feedback Tátil/Hover:** Transição suave para `var(--primary-hover)` ao tocar.
* **Ícones Associados:** Opcionalmente acompanhados por ícones à direita (ex: seta para frente `→` ou ícones de documento).

---

## 4. Guia Definitivo de Refatoração para IA (Instruções de Execução)

Qualquer agente de IA que receba este ficheiro para refatorar telas legadas ou aplicações com design inferior deve aplicar as seguintes transformações sistemáticas:

1. **Eliminação Total de Dark Mode Antigo:** Remover todos os fundos pretos, azul-escuros ou cinzas escuros (`#0F172A`, `#1E293B`). Substituir por fundos limpos (`#F4F6F4`) e superfícies em branco puro (`#FFFFFF`).
2. **Substituição de Cores de Acento:** Substituir qualquer tom anterior de roxo, azul elétrico ou amarelo genérico (`#6366F1`, `#7C3AED`) pelo **Verde Floresta Oficial (`#134E32`)** em todos os elementos de destaque, botões primários e estados ativos.
3. **Reestruturação de Cartões (Cards):** Agrupar informações dispersas em cartões brancos com cantos arredondados de `16px`, bordas subtis (`#E0E6E1`) e margens consistentes (*padding interno de 16px a 20px*).
4. **Padronização de Inputs e Formulários:** Substituir campos de texto planos ou mal delimitados por inputs de altura generosa (`50px+`), bordas limpas e labels claras acima do campo.
5. **Elevação da Experiência Mobile:** Garantir que botões de submissão estejam sempre ancorados ou de fácil acesso na parte inferior do ecrã, eliminando a necessidade de rolagens excessivas para encontrar ações principais.

---
*Este documento é o contrato universal de design para o ecossistema RDO. Nenhuma tela deve divergir destas diretrizes visuais e comportamentais.*
