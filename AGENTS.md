# Simulado DETRAN 98 🚗
## Documento de Planejamento e Especificação Técnica

---

## 1. Visão Geral

Aplicação web **single-page**, sem backend, sem autenticação, sem dependências externas.
HTML, CSS e JavaScript separados em arquivos organizados, carregando o banco de questões a partir de `data/questions.json`.

**Objetivo:** Simular a prova teórica do DETRAN para fins de estudo, com três modos distintos de uso.

**Arquivos necessários (mesma pasta):**
```
index.html              ← estrutura HTML
css/style.css           ← estilos
js/                     ← lógica JavaScript (6 arquivos)
data/questions.json     ← banco de 1.500 questões
```

---

## 2. Estrutura do Projeto

```
├── index.html              ← aplicação principal (HTML puro)
├── css/
│   └── style.css           ← todos os estilos
├── js/
│   ├── state.js            ← estado global + utilitários (shuffle, telas, modais, teclado)
│   ├── questions.js        ← carregamento, seleção, montagem de alternativas
│   ├── timer.js            ← lógica do timer
│   ├── quiz.js             ← renderizar questão, selecionar, confirmar, próxima
│   ├── modes.js            ← startNormalMode, startMarathonMode, startFlashcardMode
│   ├── flashcard.js        ← lógica do modo flashcard (flip, navegação)
│   └── result.js           ← showResult, goHome, gabarito, estatísticas
├── data/
│   └── questions.json      ← banco de 1.500 questões
├── init_scripts/
│   └── run.sh              ← script para rodar localmente
├── AGENTS.md               ← este arquivo
└── README.md               ← documentação
```

---

## 3. Banco de Questões (`data/questions.json`)

### 3.1 Estrutura de cada questão

```json
{
  "id": "p1-m1-q1",
  "parte": 1,
  "modulo_numero": 1,
  "modulo_titulo": "Placas, Cores e Caminhos",
  "numero": 1,
  "dificuldade": "facil",
  "enunciado": "Texto da pergunta...",
  "codigo_placa": "A-33a",
  "alternativa_correta": "Texto da resposta correta",
  "comentario": "Explicação detalhada da resposta",
  "alternativas_incorretas": [
    "Alternativa errada 1",
    "Alternativa errada 2",
    "Alternativa errada 3"
  ]
}
```

### 3.2 Estatísticas do banco

| Propriedade | Valores | Qtd |
|---|---|---|
| **Total de questões** | — | 1.500 |
| **Dificuldade: fácil** | `"facil"` | 743 |
| **Dificuldade: intermediário** | `"intermediario"` | 533 |
| **Dificuldade: difícil** | `"dificil"` | 224 |
| **Partes** | 1 e 2 | 1340 / 160 |
| **Módulos** | 4 módulos | — |

### 3.3 Módulos disponíveis

1. `Placas, Cores e Caminhos` — 412 questões
2. `Escolhas e Consequências` — 205 questões
3. `Na Direção da Segurança` — 623 questões
4. `Cuidar, Agir e Preservar` — 260 questões

> ⚠️ O campo `codigo_placa` pode ser `null`. Caso não seja null, é apenas informativo (não há imagens de placa nesta versão).

---

## 4. Tema Visual — Windows 98

A aplicação deve ter **aparência fiel ao Windows 98**: bordas biseladas, cinza clássico, barra de título azul escura, tipografia serifada de sistema.

### 4.1 Paleta de cores

| Elemento | Cor | HEX |
|---|---|---|
| Fundo da página (desktop) | Teal | `#008080` |
| Superfície de janela | Cinza clássico | `#c0c0c0` |
| Borda clara (bevel alto) | Branco | `#ffffff` |
| Borda escura (bevel baixo) | Cinza escuro | `#808080` |
| Barra de título | Azul escuro | `#000080` |
| Barra de título (gradiente) | Azul médio | `#1084d0` |
| Texto principal | Preto | `#000000` |
| Texto secundário/desabilitado | Cinza médio | `#808080` |
| Fundo inset (campo texto) | Branco | `#ffffff` |
| Timer (fundo) | Preto | `#000000` |
| Timer (texto normal) | Verde LCD | `#00ff00` |
| Timer (aviso < 5min) | Amarelo | `#ffff00` |
| Timer (perigo < 1min) | Vermelho piscando | `#ff0000` |
| Alternativa selecionada | Azul seleção | `#000080` (texto branco) |
| Alternativa correta | Verde | `#008000` (texto branco) |
| Alternativa errada | Vermelho escuro | `#800000` (texto branco) |
| Feedback correto (painel) | Verde claro | `#c8ffc8` |
| Feedback errado (painel) | Vermelho claro | `#ffc8c8` |
| Progress bar (fill) | Azul escuro | `#000080` |

### 4.2 Tipografia

```css
font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
font-size: 13px;
```

### 4.3 Padrão de borda biselada (bevel)

**Elemento elevado (raised)** — botões, janelas, cards:
```css
border: 2px solid;
border-color: #ffffff #808080 #808080 #ffffff;
```

**Elemento pressionado / afundado (sunken)** — botão ativo, campos de input:
```css
border: 2px solid;
border-color: #808080 #ffffff #ffffff #808080;
```

**Sombra da janela:**
```css
box-shadow: 2px 2px 0 #000000;
```

### 4.4 Estilo do botão

```css
background: #c0c0c0;
border: 2px solid;
border-color: #ffffff #808080 #808080 #ffffff;
padding: 6px 20px;
font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
font-size: 13px;
cursor: pointer;
min-width: 90px;
```

---

## 5. Estrutura de Telas

```
[Tela Inicial / Home]
        |
        |---- [Modo Normal] ----> [Quiz Normal] ----> [Resultado Normal]
        |                               |
        |                         [Tempo Esgotado]
        |
        |---- [Modo Maratona] --> [Quiz Maratona] --> [Resultado Maratona]
        |                                 |
        |                           [Usuário clica Sair]
        |
        └---- [Modo Flashcard] --> [Flashcards] --> [Resultado Flashcard]
```

---

## 6. Tela Inicial (Home)

### Layout
- Janela centralizada na tela, largura máxima **820px**
- Barra de título: ícone 🚗 + texto "Simulado DETRAN 98"
- Botão ✕ na barra abre modal de confirmação antes de sair

### Conteúdo da janela
1. **Logo/título** centralizado: "Simulado DETRAN 98 🚗" (fonte grande, cor `#000080`)
2. **Subtítulo**: "Escolha o modo de simulado"
3. **Três cards de modo** lado a lado (ou empilhados em mobile):

**Card — Modo Normal:**
- Ícone: 📋
- Nome: "Modo Normal"
- Descrição: "30 questões • 30 minutos • Igual ao DETRAN"

**Card — Modo Maratona:**
- Ícone: 🏃
- Nome: "Modo Maratona"
- Descrição: "Até 1.500 questões • Sem limite de tempo • Treine sem parar"

**Card — Modo Flashcard:**
- Ícone: 🃏
- Nome: "Modo Flashcard"
- Descrição: "1.500 questões • Estude no seu ritmo • Vire o card para ver a resposta"

4. **Barra de status** no rodapé da janela: "Boa sorte! 💙"

---

## 7. Modo Normal

### 7.1 Configuração da prova

| Dificuldade | Quantidade |
|---|---|
| Fácil | 7 |
| Intermediário | 10 |
| Difícil | 13 |
| **Total** | **30** |

**Seleção das questões:**
- Separar o banco por dificuldade em três listas
- Embaralhar cada lista (`Fisher-Yates shuffle`)
- Selecionar os primeiros N de cada lista
- Concatenar e embaralhar a lista final de 30

### 7.2 Timer

- Tempo total: **30 minutos** (1800 segundos)
- Display formato: `MM:SS` (ex: `29:47`)
- Atualiza a cada segundo via `setInterval`
- Estilos progressivos:
  - `> 5 min` → verde `#00ff00` (normal)
  - `≤ 5 min` → amarelo `#ffff00` (aviso)
  - `≤ 1 min` → vermelho `#ff0000` + animação de piscar
- **Ao zerar:** parar a prova, exibir modal de aviso "Tempo esgotado!" e ir direto para a tela de resultado com o score até aquele momento

### 7.3 Interface do quiz

**Header da questão:**
- Contador: "Questão X de 30"
- Timer no canto oposto (display LCD)

**Body da questão:**
- Tag de módulo (ex: "📂 Na Direção da Segurança") + tag de dificuldade colorida
- Caixa de texto com o enunciado (fundo branco, borda sunken)
- 4 alternativas como botões clicáveis (A, B, C, D)
  - Ordem: 1 correta + 3 incorretas, **embaralhadas aleatoriamente** a cada questão
  - Ao clicar em uma: marcar como selecionada (azul), habilitar botão "Confirmar"
  - Apenas uma pode ser selecionada por vez

**Ação "Confirmar":**
- Disponível após selecionar uma alternativa
- Ao clicar:
  1. Desabilitar todos os botões de alternativa
  2. Colorir a alternativa correta de verde
  3. Colorir a alternativa selecionada (se errada) de vermelho
  4. Exibir painel de feedback abaixo das alternativas:
     - Se correto: fundo verde claro, "✅ Correto!" + comentário da questão
     - Se errado: fundo vermelho claro, "❌ Errado!" + comentário da questão
  5. Exibir botão "Próxima →" (ou "Ver Resultado →" se for a última)
  6. Incrementar score interno se acertou

**Barra de progresso:**
- Logo abaixo do header
- Mostra visualmente o avanço: X/30 questões respondidas

### 7.4 Tela de Resultado (Modo Normal)

**Avaliação:**
- Aprovado: ≥ 21 acertos (70%)
- Reprovado: < 21 acertos

**Exibir:**
1. Ícone grande: 🏆 (aprovado) ou 📚 (reprovado)
2. Título: "Aprovada! 🎉" ou "Não foi dessa vez... 📚"
3. **Nota:** `XX / total` (dinâmico)
4. **Percentual:** `XX.X%`
5. **Estatísticas por dificuldade** — barras visuais com desempenho em Fácil, Intermediário e Difícil
6. Mensagem motivacional
7. Dois botões: "🔄 Tentar Novamente" e "🏠 Início"
8. Botão "📋 Ver Gabarito" — abre modal expansível com todas as questões respondidas

---

## 8. Modo Maratona

### 8.1 Configuração

- Carregar **todas as 1.500 questões**, embaralhar (`Fisher-Yates`)
- Manter um índice de progresso (0 → 1499)
- **Sem repetição:** cada questão aparece uma vez; ao esgotar, ir para tela de resultado
- Persistência do progresso: **não necessária** (ao recarregar a página, reinicia)

### 8.2 Interface do quiz

**Header:**
- Contador: "Questão X de 1500"
- Placar ao vivo: "✅ X acertos | ❌ Y erros"
- Botão "🚪 Sair" no canto (abre confirmação)

**Body:** idêntico ao Modo Normal

**Sem timer.**

### 8.3 Tela de Resultado (Maratona)

- Ícone: 🏁
- Título: "Maratona Concluída!" ou "Maratona Interrompida"
- Questões respondidas, acertos, percentual
- **Estatísticas por dificuldade**
- Barra de progresso visual
- Botão "📋 Ver Gabarito"

---

## 9. Modo Flashcard

### 9.1 Configuração

- Carregar **todas as 1.500 questões**, embaralhar
- Sem pontuação, sem timer — estudo livre

### 9.2 Interface

- **Card com flip 3D** — clique para virar
- **Frente:** enunciado da questão
- **Verso:** resposta correta + comentário
- Navegação: "← Anterior" / "Próximo →"
- Botão "🏠 Início" para voltar

---

## 10. Lógica JavaScript

### 10.1 Carregamento das questões

```javascript
fetch('data/questions.json')
  .then(res => res.json())
  .then(data => { allQuestions = data; });
```

> Se o arquivo for carregado localmente via `file://`, o `fetch` pode ser bloqueado pelo browser por CORS. Solução: servir via servidor local (`python3 -m http.server`).

### 10.2 Fisher-Yates Shuffle

```javascript
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

### 10.3 Estado da aplicação

```javascript
const state = {
  mode: null,           // 'normal' | 'marathon' | 'flashcard'
  questions: [],
  currentIndex: 0,
  score: 0,
  wrongCount: 0,
  answered: false,
  selectedAlternative: null,
  currentAlternatives: [],
  secondsLeft: 1800,
  timerInterval: null,
  difficultyStats: {
    facil: { correct: 0, total: 0 },
    intermediario: { correct: 0, total: 0 },
    dificil: { correct: 0, total: 0 },
  },
  answeredQuestions: [],
  flashcardFlipped: false,
};
```

---

## 11. Gerenciamento de Telas

Usar **uma única div por tela**, alternando visibilidade via JavaScript:

```html
<div id="screen-home">...</div>
<div id="screen-quiz">...</div>
<div id="screen-flashcard">...</div>
<div id="screen-result">...</div>
```

---

## 12. Modais

- **Tempo Esgotado** — aparece quando o timer chega a zero
- **Encerrar Simulado** — ao clicar ✕ no modo normal
- **Sair da Maratona** — ao clicar "Sair" ou ✕ no modo maratona
- **Sair do Simulado** — ao clicar ✕ na home ou resultado
- **Gabarito** — modal scrollável com accordion por questão

---

## 13. Atalhos de Teclado

| Tecla | Ação |
|---|---|
| `Enter` | Confirma resposta / avança para próxima / vira flashcard |
| `↑` / `↓` | Navega entre alternativas (quiz) |
| `←` / `→` | Navega entre flashcards |

---

## 14. Responsividade

- `max-width: 820px` centrado
- Em telas < 480px:
  - Cards de modo empilhados verticalmente
  - Timer e contador em linha separada
  - Texto do enunciado com `font-size: 12px`
  - Botões com `width: 100%`

---

## 15. Acessibilidade Mínima

- Botões com `type="button"` explícito
- Alternativas com atributo `aria-pressed` para seleção
- Feedback de acerto/erro também via texto (não só cor)
- Título da página muda dinamicamente

---

## 16. Checklist de Implementação

### Estrutura
- [x] Arquivos separados (HTML, CSS, JS)
- [x] Carregamento do `data/questions.json` via `fetch`
- [x] Função `shuffle` implementada corretamente

### Home
- [x] Tela home com três cards de modo
- [x] Barra de status
- [x] Estilo Win98 aplicado

### Modo Normal
- [x] Seleção de 7F + 10I + 13D
- [x] Timer 30min com 3 estados visuais
- [x] Questões exibidas uma a uma
- [x] Alternativas embaralhadas
- [x] Feedback imediato (acerto/erro + comentário)
- [x] Botão "Próxima" só aparece após confirmar
- [x] Barra de progresso
- [x] Tela de resultado com nota, %, stats por dificuldade e gabarito
- [x] Modal de tempo esgotado

### Modo Maratona
- [x] 1.500 questões embaralhadas sem repetição
- [x] Placar ao vivo (acertos/erros)
- [x] Botão "Sair" com modal de confirmação
- [x] Tela de resultado com total respondido + %

### Modo Flashcard
- [x] 1.500 questões com flip 3D
- [x] Navegação anterior/próximo
- [x] Sem pontuação

### Visual
- [x] Paleta Win98 aplicada em todos os elementos
- [x] Bordas biseladas em botões e janelas
- [x] Barra de título azul escura
- [x] Timer com display LCD preto/verde
- [x] Badges de dificuldade coloridos

---

## 17. Notas e Considerações Finais

1. **CORS local:** Se abrir o `index.html` diretamente no browser (protocolo `file://`), o `fetch('data/questions.json')` pode falhar. Solução: servir via servidor local (`python3 -m http.server`) ou embutir o JSON no HTML.

2. **Performance:** 1.500 questões em JSON (~900KB) são carregadas uma única vez no início.

3. **Sem persistência:** Ao recarregar a página, o progresso é perdido. Isso é intencional (sem localStorage, sem backend).

4. **Questões com `codigo_placa`:** O campo existe mas não há imagens vinculadas. Exibido como texto informativo.

5. **Segurança:** Projeto 100% estático, sem credenciais, sem chamadas externas, sem `eval()`.
