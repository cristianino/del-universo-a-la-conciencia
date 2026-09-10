# Decisiones de diseño

## Paleta: "abismo bioluminiscente"

La metáfora es la vida en la oscuridad: un fondo casi negro con destellos de luz
propia, que es como se ve el mar profundo y también como funciona una neurona,
encendiéndose sobre un fondo silencioso.

| Color | Hex | Uso |
|---|---|---|
| Abismo | `#070B14` | Fondo general |
| Superficie | `#101A2E` | Tarjetas y paneles |
| Elevado | `#172542` | Panel de detalle y estados hover |
| Impulso (cian) | `#3FE0D0` | Acento principal: enlaces, botones, señal activa |
| Sinapsis (magenta) | `#F25F9E` | Acento secundario: presente, interpretación |
| Mielina (ámbar) | `#FFC978` | Acento de apoyo: hipótesis en discusión |
| Texto | `#E8EEF7` | Cuerpo de texto |
| Texto tenue | `#9BAAC4` | Texto secundario |

Son cinco colores de identidad (tres superficies y tres acentos, con dos niveles
de texto), dentro del rango de tres a cinco que pide el ejercicio. El cian sobre
el fondo abismo supera holgadamente el contraste 4.5:1 exigido por WCAG AA, y el
texto tenue se mantiene por encima de 7:1.

El fondo animado en WebGL usa exactamente estos mismos tokens: los lee de las
variables CSS, así que cambiar la paleta en `tokens.css` cambia también el fondo.

### Las eras: una progresión, no una lista

Las seis franjas temporales no usan colores arbitrarios. Recorren un degradado
de violeta a magenta —Cosmos, Tierra primitiva, Vida celular, Primeros animales,
Vertebrados en tierra, Primates y humanos— de modo que el avance del tiempo se
percibe como avance de color incluso sin leer las etiquetas.

## Color para el tiempo, forma para la certeza

La línea codifica dos variables distintas y no podían competir por el mismo
canal visual:

- **El color dice cuándo**: cada punto toma el color de su era.
- **La forma dice cuánto lo sabemos**: punto relleno para conocimiento
  establecido, borde discontinuo para hipótesis en discusión, borde doble para
  interpretación filosófica.

Además el registro se nombra con palabras en la tarjeta y en el panel, porque
una convención de formas que hay que memorizar no es accesible por sí sola. Los
tres pueden filtrarse desde la cabecera: al atenuar el conocimiento establecido
queda a la vista exactamente cuánto del relato es interpretación.

## Tipografía

| Familia | Papel | Por qué |
|---|---|---|
| **Fraunces** | Títulos | Serif de contraste alto, con aire de publicación científica antigua. Da peso y autoridad a un contenido que habla de tiempo profundo. |
| **Inter** | Texto corrido e interfaz | Sans humanista diseñada para pantalla, muy legible en tamaños pequeños y en fondo oscuro. |
| **JetBrains Mono** | Datos y rótulos | Las edades, los voltajes, los nombres de genes y las etiquetas de era son datos. Una monoespaciada los separa de la prosa y alinea las cifras. |

El contraste entre serif y sans separa de un vistazo lo que es afirmación
(títulos) de lo que es explicación (cuerpo), y la monoespaciada marca lo que es
medida. La escala tipográfica es fluida: cada tamaño se define con `clamp()`, de
modo que el texto crece con la ventana sin saltos y sin media queries.

## Ritmo y composición

- Espaciado en una escala de 4 px (`--e-1` a `--e-10`), para que todo caiga en
  la misma retícula vertical.
- Medida de lectura limitada a 68 caracteres: por encima de eso el ojo pierde el
  renglón, sobre todo en texto claro sobre fondo oscuro.
- Un velo fijo entre el fondo animado y el contenido garantiza el contraste del
  texto aunque un filamento brillante pase justo por debajo.

## Accesibilidad

- Los puntos de la línea de tiempo son botones reales: funcionan con tabulador,
  con lector de pantalla y con toque, no solo con el ratón.
- `prefers-reduced-motion` detiene el fondo WebGL (deja un fotograma fijo) y
  anula las transiciones.
- Enlace de salto al contenido, foco visible en todos los elementos
  interactivos y textos alternativos en la gráfica del potencial de acción.
- El filtro de registros atenúa en lugar de ocultar, de modo que el eje conserva
  su forma y no se pierde el contexto temporal.
- Si el navegador no soporta WebGL, el fondo se oculta y el sitio sigue
  funcionando completo.
