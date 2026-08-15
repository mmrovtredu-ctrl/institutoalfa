# Instituto Alfa — site + painel

Site estático (HTML/CSS/JS puro, sem build) + banco Supabase + painel de gestão.

```
index.html          site público
painel.html         painel de gestão (login obrigatório)
css/styles.css      site
css/painel.css      painel
js/config.js        ← O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
js/cursos.js        catálogo dos 121 cursos (editar preços/conteúdo aqui)
js/script.js        lógica do site
js/painel.js        lógica do painel
js/db.js            camada Supabase
js/anim.js          animações (anime.js v4)
sql/schema.sql      ← rodar UMA VEZ no Supabase
assets/             logo + vídeo da turma de Massoterapia
```

---

## 1. Subir o banco (5 min)

1. Crie um projeto em [supabase.com](https://supabase.com) (plano free serve).
2. **SQL Editor → New query** → cole o conteúdo de `sql/schema.sql` → **Run**.
3. **Authentication → Users → Add user**: seu e-mail + senha, marque *Auto Confirm*.
4. **Authentication → Providers → Email**: desligue *Allow new users to sign up*.
   Sem isso, qualquer pessoa cria conta e entra no seu painel.
5. **Project Settings → API**: copie a **Project URL** e a **anon public key**.

## 2. Configurar

Abra `js/config.js` e preencha:

```js
export const SUPABASE_URL      = "https://xxxxx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGci...";
```

A `anon key` é pública de propósito — ela fica visível no navegador de qualquer
visitante. **Quem protege os dados é a RLS do `schema.sql`**, que só deixa o
visitante *inserir* leads e exige login para *ler* qualquer coisa.
Nunca cole aqui a `service_role` key.

## 3. Publicar

Vercel (arrasta a pasta em vercel.com/new) ou GitHub Pages. Não precisa de build.

Depois de publicar, teste você mesmo: preencha o formulário e confira se o lead
apareceu em `painel.html → Leads`.

---

## Como funciona o fluxo do lead

1. Pessoa clica em qualquer curso → abre o modal com conteúdo, carga horária e valores.
2. Clica em **Quero mais informações** → formulário: nome, WhatsApp, e-mail, idade,
   cidade e curso (select com os 121 cursos agrupados por área, já pré-selecionado).
3. Ao enviar: grava no Supabase **e** abre o WhatsApp com a mensagem pronta.
4. Se o Supabase estiver fora do ar, o lead vai para uma fila no navegador e sobe
   sozinho na próxima visita. A pessoa nunca fica travada.

**Anti-spam:** campo honeypot invisível + trava de 2,5 segundos + índice único
`(telefone, curso_slug)` no banco (o mesmo número não duplica no mesmo curso).

## Painel

- **Visão geral** — leads por dia, cursos mais procurados, contas a vencer, KPIs.
- **Leads** — filtro por status/período, busca, mudança de status inline,
  botão de WhatsApp com mensagem pronta, anotações, exportar CSV.
- **Matrículas** — ao criar uma matrícula, as parcelas são geradas automaticamente.
- **Financeiro** — entradas e saídas, marcar pago, inadimplência, exportar CSV.

---

## Editar cursos

Tudo em `js/cursos.js`. Cada curso é um objeto:

```js
{
  slug: "massoterapia-vip",
  nome: "Massoterapia VIP",
  area: "saude",                    // id de uma das 9 áreas
  modalidade: "presencial",         // presencial | ead
  carga: "25 horas",
  resumo: "...",                    // texto do card
  sobre: "...",                     // parágrafo no modal
  conteudo: ["módulo 1", "..."],
  publico: "...",
  saidas: ["onde trabalhar"],
  beneficios: ["..."],
  preco: { consulte: true }
      // ou { mensal: 197, mensal_de: 250, matricula: 49.99 }
      // ou { de: 500, parcela: 15, parcelas: 10, vista: 149.99 }
}
```

Mudou o preço? Edita aqui e republica. Nada mais precisa mudar.

### Pendências de conteúdo

**109 dos 121 cursos usam descrição genérica por área.** Eles têm `curado: false`
no catálogo e mostram no modal "conteúdo programático detalhado enviado pelo
WhatsApp". Isso é honesto e funcional, mas converte menos.

Os 12 cursos com texto próprio são: Massoterapia VIP, os 5 técnicos,
Informática presencial, Informática Infantil, Agente de Saúde ACS/ACE e os
3 combos. Priorize escrever conteúdo real para os que mais recebem lead
(veja o ranking na Visão geral do painel).

**Preços da Informática atualizados** para mensalidade R$ 160 → R$ 119,99 e matrícula
R$ 80 → R$ 50, conforme a divulgação de agosto/2026. O valor anterior do site
(R$ 180 / R$ 150) foi substituído.

**O Massoterapia VIP está sem preço** (`consulte: true`) porque o flyer não
informava valor. Assim que você definir, edite `preco` no catálogo.

---

## Fotos e vídeo

`assets/turma-informatica.jpg` (900×1200, 138 KB) — foto da turma, usada no bloco
de Informática e no modal do curso. Para trocar, mantenha proporção retrato e
comprima antes de subir.

## Vídeo da turma

O arquivo original (4K, HEVC, 133 MB) não roda em navegador. Já foi convertido para
`assets/massoterapia.mp4` (720×1280, H.264, 7,6 MB) com poster em
`assets/massoterapia-poster.jpg`. Carrega só quando a pessoa aperta o play.
Se trocar o vídeo, converta antes:

```bash
ffmpeg -i original.MOV -vf scale=720:1280 -c:v libx264 -crf 30 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k saida.mp4
```

## Animações

`anime.js@4.5.0` via CDN (jsDelivr), carregado como módulo ES em `js/anim.js`.
Se o CDN cair ou o visitante tiver *reduzir movimento* ligado, o site funciona
normalmente — só sem as animações. Isso é testado.

## Testes

`node test.mjs` na pasta acima (precisa de `npm i jsdom`) roda 30 verificações:
catálogo, boot, troca de área, filtros, modal, formulário, validações, honeypot,
redirecionamento do WhatsApp e fila offline.
