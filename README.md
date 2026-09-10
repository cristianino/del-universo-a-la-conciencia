# La historia del cerebro: del universo a la conciencia

Sitio estático que narra la evolución del cerebro como un solo proceso —
organización, cooperación, especialización e información — desde el Big Bang
hasta la cultura, con una línea de tiempo interactiva dibujada en canvas y un
fondo animado en WebGL. Pensado para publicarse en un bucket de Amazon S3.

Cada hito declara **qué nivel de organización aporta** y **a qué registro
pertenece**: conocimiento establecido, hipótesis en discusión o interpretación
filosófica. Los tres se distinguen por forma y pueden filtrarse en el recorrido.

Proyecto académico de Técnicas de la comunicación virtual — Universidad Manuela
Beltrán. Cristian David Niño Chalarca.

## Puesta en marcha

```bash
npm install      # una sola vez
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera /dist, que es lo que se sube a S3
npm run preview  # revisa /dist tal como quedará publicado
```

## Estructura

```
index.html            Portada
linea-tiempo.html     Recorrido interactivo (32 hitos)
tesis.html            El argumento: registros, cadena de niveles, arquitecturas
recursos.html         Recurso educativo: diagrama del impulso nervioso + PQR
participa.html        Los tres canales de comunicación

public/
  data/timeline.json  TODO el contenido de la línea de tiempo
  favicon.svg

src/
  config.js           Endpoint del formulario, repo de GitHub e ids de Giscus
  main.js             Arranque común: menú y fondo WebGL
  pagina-*.js         Punto de entrada de cada página
  styles/
    tokens.css        Paleta, tipografía, espaciado y tiempos de animación
    base.css          Reset, tipografía base y utilidades
    componentes.css   Menú, portada, botones, tarjetas, pie
    linea-tiempo.css  Pista, nodos, tarjetas y panel de detalle
    paginas.css       Gráfica, flujo paso a paso, PQR y formularios
  gl/
    FondoGL.js        Contexto WebGL, uniforms y bucle de dibujo
    shaders/          fondo.vert y fondo.frag
  timeline/
    datos.js          Carga y validación del JSON
    escala.js         Escala temporal por tramos y formato de edades
    LineaTiempo.js    Pista, interacción, registros y filtro
  ui/
    nav.js  formulario.js  foro.js

docs/                 Guía de contenido, decisiones de diseño y despliegue
```

## Añadir o editar un hito

Se toca **solo** `public/data/timeline.json`. No hay que modificar código: la
posición, el color y el orden se calculan a partir de los datos. El detalle de
cada campo está en `docs/guia-contenido.md`.

## Notas de construcción

- La carpeta vive en OneDrive y el montaje no permite borrar archivos, así que
  el build usa nombres de salida estables (`assets/main.js`, `assets/linea.css`…)
  y sobrescribe en lugar de vaciar `/dist`. Como los nombres no cambian entre
  versiones, conviene subir a S3 con `Cache-Control: max-age=300` en los assets
  o invalidar la caché de CloudFront al desplegar.
- La carpeta `_to_delete/` guarda builds antiguos; se puede borrar a mano.
