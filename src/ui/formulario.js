/**
 * Envío del formulario de contacto y de la encuesta.
 *
 * Un sitio estático no tiene servidor propio, así que los datos se envían a un
 * servicio externo por fetch. Si no hay endpoint configurado, el formulario cae
 * de forma ordenada a un enlace mailto en lugar de fallar en silencio.
 */
import { CONFIG } from '../config.js';

function mostrarAviso(form, texto, estado) {
  const aviso = form.querySelector('.aviso');
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.dataset.estado = estado;
  aviso.hidden = false;
}

async function enviar(form, datos) {
  const respuesta = await fetch(CONFIG.endpointFormulario, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!respuesta.ok) throw new Error(`Respuesta ${respuesta.status}`);
}

function respaldoCorreo(datos) {
  const cuerpo = Object.entries(datos)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return `mailto:${CONFIG.correo}?subject=${encodeURIComponent(datos._asunto ?? 'Mensaje desde el sitio')}&body=${encodeURIComponent(cuerpo)}`;
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
      mostrarAviso(form, 'Abriendo tu gestor de correo…', 'ok');
      window.location.href = respaldoCorreo(datos);
      return;
    }

    boton.disabled = true;
    boton.textContent = 'Enviando…';
    try {
      await enviar(form, datos);
      form.reset();
      mostrarAviso(form, '¡Recibido! Gracias por escribir, respondo lo antes posible.', 'ok');
    } catch (error) {
      console.error(error);
      mostrarAviso(form, 'No se pudo enviar. Puedes escribir directamente a ' + CONFIG.correo, 'error');
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}
