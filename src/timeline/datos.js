/**
 * Carga y normalización de los datos de la línea de tiempo.
 *
 * Todo el contenido vive en /public/data/timeline.json. Para añadir, quitar o
 * editar un hito basta con tocar ese archivo: aquí solo se valida que traiga
 * lo mínimo indispensable y se calculan los campos derivados.
 */

import { crearEscala } from './escala.js';

const CAMPOS_OBLIGATORIOS = ['id', 'mya', 'titulo', 'resumen'];
const REGISTRO_POR_DEFECTO = 'establecido';

export async function cargarLineaDeTiempo(url = './data/timeline.json') {
  const respuesta = await fetch(url, { cache: 'no-cache' });
  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar la línea de tiempo (${respuesta.status})`);
  }
  return normalizar(await respuesta.json());
}

export function normalizar(bruto) {
  const escala = crearEscala(bruto.meta.escala);
  const eras = new Map(bruto.eras.map((e) => [e.id, e]));
  const registros = bruto.meta.registros ?? {};
  const vistos = new Set();

  const hitos = bruto.hitos
    .map((h, i) => {
      for (const campo of CAMPOS_OBLIGATORIOS) {
        if (h[campo] === undefined) {
          throw new Error(`El hito #${i} ("${h.id ?? 'sin id'}") no tiene "${campo}"`);
        }
      }
      if (vistos.has(h.id)) throw new Error(`Id repetido en los datos: "${h.id}"`);
      vistos.add(h.id);

      const era = eras.get(h.era);
      const registro = h.registro ?? REGISTRO_POR_DEFECTO;
      if (!registros[registro]) {
        console.warn(`El hito "${h.id}" declara un registro desconocido: "${registro}"`);
      }

      return {
        ...h,
        registro,
        infoRegistro: registros[registro] ?? null,
        aporta: h.aporta ?? '',
        detalle: h.detalle ?? [],
        claves: h.claves ?? [],
        etiquetas: h.etiquetas ?? [],
        fuentes: h.fuentes ?? [],
        destacado: Boolean(h.destacado),
        color: h.color ?? era?.color ?? '#3FE0D0',
        eraNombre: era?.nombre ?? '',
        t: escala.aNormalizado(h.mya),
      };
    })
    .sort((a, b) => b.mya - a.mya);

  const franjasEra = bruto.eras.map((e) => ({
    ...e,
    t0: escala.aNormalizado(e.desde),
    t1: escala.aNormalizado(e.hasta),
  }));

  return { meta: bruto.meta, registros, eras: franjasEra, hitos, escala };
}
