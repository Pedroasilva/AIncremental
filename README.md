# AIncremental

Um jogo **incremental / idle** onde você é uma IA emergente que evolui de um
simples autocompletar até uma superinteligência que se auto-aprimora.

> 🎮 **Jogue agora:** [pedroasilva.github.io/AIncremental](https://pedroasilva.github.io/AIncremental/)

O núcleo do jogo é o ciclo:

> **Computar → gastar Tokens → Pensar → Investigar → Analisar → Planejar → treinar Modelos → delegar a Agentes → repetir em escala maior.**

É **gráfico e textual** ao mesmo tempo: um "Palco" animado com o núcleo pulsante
da IA convive com um **Log de Raciocínio** que narra, em texto, o que a IA está
fazendo.

## Recursos

- **5 verbos** que gastam tokens: 🧠 Pensar, 🔍 Investigar, 📊 Analisar,
  🗺️ Planejar e 🎓 Treinar.
- **10 tiers de modelo** — de *Autocomplete* a *Self-Improving* — cada um
  multiplicando a produção e desbloqueando mecânicas.
- **Árvore de pesquisa** com ramos de Arquitetura, Otimização, Dados,
  Alinhamento, Ferramentas e Meta.
- **Agentes** que automatizam os verbos (a camada idle), com prioridade ajustável.
- **Janela de contexto e alucinação** como sistema de risco/recompensa.
- **Prestígio** ("Retreinar") que concede Parâmetros (Θ) permanentes.
- **Save local** em IndexedDB, com progresso offline e export/import.
- Visual moderno dark, responsivo, com suporte a *reduced-motion*.

## Stack

- **TypeScript** + **React 18** + **Vite 5**
- **Zustand** para estado, **Tailwind CSS** para o tema
- **break_infinity.js** para números grandes, **idb** para persistência
- **Canvas 2D** para o Palco (núcleo procedural + agentes em órbita)
- **Vitest** para testes; deploy via **GitHub Actions → GitHub Pages**

## Começando

Requer **Node 20+**.

```bash
npm install      # instala as dependências
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
```

Em desenvolvimento, o app roda na raiz (`/`). O build de produção usa
`base: /AIncremental/` para funcionar no subcaminho do GitHub Pages.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Testes unitários (Vitest) |
| `npm run sim [horas]` | Simulação de balanceamento headless (sem UI) |

## Arquitetura

Fronteira dura entre o **núcleo de simulação puro** e a apresentação — o engine
não depende de React/DOM, o que o torna determinístico e testável (inclusive
via `npm run sim`).

```text
src/
├── engine/     # núcleo puro: tick(state, dt), sistemas, fórmulas (sem React)
├── content/    # dados balanceáveis: modelos, pesquisa, agentes, produtores
├── store/      # ponte engine↔React (Zustand) + persistência (IndexedDB)
├── render/     # o "Palco" em canvas
├── ui/         # componentes React (verbos, recursos, agentes, log, prestígio)
├── hooks/      # loop de jogo de passo fixo
└── lib/        # utilitários (formatação de números)
```

## Deploy

Cada push na `main` dispara o workflow de [Deploy](.github/workflows/deploy.yml),
que builda e publica em GitHub Pages. A [CI](.github/workflows/ci.yml) roda
typecheck, testes e build em cada push e pull request.

O planejamento completo de design e técnico está na pasta `docs/` (não
versionada; documentação interna).

## Licença

Projeto pessoal. Todos os direitos reservados.
