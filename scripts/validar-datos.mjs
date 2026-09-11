/**
 * Validación de public/data/timeline.json.
 *
 * El contenido se edita a mano y se publica sin recompilar, así que conviene
 * que un error de datos se detecte en CI y no en la cara del visitante.
 * Se ejecuta con `npm run validar`, y el despliegue lo corre antes del build.
 */

import { readFileSync } from 'node:fs';

const RUTA = 'public/data/timeline.json';
const OBLIGATORIOS = ['id', 'mya', 'titulo', 'resumen'];
const REGISTROS = ['establecido', 'hipotesis', 'interpretacion'];

const errores = [];
const avisos = [];

const fallo = (m) => errores.push(m);
const aviso = (m) => avisos.push(m);

let datos;
try {
  datos = JSON.parse(readFileSync(RUTA, 'utf8'));
} catch (e) {
  console.error(`✗ ${RUTA} no es JSON válido: ${e.message}`);
  process.exit(1);
}

// --- escala: los tramos deben cubrir el rango sin huecos ni solapes ---
const tramos = [...(datos.meta?.escala?.tramos ?? [])].sort((a, b) => b.desde - a.desde);
if (!tramos.length) fallo('meta.escala.tramos está vacío');

tramos.forEach((t, i) => {
  if (t.desde <= t.hasta) fallo(`tramo ${i}: "desde" (${t.desde}) debe ser mayor que "hasta" (${t.hasta})`);
  if (!(t.peso > 0)) fallo(`tramo ${i}: el peso debe ser mayor que cero`);
  const sig = tramos[i + 1];
  if (sig && t.hasta !== sig.desde) {
    fallo(`hueco en la escala: un tramo acaba en ${t.hasta} y el siguiente empieza en ${sig.desde}`);
  }
});

const masAntiguo = tramos[0]?.desde ?? Infinity;
const masReciente = tramos.at(-1)?.hasta ?? 0;

// --- eras ---
const idsEra = new Set();
for (const e of datos.eras ?? []) {
  if (idsEra.has(e.id)) fallo(`era repetida: "${e.id}"`);
  idsEra.add(e.id);
  if (!/^#[0-9a-fA-F]{6}$/.test(e.color ?? '')) fallo(`la era "${e.id}" no tiene un color hex de 6 dígitos`);
}

// --- hitos ---
const idsHito = new Set();
for (const [i, h] of (datos.hitos ?? []).entries()) {
  const nombre = h.id ?? `#${i}`;

  for (const campo of OBLIGATORIOS) {
    if (h[campo] === undefined || h[campo] === '') fallo(`el hito "${nombre}" no tiene "${campo}"`);
  }
  if (idsHito.has(h.id)) fallo(`id de hito repetido: "${h.id}"`);
  idsHito.add(h.id);

  if (typeof h.mya === 'number' && (h.mya > masAntiguo || h.mya < masReciente)) {
    fallo(`el hito "${nombre}" (${h.mya} Ma) cae fuera del rango de la escala ${masAntiguo}–${masReciente}`);
  }
  if (h.era && !idsEra.has(h.era)) fallo(`el hito "${nombre}" apunta a una era inexistente: "${h.era}"`);

  const registro = h.registro ?? 'establecido';
  if (!REGISTROS.includes(registro)) {
    fallo(`el hito "${nombre}" declara un registro desconocido: "${registro}"`);
  }

  // El eje narrativo del sitio: cada hito debe decir qué nivel aporta
  if (!h.aporta) aviso(`el hito "${nombre}" no declara "aporta"`);
  if (!h.detalle?.length) aviso(`el hito "${nombre}" no tiene párrafos de detalle`);
  if (h.resumen && h.resumen.length > 240) {
    aviso(`el resumen de "${nombre}" tiene ${h.resumen.length} caracteres; no cabrá bien en la tarjeta`);
  }
}

// --- salida ---
for (const a of avisos) console.warn(`  aviso: ${a}`);
for (const e of errores) console.error(`  error: ${e}`);

if (errores.length) {
  console.error(`\n✗ ${errores.length} error(es) en ${RUTA}`);
  process.exit(1);
}
console.log(`✓ ${RUTA}: ${idsHito.size} hitos y ${idsEra.size} eras, sin errores` +
            (avisos.length ? ` (${avisos.length} aviso(s))` : ''));
