# Publicar en GitHub Pages con CI/CD

El sitio se publica solo: cada push a `main` valida los datos, construye y
despliega. La URL será

    https://cristianino.github.io/del-universo-a-la-conciencia/

El proyecto ya está preparado para vivir en un subdirectorio: `vite.config.js`
usa `base: './'`, así que todas las rutas son relativas y no hay que tocar nada.

## 1. Activar Pages en el repositorio

Settings → Pages → **Source: GitHub Actions**.

No elijas "Deploy from a branch": esa opción publica archivos ya construidos, y
aquí quien construye es el workflow.

## 2. Guardar los secretos (opcional)

Settings → Secrets and variables → Actions → **New repository secret**:

| Secreto | Qué contiene |
|---|---|
| `VITE_CORREO_CONTACTO` | El alias de correo para el formulario |
| `VITE_ENDPOINT_FORMULARIO` | La URL del servicio de formularios, si lo usas |

Si no existen, el build sale igual y el formulario deriva al foro. Son opcionales.

Ten en cuenta que un secreto de Actions protege el valor **en GitHub**, pero el
build lo inyecta en el JavaScript publicado: cualquiera puede leerlo en el sitio.
Sirve para no dejar la dirección en el repositorio, no para mantenerla en
secreto. Por eso conviene que sea un alias de reenvío, no la dirección personal.

## 3. Hacer el primer despliegue

El workflow vive en `.github/workflows/desplegar.yml` y se dispara con cada push
a `main`. Al trabajar en otra rama, el despliegue ocurre cuando integras:

```bash
git checkout main
git merge <tu-rama>
git push
```

También puedes lanzarlo a mano: pestaña Actions → *Desplegar en GitHub Pages* →
**Run workflow**.

El primer despliegue tarda un par de minutos e incluye un paso extra en el que
GitHub crea el entorno `github-pages`. Cuando el job `desplegar` termina, la URL
aparece en el resumen del propio workflow y en Settings → Pages.

## 4. Qué hace el workflow

1. `npm ci` — instala exactamente lo que dice `package-lock.json`.
2. `npm run validar` — revisa `timeline.json`: campos obligatorios, ids
   repetidos, eras inexistentes, registros desconocidos, huecos en la escala y
   hitos fuera de rango. Si algo falla, **no se publica nada**.
3. `npm run build` — genera `dist/`.
4. `upload-pages-artifact` + `deploy-pages` — publican esa carpeta.

Los permisos del token están limitados a lo justo (`contents: read`,
`pages: write`, `id-token: write`), y `concurrency` evita que dos push seguidos
se pisen: se publica el último.

## 5. Corregir contenido sin desplegar

Como los hitos viven en `public/data/timeline.json`, para un cambio de texto
basta con editar ese archivo y empujar a `main`: el workflow lo valida y lo
publica sin que tengas que construir nada en tu máquina.

Antes de empujar, conviene comprobarlo en local:

```bash
npm run validar
npm run dev
```

## Publicar además en S3

No son excluyentes: el `dist` es el mismo. Los pasos del bucket están en
`despliegue-s3.md`. La diferencia práctica es que Pages sirve por HTTPS sin
configurar nada, mientras que el bucket solo da HTTP salvo que le pongas
CloudFront delante con un certificado de ACM.
