# Publicar en un bucket de S3

## 1. Generar el sitio

```bash
npm run build
```

Todo lo que hay que subir queda en `dist/`. Nada más: no hay servidor ni proceso
en ejecución.

## 2. Crear el bucket

En la consola de AWS → S3 → **Crear bucket**:

- Nombre: por ejemplo `cerebro-linea-de-tiempo`
- Región: la más cercana (por ejemplo `us-east-1`)
- **Desmarcar** "Bloquear todo el acceso público" (el sitio es público)

## 3. Activar el alojamiento de sitios web

Propiedades → *Alojamiento de sitios web estáticos* → Habilitar:

- Documento de índice: `index.html`
- Documento de error: `index.html`

Al guardar, AWS entrega la URL del sitio
(`http://<bucket>.s3-website-<region>.amazonaws.com`).

## 4. Política de lectura pública

Permisos → *Política del bucket*:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "LecturaPublica",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::NOMBRE-DEL-BUCKET/*"
  }]
}
```

## 5. Subir

Desde la consola: arrastrar **el contenido** de `dist/` (no la carpeta `dist`
en sí) a la raíz del bucket.

Con la CLI de AWS:

```bash
aws s3 sync dist/ s3://NOMBRE-DEL-BUCKET/ --delete
```

## 6. Comprobaciones después de publicar

- `data/timeline.json` responde con `Content-Type: application/json`.
- La línea de tiempo carga los hitos (si no, mirar la consola del navegador).
- Las cuatro páginas se abren desde el menú.

## Notas

- Los nombres de los assets son estables entre versiones, así que conviene
  subirlos con `Cache-Control: max-age=300` o invalidar la caché si más adelante
  se pone CloudFront delante.
- Para HTTPS y dominio propio hace falta CloudFront con un certificado de ACM;
  el bucket por sí solo sirve el sitio por HTTP.
