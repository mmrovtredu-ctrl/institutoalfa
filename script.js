/* =========================================================
   INSTITUTO ALFA — script
   ========================================================= */

// ---- Configuração de contato ----
const WHATS_NUMERO = "5598985843807"; // (98) 98584-3807
const CONSULTOR = "Bernardo";

/** Monta o link wa.me com a mensagem do curso desejado. */
function linkWhats(mensagem) {
  const base = mensagem || "Olá! Vim pelo site do Instituto Alfa.";
  return `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(base)}`;
}

/** Aplica o href de WhatsApp em todo elemento com data-curso. */
function ativarBotoesWhats(escopo = document) {
  escopo.querySelectorAll("[data-curso]").forEach((el) => {
    el.setAttribute("href", linkWhats(el.dataset.curso));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

/* =========================================================
   DADOS — fiéis às informações das imagens
   ========================================================= */

// Cursos técnicos (presenciais) — De R$250 por R$197/mês
const TECNICOS = [
  { nome: "Enfermagem",   antigo: "250,00", novo: "197,00" },
  { nome: "Farmácia",     antigo: "250,00", novo: "197,00" },
  { nome: "Radiologia",   antigo: "250,00", novo: "197,00" },
  { nome: "Estética",     antigo: "250,00", novo: "197,00", destaque: "Turma em Barreirinhas" },
  { nome: "Saúde Bucal",  novo: null }, // sem preço divulgado
];

// Cursos profissionalizantes (presenciais)
const PROFISSIONAIS = [
  { nome: "Agente Comunitário de Saúde (ACS)", tag: "Curso profissional", antigo: "180,00", novo: "140,00" },
  { nome: "Agente de Combate às Endemias (ACE)", tag: "Curso profissional", antigo: "180,00", novo: "140,00" },
];

// Cursos EAD (online) — só informação, sem fotos
const EAD = [
  { nome: "Auxiliar de Creche",        antigo: null,  novo: "29,99" },
  { nome: "Operador de Caixa",         antigo: "700", novo: "29,99" },
  { nome: "Técnicas de Vendas",        antigo: "700", novo: "29,99" },
  { nome: "Atendente de Farmácia",     antigo: "700", novo: "29,99" },
  { nome: "Auxiliar de Veterinário",   antigo: null,  novo: "39,99" },
  { nome: "Agente de Saúde (EAD)",     antigo: "700", novo: "39,99" },
  { nome: "Libras",                    antigo: null,  novo: "39,99" },
  { nome: "Frentista",                 antigo: "700", novo: "29,70" },
  { nome: "Inglês do Zero à Fluência", antigo: "900", novo: "44,99" },
];

// Pacote EAD — demais cursos disponíveis
const EAD_PACK = [
  "Youtuber", "Maquiagem", "Massagem", "Instagram", "Canva", "Cuidador de Idoso",
  "Elaboração de Currículo", "Mídias Sociais", "Solda MIG/MAG", "Análises Clínicas",
  "Fiscal de Loja", "Segurança na Internet", "Contabilidade", "Gestão em RH",
  "Conhecimentos Bancários", "Design de Cílios e Sobrancelha", "Socorrista APH",
  "Atualização em Radiologia", "Operador de Empilhadeira", "Energia Solar",
  "Mediador Escolar", "CorelDraw",
];

/* =========================================================
   RENDER — cards
   ========================================================= */

function cardTecnico(c) {
  const div = document.createElement("div");
  div.className = "course" + (c.novo ? "" : " course--soon");

  let precoHtml;
  if (c.novo) {
    precoHtml = `
      <div class="course__price">
        <p class="course__old">de R$ ${c.antigo}</p>
        <p class="course__now"><span class="cur">R$</span>${c.novo}<span class="course__per">/mês</span></p>
      </div>`;
  } else {
    precoHtml = `
      <div class="course__price">
        <p class="course__now">Matrículas abertas</p>
      </div>`;
  }

  const msg = `Olá ${CONSULTOR}! Quero me matricular no curso Técnico em ${c.nome} do Instituto Alfa.`;

  div.innerHTML = `
    <p class="course__tag">Técnico em${c.destaque ? " · " + c.destaque : ""}</p>
    <h3 class="course__name">${c.nome}</h3>
    ${precoHtml}
    <a class="btn btn--wa btn--sm" data-curso="${msg}" href="#">Quero esse curso</a>
  `;
  return div;
}

function cardProfissional(c) {
  const div = document.createElement("div");
  div.className = "course";
  const msg = `Olá ${CONSULTOR}! Quero me matricular no curso ${c.nome} do Instituto Alfa.`;
  div.innerHTML = `
    <p class="course__tag">${c.tag}</p>
    <h3 class="course__name">${c.nome}</h3>
    <div class="course__price">
      <p class="course__old">de R$ ${c.antigo}</p>
      <p class="course__now"><span class="cur">R$</span>${c.novo}<span class="course__per">/mês</span></p>
    </div>
    <a class="btn btn--wa btn--sm" data-curso="${msg}" href="#">Quero esse curso</a>
  `;
  return div;
}

function cardEad(c) {
  const div = document.createElement("div");
  div.className = "ead";
  const msg = `Olá ${CONSULTOR}! Tenho interesse no curso EAD de ${c.nome} do Instituto Alfa.`;
  const old = c.antigo ? `<span class="ead__old">de R$ ${c.antigo}</span>` : "";
  div.innerHTML = `
    <h3 class="ead__name">${c.nome}</h3>
    <div class="ead__price">
      ${old}
      <span class="ead__now">R$ ${c.novo}</span>
      <span class="ead__per">em até 10x</span>
    </div>
    <a class="btn btn--wa btn--sm" data-curso="${msg}" href="#">Tenho interesse</a>
  `;
  return div;
}

function montarCards() {
  const gTec = document.getElementById("grid-tecnicos");
  TECNICOS.forEach((c) => gTec.appendChild(cardTecnico(c)));

  const gProf = document.getElementById("grid-profissionais");
  PROFISSIONAIS.forEach((c) => gProf.appendChild(cardProfissional(c)));

  const gEad = document.getElementById("grid-ead");
  EAD.forEach((c) => gEad.appendChild(cardEad(c)));

  const pack = document.getElementById("ead-pack-tags");
  EAD_PACK.forEach((nome) => {
    const s = document.createElement("span");
    s.textContent = nome;
    pack.appendChild(s);
  });
}

/* =========================================================
   ANIMAÇÕES
   ========================================================= */

function ativarReveal() {
  const alvos = document.querySelectorAll(".reveal, .grid");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  alvos.forEach((el) => io.observe(el));
}

function topbarSticky() {
  const bar = document.getElementById("topbar");
  const onScroll = () => bar.classList.toggle("is-stuck", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  montarCards();
  ativarBotoesWhats();   // aplica em todos (estáticos + cards gerados)
  ativarReveal();
  topbarSticky();
});
