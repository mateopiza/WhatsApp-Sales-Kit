# Guía Técnica de Arquitectura Docker & Nginx

Este documento detalla la arquitectura de contenedores, la optimización del servidor web Nginx y el mecanismo de inyección de configuración en tiempo de ejecución para **Empires Jewelry**.

---

## 🏗️ Arquitectura Multi-Stage del Dockerfile

El contenedor de producción utiliza una estrategia de compilación en dos etapas (*Multi-Stage Build*) para reducir el tamaño final de la imagen a aproximadamente **25 MB** y evitar incluir herramientas de desarrollo (Node, npm, TypeScript compiler) en el entorno de producción.

```
┌────────────────────────────────────────────────────────┐
│ Stage 1: Builder (node:20-alpine)                      │
│ 1. Copia package.json y package-lock.json             │
│ 2. Ejecuta npm ci --frozen-lockfile                    │
│ 3. Copia código fuente y compila con Vite / TypeScript │
│ 4. Genera carpeta /app/dist optimizada                │
└──────────────────────────┬─────────────────────────────┘
                           │ Extrae únicamente /dist
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 2: Runtime (nginx:1.27-alpine)                   │
│ 1. Copia /app/dist -> /usr/share/nginx/html            │
│ 2. Copia configuración Nginx con Gzip y caché          │
│ 3. Inyecta entrypoint.sh para variables en caliente   │
│ 4. Expone puerto 80 con Healthcheck /health            │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Inyección de Variables en Tiempo de Ejecución

A diferencia de las aplicaciones React tradicionales que requieren recompilar todo el código cuando cambian las variables de entorno, este proyecto utiliza un patrón de **inyección en caliente** mediante `entrypoint.sh`.

### ¿Cómo funciona?
1. Cuando el contenedor arranca, el script `entrypoint.sh` lee las variables de entorno del sistema (`STORE_NAME`, `STORE_CURRENCY`, `STORE_WHATSAPP_PHONE`, `STORE_ADMIN_PIN`, etc.).
2. Genera un archivo estático `/usr/share/nginx/html/runtime-config.js` con el objeto global:
   ```javascript
   window.__RUNTIME_CONFIG__ = {
     storeName: "Empires Jewelry",
     storeCurrency: "USD",
     storeWhatsappPhone: "573001234567",
     storePrimaryColor: "#D4B48C",
     storeAccentColor: "#3A332D",
     storeAdminPin: "1879",
     storeLogoUrl: "",
     storeTagline: "Joyería de Alta Distinción"
   };
   ```
3. El frontend de React lee este objeto al inicializarse con fallback a valores por defecto.
4. **Beneficio**: Puedes cambiar el teléfono de WhatsApp, el PIN o la moneda cambiando simplemente la variable en Dokploy o `docker-compose.yml` y reiniciando el contenedor, ¡sin tener que esperar una nueva compilación de 5 minutos!

---

## 🌐 Configuración de Nginx (`nginx.conf`)

El servidor Nginx está optimizado para alto rendimiento y seguridad:

### 1. Compresión Gzip
Reduce la transferencia de datos en más de un 70% para archivos CSS, JS, SVG y JSON:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
gzip_min_length 256;
```

### 2. Caché Agresivo para Assets con Hash
Los archivos estáticos generados por Vite (`/assets/*.js`, `/assets/*.css`, imágenes y fuentes) se sirven con cabeceras de caché inmutable de 1 año:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|woff|ttf)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Exclusión de Caché para `runtime-config.js`
El archivo de configuración en caliente nunca se almacena en caché para reflejar cambios inmediatamente tras un reinicio del contenedor:
```nginx
location = /runtime-config.js {
    expires off;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

### 4. Enrutamiento SPA (Single Page Application Fallback)
Cualquier ruta profunda (como `/admin`, `/colecciones`, `/anillos`) se redirige a `index.html` sin generar errores 404:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 5. Verificación de Salud (`/health`)
Endpoint ligero utilizado por Docker, Traefik y Dokploy para monitorizar la salud del servicio sin escribir en los logs de acceso:
```nginx
location = /health {
    access_log off;
    return 200 '{"status":"ok"}';
    add_header Content-Type application/json;
}
```

---

## 🧪 Pruebas Locales con Docker

### 1. Construir la imagen localmente
```bash
docker build -f empires-jewelry-app/docker/Dockerfile -t empires-jewelry-app:local ./empires-jewelry-app
```

### 2. Ejecutar un contenedor de prueba
```bash
docker run -d \
  --name test-empires \
  -p 8080:80 \
  -e STORE_NAME="Empires Joyería Fina" \
  -e STORE_CURRENCY="COP" \
  -e STORE_WHATSAPP_PHONE="573109876543" \
  empires-jewelry-app:local
```

### 3. Verificar estado y funcionamiento
```bash
# Probar endpoint de salud
curl -i http://localhost:8080/health

# Probar la inyección de runtime config
curl http://localhost:8080/runtime-config.js

# Detener y eliminar contenedor de prueba
docker stop test-empires && docker rm test-empires
```
