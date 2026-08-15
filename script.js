const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* NAV scrolled */
const nav = document.getElementById('nav');
addEventListener('scroll', ()=>{ nav.classList.toggle('scrolled', scrollY > 40); }, {passive:true});

/* REVEAL on scroll */
const io = new IntersectionObserver((es)=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.16, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* COUNT UP */
const cu = new IntersectionObserver((es)=>{
  es.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target, end=+el.dataset.count, suf=el.dataset.suffix||'';
    const dur=1400, t0=performance.now();
    const fmt=n=>n>=1000?n.toLocaleString('pt-BR'):n;
    const step=(t)=>{ const p=Math.min(1,(t-t0)/dur); const v=Math.round((1-Math.pow(1-p,3))*end);
      el.textContent=fmt(v)+suf; if(p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step); cu.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cu.observe(el));

/* PARALLAX (hero + feature/level imgs + nature) */
const heroBg=document.getElementById('heroBg');
const natureBg=document.getElementById('natureBg');
const pars=[...document.querySelectorAll('[data-par]')];
let ticking=false;
function parallax(){
  const y=scrollY, vh=innerHeight;
  if(heroBg) heroBg.style.transform=`translate3d(0,${y*0.32}px,0)`;
  if(natureBg){ const r=natureBg.parentElement.getBoundingClientRect();
    const off=(r.top - vh)* -0.12; natureBg.style.transform=`translate3d(0,${off}px,0)`; }
  pars.forEach(p=>{ const r=p.getBoundingClientRect();
    if(r.bottom<0||r.top>vh) return;
    const c=(r.top + r.height/2 - vh/2)/vh;
    p.style.transform=`translate3d(0,${c*-26}px,0)`; });
  ticking=false;
}
if(!reduce){ addEventListener('scroll',()=>{ if(!ticking){requestAnimationFrame(parallax);ticking=true;} },{passive:true});
  addEventListener('resize',parallax); parallax(); }

/* 3D TILT CARDS — mouse on desktop, scroll-driven on touch */
if(!reduce){
  const fine = matchMedia('(pointer:fine)').matches;
  if(fine){
    document.querySelectorAll('[data-tilt]').forEach(card=>{
      const strength=8;
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`rotateY(${px*strength}deg) rotateX(${-py*strength}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave',()=>{ card.style.transform='rotateY(0) rotateX(0)'; });
    });
  } else {
    /* touch: subtle continuous 3D tilt as the card moves through the viewport */
    const tcards=[...document.querySelectorAll('[data-tilt]')];
    tcards.forEach(c=>c.style.transition='transform .25s linear');
    let tk=false;
    function stilt(){
      const vh=innerHeight;
      tcards.forEach(c=>{
        const r=c.getBoundingClientRect();
        if(r.bottom<-40||r.top>vh+40) return;
        const center=(r.top+r.height/2-vh/2)/vh;          // -0.5 .. 0.5
        const rx=Math.max(-5,Math.min(5,-center*7));
        c.style.transform=`rotateX(${rx}deg) translateZ(0)`;
      });
      tk=false;
    }
    addEventListener('scroll',()=>{ if(!tk){requestAnimationFrame(stilt);tk=true;} },{passive:true});
    addEventListener('resize',stilt); stilt();
  }
}

/* LIGHTBOX */
const lb=document.getElementById('lb'), lbImg=document.getElementById('lbImg');
document.getElementById('grid').addEventListener('click',e=>{
  const img=e.target.closest('.gitem img'); if(!img) return;
  lbImg.src=img.src; lbImg.alt=img.alt; lb.classList.add('open');
});
lb.addEventListener('click',()=>lb.classList.remove('open'));
addEventListener('keydown',e=>{ if(e.key==='Escape') lb.classList.remove('open'); });

/* GOD-RAY DUST MOTES (Three.js, graceful) */
(function(){
  if(reduce || typeof THREE==='undefined') return;
  const canvas=document.getElementById('godrays');
  const hero=document.getElementById('top');
  let renderer,scene,camera,points,raf;
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  }catch(err){ return; }
  const size=()=>{ const w=hero.clientWidth,h=hero.clientHeight; renderer.setSize(w,h,false);
    camera.aspect=w/h; camera.updateProjectionMatrix(); };
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(60, hero.clientWidth/hero.clientHeight, .1, 100);
  camera.position.z=14;

  const N = innerWidth<680 ? 180 : 340;
  const geo=new THREE.BufferGeometry();
  const pos=new Float32Array(N*3), spd=new Float32Array(N);
  for(let i=0;i<N;i++){
    pos[i*3]=(Math.random()-.5)*34;
    pos[i*3+1]=(Math.random()-.5)*22;
    pos[i*3+2]=(Math.random()-.5)*16;
    spd[i]=.002+Math.random()*.006;
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:0xf0c778,size:.12,transparent:true,opacity:.65,
    blending:THREE.AdditiveBlending,depthWrite:false});
  points=new THREE.Points(geo,mat); scene.add(points);
  size();

  let mx=0,my=0;
  addEventListener('mousemove',e=>{ mx=(e.clientX/innerWidth-.5); my=(e.clientY/innerHeight-.5); },{passive:true});
  addEventListener('resize',size);

  const clock=new THREE.Clock();
  function tick(){
    raf=requestAnimationFrame(tick);
    const p=geo.attributes.position.array, t=clock.getElapsedTime();
    for(let i=0;i<N;i++){
      p[i*3+1]+= spd[i]*10;                    // drift up
      p[i*3]  += Math.sin(t*0.4+i)*0.004;      // sway
      if(p[i*3+1]>11){ p[i*3+1]=-11; p[i*3]=(Math.random()-.5)*34; }
    }
    geo.attributes.position.needsUpdate=true;
    points.rotation.y += 0.0006;
    camera.position.x += (mx*3 - camera.position.x)*0.04;
    camera.position.y += (-my*2 - camera.position.y)*0.04;
    camera.lookAt(scene.position);
    renderer.render(scene,camera);
  }
  tick();

  /* pause when hero off-screen */
  new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting && !raf) tick(); else if(!e.isIntersecting && raf){ cancelAnimationFrame(raf); raf=null; } });
  },{threshold:0}).observe(hero);
})();
