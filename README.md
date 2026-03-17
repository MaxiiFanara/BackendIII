# AdoptMe — API REST de adopción de mascotas

API REST construida con Node.js, Express y MongoDB para gestionar la adopción de mascotas.

---

## Imagen en Docker Hub

```
docker pull maxifana/adoptme:latest
```

🔗 **Link público:** [https://hub.docker.com/r/maxifana/adoptme](https://hub.docker.com/r/maxifana/adoptme)

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y corriendo
- [MongoDB](https://www.mongodb.com/try/download/community) corriendo localmente en el puerto `27017`

---

## Ejecutar el proyecto

```bash
docker run -d \
  --name adoptme-container \
  --network host \
  -e MONGODB_URI=mongodb://127.0.0.1:27017/adoptme \
  -e PORT=3000 \
  maxifana/adoptme:latest
```

> **Windows/Mac:** reemplazá `--network host` y `127.0.0.1` por `-p 3000:3000` y `host.docker.internal`:
> ```bash
> docker run -d \
>   --name adoptme-container \
>   -p 3000:3000 \
>   -e MONGODB_URI=mongodb://host.docker.internal:27017/adoptme \
>   -e PORT=3000 \
>   maxifana/adoptme:latest
> ```

---

## Acceder al proyecto

Una vez levantado el contenedor, abrí el navegador en:

```
http://localhost:3000/api/docs
```

Desde ahí podés ver y probar todos los endpoints disponibles a través de la interfaz Swagger.

---

## Construir la imagen localmente

Si preferís construir la imagen desde el código fuente en lugar de descargarla:

```bash
docker build -t maxifana/adoptme:latest .
```

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (default: `3000`) |
| `MONGODB_URI` | URI de conexión a MongoDB |
