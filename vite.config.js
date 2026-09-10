import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// Sitio multipagina. Cada entrada genera un .html propio dentro de /dist,
// que es exactamente lo que se sube al bucket de S3.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    // La carpeta vive en OneDrive y el montaje no permite borrar archivos, así
    // que en lugar de vaciar /dist en cada build se usan nombres de salida
    // estables: cada compilación sobrescribe exactamente los mismos archivos.
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
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
