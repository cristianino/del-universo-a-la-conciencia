// vite.config.js
import { defineConfig } from "file:///sessions/rcw-01m6aqwc3sgljjp5zq7jksqm/mnt/sitio%20de%20cerebro/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///sessions/rcw-01m6aqwc3sgljjp5zq7jksqm/mnt/sitio%20de%20cerebro/vite.config.js";
var r = (p) => fileURLToPath(new URL(p, __vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    // La carpeta vive en OneDrive y el montaje no permite borrar archivos, así
    // que en lugar de vaciar /dist en cada build se usan nombres de salida
    // estables: cada compilación sobrescribe exactamente los mismos archivos.
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]"
      },
      input: {
        inicio: r("./index.html"),
        linea: r("./linea-tiempo.html"),
        recursos: r("./recursos.html"),
        participa: r("./participa.html")
      }
    }
  },
  server: { port: 5173, open: "/index.html" }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvcmN3LTAxbTZhcXdjM3NnbGpqcDV6cTdqa3NxbS9tbnQvc2l0aW8gZGUgY2VyZWJyb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3Nlc3Npb25zL3Jjdy0wMW02YXF3YzNzZ2xqanA1enE3amtzcW0vbW50L3NpdGlvIGRlIGNlcmVicm8vdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Nlc3Npb25zL3Jjdy0wMW02YXF3YzNzZ2xqanA1enE3amtzcW0vbW50L3NpdGlvJTIwZGUlMjBjZXJlYnJvL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5cbmNvbnN0IHIgPSAocCkgPT4gZmlsZVVSTFRvUGF0aChuZXcgVVJMKHAsIGltcG9ydC5tZXRhLnVybCkpO1xuXG4vLyBTaXRpbyBtdWx0aXBhZ2luYS4gQ2FkYSBlbnRyYWRhIGdlbmVyYSB1biAuaHRtbCBwcm9waW8gZGVudHJvIGRlIC9kaXN0LFxuLy8gcXVlIGVzIGV4YWN0YW1lbnRlIGxvIHF1ZSBzZSBzdWJlIGFsIGJ1Y2tldCBkZSBTMy5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6ICcuLycsXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgLy8gTGEgY2FycGV0YSB2aXZlIGVuIE9uZURyaXZlIHkgZWwgbW9udGFqZSBubyBwZXJtaXRlIGJvcnJhciBhcmNoaXZvcywgYXNcdTAwRURcbiAgICAvLyBxdWUgZW4gbHVnYXIgZGUgdmFjaWFyIC9kaXN0IGVuIGNhZGEgYnVpbGQgc2UgdXNhbiBub21icmVzIGRlIHNhbGlkYVxuICAgIC8vIGVzdGFibGVzOiBjYWRhIGNvbXBpbGFjaVx1MDBGM24gc29icmVzY3JpYmUgZXhhY3RhbWVudGUgbG9zIG1pc21vcyBhcmNoaXZvcy5cbiAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5qcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5bZXh0XScsXG4gICAgICB9LFxuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgaW5pY2lvOiByKCcuL2luZGV4Lmh0bWwnKSxcbiAgICAgICAgbGluZWE6IHIoJy4vbGluZWEtdGllbXBvLmh0bWwnKSxcbiAgICAgICAgcmVjdXJzb3M6IHIoJy4vcmVjdXJzb3MuaHRtbCcpLFxuICAgICAgICBwYXJ0aWNpcGE6IHIoJy4vcGFydGljaXBhLmh0bWwnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7IHBvcnQ6IDUxNzMsIG9wZW46ICcvaW5kZXguaHRtbCcgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VyxTQUFTLG9CQUFvQjtBQUNwWSxTQUFTLGVBQWUsV0FBVztBQUQyTCxJQUFNLDJDQUEyQztBQUcvUSxJQUFNLElBQUksQ0FBQyxNQUFNLGNBQWMsSUFBSSxJQUFJLEdBQUcsd0NBQWUsQ0FBQztBQUkxRCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJUixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ0wsUUFBUSxFQUFFLGNBQWM7QUFBQSxRQUN4QixPQUFPLEVBQUUscUJBQXFCO0FBQUEsUUFDOUIsVUFBVSxFQUFFLGlCQUFpQjtBQUFBLFFBQzdCLFdBQVcsRUFBRSxrQkFBa0I7QUFBQSxNQUNqQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRLEVBQUUsTUFBTSxNQUFNLE1BQU0sY0FBYztBQUM1QyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
