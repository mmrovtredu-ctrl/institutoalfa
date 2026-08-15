/* ============================================================
   ÍCONES DAS ÁREAS — SVG inline, animados por CSS.
   Substituem os emojis: emoji muda de desenho em cada aparelho
   (no iPhone vira aquele brilhante em 3D) e não dá para animar.

   Regras:
   · 24x24, traço em currentColor — herdam a cor do botão,
     inclusive o dourado quando a área está ativa.
   · A animação vive em css/motion.css, nas classes .ic-*.
   · Zero dependência, zero requisição extra.
   ============================================================ */

const svg = (corpo) =>
  `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false">${corpo}</svg>`;

export const ICONES = {
  /* Cursos Técnicos — capelo com a borla balançando */
  tecnicos: svg(`
    <path d="M12 4 2.5 8.6 12 13.2l9.5-4.6L12 4Z"/>
    <path d="M6.2 10.6v4.1c0 1.6 2.6 2.9 5.8 2.9s5.8-1.3 5.8-2.9v-4.1"/>
    <g class="ic-tassel"><path d="M21.5 8.6v4.6"/><circle cx="21.5" cy="14.4" r="1.2"/></g>`),

  /* Saúde e Bem-estar — batimento correndo e coração pulsando */
  saude: svg(`
    <path class="ic-linha" d="M2.5 12.6h3.3l1.7-3.9 2.6 7.6 2-5.1 1.4 3h2.1"/>
    <path class="ic-coracao" d="M18.4 8.3c1.5 0 2.6 1.2 2.6 2.7 0 2.4-3.2 4.4-4.2 5-1-.6-4.2-2.6-4.2-5 0-1.5 1.1-2.7 2.6-2.7.8 0 1.4.4 1.6.8.2-.4.8-.8 1.6-.8Z"/>`),

  /* Beleza e Estética — brilhos piscando fora de compasso */
  beleza: svg(`
    <path class="ic-brilho b1" d="M12 3.2 13.6 8 18.4 9.6 13.6 11.2 12 16 10.4 11.2 5.6 9.6 10.4 8 12 3.2Z"/>
    <path class="ic-brilho b2" d="M18.6 14.2 19.4 16.4 21.6 17.2 19.4 18 18.6 20.2 17.8 18 15.6 17.2 17.8 16.4 18.6 14.2Z"/>
    <path class="ic-brilho b3" d="M5.6 15 6.2 16.6 7.8 17.2 6.2 17.8 5.6 19.4 5 17.8 3.4 17.2 5 16.6 5.6 15Z"/>`),

  /* Informática — monitor com o cursor piscando */
  informatica: svg(`
    <rect x="2.6" y="4.2" width="18.8" height="12.4" rx="2"/>
    <path d="M8.6 20.2h6.8M12 16.6v3.6"/>
    <path d="m7.4 8.4 2.1 2.1-2.1 2.1"/>
    <path class="ic-cursor" d="M11.6 12.6h4.6"/>`),

  /* Administração e Negócios — barras crescendo em sequência */
  negocios: svg(`
    <path d="M3.2 20.4h17.6"/>
    <rect class="ic-barra b1" x="4.6"  y="12.4" width="3.4" height="6"  rx="1"/>
    <rect class="ic-barra b2" x="10.3" y="8.8"  width="3.4" height="9.6" rx="1"/>
    <rect class="ic-barra b3" x="16"   y="5"    width="3.4" height="13.4" rx="1"/>`),

  /* Serviços e Atendimento — campainha tocando */
  servicos: svg(`
    <g class="ic-sino">
      <path d="M17.6 15.4V10.6a5.6 5.6 0 1 0-11.2 0v4.8l-1.5 2.2h14.2l-1.5-2.2Z"/>
    </g>
    <path class="ic-badalo" d="M10.3 18.6a1.9 1.9 0 0 0 3.4 0"/>`),

  /* Industrial e Operacional — engrenagem girando */
  industrial: svg(`
    <g class="ic-engrenagem">
      <path d="M12.2 2.2h-.4a1.9 1.9 0 0 0-1.9 1.9v.2a1.9 1.9 0 0 1-.9 1.6l-.4.2a1.9 1.9 0 0 1-1.9 0l-.2-.1a1.9 1.9 0 0 0-2.6.7l-.2.4a1.9 1.9 0 0 0 .7 2.6l.2.1a1.9 1.9 0 0 1 .9 1.6v.5a1.9 1.9 0 0 1-.9 1.6l-.2.1a1.9 1.9 0 0 0-.7 2.6l.2.4a1.9 1.9 0 0 0 2.6.7l.2-.1a1.9 1.9 0 0 1 1.9 0l.4.2a1.9 1.9 0 0 1 .9 1.6v.2a1.9 1.9 0 0 0 1.9 1.9h.4a1.9 1.9 0 0 0 1.9-1.9v-.2a1.9 1.9 0 0 1 .9-1.6l.4-.2a1.9 1.9 0 0 1 1.9 0l.2.1a1.9 1.9 0 0 0 2.6-.7l.2-.4a1.9 1.9 0 0 0-.7-2.6l-.2-.1a1.9 1.9 0 0 1-.9-1.6v-.5a1.9 1.9 0 0 1 .9-1.6l.2-.1a1.9 1.9 0 0 0 .7-2.6l-.2-.4a1.9 1.9 0 0 0-2.6-.7l-.2.1a1.9 1.9 0 0 1-1.9 0l-.4-.2a1.9 1.9 0 0 1-.9-1.6v-.2a1.9 1.9 0 0 0-1.9-1.9Z"/>
      <circle cx="12" cy="12" r="2.7"/>
    </g>`),

  /* Educação e Preparatórios — livro com a página virando */
  educacao: svg(`
    <path d="M3 5.2v13c0 0 2.4-1.4 4.6-1.4 2.1 0 4.4 1.4 4.4 1.4V5.2S9.7 3.8 7.6 3.8C5.4 3.8 3 5.2 3 5.2Z"/>
    <path class="ic-pagina" d="M12 5.2v13s2.3-1.4 4.4-1.4c2.2 0 4.6 1.4 4.6 1.4v-13s-2.4-1.4-4.6-1.4c-2.1 0-4.4 1.4-4.4 1.4Z"/>`),

  /* Idiomas — conversa com os pontinhos digitando */
  idiomas: svg(`
    <path d="M20.4 12.5c0 3.4-3.4 6.1-7.6 6.1-.9 0-1.7-.1-2.5-.3L5.6 20.4l1.1-3.2c-1.4-1.1-2.3-2.7-2.3-4.7 0-3.4 3.4-6.1 7.6-6.1s8.4 2.7 8.4 6.1Z"/>
    <circle class="ic-ponto p1" cx="8.9"  cy="12.4" r="1"/>
    <circle class="ic-ponto p2" cx="12.4" cy="12.4" r="1"/>
    <circle class="ic-ponto p3" cx="15.9" cy="12.4" r="1"/>`),
};

/** Ícone da área. Cai num genérico se a área for nova e ainda não tiver desenho. */
export const icone = (id) => ICONES[id] || ICONES.tecnicos;

/* ============================================================
   ÍCONES MIÚDOS — os que substituem os emojis soltos pela
   página (selos, dados do curso, rodapé).
   Mesma regra: traço em currentColor, 1em, alinhado ao texto.
   ============================================================ */
const mini = (corpo) =>
  `<svg class="ic-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false">${corpo}</svg>`;

export const MINI = {
  relogio: mini(`<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3 1.8"/>`),

  local: mini(`<path d="M12 21.4s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/>
               <circle cx="12" cy="10.2" r="2.5"/>`),

  certificado: mini(`<path d="M6 3.4h9.2L19 7.2v9.4a1.6 1.6 0 0 1-1.6 1.6H6a1.6 1.6 0 0 1-1.6-1.6V5a1.6 1.6 0 0 1 1.6-1.6Z"/>
                     <path d="M14.8 3.6v3.8H18.8"/><path d="m9.2 20.6 2.3-1.6 2.3 1.6v-2.4H9.2v2.4Z"/>`),

  professor: mini(`<circle cx="12" cy="8" r="3.4"/>
                   <path d="M4.8 20.4a7.2 7.2 0 0 1 14.4 0"/>`),

  turno: mini(`<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.4 1.4"/>`),

  idade: mini(`<circle cx="12" cy="7.6" r="3.2"/>
               <path d="M5.4 20.4a6.6 6.6 0 0 1 13.2 0"/>`),

  capelo: mini(`<path d="M12 4.4 3.4 8.6 12 12.8l8.6-4.2L12 4.4Z"/>
                <path d="M6.8 10.4v3.8c0 1.4 2.3 2.6 5.2 2.6s5.2-1.2 5.2-2.6v-3.8"/>`),

  estrela: mini(`<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.6Z"/>`),

  faisca: mini(`<path d="M12 3.4 13.7 8.3 18.6 10 13.7 11.7 12 16.6 10.3 11.7 5.4 10 10.3 8.3 12 3.4Z"/>
                <path d="M18.4 14.4 19 16.2 20.8 16.8 19 17.4 18.4 19.2 17.8 17.4 16 16.8 17.8 16.2 18.4 14.4Z"/>`),

  telefone: mini(`<path d="M20.4 16.9v2.6a1.8 1.8 0 0 1-1.9 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 2.8 5.5 1.8 1.8 0 0 1 4.6 3.6h2.6a1.8 1.8 0 0 1 1.8 1.6c.1.9.3 1.7.7 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14.4 14.4 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.6 2.5.7a1.8 1.8 0 0 1 1.4 1.8Z"/>`),

  aceno: mini(`<path d="M9.4 12.6V5.9a1.5 1.5 0 1 1 3 0v5.2"/>
               <path d="M12.4 11.1V4.9a1.5 1.5 0 1 1 3 0v6.2"/>
               <path d="M15.4 11.6V7.4a1.5 1.5 0 1 1 3 0v6.4c0 3.7-2.6 6.6-6.2 6.6s-6-2.3-6.6-5.4L5 11.6a1.5 1.5 0 0 1 2.7-1.2l1.2 2.2"/>`),
};

/* Check que se desenha sozinho — usado na tela de "cadastro feito". */
export const CHECK_OK = `
  <svg class="ic-ok" viewBox="0 0 52 52" fill="none" stroke="currentColor"
       stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle class="ok-circulo" cx="26" cy="26" r="22"/>
    <path class="ok-risco" d="M15.5 27.2 22.6 34.2 36.8 19.4"/>
  </svg>`;
