import './main.js';
import './styles/paginas.css';

import { conectarFormulario } from './ui/formulario.js';
import { montarForo } from './ui/foro.js';
import { urlRepo } from './config.js';

conectarFormulario('#form-contacto', 'Mensaje desde el sitio del cerebro');
conectarFormulario('#form-encuesta', 'Encuesta del sitio del cerebro');
montarForo('#foro');

// Enlaces al repositorio, solo si está configurado
const repo = urlRepo();
document.querySelectorAll('[data-repo-enlace]').forEach((a) => {
  if (repo) a.href = repo;
  else a.remove();   // sin repositorio configurado, el enlace no se muestra
});
