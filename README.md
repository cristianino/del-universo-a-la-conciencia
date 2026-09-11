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
npm run validar  # revisa que timeline.json esté bien formado
npm run build    # valida y genera /dist
npm run preview  # revisa /dist tal como quedará publicado
```

## Publicación

Cada push a `main` despliega en GitHub Pages mediante
`.github/workflows/desplegar.yml`:

    https://cristianino.github.io/del-universo-a-la-conciencia/

El paso a paso está en `docs/despliegue-pages.md`. Para publicar además en un
bucket de S3, `docs/despliegue-s3.md`.

## Datos sensibles

El correo de contacto y el endpoint del formulario no están en el código: se
leen de variables de entorno (`.env.local` en tu máquina, secretos de Actions en
CI). Copia `.env.example` a `.env.local` para trabajar en local. Sin esos
valores el sitio funciona igual y el formulario deriva al foro.

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

- El build NO vacía `/dist`: la carpeta vive en OneDrive y el montaje no permite
  borrar archivos. En CI no importa, porque el runner parte de cero; en local se
  acumulan los assets de builds anteriores y se borran a mano cuando molesten.
- Los nombres de salida llevan hash, que es el comportamiento por defecto de
  Vite. Es lo que evita que un visitante con el sitio ya cacheado siga viendo el
  JavaScript de la versión anterior.
