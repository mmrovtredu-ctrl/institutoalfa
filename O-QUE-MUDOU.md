# Instituto Alfa — o que mudou

Cor, layout, textos e estrutura **não foram tocados**. Mudou só movimento, ícones e o defeito do vídeo.

## Arquivos

| Arquivo | Situação |
|---|---|
| `css/motion.css` | **novo** — todas as animações e estados de toque |
| `js/icones.js`   | **novo** — os ícones em SVG que entraram no lugar dos emojis |
| `index.html`     | alterado — link do motion.css, correção do vídeo, emojis → SVG |
| `js/script.js`   | alterado — ícones das áreas, cascata dos cards, ondinha do toque |

Nenhum arquivo gerado por `sincronizar.mjs` foi tocado (`config.js`, `db.js`, `cursos.js` continuam intactos).
Se você trabalha pelo monorepo, `icones.js` e `motion.css` são arquivos novos e independentes — não precisam entrar em `compartilhado/`.

---

## 1. O botão de play não sumia

O código antigo fazia `pb.hidden = true`. O `[hidden]` do navegador vem da folha de estilo do próprio navegador, e **qualquer** `display` do autor ganha dele — o `.play-btn{display:grid}` mantinha o botão na tela por cima do vídeo tocando.

Agora o botão sai por classe (`.off`), com transição, e volta sozinho quando o vídeo pausa ou termina. A legenda do vídeo também some enquanto toca, para não cobrir os controles. Se o navegador barrar o play, o botão volta — nada de tela travada.

Também entrou `[hidden]{display:none !important}` como rede de segurança, para esse tipo de bug não voltar em outro lugar.

## 2. Fim dos emojis

Os emojis mudavam de desenho em cada aparelho — no iPhone viravam aqueles brilhantes em 3D — e não dá para animar emoji.

Saíram todos da interface e entraram **SVG desenhados à mão**, em `currentColor`: ficam cinza quando a área está apagada e **dourados** quando ela é a escolhida. Sem requisição extra, sem biblioteca.

Cada área ganhou vida própria:

| Área | O que faz |
|---|---|
| Cursos Técnicos | a borla do capelo balança |
| Saúde e Bem-estar | o batimento corre e o coração pulsa |
| Beleza e Estética | os brilhos cintilam fora de compasso |
| Informática | o cursor pisca |
| Administração | as barras do gráfico sobem em sequência |
| Serviços | a campainha toca |
| Industrial | a engrenagem gira |
| Educação | a página do livro vira |
| Idiomas | os pontinhos "digitam" |

A área ativa anima mais rápido; as outras ficam discretas. Também trocaram os emojis dos dados do curso (⏱️📍📜👩‍🏫), das cidades, do telefone, dos selos e do "cadastro feito" — esse virou um check que se desenha na tela.

Os emojis da **mensagem do WhatsApp** ficaram: ali eles são bem-vindos.

## 3. Cards de curso mais vivos

Referência tirada do site do Eduardo: **animação em CSS puro**, sem biblioteca nenhuma.

- **Entram em cascata** ao trocar de área, com atraso escalonado (`--i`) — e agora isso funciona mesmo se o CDN do anime.js cair
- **Afundam ao toque** (`:active`) — no celular não existe `:hover`, o retorno tem que vir do dedo
- **Ondinha dourada** sai exatamente de onde o dedo tocou
- **Brilho dourado** atravessa o card de tempos em tempos, um por vez
- **A seta do "Ver detalhes"** chama sozinha
- **O selo "Novo"** respira em verde
- **O preço acende** uma vez quando o card aparece

Botões dourados e verdes ganharam um feixe de luz atravessando. O botão do WhatsApp ganhou anel duplo e uma sacudida a cada 7 segundos.

## 4. Feito para o dedo, no iPhone

- Áreas com 62 px de altura no celular — bem acima dos 44 pt que a Apple pede
- Sem o realce cinza do iOS ao tocar: o retorno é o nosso
- Campos com `font-size: 16px` — o Safari não dá mais zoom sozinho ao focar
- Botão do WhatsApp respeitando `safe-area-inset-bottom` (barra de gestos)
- Zero scroll horizontal, conferido em 390 px e em 1440 px

## 5. Performance

As animações usam só `transform`, `opacity` e `background-position` — nada que force o navegador a refazer layout. Foi por isso que o brilho dos cards e dos botões não anima `left`: em um grid com 12 cards, isso derrubaria os quadros no celular.

Quem tiver **"Reduzir movimento"** ligado no iPhone recebe o site inteiro, funcionando, sem nenhuma animação.

---

## Como testar

1. Toque no play do vídeo da Massoterapia — o botão tem que sumir e voltar ao pausar
2. Troque de área — os ícones mudam de cinza para dourado e os cards entram em cascata
3. Segure o dedo num card — ele afunda e sai a ondinha
4. Procure um emoji na interface — não deve sobrar nenhum
5. Ative Ajustes → Acessibilidade → Movimento → Reduzir Movimento e recarregue: tudo parado, tudo funcionando
