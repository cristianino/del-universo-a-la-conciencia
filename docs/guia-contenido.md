# Guía de contenido: cómo editar la línea de tiempo

Todo el contenido vive en `public/data/timeline.json`. El sitio lo carga en
tiempo de ejecución, así que basta con editar ese archivo y volver a subirlo al
bucket: no hace falta recompilar nada si solo cambia el contenido.

## Estructura del archivo

```jsonc
{
  "meta": { ... },   // título, registros epistémicos y configuración de la escala
  "eras":  [ ... ],  // franjas de fondo, del Cosmos a los humanos
  "hitos": [ ... ]   // los puntos del recorrido
}
```

## Un hito

```jsonc
{
  "id": "cefalizacion",          // obligatorio, único, sin espacios
  "mya": 570,                    // obligatorio, millones de años atrás (0.3 = 300 ka)
  "era": "animal",               // id de una era; define el color del punto
  "registro": "establecido",     // establecido | hipotesis | interpretacion
  "titulo": "Cefalización: la primera agrupación neuronal",   // obligatorio
  "subtitulo": "punto de inflexión",   // el rótulo en mayúsculas bajo el título
  "aporta": "Un centro donde se integra todo",  // el nivel de organización nuevo
  "resumen": "Una o dos frases...",    // obligatorio, es lo que aparece al hover
  "detalle": ["Párrafo 1", "Párrafo 2"],        // panel completo
  "claves": ["Idea suelta", "Otra idea"],       // lista "Por qué importa"
  "etiquetas": ["cefalización", "movimiento"],
  "fuentes": [{ "texto": "Autor, A. (2023). Título. Revista, 1(1).", "url": "" }],
  "destacado": true,             // punto relleno en lugar de hueco
  "color": "#3FE0D0"             // opcional: anula el color de la era
}
```

Campos obligatorios: `id`, `mya`, `titulo` y `resumen`. Si falta alguno, o si
hay dos hitos con el mismo `id`, la página lo dice en la consola en lugar de
fallar en silencio.

El orden en el archivo da igual: los hitos se ordenan solos por antigüedad y se
reparten alternando arriba y abajo del eje.

## Los tres registros

Es la decisión editorial central del sitio: no todo lo que se cuenta tiene el
mismo respaldo, y el visitante tiene derecho a saber qué está leyendo.

| Valor | Qué significa | Cómo se ve |
|---|---|---|
| `establecido` | Evidencia amplia y consenso actual | Punto relleno |
| `hipotesis` | Hay modelos, no hay explicación única | Punto de borde discontinuo |
| `interpretacion` | Lectura del proceso, no hecho demostrado | Punto de borde doble |

El color de un punto siempre indica la **era**, nunca el registro: dos
codificaciones de color competirían. El registro se codifica por forma, se
etiqueta con texto en la tarjeta y el panel, y puede filtrarse desde la
cabecera del recorrido.

Los nombres y descripciones se editan en `meta.registros`, y añadir un cuarto
solo requiere declararlo ahí y darle estilo en `src/styles/componentes.css`.

## El campo `aporta`

Es el eje narrativo: cada hito debe declarar **qué nivel de organización añade
que el anterior no tenía**. Se muestra como "Nivel nuevo" en la tarjeta
expandida y en el panel. Si un hito no puede completar esa frase, probablemente
no merezca estar en la línea.

## La escala del tiempo

La línea cubre 13.800 millones de años, pero casi todo lo interesante ocurre en
los últimos 600. El JSON reparte el ancho por tramos:

```jsonc
"tramos": [
  { "desde": 13800, "hasta": 4600, "peso": 1.1 },
  { "desde": 650,   "hasta": 500,  "peso": 2.2 },  // el Cámbrico recibe más aire
  ...
]
```

Cada tramo ocupa una porción del ancho proporcional a su `peso`. Subir el peso
separa sus hitos; bajarlo los junta. Los tramos deben cubrir el rango completo
sin huecos.

## Añadir una era

```jsonc
{ "id": "humano", "nombre": "Primates y humanos", "desde": 66, "hasta": 0, "color": "#F25F9E" }
```

La secuencia actual va de violeta (Cosmos) a magenta (presente), lo que da al
recorrido una progresión cromática legible de un vistazo.

## Nomenclatura de las edades

`mya` siempre va en millones de años. El sitio la formatea sola:

| En el JSON | En pantalla |
|---|---|
| `13800` | hace 13.800 Ma |
| `2.5` | hace 2,5 Ma |
| `0.3` | hace 300 ka |
| `0` | hoy |
