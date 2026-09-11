/**
 * Envío del formulario de contacto y de la encuesta.
 *
 * Un sitio estático no tiene servidor propio, así que hay tres escenarios y el
 * formulario funciona en los tres:
 *   1. Con endpoint configurado  -> se envía por fetch al servicio externo.
 *   2. Sin endpoint pero con correo -> se abre el gestor de correo del visitante.
 *   3. Sin ninguno de los dos     -> se deriva al foro público del repositorio.
 */
import { CONFIG, urlRepo } from '../config.js';

function mostrarAviso(form, texto, estado) {
  const aviso = form.querySelector('.aviso');
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.dataset.estado = estado;
  aviso.hidden = false;
}

async function enviar(datos) {
  const respuesta = await fetch(CONFIG.endpointFormulario, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok) throw new Error(`Respuesta ${respuesta.status}`);
}

function respaldoCorreo(datos) {
  const cuerpo = Object.entries(datos)
    .filter(([k]) => k !== '_asunto')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return `mailto:${CONFIG.correo}?subject=${encodeURIComponent(datos._asunto ?? 'Mensaje desde el sitio')}&body=${encodeURIComponent(cuerpo)}`;
}

/** Sin endpoint ni correo, el foro es el canal que sí está disponible. */
function derivarAlForo(form) {
  const repo = urlRepo();
  mostrarAviso(
    form,
    repo
      ? 'El canal de correo aún no está activo. Puedes escribir en el foro público, más abajo en esta misma página.'
      : 'El canal de correo aún no está activo. Prueba de nuevo en unos días.',
    'error',
  );
}

export function conectarFormulario(selector, asunto) {
  const form = document.querySelector(selector);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());
    datos._asunto = asunto;

    const boton = form.querySelector('[type="submit"]');
    const textoOriginal = boton.textContent;

    if (!CONFIG.endpointFormulario) {
      if (!CONFIG.correo) return derivarAlForo(form);
      mostrarAviso(form, 'Abriendo tu gestor de correo…', 'ok');
      window.location.href = respaldoCorreo(datos);
      return;
    }

    boton.disabled = true;
    boton.textContent = 'Enviando…';
    try {
      await enviar(datos);
      form.reset();
      mostrarAviso(form, '¡Recibido! Gracias por escribir, respondo lo antes posible.', 'ok');
    } catch (error) {
      console.error(error);
      mostrarAviso(
        form,
        CONFIG.correo
          ? `No se pudo enviar. Puedes escribir directamente a ${CONFIG.correo}`
          : 'No se pudo enviar. Inténtalo de nuevo o escribe en el foro de esta página.',
        'error',
      );
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}
