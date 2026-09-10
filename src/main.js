/** Arranque común a todas las páginas: menú y fondo WebGL. */
import './styles/tokens.css';
import './styles/base.css';
import './styles/componentes.css';

import { iniciarNav } from './ui/nav.js';
import { iniciarFondo } from './gl/FondoGL.js';

iniciarNav();

const lienzo = document.querySelector('.fondo-gl');
if (lienzo) {
  try {
    iniciarFondo(lienzo, { intensidad: Number(lienzo.dataset.intensidad ?? 1) });
  } catch (e) {
    console.warn('El fondo WebGL no pudo iniciarse:', e.message);
    lienzo.style.display = 'none';
  }
}
