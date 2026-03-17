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

---

## Alternativa: MongoDB Atlas (base de datos en la nube)

### Lo que NO necesitás hacer

- No necesitás instalar MongoDB en tu computadora
- No necesitás configurar `bindIp` en `mongod.conf`
- No necesitás `--network host`

### Lo único que cambia es la URI

En lugar de:
```
mongodb://127.0.0.1:27017/adoptme
```

Usás la URI de Atlas que se ve así:
```
mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/adoptme
```

### Cómo obtener la URI de Atlas

1. Entrá a [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Seleccioná tu cluster
3. Click en **Connect**
4. Click en **Drivers**
5. Copiá la URI que aparece y reemplazá `<password>` con tu contraseña

### Comando para correr el contenedor con Atlas
```bash
docker run -d \
  --name adoptme-container \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/adoptme" \
  -e PORT=3000 \
  maxifana/adoptme:latest
```

> Con Atlas usás `-p 3000:3000` en lugar de `--network host` porque la base de datos está en la nube y no en tu máquina local.

### Importante: habilitar tu IP en Atlas

Atlas por defecto bloquea todas las IPs. Antes de correr el contenedor:

1. En Atlas → **Network Access**
2. Click en **Add IP Address**
3. Click en **Allow Access from Anywhere** (para testing)
4. Click en **Confirm**
