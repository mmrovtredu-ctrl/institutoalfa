/* ============================================================
   INSTITUTO ALFA — script.js
   - Lista de cursos (com modalidade Presencial / EAD)
   - Filtro por modalidade
   - Botões de WhatsApp com mensagem pronta
   - Animações de revelar ao rolar + contadores
   ============================================================ */

/* ---- WhatsApp ---- */
const WA_NUMBER = "5598985843807"; // (98) 98584-3807

function waLink(curso){
  const msg =
    "Olá, Instituto Alfa! 👋\n\n" +
    "Tenho interesse em: *" + curso + "*.\n" +
    "Poderiam me passar mais informações?\n\n" +
    "_EU QUERO SER ALFA_ 🎯";
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
}

function bindWA(){
  document.querySelectorAll('a.wa, button.wa').forEach(function(el){
    if(el.dataset.bound) return;
    el.dataset.bound = "1";
    const curso = el.dataset.curso || "Quero informações sobre os cursos";
    el.setAttribute('href', waLink(curso));
    el.setAttribute('target','_blank');
    el.setAttribute('rel','noopener');
  });
}

/* ---- Dados dos cursos (extraídos das imagens do Instituto Alfa) ----
   modalidade: "presencial" ou "ead"
   Ajuste livremente a modalidade/preço de qualquer curso aqui. */
const COURSES = [
  {
    name:"Técnico em Enfermagem", area:"Curso Técnico", modalidade:"presencial",
    meta:"Alta empregabilidade na área da saúde.",
    old:"R$ 250,00", price:"R$ 197,00", unit:"/mês", hot:true
  },
  {
    name:"Técnico em Estética", area:"Curso Técnico", modalidade:"presencial",
    meta:"Construa sua carreira na estética. Em Barreirinhas.",
    old:"R$ 250,00", price:"R$ 197,00", unit:"/mês", hot:true
  },
  {
    name:"Técnico em Radiologia", area:"Curso Técnico", modalidade:"presencial",
    meta:"Formação técnica para o setor de diagnóstico por imagem.",
    old:"R$ 250,00", price:"R$ 197,00", unit:"/mês", hot:true
  },
  {
    name:"Técnico em Farmácia", area:"Curso Técnico", modalidade:"presencial",
    meta:"Atuação em farmácias, drogarias e distribuidoras.",
    old:"R$ 250,00", price:"R$ 197,00", unit:"/mês", hot:true
  },
  {
    name:"Técnico em Saúde Bucal", area:"Curso Técnico", modalidade:"presencial",
    meta:"Auxílio e atuação em consultórios odontológicos.",
    consult:true
  },
  {
    name:"Agente de Saúde — ACS e ACE", area:"Profissionalizante", modalidade:"presencial",
    meta:"Agente Comunitário de Saúde (ACS) e Combate às Endemias (ACE).",
    old:"R$ 180,00", price:"R$ 140,00", unit:"/mês"
  },
  {
    name:"Informática Básico e Avançado", area:"Profissionalizante", modalidade:"presencial",
    meta:"Do zero ao avançado. Presencial + 12 cursos online (EAD) de bônus.",
    old:"R$ 180,00", price:"R$ 119,99", unit:"/mês", hot:true
  },
  {
    name:"Informática Infantil", area:"Profissionalizante", modalidade:"presencial",
    meta:"Tecnologia e lógica para crianças, de forma lúdica.",
    consult:true
  },
  {
    name:"Pacote 12 Cursos Online", area:"Bônus EAD", modalidade:"ead",
    meta:"12 cursos online liberados gratuitamente com a matrícula da Informática.",
    free:"Grátis", freeNote:"com a Informática"
  },
  {
    name:"Profissionalizante — Área Comercial", area:"Profissionalizante", modalidade:"ead",
    meta:"Vendas, atendimento e rotinas comerciais — estude online.",
    consult:true
  },
  {
    name:"Profissionalizante — Área do Turismo", area:"Profissionalizante", modalidade:"ead",
    meta:"Capacitação para o setor de turismo e hospitalidade.",
    consult:true
  },
  {
    name:"Profissionalizante — Área Digital", area:"Profissionalizante", modalidade:"ead",
    meta:"Habilidades digitais para o mercado de hoje.",
    consult:true
  }
];

/* ---- WhatsApp SVG (reaproveitado nos cards) ---- */
const WA_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#04210f" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.04c-.24.68-1.42 1.31-1.95 1.35-.5.05-.96.23-3.23-.67-2.73-1.08-4.46-3.86-4.6-4.04-.13-.18-1.09-1.45-1.09-2.77 0-1.31.69-1.96.93-2.23.24-.27.53-.34.71-.34l.5.01c.16.01.38-.06.59.45.24.58.81 2 .88 2.14.07.14.12.31.02.49-.09.18-.14.29-.27.45l-.41.48c-.13.13-.27.28-.12.55.16.27.69 1.14 1.49 1.85 1.02.91 1.88 1.19 2.15 1.32.27.14.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.6.76 1.87.9.27.13.45.2.51.31.07.11.07.63-.17 1.31z"/></svg>';

function modalityLabel(m){
  return m === "ead"
    ? '<span class="modality ead">EAD / Online</span>'
    : '<span class="modality presencial">Presencial</span>';
}

function priceBlock(c){
  if(c.free){
    return '<div class="free">' + c.free + '</div><span class="old" style="text-decoration:none">' + (c.freeNote||"") + '</span>';
  }
  if(c.consult){
    return '<div class="consult">Consulte os valores</div>';
  }
  return (c.old ? '<span class="old">de ' + c.old + '</span>' : '') +
         '<div class="new"><b>' + c.price + '</b><span class="unit">' + (c.unit||"") + '</span></div>';
}

function courseCard(c, i){
  const ribbon = c.hot ? '<div class="ribbon">Promoção</div>' : '';
  const waMsg = c.name + (c.modalidade === "ead" ? " (EAD)" : " (Presencial)");
  return '<article class="card" style="animation-delay:' + (i*60) + 'ms">' +
      ribbon +
      '<div class="card-top">' +
        '<span class="cat">' + c.area + '</span>' +
        modalityLabel(c.modalidade) +
      '</div>' +
      '<h3>' + c.name + '</h3>' +
      '<p class="meta">' + c.meta + '</p>' +
      '<div class="price-block">' + priceBlock(c) + '</div>' +
      '<a class="btn btn-wa btn-sm wa" data-curso="' + waMsg + '" href="#">' +
        WA_SVG + 'Tenho interesse' +
      '</a>' +
    '</article>';
}

const grid = document.getElementById('courseGrid');

function render(filter){
  const list = (filter === "all")
    ? COURSES
    : COURSES.filter(function(c){ return c.modalidade === filter; });

  if(list.length === 0){
    grid.innerHTML = '<p class="modal-note" style="grid-column:1/-1">Nenhum curso nesta modalidade no momento.</p>';
  } else {
    grid.innerHTML = list.map(courseCard).join("");
  }
  bindWA();
}

/* render inicial — cards aparecem imediatamente */
render("all");

/* filtros de modalidade */
document.querySelectorAll('#modalTabs .tab').forEach(function(tab){
  tab.addEventListener('click', function(){
    document.querySelectorAll('#modalTabs .tab').forEach(function(t){
      t.classList.remove('active');
      t.setAttribute('aria-selected','false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    render(tab.dataset.filter);
  });
});

/* ---- Scroll reveal (com fallback de segurança) ---- */
function setupReveals(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
  els.forEach(function(el){ io.observe(el); });

  /* segurança: revela tudo após 1.5s caso algo não dispare */
  setTimeout(function(){ els.forEach(function(el){ el.classList.add('in'); }); }, 1500);
}
setupReveals();

/* ---- Contadores ---- */
(function(){
  const nums = document.querySelectorAll('[data-count]');
  if(!('IntersectionObserver' in window)){ return; }
  const seen = new WeakSet();
  const cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && !seen.has(e.target)){
        seen.add(e.target);
        const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || "";
        let n = 0; const step = Math.max(1, Math.ceil(target/40));
        const t = setInterval(function(){
          n += step; if(n >= target){ n = target; clearInterval(t); }
          el.textContent = n + suffix;
        }, 28);
      }
    });
  }, {threshold:.5});
  nums.forEach(function(el){ cio.observe(el); });
})();

/* ---- Header com sombra ao rolar ---- */
(function(){
  const header = document.getElementById('top');
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 10); }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();

/* ---- Ano no rodapé + WhatsApp ---- */
document.getElementById('yr').textContent = new Date().getFullYear();
bindWA();
