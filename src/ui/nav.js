/** Menú: marca la página actual y abre/cierra la lista en pantallas pequeñas. */
export function iniciarNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const actual = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav__enlaces a').forEach((a) => {
    const destino = a.getAttribute('href');
    if (destino === actual || (actual === '' && destino === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  const boton = nav.querySelector('.nav__menu');
  const lista = nav.querySelector('.nav__enlaces');
  boton?.addEventListener('click', () => {
    const abierto = lista.dataset.abierto === 'true';
    lista.dataset.abierto = String(!abierto);
    boton.setAttribute('aria-expanded', String(!abierto));
  });
}
