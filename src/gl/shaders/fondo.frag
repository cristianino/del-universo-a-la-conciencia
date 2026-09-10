precision mediump float;

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
  color += u_cImpulso  * filamento * 0.20 * u_intensidad;
  color += u_cSinapsis * bruma * 0.07 * u_intensidad;
  color += u_cImpulso  * halo * 0.06 * u_intensidad;
  color += u_cImpulso  * chispas(uv, u_tiempo) * 0.45 * u_intensidad;

  // Vineta: oscurece los bordes para que el texto respire.
  float vineta = smoothstep(1.25, 0.35, length(uv - 0.5));
  color *= mix(0.55, 1.0, vineta);

  gl_FragColor = vec4(color, 1.0);
}
