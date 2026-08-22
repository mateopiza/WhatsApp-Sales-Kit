# Guía de Despliegue en Dokploy a través de GitHub

Esta guía describe el procedimiento detallado para desplegar la plataforma **Empires Jewelry** en un servidor VPS propio utilizando **Dokploy** (Plataforma como Servicio / PaaS autoalojada) conectada directamente a tu repositorio de **GitHub** con integración continua (CI/CD).

---

## 🏗️ Requisitos Previos

1. **Servidor VPS**: Un servidor con Ubuntu 22.04 / 24.04 o Debian 12 con Docker y Dokploy instalado (mínimo 1 vCPU y 1 GB RAM).
2. **Instalación de Dokploy**: Dokploy corriendo en tu servidor (usualmente accesible en el puerto `3000` o en tu subdominio de administración como `dokploy.tudominio.com`).
3. **Repositorio en GitHub**: Este repositorio subido a tu cuenta u organización de GitHub.
4. **Dominio / DNS**: Un registro DNS tipo `A` apuntando a la IP pública de tu servidor VPS (por ejemplo `joyeria.tudominio.com` -> `IP_DEL_VPS`).

---

## 🚀 Paso a Paso: Despliegue en Dokploy

### Opción 1: Despliegue mediante Docker Compose (Recomendado)

Esta opción utiliza el archivo `docker-compose.yml` de la raíz del proyecto para orquestar la tienda, los volúmenes de persistencia y la configuración de Traefik.

#### 1. Crear un Proyecto y Servicio Compose en Dokploy
1. Inicia sesión en tu panel de **Dokploy**.
2. Dirígete a la sección **Projects** y haz clic en **Create Project** (ej. `Empires-Jewelry`).
3. Dentro del proyecto, haz clic en **Add Service** y selecciona **Compose**.
4. Asigna un nombre al servicio (ej. `empires-store`).

#### 2. Conectar el Repositorio de GitHub
1. En la pestaña **General** / **Source Type**, selecciona **GitHub**.
2. Si es la primera vez, autoriza la GitHub App de Dokploy para dar acceso a tu repositorio.
3. Selecciona tu repositorio (ej. `usuario/empires-jewelry`) y la rama de producción (`main` o `master`).
4. En **Compose Path**, escribe:
   ```
   ./docker-compose.yml
   ```

#### 3. Configurar Variables de Entorno
Dirígete a la pestaña **Environment** en Dokploy y añade las siguientes variables según las necesidades de tu boutique:

```env
# Dominio asignado en tu DNS
DOMAIN=joyeria.tudominio.com

# Puerto de la aplicación (interno en la red de Dokploy)
STORE_PORT=3000

# Identidad de la marca
STORE_NAME=Empires Jewelry
STORE_CURRENCY=USD
STORE_WHATSAPP_PHONE=573001234567
STORE_PRIMARY_COLOR=#D4B48C
STORE_ACCENT_COLOR=#3A332D

# PIN de acceso administrativo al CMS
STORE_ADMIN_PIN=1879

# Eslogan y detalles
STORE_TAGLINE=Joyería de Alta Distinción
```

#### 4. Configurar Dominio y SSL Automático (Traefik)
1. En la pestaña **Domains** de tu servicio en Dokploy:
   - Haz clic en **Add Domain**.
   - Ingresa tu dominio o subdominio (ej. `joyeria.tudominio.com`).
   - Selecciona el puerto del contenedor: `80`.
   - Activa la casilla **HTTPS** y selecciona el emisor de certificados **Let's Encrypt**.
2. Dokploy y su proxy Traefik generarán y renovarán automáticamente el certificado SSL/TLS gratuito.

#### 5. Desplegar (Deploy)
1. Haz clic en el botón **Deploy** en la parte superior derecha.
2. Observa los logs en tiempo real en la pestaña **Deployments**. Dokploy ejecutará la compilación multi-stage de Vite y levantará el contenedor de Nginx en segundos.
3. Una vez finalizado el estado cambiará a `Running` / `Healthy`.

---

### Opción 2: Despliegue directo mediante Dockerfile (Alternativa)

Si prefieres desplegar únicamente como una **Application** en lugar de Compose:
1. En Dokploy, haz clic en **Add Service** -> **Application**.
2. Selecciona tu repositorio de GitHub y la rama `main`.
3. En **Build Type**, selecciona **Dockerfile**.
4. En **Dockerfile Path**, ingresa:
   ```
   ./templates/jewelry/docker/Dockerfile
   ```
5. En **Context Path**, ingresa:
   ```
   ./templates/jewelry
   ```
6. En **Ports**, mapea el puerto del contenedor `80`.
7. Define las variables de entorno y haz clic en **Deploy**.

---

## 🔄 Integración Continua y Auto-Deploy (Webhooks de GitHub)

Dokploy permite que cada vez que hagas `git push` a la rama `main`, la aplicación se recompile y actualice automáticamente sin tiempo de inactividad (*Zero-Downtime Deployment*).

### Cómo activar el despliegue automático:
1. En la pestaña **General** de tu servicio en Dokploy, activa la casilla **Auto Deploy**.
2. Dokploy registrará automáticamente el Webhook en tu repositorio de GitHub.
3. Al realizar cualquier commit en GitHub:
   ```bash
   git add .
   git commit -m "feat: actualizar catálogo de piezas"
   git push origin main
   ```
4. Dokploy recibirá el evento push, descargará el código, compilará y actualizará el contenedor en vivo.

---

## 🛠️ Comandos de Mantenimiento y Logs

### Ver logs en vivo desde Dokploy
En la pestaña **Logs** de tu servicio podrás visualizar los accesos y registros de Nginx y del inyector de configuración en tiempo real.

### Ver logs desde la terminal del VPS
```bash
# Listar contenedores en ejecución
docker ps --filter "name=empires"

# Ver logs del contenedor en tiempo real
docker logs -f empires-store

# Probar el endpoint de salud local
curl -i http://localhost:3000/health
```

---

## 🔐 Seguridad y Buenas Prácticas en Producción

1. **Cambiar el PIN del CMS**: Modifica siempre `STORE_ADMIN_PIN` en las variables de entorno de Dokploy por una clave segura.
2. **Protección contra Fuerza Bruta**: La aplicación bloquea automáticamente el acceso tras 5 intentos fallidos consecutivos durante 15 minutos.
3. **Headers de Seguridad Nginx**: El contenedor ya incluye cabeceras `X-Frame-Options`, `X-Content-Type-Options` y `Referrer-Policy`.
4. **Resiliencia Offline**: La aplicación cuenta con almacenamiento caché local resiliente (`localStorage` + `IndexedDB`), garantizando que si el servidor o la red fallan momentáneamente, el catálogo sigue visible para los clientes.
