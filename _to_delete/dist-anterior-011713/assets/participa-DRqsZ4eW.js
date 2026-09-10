import"./main-DEXYHTVp.js";/* empty css                */const i={correo:"cristiandavid113@gmail.com"};function c(o,e,t){const r=o.querySelector(".aviso");r&&(r.textContent=e,r.dataset.estado=t,r.hidden=!1)}function a(o){const e=Object.entries(o).map(([t,r])=>`${t}: ${r}`).join(`
`);return`mailto:${i.correo}?subject=${encodeURIComponent(o._asunto??"Mensaje desde el sitio")}&body=${encodeURIComponent(e)}`}function s(o,e){const t=document.querySelector(o);t&&t.addEventListener("submit",async r=>{r.preventDefault();const n=Object.fromEntries(new FormData(t).entries());n._asunto=e,t.querySelector('[type="submit"]').textContent;{c(t,"Abriendo tu gestor de correo…","ok"),window.location.href=a(n);return}})}function d(o){const e=document.querySelector(o);if(e){e.innerHTML=`
      <div class="tarjeta">
        <h3>Foro en preparación</h3>
        <p>El hilo público de discusión se abrirá en las Discussions del
        repositorio del proyecto. Mientras tanto puedes escribir por el
        formulario de esta misma página.</p>
        
      </div>`;return}}s("#form-contacto","Mensaje desde el sitio del cerebro");s("#form-encuesta","Encuesta del sitio del cerebro");d("#foro");document.querySelectorAll("[data-repo-enlace]").forEach(o=>{var e;(e=o.closest("[data-repo-bloque]"))==null||e.classList.add("tenue")});
