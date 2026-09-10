/** Página de la línea de tiempo. */
import './main.js';
import './styles/linea-tiempo.css';

import { cargarLineaDeTiempo } from './timeline/datos.js';
import { montarLineaDeTiempo } from './timeline/LineaTiempo.js';

const raiz = document.querySelector('#linea-de-tiempo');

cargarLineaDeTiempo()
  .then((datos) => {
    montarLineaDeTiempo(raiz, datos);
    // Permite enlazar un hito concreto: linea-tiempo.html#hito=cefalizacion
    const id = new URLSearchParams(location.hash.slice(1)).get('hito');
    if (id) raiz.querySelector(`[data-id="${id}"] .lt__punto`)?.focus();
  })
  .catch((error) => {
    console.error(error);
    raiz.innerHTML = `<p class="tarjeta">No fue posible cargar la línea de tiempo.
      Comprueba que <code>data/timeline.json</code> esté publicado junto al sitio.</p>`;
  });
