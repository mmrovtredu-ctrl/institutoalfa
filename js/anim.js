/* ============================================================
   ANIM — anime.js v4 (ESM via CDN).
   Regra: a animação é ENFEITE. Se o CDN cair, o site tem que
   continuar 100% legível e clicável. Por isso tudo aqui é
   opcional, com try/catch e checagem de prefers-reduced-motion.
   ============================================================ */

const REDUZIR = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let A = null;          // módulo anime.js
export let ANIM_OK = false;

export async function initAnime() {
  if (REDUZIR) return null;
  try {
    A = await import("https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm");
    ANIM_OK = true;
    document.documentElement.classList.add("anim-on");
    return A;
  } catch (e) {
    console.warn("[anim] anime.js não carregou, seguindo com CSS:", e);
    return null;
  }
}

/* ---------- 1. Título do hero: letras entrando uma a uma ---------- */
export function heroTitulo(seletor = ".hero-title .anim-text") {
  if (!A) return;
  try {
    const { animate, stagger, splitText } = A;
    const alvo = document.querySelector(seletor);
    if (!alvo) return;
    const { chars } = splitText(alvo, { words: false, chars: true });
    animate(chars, {
      y: [
        { to: "-2.4rem", ease: "outExpo", duration: 550 },
        { to: 0, ease: "outBounce", duration: 750, delay: 80 },
      ],
      rotate: { from: "-1turn", delay: 0 },
      opacity: { from: 0, duration: 200 },
      delay: stagger(45),
      ease: "inOutCirc",
    });
  } catch (e) { console.warn("[anim] heroTitulo:", e); }
}

/* ---------- 2. Selo "vagas abertas" flutuando em loop ---------- */
export function seloPulsando(seletor = ".hero-title .gold") {
  if (!A) return;
  try {
    const { waapi, stagger, splitText } = A;
    const alvo = document.querySelector(seletor);
    if (!alvo) return;
    const { chars } = splitText(alvo, { words: false, chars: true });
    waapi.animate(chars, {
      translate: "0 -0.55rem",
      delay: stagger(70, { start: 1400 }),
      duration: 620,
      loop: true,
      alternate: true,
      ease: "inOut(2)",
    });
  } catch (e) { console.warn("[anim] selo:", e); }
}

/* ---------- 3. Cards entrando ao trocar de área ---------- */
export function entradaCards(cards) {
  if (!A || !cards.length) { cards.forEach(c => c.style.opacity = 1); return; }
  try {
    const { animate, stagger, utils } = A;
    animate(cards, {
      opacity:   { from: 0 },
      y:         { from: 26 },
      scale:     { from: .96 },
      rotate:    () => utils.random(-1.4, 1.4),
      duration:  () => utils.random(480, 720),
      delay:     stagger(28, { from: "first" }),
      ease:      "outElastic(1, .85)",
    });
  } catch (e) {
    cards.forEach(c => (c.style.opacity = 1));
  }
}

/* ---------- 4. Números subindo ---------- */
export function contador(el, alvo, sufixo = "") {
  const escrever = (v) => (el.textContent = Math.round(v) + sufixo);
  if (!A) { escrever(alvo); return; }
  try {
    const obj = { n: 0 };
    A.animate(obj, {
      n: alvo, duration: 1400, ease: "out(3)",
      onUpdate: () => escrever(obj.n),
    });
  } catch { escrever(alvo); }
}

/* ---------- 5. Abertura do modal do curso (FLIP do card) ---------- */
let layoutModal = null;

export function prepararLayoutModal($dialog) {
  if (!A || !A.createLayout) return null;
  try {
    layoutModal = A.createLayout($dialog, {
      children: [".modal-card", ".modal-head", ".modal-body h4", ".modal-body li"],
    });
    return layoutModal;
  } catch (e) { console.warn("[anim] createLayout indisponível:", e); return null; }
}

/** Executa `acao()` dentro da transição de layout (com fallback direto). */
export function transicaoModal(acao, duracao = 420) {
  if (layoutModal) {
    try { layoutModal.update(acao, { duration: duracao }); return; }
    catch (e) { console.warn("[anim] transicaoModal:", e); }
  }
  acao();
}

/* ---------- 6. Conteúdo do modal aparecendo em cascata ---------- */
export function cascataModal($root) {
  if (!A) return;
  try {
    const itens = $root.querySelectorAll(".modal-anim");
    if (!itens.length) return;
    A.animate(itens, {
      opacity: { from: 0 },
      y: { from: 14 },
      delay: A.stagger(35),
      duration: 420,
      ease: "out(3)",
    });
  } catch (_) {}
}

/* ---------- 7. Feedback de sucesso ---------- */
export function pulsoSucesso(el) {
  if (!A || !el) return;
  try {
    A.animate(el, { scale: [{ to: 1.06, duration: 180 }, { to: 1, duration: 320 }], ease: "outBack" });
  } catch (_) {}
}
