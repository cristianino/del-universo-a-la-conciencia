/**
 * Configuración de los canales de comunicación.
 *
 * Todo lo que depende de una cuenta externa (endpoint del formulario, repo de
 * GitHub, identificadores de Giscus) vive aquí. Mientras un valor esté vacío el
 * sitio no se rompe: muestra en su lugar una alternativa utilizable.
 */
export const CONFIG = {
  // Endpoint que recibe el formulario y la encuesta.
  // Formspree: https://formspree.io/f/xxxxxxx   ·   Web3Forms: https://api.web3forms.com/submit
  endpointFormulario: '',

  // Correo de respaldo, usado si el endpoint no está configurado.
  correo: 'cristiandavid113@gmail.com',

  // Repositorio público del proyecto.
  github: {
    usuario: '',
    repo: '',
  },

  // Foro de discusión (Giscus sobre GitHub Discussions).
  // Los identificadores se obtienen en https://giscus.app
  giscus: {
    repoId: '',
    categoria: 'General',
    categoriaId: '',
  },
};

export const urlRepo = () =>
  CONFIG.github.usuario && CONFIG.github.repo
    ? `https://github.com/${CONFIG.github.usuario}/${CONFIG.github.repo}`
    : '';
