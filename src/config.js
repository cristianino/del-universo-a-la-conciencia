/**
 * Configuración de los canales de comunicación.
 *
 * Nada sensible se escribe en este archivo: los valores llegan desde variables
 * de entorno de Vite, que viven en `.env.local` (ignorado por git). Así el
 * repositorio público no contiene ni la dirección de correo ni la clave del
 * servicio de formularios, y el build sí.
 *
 * Copia `.env.example` a `.env.local` y rellena lo que necesites. Mientras un
 * valor esté vacío el sitio no se rompe: ofrece la alternativa que quede.
 */
export const CONFIG = {
  // Endpoint que recibe el formulario y la encuesta.
  // Formspree: https://formspree.io/f/xxxxxxx
  // Web3Forms:  https://api.web3forms.com/submit
  endpointFormulario: import.meta.env.VITE_ENDPOINT_FORMULARIO ?? '',

  // Correo de respaldo, usado solo si no hay endpoint configurado.
  // Conviene que sea un alias de reenvío, no la dirección personal.
  correo: import.meta.env.VITE_CORREO_CONTACTO ?? '',

  // Repositorio público del proyecto.
  github: {
    usuario: 'cristianino',
    repo: 'del-universo-a-la-conciencia',
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

/** Si no hay ni endpoint ni correo, el formulario deriva al foro. */
export const hayCanalDirecto = () =>
  Boolean(CONFIG.endpointFormulario || CONFIG.correo);
