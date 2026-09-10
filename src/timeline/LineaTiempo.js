/**
 * Línea de tiempo interactiva.
 *
 * Reparto de responsabilidades:
 *  - El canvas dibuja lo que debe estar vivo: el eje, las auras de cada hito y
 *    un impulso que recorre la línea.
 *  - El DOM sostiene lo que debe ser legible y accesible: los puntos son
 *    botones reales, así que el teclado, el lector de pantalla y el scroll
 *    táctil funcionan sin código adicional.
 *
 * Cada hito declara además su registro epistémico (conocimiento establecido,
 * hipótesis en discusión o interpretación filosófica). El registro se codifica
 * por forma —no por color, que ya lo usa la era— y puede filtrarse.
 */

import { formatearEdad, etiquetaEdad } from './escala.js';

const ANCHO_POR_HITO = 265;   // px de pista reservados a cada hito
const MARGEN_PISTA = 0.05;    // 5 % libre a cada lado
const DPR_MAXIMO = 1.5;       // la pista es muy ancha: limita el tamaño del canvas

export function montarLineaDeTiempo(raiz, datos) {
  const { hitos, eras, meta, registros } = datos;

  raiz.innerHTML = plantilla(meta, registros, hitos);
  const viewport = raiz.querySelector('.lt__viewport');
  const pista = raiz.querySelector('.lt__pista');
  const lienzo = raiz.querySelector('.lt__lienzo');
  const listaNodos = raiz.querySelector('.lt__nodos');
  const capaEras = raiz.querySelector('.lt__eras');
  const panel = raiz.querySelector('.lt__panel');
  const ctx = lienzo.getContext('2d');

  // El panel y su velo se cuelgan del body: dentro del contenedor quedarían
  // por debajo de la barra de navegación, que crea su propio apilamiento.
  const velo = document.createElement('div');
  velo.className = 'lt__velo';
  velo.hidden = true;
  document.body.append(velo, panel);

  const anchoPista = Math.max(hitos.length * ANCHO_POR_HITO, 1400);
  pista.style.width = `${anchoPista}px`;

  // posición horizontal de un t normalizado, con margen a los lados
  const posicion = (t) => MARGEN_PISTA + t * (1 - 2 * MARGEN_PISTA);

  // --- bandas de era ----------------------------------------
  capaEras.innerHTML = eras
    .map((e) => {
      const izq = posicion(e.t0) * 100;
      const der = posicion(e.t1) * 100;
      return `<div class="lt__era" style="--izq:${izq}%; --ancho:${der - izq}%; --color:${e.color}">
                <span>${e.nombre}</span>
              </div>`;
    })
    .join('');

  // --- nodos ------------------------------------------------
  listaNodos.innerHTML = hitos
    .map((h, i) => {
      const lado = i % 2 === 0 ? 'arriba' : 'abajo';
      return `
      <li class="lt__nodo" data-id="${h.id}" data-lado="${lado}" data-registro="${h.registro}"
          style="--x:${posicion(h.t) * 100}%; --color:${h.color}">
        <button class="lt__punto ${h.destacado ? 'es-destacado' : ''}"
                type="button" aria-expanded="false" aria-controls="tarjeta-${h.id}">
          <span class="solo-lectores">${h.titulo}. ${etiquetaEdad(h.mya)}. Ver detalle</span>
        </button>
        <div class="lt__tarjeta" id="tarjeta-${h.id}">
          <p class="lt__edad">${etiquetaEdad(h.mya)}</p>
          <h3 class="lt__titulo">${h.titulo}</h3>
          <p class="lt__kicker">${h.subtitulo ?? ''}</p>
          ${h.aporta ? `<p class="lt__aporta"><span>Nivel nuevo</span>${h.aporta}</p>` : ''}
          <p class="lt__resumen">${h.resumen}</p>
          <p class="lt__pista-accion" aria-hidden="true">Clic para ampliar</p>
        </div>
      </li>`;
    })
    .join('');

  const nodos = [...listaNodos.querySelectorAll('.lt__nodo')];
  const porId = new Map(hitos.map((h) => [h.id, h]));
  let activo = null;   // hito bajo el puntero o el foco

  nodos.forEach((nodo) => {
    const boton = nodo.querySelector('.lt__punto');
    const hito = porId.get(nodo.dataset.id);

    const marcar = (on) => {
      activo = on ? hito : activo === hito ? null : activo;
      nodo.classList.toggle('es-activo', on);
      boton.setAttribute('aria-expanded', String(on));
    };

    nodo.addEventListener('pointerenter', () => marcar(true));
    nodo.addEventListener('pointerleave', () => marcar(false));
    boton.addEventListener('focus', () => {
      marcar(true);
      nodo.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
    boton.addEventListener('blur', () => marcar(false));
    boton.addEventListener('click', () => abrirPanel(hito));
  });

  // --- filtro por registro ----------------------------------
  // Los hitos filtrados se atenúan en lugar de desaparecer: así el eje conserva
  // su forma y se ve cuánto del relato pertenece a cada registro.
  const activos = new Set(Object.keys(registros));

  raiz.querySelectorAll('.lt__filtro').forEach((boton) => {
    boton.addEventListener('click', () => {
      const clave = boton.dataset.registro;
      if (activos.has(clave)) activos.delete(clave);
      else activos.add(clave);
      boton.setAttribute('aria-pressed', String(activos.has(clave)));
      nodos.forEach((n) => {
        n.dataset.atenuado = String(!activos.has(n.dataset.registro));
      });
    });
  });

  // --- panel de detalle -------------------------------------
  function abrirPanel(hito) {
    const reg = hito.infoRegistro;
    panel.innerHTML = `
      <button class="lt__cerrar" type="button" aria-label="Cerrar detalle">&times;</button>
      <p class="etiqueta">${hito.eraNombre} · ${etiquetaEdad(hito.mya)}</p>
      <h2 id="lt-panel-titulo">${hito.titulo}</h2>
      <p class="lt__panel-sub">${hito.subtitulo ?? ''}</p>
      ${reg ? `<p class="lt__registro" data-registro="${hito.registro}">
                 <span class="lt__marca"></span>
                 <span><strong>${reg.nombre}.</strong> ${reg.descripcion}</span>
               </p>` : ''}
      ${hito.aporta ? `<p class="lt__aporta lt__aporta--panel"><span>Nivel nuevo</span>${hito.aporta}</p>` : ''}
      ${hito.detalle.map((p) => `<p>${p}</p>`).join('')}
      ${hito.claves.length ? `<h3>Por qué importa</h3><ul class="lt__claves">${hito.claves.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}
      ${hito.fuentes.length ? `<h3>Referencias</h3><ul class="lt__fuentes">${hito.fuentes.map((f) => `<li>${f.url ? `<a href="${f.url}" target="_blank" rel="noopener">${f.texto}</a>` : f.texto}</li>`).join('')}</ul>` : ''}
      ${hito.etiquetas.length ? `<p class="lt__etiquetas">${hito.etiquetas.map((e) => `<span>${e}</span>`).join('')}</p>` : ''}
    `;
    panel.hidden = false;
    velo.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add('es-visible');
      velo.classList.add('es-visible');
    });
    panel.querySelector('.lt__cerrar').addEventListener('click', cerrarPanel);
    panel.querySelector('.lt__cerrar').focus();
  }

  function cerrarPanel() {
    panel.classList.remove('es-visible');
    velo.classList.remove('es-visible');
    velo.hidden = true;
    setTimeout(() => { panel.hidden = true; }, 320);
  }

  velo.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) cerrarPanel();
  });

  // La rueda vertical desplaza la línea en horizontal: el gesto natural
  // sobre una pista que corre de izquierda a derecha.
  viewport.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    viewport.scrollLeft += e.deltaY;
    e.preventDefault();
  }, { passive: false });

  // --- dibujo del canvas ------------------------------------
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const estilo = getComputedStyle(document.documentElement);
  const cImpulso = estilo.getPropertyValue('--c-impulso').trim() || '#3FE0D0';
  const cBorde = estilo.getPropertyValue('--c-borde').trim() || '#22355C';
  let dpr = 1;

  function redimensionar() {
    dpr = Math.min(window.devicePixelRatio || 1, DPR_MAXIMO);
    lienzo.width = Math.floor(pista.clientWidth * dpr);
    lienzo.height = Math.floor(pista.clientHeight * dpr);
    lienzo.style.width = `${pista.clientWidth}px`;
    lienzo.style.height = `${pista.clientHeight}px`;
  }

  function dibujar(ahora) {
    const w = lienzo.width;
    const h = lienzo.height;
    const y = h / 2;
    ctx.clearRect(0, 0, w, h);

    // eje base
    ctx.strokeStyle = cBorde;
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.moveTo(posicion(0) * w, y);
    ctx.lineTo(posicion(1) * w, y);
    ctx.stroke();

    // impulso que recorre el eje, como un potencial de acción en tránsito
    const ciclo = sinMovimiento ? 0.35 : ((ahora / 11000) % 1);
    const xImpulso = posicion(ciclo) * w;
    const grad = ctx.createLinearGradient(xImpulso - 220 * dpr, 0, xImpulso + 40 * dpr, 0);
    grad.addColorStop(0, 'rgba(63,224,208,0)');
    grad.addColorStop(0.8, cImpulso);
    grad.addColorStop(1, 'rgba(63,224,208,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3 * dpr;
    ctx.beginPath();
    ctx.moveTo(Math.max(0, xImpulso - 220 * dpr), y);
    ctx.lineTo(xImpulso + 40 * dpr, y);
    ctx.stroke();

    // auras de cada hito
    for (const hito of hitos) {
      const atenuado = !activos.has(hito.registro);
      const x = posicion(hito.t) * w;
      const esActivo = activo === hito;
      const pulso = sinMovimiento ? 0.5 : 0.5 + 0.5 * Math.sin(ahora / 900 + hito.t * 12);
      const r = (esActivo ? 15 : hito.destacado ? 9 : 6) * dpr * (0.9 + pulso * 0.2);
      const opacidad = atenuado ? '22' : 'bb';

      const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      halo.addColorStop(0, `${hito.color}${opacidad}`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, r * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    anim = requestAnimationFrame(dibujar);
  }

  let anim = 0;
  redimensionar();
  window.addEventListener('resize', () => { redimensionar(); }, { passive: true });
  anim = requestAnimationFrame(dibujar);

  return {
    irA(id) {
      const nodo = nodos.find((n) => n.dataset.id === id);
      nodo?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    },
    destruir() { cancelAnimationFrame(anim); },
  };
}

function plantilla(meta, registros, hitos) {
  const cuenta = (clave) => hitos.filter((h) => h.registro === clave).length;

  const filtros = Object.entries(registros)
    .map(([clave, r]) => `
      <button class="lt__filtro" type="button" data-registro="${clave}" aria-pressed="true"
              title="${r.descripcion}">
        <span class="lt__marca"></span>
        ${r.nombre}
        <span class="lt__cuenta">${cuenta(clave)}</span>
      </button>`)
    .join('');

  return `
    <div class="lt__cabecera">
      <p class="etiqueta">Línea de tiempo</p>
      <h2>${meta.titulo}</h2>
      <p class="lt__entrada">${meta.subtitulo}</p>
      <div class="lt__controles">
        <p class="lt__ayuda">Desliza en horizontal. Pasa el cursor o usa el tabulador sobre cada
        punto para ver su tarjeta, y actívalo para leer el detalle completo.</p>

        <div class="lt__filtros" role="group" aria-label="Filtrar por registro">
          <p class="lt__filtros-titulo">Tres registros distintos. Pulsa uno para atenuarlo:</p>
          <div class="lt__filtros-lista">${filtros}</div>
        </div>
      </div>
    </div>
    <div class="lt__viewport">
      <div class="lt__pista">
        <canvas class="lt__lienzo" aria-hidden="true"></canvas>
        <div class="lt__eras" aria-hidden="true"></div>
        <ul class="lt__nodos"></ul>
      </div>
    </div>
    <aside class="lt__panel" role="dialog" aria-labelledby="lt-panel-titulo" hidden></aside>
  `;
}
