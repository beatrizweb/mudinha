# 🌿 Plantas da Mudinha — guia de arte

Aqui é onde a Bia coloca as ilustrações das 7 fases da planta.

Enquanto não tiver imagem aqui, o app mostra emoji como fallback automático.
Quando você adicionar um arquivo com o nome certo, ele aparece sozinho.

## 📂 Arquivos esperados

Coloca os arquivos **EXATAMENTE com esses nomes** nessa pasta:

| Arquivo | Substitui o emoji | Quando aparece |
|---|---|---|
| `semente.svg` | 🌱 | 0–2 dias (acabou de plantar) |
| `brotinho.svg` | 🌿 | 3–6 dias |
| `mudinha.svg` | 🍃 | 7–13 dias |
| `vaso-pequeno.svg` | 🪴 | 14–29 dias |
| `vaso-medio.svg` | 🌳 | 30–59 dias |
| `crescida.svg` | 🌴 | 60–99 dias |
| `majestosa.svg` | 🌺 | 100+ dias |

## 🎨 Especificações técnicas

| Item | Valor recomendado |
|---|---|
| **Formato** | SVG (vetorial, escala bem) — PNG também funciona |
| **Tamanho do canvas** | quadrado 200×200 px (ou maior, é vetor) |
| **Padding interno** | ~10% de respiro nas bordas |
| **Estilo** | leve, minimalista, com a paleta Estufa de Domingo |
| **Cores principais** | `#2D5F3F` (verde escuro), `#87B891` (verde claro), `#8B6F47` (terra/vaso) |
| **Fundo** | transparente (SVG) |

## 🌱 Sugestão de evolução

A ideia é que o usuário sinta a planta CRESCENDO. Sugestão:

1. **Semente** — vasinho marrom com terra, pequeno broto saindo
2. **Brotinho** — vaso pequeno + caule com 1-2 folhinhas
3. **Mudinha** — vaso pequeno + caule maior com 3-4 folhas
4. **Vaso pequeno** — vaso decorado + planta com várias folhas
5. **Vaso médio** — vaso maior + planta robusta com vários ramos
6. **Crescida** — planta grande, várias folhas, talvez começando a florir
7. **Majestosa** — planta no auge, com flor visível, vaso premium

## 🔄 Como o sistema funciona

O componente `<EstagioPlanta>` em `src/components/estagio-planta.tsx`:
1. Tenta carregar a imagem de `/plantas/[id].svg`
2. Se a imagem existe → mostra ela
3. Se não existe → mostra emoji como fallback

Você pode ir colocando uma de cada vez. Não precisa fazer todas juntas.

## 💡 Pra adicionar uma imagem agora

1. Cria o SVG no Figma (ou Illustrator/Inkscape)
2. Exporta como SVG
3. Renomeia pra um dos nomes da tabela acima (ex: `semente.svg`)
4. Coloca nessa pasta (`public/plantas/`)
5. Salva
6. F5 no navegador — aparece automaticamente!

## 🎯 Onde aparece no app

- **Cards do jardim** — tamanho 32px (pequeno)
- **Detalhe do hábito** — tamanho 128px (grande, com animação balançando)
