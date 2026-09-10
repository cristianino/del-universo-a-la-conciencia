import"./main-DEXYHTVp.js";function V(a){const i=[...a.tramos].sort((l,n)=>n.desde-l.desde),c=i.reduce((l,n)=>l+n.peso,0);let f=0;const m=i.map(l=>{const n=f/c;return f+=l.peso,{...l,inicio:n,fin:f/c}}),h=m[0].desde,o=m[m.length-1].hasta;function r(l){const n=Math.min(h,Math.max(o,l));for(const e of m)if(n<=e.desde&&n>=e.hasta){const b=(e.desde-n)/(e.desde-e.hasta||1);return e.inicio+b*(e.fin-e.inicio)}return n>h?0:1}function p(l){const n=Math.min(1,Math.max(0,l));for(const e of m)if(n>=e.inicio&&n<=e.fin){const b=(n-e.inicio)/(e.fin-e.inicio||1);return e.desde-b*(e.desde-e.hasta)}return o}return{aNormalizado:r,aMya:p,franjas:m,masAntiguo:h,masReciente:o}}function E(a){return a>=1e3?`${(a/1e3).toFixed(a%1e3===0?0:1)} mil M a.`:a>=1?`${Math.round(a)} M a.`:`${Math.round(a*1e3)} mil a.`}const G=["id","mya","titulo","resumen"];async function W(a="./data/timeline.json"){const i=await fetch(a,{cache:"no-cache"});if(!i.ok)throw new Error(`No se pudo cargar la línea de tiempo (${i.status})`);return B(await i.json())}function B(a){const i=V(a.meta.escala),c=new Map(a.eras.map(o=>[o.id,o])),f=new Set,m=a.hitos.map((o,r)=>{for(const l of G)if(o[l]===void 0)throw new Error(`El hito #${r} ("${o.id??"sin id"}") no tiene "${l}"`);if(f.has(o.id))throw new Error(`Id repetido en los datos: "${o.id}"`);f.add(o.id);const p=c.get(o.era);return{...o,detalle:o.detalle??[],claves:o.claves??[],etiquetas:o.etiquetas??[],destacado:!!o.destacado,color:o.color??(p==null?void 0:p.color)??"#3FE0D0",eraNombre:(p==null?void 0:p.nombre)??"",t:i.aNormalizado(o.mya)}}).sort((o,r)=>r.mya-o.mya),h=a.eras.map(o=>({...o,t0:i.aNormalizado(o.desde),t1:i.aNormalizado(o.hasta)}));return{meta:a.meta,eras:h,hitos:m,escala:i}}const Y=240,N=.06;function U(a,i){const{hitos:c,eras:f,meta:m}=i;a.innerHTML=X(m);const h=a.querySelector(".lt__viewport"),o=a.querySelector(".lt__pista"),r=a.querySelector(".lt__lienzo"),p=a.querySelector(".lt__nodos"),l=a.querySelector(".lt__eras"),n=a.querySelector(".lt__panel"),e=r.getContext("2d"),b=Math.max(c.length*Y,1400);o.style.width=`${b}px`;const v=t=>N+t*(1-2*N);l.innerHTML=f.map(t=>{const s=v(t.t0)*100,d=v(t.t1)*100;return`<div class="lt__era" style="--izq:${s}%; --ancho:${d-s}%; --color:${t.color}">
                <span>${t.nombre}</span>
              </div>`}).join(""),p.innerHTML=c.map((t,s)=>{const d=s%2===0?"arriba":"abajo";return`
      <li class="lt__nodo" data-id="${t.id}" data-lado="${d}"
          style="--x:${v(t.t)*100}%; --color:${t.color}">
        <button class="lt__punto ${t.destacado?"es-destacado":""}"
                type="button" aria-expanded="false" aria-controls="tarjeta-${t.id}">
          <span class="solo-lectores">${t.titulo}. ${E(t.mya)}. Ver detalle</span>
        </button>
        <div class="lt__tarjeta" id="tarjeta-${t.id}">
          <p class="lt__edad">${E(t.mya)}</p>
          <h3 class="lt__titulo">${t.titulo}</h3>
          <p class="lt__subtitulo">${t.subtitulo??""}</p>
          <p class="lt__resumen">${t.resumen}</p>
          <p class="lt__pista-accion" aria-hidden="true">Clic para ampliar</p>
        </div>
      </li>`}).join("");const x=[...p.querySelectorAll(".lt__nodo")],H=new Map(c.map(t=>[t.id,t]));let g=null;x.forEach(t=>{const s=t.querySelector(".lt__punto"),d=H.get(t.dataset.id),u=$=>{g=$?d:g===d?null:g,t.classList.toggle("es-activo",$),s.setAttribute("aria-expanded",String($))};t.addEventListener("pointerenter",()=>u(!0)),t.addEventListener("pointerleave",()=>u(!1)),s.addEventListener("focus",()=>{u(!0),t.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"})}),s.addEventListener("blur",()=>u(!1)),s.addEventListener("click",()=>R(d))});function R(t){n.innerHTML=`
      <button class="lt__cerrar" type="button" aria-label="Cerrar detalle">&times;</button>
      <p class="etiqueta">${t.eraNombre} · ${E(t.mya)}</p>
      <h2 id="lt-panel-titulo">${t.titulo}</h2>
      <p class="lt__panel-sub">${t.subtitulo??""}</p>
      ${t.detalle.map(s=>`<p>${s}</p>`).join("")}
      ${t.claves.length?`<h3>Por qué importa</h3><ul class="lt__claves">${t.claves.map(s=>`<li>${s}</li>`).join("")}</ul>`:""}
      ${t.etiquetas.length?`<p class="lt__etiquetas">${t.etiquetas.map(s=>`<span>${s}</span>`).join("")}</p>`:""}
    `,n.hidden=!1,requestAnimationFrame(()=>n.classList.add("es-visible")),n.querySelector(".lt__cerrar").addEventListener("click",P),n.querySelector(".lt__cerrar").focus()}function P(){n.classList.remove("es-visible"),n.hidden=!0}a.addEventListener("keydown",t=>{t.key==="Escape"&&!n.hidden&&P()}),h.addEventListener("wheel",t=>{Math.abs(t.deltaY)<=Math.abs(t.deltaX)||(h.scrollLeft+=t.deltaY,t.preventDefault())},{passive:!1});const A=window.matchMedia("(prefers-reduced-motion: reduce)").matches,T=getComputedStyle(document.documentElement),z=T.getPropertyValue("--c-impulso").trim()||"#3FE0D0",F=T.getPropertyValue("--c-borde").trim()||"#22355C";let _=1;function C(){_=Math.min(window.devicePixelRatio||1,2),r.width=Math.floor(o.clientWidth*_),r.height=Math.floor(o.clientHeight*_),r.style.width=`${o.clientWidth}px`,r.style.height=`${o.clientHeight}px`}function k(t){const s=r.width,d=r.height,u=d/2;e.clearRect(0,0,s,d),e.strokeStyle=F,e.lineWidth=2*_,e.beginPath(),e.moveTo(v(0)*s,u),e.lineTo(v(1)*s,u),e.stroke();const $=A?.35:t/9e3%1,w=v($)*s,M=e.createLinearGradient(w-220*_,0,w+40*_,0);M.addColorStop(0,"rgba(63,224,208,0)"),M.addColorStop(.8,z),M.addColorStop(1,"rgba(63,224,208,0)"),e.strokeStyle=M,e.lineWidth=3*_,e.beginPath(),e.moveTo(Math.max(0,w-220*_),u),e.lineTo(w+40*_,u),e.stroke();for(const y of c){const q=v(y.t)*s,O=g===y,D=A?.5:.5+.5*Math.sin(t/900+y.t*12),I=(O?16:y.destacado?9:6)*_*(.9+D*.2),L=e.createRadialGradient(q,u,0,q,u,I*4);L.addColorStop(0,`${y.color}bb`),L.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=L,e.beginPath(),e.arc(q,u,I*4,0,Math.PI*2),e.fill()}S=requestAnimationFrame(k)}let S=0;return C(),window.addEventListener("resize",()=>{C()},{passive:!0}),S=requestAnimationFrame(k),{irA(t){const s=x.find(d=>d.dataset.id===t);s==null||s.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"})},destruir(){cancelAnimationFrame(S)}}}function X(a){return`
    <div class="lt__cabecera">
      <p class="etiqueta">Línea de tiempo</p>
      <h2>${a.titulo}</h2>
      <p class="tenue">${a.subtitulo}</p>
      <p class="lt__ayuda">Desliza en horizontal. Pasa el cursor o usa el tabulador sobre cada punto para ver su tarjeta, y actívalo para leer el detalle completo.</p>
    </div>
    <div class="lt__viewport">
      <div class="lt__pista">
        <canvas class="lt__lienzo" aria-hidden="true"></canvas>
        <div class="lt__eras" aria-hidden="true"></div>
        <ul class="lt__nodos"></ul>
      </div>
    </div>
    <aside class="lt__panel" role="dialog" aria-labelledby="lt-panel-titulo" hidden></aside>
  `}const j=document.querySelector("#linea-de-tiempo");W().then(a=>{var c;U(j,a);const i=new URLSearchParams(location.hash.slice(1)).get("hito");i&&((c=j.querySelector(`[data-id="${i}"] .lt__punto`))==null||c.focus())}).catch(a=>{console.error(a),j.innerHTML=`<p class="tarjeta">No fue posible cargar la línea de tiempo.
      Comprueba que <code>data/timeline.json</code> esté publicado junto al sitio.</p>`});
