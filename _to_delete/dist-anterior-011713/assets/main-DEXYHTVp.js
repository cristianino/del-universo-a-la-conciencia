(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&t(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(o){if(o.ep)return;o.ep=!0;const r=e(o);fetch(o.href,r)}})();function x(){const n=document.querySelector(".nav");if(!n)return;const i=location.pathname.split("/").pop()||"index.html";n.querySelectorAll(".nav__enlaces a").forEach(o=>{const r=o.getAttribute("href");(r===i||i===""&&r==="index.html")&&o.setAttribute("aria-current","page")});const e=n.querySelector(".nav__menu"),t=n.querySelector(".nav__enlaces");e==null||e.addEventListener("click",()=>{const o=t.dataset.abierto==="true";t.dataset.abierto=String(!o),e.setAttribute("aria-expanded",String(!o))})}const E=`attribute vec2 a_posicion;

void main() {
  gl_Position = vec4(a_posicion, 0.0, 1.0);
}
`,F=`precision mediump float;

uniform vec2  u_res;         // tamaño del lienzo en pixeles
uniform float u_tiempo;      // segundos desde el inicio
uniform vec2  u_puntero;     // posicion del cursor normalizada 0..1
uniform float u_intensidad;  // 0 = casi apagado, 1 = pleno
uniform vec3  u_cFondo;
uniform vec3  u_cImpulso;
uniform vec3  u_cSinapsis;

// --- ruido de valor + fbm ----------------------------------
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float ruido(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float suma = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    suma += amp * ruido(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return suma;
}

// --- chispas: una por celda, con pulso desfasado -----------
float chispas(vec2 uv, float t) {
  vec2 rejilla = uv * 9.0;
  vec2 celda = floor(rejilla);
  vec2 local = fract(rejilla) - 0.5;

  float semilla = hash21(celda);
  vec2 centro = (vec2(hash21(celda + 3.7), hash21(celda + 8.1)) - 0.5) * 0.7;
  float pulso = 0.5 + 0.5 * sin(t * (0.6 + semilla) + semilla * 30.0);

  float d = length(local - centro);
  return smoothstep(0.055, 0.0, d) * pulso * step(0.72, semilla);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;   // corrige la relacion de aspecto

  float t = u_tiempo * 0.06;

  // Deriva lenta del campo: dos capas de fbm que se empujan entre si.
  vec2 deriva = vec2(fbm(p * 2.0 + t), fbm(p * 2.0 - t + 5.2));
  float campo = fbm(p * 3.0 + deriva * 1.4);

  // Crestas del campo: filamentos que recuerdan axones cruzandose.
  float filamento = smoothstep(0.46, 0.50, campo) - smoothstep(0.50, 0.55, campo);

  // Bruma de fondo, mas densa en la mitad inferior.
  float bruma = pow(campo, 2.2) * (0.35 + 0.65 * (1.0 - uv.y));

  // Halo que sigue al cursor, como si el campo respondiera a la atencion.
  float dPuntero = distance(uv, u_puntero);
  float halo = smoothstep(0.42, 0.0, dPuntero) * 0.5;

  vec3 color = u_cFondo;
  color += u_cImpulso  * filamento * 0.42 * u_intensidad;
  color += u_cSinapsis * bruma * 0.13 * u_intensidad;
  color += u_cImpulso  * halo * 0.10 * u_intensidad;
  color += u_cImpulso  * chispas(uv, u_tiempo) * 0.8 * u_intensidad;

  // Vineta: oscurece los bordes para que el texto respire.
  float vineta = smoothstep(1.25, 0.35, length(uv - 0.5));
  color *= mix(0.72, 1.0, vineta);

  gl_FragColor = vec4(color, 1.0);
}
`;function S(n,i,e){const t=n.createShader(i);if(n.shaderSource(t,e),n.compileShader(t),!n.getShaderParameter(t,n.COMPILE_STATUS)){const o=n.getShaderInfoLog(t);throw n.deleteShader(t),new Error(`Error al compilar el shader: ${o}`)}return t}function L(n){const i=n.trim().replace("#",""),e=i.length===3?i.split("").map(t=>t+t).join(""):i;return[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]}function y(n,i){const e=getComputedStyle(document.documentElement).getPropertyValue(n);return L(e||i)}function P(n,i={}){const e=n.getContext("webgl",{antialias:!1,alpha:!1,powerPreference:"low-power"});if(!e)return n.style.display="none",{destruir(){}};const t=e.createProgram();if(e.attachShader(t,S(e,e.VERTEX_SHADER,E)),e.attachShader(t,S(e,e.FRAGMENT_SHADER,F)),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(`Error al enlazar el programa: ${e.getProgramInfoLog(t)}`);e.useProgram(t);const o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const r=e.getAttribLocation(t,"a_posicion");e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,0,0);const a=s=>e.getUniformLocation(t,s),c={res:a("u_res"),tiempo:a("u_tiempo"),puntero:a("u_puntero"),intensidad:a("u_intensidad"),cFondo:a("u_cFondo"),cImpulso:a("u_cImpulso"),cSinapsis:a("u_cSinapsis")};e.uniform3fv(c.cFondo,y("--c-abismo","#070B14")),e.uniform3fv(c.cImpulso,y("--c-impulso","#3FE0D0")),e.uniform3fv(c.cSinapsis,y("--c-sinapsis","#F25F9E")),e.uniform1f(c.intensidad,i.intensidad??1);const l={x:.5,y:.5};let u={x:.5,y:.5};const b=s=>{u.x=s.clientX/window.innerWidth,u.y=1-s.clientY/window.innerHeight};window.addEventListener("pointermove",b,{passive:!0});function h(){const s=Math.min(window.devicePixelRatio||1,1.75),m=Math.floor(n.clientWidth*s),f=Math.floor(n.clientHeight*s);(n.width!==m||n.height!==f)&&(n.width=m,n.height=f,e.viewport(0,0,m,f),e.uniform2f(c.res,m,f))}const v=window.matchMedia("(prefers-reduced-motion: reduce)").matches,A=performance.now();let _=!0,d=0;function g(s){h(),l.x+=(u.x-l.x)*.06,l.y+=(u.y-l.y)*.06,e.uniform2f(c.puntero,l.x,l.y),e.uniform1f(c.tiempo,v?12:(s-A)/1e3),e.drawArrays(e.TRIANGLES,0,3),!v&&_&&(d=requestAnimationFrame(g))}const w=()=>{_=!document.hidden,_&&!v&&(d=requestAnimationFrame(g))};return document.addEventListener("visibilitychange",w),window.addEventListener("resize",h,{passive:!0}),d=requestAnimationFrame(g),{destruir(){cancelAnimationFrame(d),window.removeEventListener("pointermove",b),window.removeEventListener("resize",h),document.removeEventListener("visibilitychange",w)}}}x();const p=document.querySelector(".fondo-gl");if(p)try{P(p,{intensidad:Number(p.dataset.intensidad??1)})}catch(n){console.warn("El fondo WebGL no pudo iniciarse:",n.message),p.style.display="none"}
