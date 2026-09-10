/**
 * Escala temporal por tramos.
 *
 * El problema: entre el Big Bang y los primeros animales caben pocos hitos muy
 * separados, y en los últimos 600 millones de años se acumula casi todo. Una
 * escala lineal aplastaría el final; una logarítmica aplastaría el principio.
 * La solución es repartir el ancho por tramos, dando a cada uno el peso que su
 * densidad de contenido merece.
 *
 * Los tramos se declaran en `meta.escala.tramos` del JSON, así que ajustar el
 * reparto no requiere tocar este archivo.
 */

export function crearEscala(config) {
  const tramos = [...config.tramos].sort((a, b) => b.desde - a.desde);
  const total = tramos.reduce((s, t) => s + t.peso, 0);

  // Cada tramo recibe [inicio, fin] dentro del rango normalizado 0..1
  let acumulado = 0;
  const franjas = tramos.map((t) => {
    const inicio = acumulado / total;
    acumulado += t.peso;
    return { ...t, inicio, fin: acumulado / total };
  });

  const masAntiguo = franjas[0].desde;
  const masReciente = franjas[franjas.length - 1].hasta;

  /** millones de años atrás -> posición normalizada (0 = origen, 1 = presente) */
  function aNormalizado(mya) {
    const v = Math.min(masAntiguo, Math.max(masReciente, mya));
    for (const f of franjas) {
      if (v <= f.desde && v >= f.hasta) {
        const avance = (f.desde - v) / (f.desde - f.hasta || 1);
        return f.inicio + avance * (f.fin - f.inicio);
      }
    }
    return v > masAntiguo ? 0 : 1;
  }

  /** posición normalizada -> millones de años atrás (para el eje y el zoom) */
  function aMya(n) {
    const v = Math.min(1, Math.max(0, n));
    for (const f of franjas) {
      if (v >= f.inicio && v <= f.fin) {
        const avance = (v - f.inicio) / (f.fin - f.inicio || 1);
        return f.desde - avance * (f.desde - f.hasta);
      }
    }
    return masReciente;
  }

  return { aNormalizado, aMya, franjas, masAntiguo, masReciente };
}

/**
 * Cifra de una edad, con la misma nomenclatura de la lámina impresa:
 * Ma para millones de años y ka para miles.
 *   13800  -> "13.800 Ma"      2.5 -> "2,5 Ma"
 *   0.07   -> "70 ka"          0   -> "hoy"
 */
export function formatearEdad(mya) {
  if (mya === 0) return 'hoy';
  if (mya < 1) return `${Math.round(mya * 1000)} ka`;
  const decimales = mya < 10 ? 1 : 0;
  return `${mya.toLocaleString('es-CO', { maximumFractionDigits: decimales })} Ma`;
}

/** La misma cifra en la forma en que se lee: "hace 540 Ma" / "hoy". */
export function etiquetaEdad(mya) {
  return mya === 0 ? 'hoy' : `hace ${formatearEdad(mya)}`;
}
