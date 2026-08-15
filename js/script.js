/* ============================================================
   INSTITUTO ALFA — script.js
   Cursos por área · modal de detalhes · captura de lead · WhatsApp
   ============================================================ */
import { AREAS, CURSOS, porSlug, areaNome } from "./cursos.js";
import { WA_NUMBER, CIDADES } from "./config.js";
import { salvarLead, contexto, sincronizarPendentes } from "./db.js";
import * as anim from "./anim.js";
import { icone, MINI, CHECK_OK } from "./icones.js";

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const BRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ============================================================
   WHATSAPP
   ============================================================ */
function waLink(texto) {
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(texto);
}

function mensagemLead(d) {
  return (
    "Olá, Instituto Alfa! 👋\n\n" +
    "Acabei de me cadastrar no site e quero informações sobre:\n" +
    "*" + d.curso + "*\n\n" +
    "Nome: " + d.nome + "\n" +
    "E-mail: " + d.email + "\n" +
    "Telefone: " + d.telefone + "\n" +
    (d.idade ? "Idade: " + d.idade + " anos\n" : "") +
    (d.cidade ? "Cidade: " + d.cidade + "\n" : "") +
    "\n_EU QUERO SER ALFA_ 🎯"
  );
}

/* Botões de WhatsApp "soltos" pelo site → abrem o formulário, não o zap direto. */
function bindCTAs() {
  $$("a.wa, button.wa").forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = "1";
    el.setAttribute("href", "#");
    el.addEventListener("click", (e) => {
      e.preventDefault();
      abrirFormulario({ cursoPreSelecionado: el.dataset.curso || "" });
    });
  });
}

/* ============================================================
   PREÇO
   ============================================================ */
function precoResumo(c) {
  const p = c.preco || {};
  if (p.consulte) return `<div class="consult">Consulte os valores</div>`;
  if (p.mensal) {
    return (p.mensal_de ? `<span class="old">de ${BRL(p.mensal_de)}</span>` : "") +
      `<div class="new"><b>${BRL(p.mensal)}</b><span class="unit">/mês</span></div>`;
  }
  if (p.parcela) {
    return (p.de ? `<span class="old">de ${BRL(p.de)}</span>` : "") +
      `<div class="new"><b>${p.parcelas}x ${BRL(p.parcela)}</b></div>` +
      (p.vista ? `<span class="unit">ou ${BRL(p.vista)} à vista</span>` : "");
  }
  return `<div class="consult">Consulte os valores</div>`;
}

function precoCompleto(c) {
  const p = c.preco || {};
  if (p.consulte)
    return `<div class="pc-linha"><span>Investimento</span><b class="pc-consulte">Consulte no WhatsApp</b></div>`;
  let h = "";
  if (p.mensal) {
    h += `<div class="pc-linha"><span>Mensalidade</span><b>${
      p.mensal_de ? `<s>${BRL(p.mensal_de)}</s> ` : ""}${BRL(p.mensal)}</b></div>`;
  }
  if (p.matricula != null) {
    h += `<div class="pc-linha"><span>Matrícula</span><b>${
      p.matricula_de ? `<s>${BRL(p.matricula_de)}</s> ` : ""}${BRL(p.matricula)}</b></div>`;
  }
  if (p.parcela) {
    if (p.de) h += `<div class="pc-linha"><span>De</span><b><s>${BRL(p.de)}</s></b></div>`;
    h += `<div class="pc-linha"><span>Parcelado</span><b>${p.parcelas}x de ${BRL(p.parcela)}</b></div>`;
    if (p.vista) h += `<div class="pc-linha"><span>À vista</span><b>${BRL(p.vista)}</b></div>`;
  }
  if (p.nota) h += `<p class="pc-obs">${p.nota}</p>`;
  return h;
}

/* ============================================================
   GRID DE CURSOS POR ÁREA
   ============================================================ */
let areaAtiva = "tecnicos";
let modalidadeAtiva = "todas";

const grid = $("#courseGrid");
const navAreas = $("#areaNav");
const contadorRes = $("#resultCount");

function montarNavAreas() {
  navAreas.innerHTML = AREAS.map((a) => {
    const n = CURSOS.filter((c) => c.area === a.id).length;
    return `<button class="area-btn" data-area="${a.id}" role="tab" aria-selected="false">
      <span class="area-ic" aria-hidden="true">${icone(a.id)}</span>
      <span class="area-txt"><b>${esc(a.nome)}</b><small>${n} curso${n > 1 ? "s" : ""}</small></span>
    </button>`;
  }).join("");

  navAreas.addEventListener("click", (e) => {
    const b = e.target.closest(".area-btn");
    if (!b) return;
    areaAtiva = b.dataset.area;
    render();
    $("#cursos").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function cardCurso(c, i = 0) {
  const flag = c.novo ? `<div class="ribbon novo">Novo</div>`
             : c.combo ? `<div class="ribbon combo">Combo</div>`
             : c.destaque ? `<div class="ribbon">Destaque</div>` : "";
  const mod = c.modalidade === "ead"
    ? `<span class="modality ead">EAD / Online</span>`
    : `<span class="modality presencial">Presencial</span>`;

  return `<article class="card" data-slug="${c.slug}" tabindex="0" role="button"
            style="--i:${Math.min(i, 14)}"
            aria-label="Ver detalhes de ${esc(c.nome)}">
      ${flag}
      <div class="card-top"><span class="cat">${esc(areaNome(c.area))}</span>${mod}</div>
      <h3>${esc(c.nome)}</h3>
      <p class="meta">${esc(c.resumo)}</p>
      <div class="price-block">${precoResumo(c)}</div>
      <span class="card-cta">Ver detalhes e valores <span aria-hidden="true">→</span></span>
    </article>`;
}

function render() {
  $$(".area-btn", navAreas).forEach((b) => {
    const on = b.dataset.area === areaAtiva;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
  });
  $$("#modalTabs .tab").forEach((t) => {
    const on = t.dataset.filter === modalidadeAtiva;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", String(on));
  });

  let lista = CURSOS.filter((c) => c.area === areaAtiva);
  if (modalidadeAtiva !== "todas")
    lista = lista.filter((c) => c.modalidade === modalidadeAtiva);
  lista.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));

  const a = AREAS.find((x) => x.id === areaAtiva);
  $("#areaTitulo").textContent = a ? a.nome : "";
  $("#areaTag").textContent = a ? a.tag : "";
  contadorRes.textContent = lista.length
    ? `${lista.length} curso${lista.length > 1 ? "s" : ""} nesta área`
    : "";

  if (!lista.length) {
    grid.innerHTML = `<p class="vazio">Nenhum curso ${
      modalidadeAtiva === "ead" ? "online" : "presencial"
    } nesta área. Toque em "Todas as modalidades" para ver o restante.</p>`;
    return;
  }
  grid.innerHTML = lista.map((c, i) => cardCurso(c, i)).join("");
}

/* ondinha dourada saindo de onde o dedo tocou.
   No celular não existe :hover — o retorno visual tem que vir do toque. */
const SEM_MOVIMENTO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

grid.addEventListener("pointerdown", (e) => {
  if (SEM_MOVIMENTO) return;
  const card = e.target.closest(".card");
  if (!card) return;

  const r = card.getBoundingClientRect();
  const d = Math.max(r.width, r.height) * 2.2;
  const onda = document.createElement("span");
  onda.className = "onda";
  onda.style.cssText =
    `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${d}px;height:${d}px`;
  card.appendChild(onda);
  onda.addEventListener("animationend", () => onda.remove(), { once: true });
}, { passive: true });

/* abrir detalhes: clique ou Enter/Espaço no card */
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) abrirCurso(card.dataset.slug);
});
grid.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".card");
  if (card) { e.preventDefault(); abrirCurso(card.dataset.slug); }
});

/* ============================================================
   MODAL — passo 1: detalhes do curso
   ============================================================ */
const dlg = $("#cursoModal");
let cursoAtual = null;

function abrirCurso(slug) {
  const c = porSlug(slug);
  if (!c) return;
  cursoAtual = c;
  dlg.innerHTML = viewDetalhe(c);
  anim.transicaoModal(() => { if (!dlg.open) dlg.showModal(); });
  anim.cascataModal(dlg);
  history.replaceState(null, "", "#curso=" + c.slug);
}

function viewDetalhe(c) {
  const mod = c.modalidade === "ead" ? "EAD / Online" : "Presencial";
  const lista = (arr, cls = "") =>
    arr && arr.length ? `<ul class="${cls}">${arr.map((i) => `<li class="modal-anim">${esc(i)}</li>`).join("")}</ul>` : "";

  return `<div class="modal-card">
    <button class="modal-x" data-fechar aria-label="Fechar">&times;</button>

    <header class="modal-head modal-anim">
      <div class="modal-tags">
        <span class="modality ${c.modalidade === "ead" ? "ead" : "presencial"}">${mod}</span>
        <span class="pill">${esc(areaNome(c.area))}</span>
        ${c.novo ? `<span class="pill novo">Turma nova</span>` : ""}
      </div>
      <h2>${esc(c.nome)}</h2>
      <p class="modal-sub">${esc(c.resumo)}</p>
      <div class="modal-facts">
        <span>${MINI.relogio}${esc(c.carga)}</span>
        <span>${MINI.local}${esc(c.cidade)}</span>
        <span>${MINI.certificado}Certificado de conclusão</span>
        ${c.professor ? `<span>${MINI.professor}${esc(c.professor)}</span>` : ""}
        ${c.turnos ? `<span>${MINI.turno}${c.turnos.map(esc).join(" · ")}</span>` : ""}
        ${c.idade_min ? `<span>${MINI.idade}${esc(c.idade_min)}</span>` : ""}
      </div>
    </header>

    <div class="modal-body">
      <div class="modal-col">
        <h4 class="modal-anim">Sobre o curso</h4>
        <p class="modal-anim">${esc(c.sobre)}</p>

        <h4 class="modal-anim">O que você vai aprender</h4>
        ${lista(c.conteudo, "check")}
        ${!c.curado ? `<p class="nota modal-anim">Conteúdo programático detalhado enviado pelo WhatsApp.</p>` : ""}

        <h4 class="modal-anim">Para quem é</h4>
        <p class="modal-anim">${esc(c.publico)}</p>

        <h4 class="modal-anim">Onde você pode trabalhar</h4>
        ${lista(c.saidas, "dots")}
      </div>

      <aside class="modal-side">
        ${c.foto ? `<div class="foto-card modal-anim" style="max-height:280px">
          <img src="${esc(c.foto)}" alt="Turma de ${esc(c.nome)}" loading="lazy" decoding="async">
        </div>` : ""}
        ${c.video ? `<div class="video-card modal-anim" style="max-height:300px">
          <video controls playsinline preload="none" poster="${esc(c.poster || "")}">
            <source src="${esc(c.video)}" type="video/mp4"></video>
        </div>` : ""}
        <div class="pc modal-anim">
          ${precoCompleto(c)}
          <button class="btn btn-gold pc-btn" data-quero>Quero mais informações</button>
          <p class="pc-nota">Preencha seus dados e você é direcionado para o WhatsApp.</p>
        </div>
        ${c.beneficios ? `<div class="benef modal-anim"><h4>Você leva</h4>${lista(c.beneficios, "check")}</div>` : ""}
      </aside>
    </div>
  </div>`;
}

/* ============================================================
   MODAL — passo 2: formulário (obrigatório antes do WhatsApp)
   ============================================================ */
let formAbertoEm = 0;

function optionsCursos(sel) {
  return AREAS.map((a) => {
    const itens = CURSOS.filter((c) => c.area === a.id);
    if (!itens.length) return "";
    return `<optgroup label="${esc(a.nome)}">` +
      itens.map((c) =>
        `<option value="${c.slug}" ${c.slug === sel ? "selected" : ""}>${esc(c.nome)}${
          c.modalidade === "ead" ? " · online" : " · presencial"}</option>`).join("") +
      `</optgroup>`;
  }).join("");
}

function abrirFormulario({ curso = null, cursoPreSelecionado = "" } = {}) {
  const c = curso || cursoAtual;
  cursoAtual = c;
  dlg.innerHTML = viewFormulario(c, cursoPreSelecionado);
  anim.transicaoModal(() => { if (!dlg.open) dlg.showModal(); });
  anim.cascataModal(dlg);
  formAbertoEm = Date.now();
  setTimeout(() => $("#f-nome")?.focus(), 120);
}

function viewFormulario(c, dica) {
  return `<div class="modal-card modal-form">
    <button class="modal-x" data-fechar aria-label="Fechar">&times;</button>

    <header class="modal-head modal-anim">
      ${c ? `<button class="voltar" data-voltar>← voltar para o curso</button>` : ""}
      <h2>Falta só um passo</h2>
      <p class="modal-sub">${
        c ? `Preencha seus dados para receber as informações de <b>${esc(c.nome)}</b> no WhatsApp.`
          : (dica ? `<b>${esc(dica)}</b><br>Preencha seus dados e a nossa equipe fala com você no WhatsApp.`
                  : "Preencha seus dados e a nossa equipe fala com você no WhatsApp.")}
      </p>
    </header>

    <form id="leadForm" class="lead-form" novalidate>
      <!-- armadilha anti-robô: humano nunca preenche -->
      <div class="hp" aria-hidden="true">
        <label>Não preencha<input type="text" name="empresa" tabindex="-1" autocomplete="off"></label>
      </div>

      <div class="campo modal-anim">
        <label for="f-nome">Nome completo *</label>
        <input id="f-nome" name="nome" type="text" required minlength="3" autocomplete="name"
               placeholder="Como podemos te chamar?">
      </div>

      <div class="campo modal-anim">
        <label for="f-tel">WhatsApp *</label>
        <input id="f-tel" name="telefone" type="tel" required inputmode="numeric"
               autocomplete="tel" placeholder="(98) 90000-0000" maxlength="16">
      </div>

      <div class="campo modal-anim">
        <label for="f-email">E-mail *</label>
        <input id="f-email" name="email" type="email" required autocomplete="email"
               placeholder="seuemail@exemplo.com">
      </div>

      <div class="campo-linha modal-anim">
        <div class="campo">
          <label for="f-idade">Idade *</label>
          <input id="f-idade" name="idade" type="number" required min="10" max="99"
                 inputmode="numeric" placeholder="Ex.: 24">
        </div>
        <div class="campo">
          <label for="f-cidade">Cidade</label>
          <select id="f-cidade" name="cidade">
            ${CIDADES.map((x) => `<option>${esc(x)}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="campo modal-anim">
        <label for="f-curso">Curso desejado *</label>
        <select id="f-curso" name="curso_slug" required>
          <option value="">Selecione o curso…</option>
          ${optionsCursos(c ? c.slug : null)}
        </select>
      </div>

      <p class="erro" id="f-erro" role="alert" hidden></p>

      <button type="submit" class="btn btn-wa btn-lg envia modal-anim">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#04210f" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.04c-.24.68-1.42 1.31-1.95 1.35-.5.05-.96.23-3.23-.67-2.73-1.08-4.46-3.86-4.6-4.04-.13-.18-1.09-1.45-1.09-2.77 0-1.31.69-1.96.93-2.23.24-.27.53-.34.71-.34l.5.01c.16.01.38-.06.59.45.24.58.81 2 .88 2.14.07.14.12.31.02.49-.09.18-.14.29-.27.45l-.41.48c-.13.13-.27.28-.12.55.16.27.69 1.14 1.49 1.85 1.02.91 1.88 1.19 2.15 1.32.27.14.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.6.76 1.87.9.27.13.45.2.51.31.07.11.07.63-.17 1.31z"/></svg>
        <span class="txt">Continuar no WhatsApp</span>
      </button>
      <p class="lgpd modal-anim">Usamos seus dados apenas para falar sobre o curso. Nada de spam.</p>
    </form>
  </div>`;
}

/* ---------- validação e envio ---------- */
function limparTelefone(v) { return v.replace(/\D/g, ""); }

function mascaraTelefone(v) {
  const d = limparTelefone(v).slice(0, 11);
  if (d.length <= 2) return d.replace(/(\d{0,2})/, "($1");
  if (d.length <= 6) return d.replace(/(\d{2})(\d{0,4})/, "($1) $2");
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

async function enviarLead(form) {
  const erroEl = $("#f-erro");
  const btn = $(".envia", form);
  const dizer = (m) => { erroEl.textContent = m; erroEl.hidden = false; };
  erroEl.hidden = true;

  const fd = new FormData(form);
  const nome  = (fd.get("nome") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim().toLowerCase();
  const tel   = limparTelefone((fd.get("telefone") || "").toString());
  const idade = parseInt(fd.get("idade"), 10);
  const slug  = (fd.get("curso_slug") || "").toString();

  /* anti-bot */
  if ((fd.get("empresa") || "").toString().trim() !== "") return;      // honeypot
  if (Date.now() - formAbertoEm < 2500)
    return dizer("Calma aí! Confira os dados e envie novamente.");     // rápido demais

  if (nome.length < 3 || !nome.includes(" "))
    return dizer("Escreva seu nome e sobrenome.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return dizer("Confira o e-mail — parece que falta algo.");
  if (tel.length < 10 || tel.length > 11)
    return dizer("O WhatsApp precisa ter DDD + número. Ex.: (98) 98584-3807");
  if (!idade || idade < 10 || idade > 99)
    return dizer("Informe uma idade válida.");
  if (!slug) return dizer("Escolha o curso que você quer.");

  const c = porSlug(slug);
  const lead = {
    nome, email, telefone: tel, idade,
    curso: c ? c.nome : slug,
    curso_slug: slug,
    area: c ? c.area : null,
    modalidade: c ? c.modalidade : null,
    cidade: (fd.get("cidade") || "").toString(),
    ...contexto(),
  };

  btn.disabled = true;
  $(".txt", btn).textContent = "Salvando…";

  const r = await salvarLead(lead);

  /* Mesmo se o banco falhar, a pessoa segue para o WhatsApp.
     O lead fica na fila local e sobe na próxima visita.        */
  const url = waLink(mensagemLead({ ...lead, curso: lead.curso }));
  const nova = window.open(url, "_blank", "noopener");

  dlg.innerHTML = viewSucesso(lead, url, r);
  anim.cascataModal(dlg);
  anim.pulsoSucesso($(".ok-ic", dlg));
  if (!nova) location.href = url;   // popup bloqueado → redireciona
}

function viewSucesso(lead, url, r) {
  return `<div class="modal-card modal-ok">
    <button class="modal-x" data-fechar aria-label="Fechar">&times;</button>
    <div class="ok-ic modal-anim">${CHECK_OK}</div>
    <h2 class="modal-anim">Cadastro feito, ${esc(lead.nome.split(" ")[0])}!</h2>
    <p class="modal-sub modal-anim">Abrimos o WhatsApp em outra aba com a sua mensagem pronta.
      Se não abriu, toque no botão abaixo.</p>
    <a class="btn btn-wa btn-lg modal-anim" href="${url}" target="_blank" rel="noopener">Abrir o WhatsApp</a>
    ${r && r.offline ? `<p class="nota modal-anim">Sem conexão com o servidor agora — seu cadastro foi guardado e será enviado automaticamente.</p>` : ""}
    <button class="linkish modal-anim" data-fechar>Continuar vendo os cursos</button>
  </div>`;
}

/* ---------- eventos do modal ---------- */
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) return dlg.close();                 // clique no backdrop
  if (e.target.closest("[data-fechar]")) return dlg.close();
  if (e.target.closest("[data-quero]")) return abrirFormulario({ curso: cursoAtual });
  if (e.target.closest("[data-voltar]")) return abrirCurso(cursoAtual.slug);
});
dlg.addEventListener("close", () => {
  history.replaceState(null, "", location.pathname + location.search);
});
dlg.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "leadForm") enviarLead(e.target);
});
dlg.addEventListener("input", (e) => {
  if (e.target.id === "f-tel") e.target.value = mascaraTelefone(e.target.value);
});

/* ============================================================
   FILTRO DE MODALIDADE
   ============================================================ */
$("#modalTabs").addEventListener("click", (e) => {
  const t = e.target.closest(".tab");
  if (!t) return;
  modalidadeAtiva = t.dataset.filter;
  render();
});

/* ============================================================
   BUSCA
   ============================================================ */
const busca = $("#buscaCurso");
const sugest = $("#buscaSugestoes");

busca.addEventListener("input", () => {
  const q = busca.value.trim().toLowerCase();
  if (q.length < 2) { sugest.hidden = true; sugest.innerHTML = ""; return; }
  const hits = CURSOS.filter((c) => c.nome.toLowerCase().includes(q)).slice(0, 8);
  sugest.innerHTML = hits.length
    ? hits.map((c) => `<button data-slug="${c.slug}"><b>${esc(c.nome)}</b>
        <small>${esc(areaNome(c.area))} · ${c.modalidade === "ead" ? "online" : "presencial"}</small></button>`).join("")
    : `<p class="vazio-busca">Nada encontrado para "${esc(busca.value)}".</p>`;
  sugest.hidden = false;
});
sugest.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-slug]");
  if (!b) return;
  sugest.hidden = true; busca.value = "";
  abrirCurso(b.dataset.slug);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".busca-wrap")) sugest.hidden = true;
});

/* ============================================================
   SCROLL REVEAL + CONTADORES + HEADER
   ============================================================ */
function reveals() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
  const io = new window.IntersectionObserver((en) => {
    en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((e) => io.observe(e));
  setTimeout(() => els.forEach((e) => e.classList.add("in")), 1800);
}

function contadores() {
  const nums = $$("[data-count]");
  if (!("IntersectionObserver" in window)) return;
  const vistos = new WeakSet();
  const io = new window.IntersectionObserver((en) => {
    en.forEach((x) => {
      if (!x.isIntersecting || vistos.has(x.target)) return;
      vistos.add(x.target);
      anim.contador(x.target, +x.target.dataset.count, x.target.dataset.suffix || "");
    });
  }, { threshold: .5 });
  nums.forEach((n) => io.observe(n));
}

(function header() {
  const h = $("#top");
  const on = () => h.classList.toggle("scrolled", window.scrollY > 10);
  on(); window.addEventListener("scroll", on, { passive: true });
})();

/* ============================================================
   BOOT
   ============================================================ */
(async function boot() {
  $("#yr").textContent = new Date().getFullYear();
  $("#totalCursos").dataset.count = CURSOS.length;
  $("#totalAreas").dataset.count = AREAS.length;

  montarNavAreas();
  render();
  reveals();
  bindCTAs();

  await anim.initAnime();
  anim.prepararLayoutModal(dlg);
  anim.heroTitulo();
  anim.seloPulsando();
  contadores();

  /* deep-link: institutoalfa.com/#curso=massoterapia-vip */
  const m = location.hash.match(/curso=([\w-]+)/);
  if (m && porSlug(m[1])) { areaAtiva = porSlug(m[1]).area; render(); abrirCurso(m[1]); }

  window.alfaAbrirCurso = abrirCurso;   // usado pelos botões fora do grid
  sincronizarPendentes();
})();
