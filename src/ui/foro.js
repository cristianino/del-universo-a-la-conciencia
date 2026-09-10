/**
 * Foro de discusión embebido (Giscus sobre GitHub Discussions).
 * Si aún no hay identificadores configurados, se muestra un aviso con el
 * enlace al repositorio en lugar de un hueco vacío.
 */
import { CONFIG, urlRepo } from '../config.js';

export function montarForo(selector) {
  const destino = document.querySelector(selector);
  if (!destino) return;

  const { usuario, repo } = CONFIG.github;
  const { repoId, categoria, categoriaId } = CONFIG.giscus;

  if (!usuario || !repo || !repoId || !categoriaId) {
    destino.innerHTML = `
      <div class="tarjeta">
        <h3>Foro en preparación</h3>
        <p>El hilo público de discusión se abrirá en las Discussions del
        repositorio del proyecto. Mientras tanto puedes escribir por el
        formulario de esta misma página.</p>
        ${urlRepo() ? `<p><a href="${urlRepo()}/discussions" target="_blank" rel="noopener">Ir a las discusiones del repositorio</a></p>` : ''}
      </div>`;
    return;
  }

  const s = document.createElement('script');
  s.src = 'https://giscus.app/client.js';
  s.async = true;
  s.crossOrigin = 'anonymous';
  Object.entries({
    'data-repo': `${usuario}/${repo}`,
    'data-repo-id': repoId,
    'data-category': categoria,
    'data-category-id': categoriaId,
    'data-mapping': 'pathname',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': 'transparent_dark',
    'data-lang': 'es',
  }).forEach(([k, v]) => s.setAttribute(k, v));

  destino.appendChild(s);
}
