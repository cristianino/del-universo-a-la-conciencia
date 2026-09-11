import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// Sitio multipagina. Cada entrada genera un .html propio dentro de /dist,
// que es lo que publica el workflow en GitHub Pages.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    // No se vacía /dist: la carpeta de trabajo vive en OneDrive y el montaje no
    // permite borrar archivos. En CI da igual, porque el runner parte de cero.
    emptyOutDir: false,
    rollupOptions: {
      // Los nombres de salida llevan hash (el valor por defecto de Vite): al
      // cambiar el contenido cambia el nombre, y el navegador no puede servir
      // una versión vieja desde su caché. Con nombres fijos, un visitante que
      // ya había abierto el sitio seguía viendo el JS anterior.
      input: {
        inicio: r('./index.html'),
        linea: r('./linea-tiempo.html'),
        tesis: r('./tesis.html'),
        recursos: r('./recursos.html'),
        participa: r('./participa.html'),
      },
    },
  },
  server: { port: 5173, open: '/index.html' },
});
