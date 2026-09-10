/**
 * Fondo animado en WebGL.
 *
 * Un único cuadrilátero que cubre la pantalla y un fragment shader que dibuja
 * un campo de filamentos y chispas. Los colores no se escriben aquí: se leen
 * de las variables CSS del sistema de diseño, de modo que cambiar la paleta en
 * tokens.css cambia también el fondo.
 */

import fuenteVert from './shaders/fondo.vert?raw';
import fuenteFrag from './shaders/fondo.frag?raw';

function compilar(gl, tipo, fuente) {
  const sh = gl.createShader(tipo);
  gl.shaderSource(sh, fuente);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Error al compilar el shader: ${error}`);
  }
  return sh;
}

/** "#3FE0D0" -> [0.247, 0.878, 0.816] */
export function hexAVec3(hex) {
  const h = hex.trim().replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(n.slice(0, 2), 16) / 255,
    parseInt(n.slice(2, 4), 16) / 255,
    parseInt(n.slice(4, 6), 16) / 255,
  ];
}

function tokenColor(nombre, respaldo) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(nombre);
  return hexAVec3(v || respaldo);
}

export function iniciarFondo(canvas, opciones = {}) {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    powerPreference: 'low-power',
  });

  // Sin WebGL el sitio sigue funcionando: solo queda el color de fondo plano.
  if (!gl) {
    canvas.style.display = 'none';
    return { destruir() {} };
  }

  const programa = gl.createProgram();
  gl.attachShader(programa, compilar(gl, gl.VERTEX_SHADER, fuenteVert));
  gl.attachShader(programa, compilar(gl, gl.FRAGMENT_SHADER, fuenteFrag));
  gl.linkProgram(programa);
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
    throw new Error(`Error al enlazar el programa: ${gl.getProgramInfoLog(programa)}`);
  }
  gl.useProgram(programa);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(programa, 'a_posicion');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (n) => gl.getUniformLocation(programa, n);
  const uni = {
    res: u('u_res'), tiempo: u('u_tiempo'), puntero: u('u_puntero'),
    intensidad: u('u_intensidad'), cFondo: u('u_cFondo'),
    cImpulso: u('u_cImpulso'), cSinapsis: u('u_cSinapsis'),
  };

  gl.uniform3fv(uni.cFondo, tokenColor('--c-abismo', '#070B14'));
  gl.uniform3fv(uni.cImpulso, tokenColor('--c-impulso', '#3FE0D0'));
  gl.uniform3fv(uni.cSinapsis, tokenColor('--c-sinapsis', '#F25F9E'));
  gl.uniform1f(uni.intensidad, opciones.intensidad ?? 1);

  const puntero = { x: 0.5, y: 0.5 };
  let objetivo = { x: 0.5, y: 0.5 };
  const alMover = (e) => {
    objetivo.x = e.clientX / window.innerWidth;
    objetivo.y = 1 - e.clientY / window.innerHeight;
  };
  window.addEventListener('pointermove', alMover, { passive: true });

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const ancho = Math.floor(canvas.clientWidth * dpr);
    const alto = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== ancho || canvas.height !== alto) {
      canvas.width = ancho;
      canvas.height = alto;
      gl.viewport(0, 0, ancho, alto);
      gl.uniform2f(uni.res, ancho, alto);
    }
  }

  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inicio = performance.now();
  let visible = true;
  let anim = 0;

  function dibujar(ahora) {
    redimensionar();
    puntero.x += (objetivo.x - puntero.x) * 0.06;
    puntero.y += (objetivo.y - puntero.y) * 0.06;
    gl.uniform2f(uni.puntero, puntero.x, puntero.y);
    gl.uniform1f(uni.tiempo, sinMovimiento ? 12 : (ahora - inicio) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!sinMovimiento && visible) anim = requestAnimationFrame(dibujar);
  }

  // Sin movimiento: un solo fotograma. Fuera de pantalla: se detiene el bucle.
  const alCambiarVisibilidad = () => {
    visible = !document.hidden;
    if (visible && !sinMovimiento) anim = requestAnimationFrame(dibujar);
  };
  document.addEventListener('visibilitychange', alCambiarVisibilidad);
  window.addEventListener('resize', redimensionar, { passive: true });
  anim = requestAnimationFrame(dibujar);

  return {
    destruir() {
      cancelAnimationFrame(anim);
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('resize', redimensionar);
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
    },
  };
}
