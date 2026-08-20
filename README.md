# Empires Jewelry — Mobile-First Luxury Jewelry E-Commerce & CMS

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed.svg)](https://www.docker.com/)
[![Dokploy](https://img.shields.io/badge/Deploy-Dokploy-00c853.svg)](https://dokploy.com/)
[![WCAG AA](https://img.shields.io/badge/WCAG%20AA-Compliant-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

Aplicación web de comercio electrónico y catálogo interactivo de alta joyería con enfoque **Mobile-First**, arquitectura lista para producción en contenedores **Docker & Dokploy**, y sincronización híbrida con **Cloudflare Workers / D1**.

---

## 💎 Características Principales

### 1. Experiencia de Usuario & Diseño Responsive
- **Enfoque Multidispositivo**:
  - **Móvil (360px - 640px)**: Visor de joyas a pantalla completa (65-75% VH), navegación gestual táctil (*swipe*, *pinch zoom*, doble toque para ampliar), barra inferior táctil (`BottomNav`) y cajones deslizables fluidos.
  - **Tablets (640px - 1024px)**: Cuadrículas de catálogo adaptativas (2 a 3 columnas) y modales con proporción áurea.
  - **Escritorio (1024px+)**: Barra de navegación superior de lujo con accesos directos (*Inicio, Colecciones, Concierge VIP*), selector de divisas en vivo (`USD`, `COP`, `EUR`) y **Visor de Joya en 2 Columnas** (galería interactiva a la izquierda + panel de especificaciones y cotización a la derecha).
- **Sistema de Diseño Empires**:
  - **Paleta de Color**: Crema (`#F5EDE6`), Taupe (`#8A8176`), Piedra (`#CFC7BE`), Oro de 18k (`#D4B48C`), Tinta (`#3A332D`).
  - **Tipografía**: *Cinzel* (títulos y encabezados editoriales) + *Montserrat* (precios, etiquetas y cuerpo de texto).
  - **Zero Emojis**: 100% iconos vectoriales SVG de alta definición (*Lucide React*).
  - **Accesibilidad**: Cumplimiento estricto de **WCAG AA** con ratios de contraste superiores a 4.5:1.

### 2. Catálogo Interactivo & Cotizaciones VIP por WhatsApp
- **Generación Dinámica de Enlaces de WhatsApp**:
  - Consulta individual de pieza con referencia, material y precio estimado en la divisa seleccionada.
  - Cotización por lote (*Bulk Inquiry*) para múltiples piezas seleccionadas en la **Selección Privada (Favoritos)**.
  - Agendamiento de citas VIP en boutique o virtual 1-on-1 (*Concierge Privado*).
- **Guía de Tallas Interactiva**: Inspector visual de diámetros interiores para anillos y tabla de equivalencias internacionales (US, EU, ES), además de guía para pulseras con cierre ajustable *Coulisse*.

### 3. Portal de Administración CMS Integrado
- Acceso discreto vía ruta `/admin`, atajo de teclado `Ctrl+Shift+A` o gesto de **5 toques en el logotipo**.
- Autenticación segura por PIN/Contraseña con protección contra fuerza bruta y bloqueo temporal tras 5 intentos fallidos.
- **CRUD Completo de Joyas**: Crear, editar, duplicar y eliminar piezas con sincronización optimista instantánea (0ms de latencia) y persistencia en segundo plano.
- Vista dual: Tabla ejecutiva y cuadrícula visual de tarjetas.

### 4. Despliegue en Dokploy & Contenedores Docker
- **Docker Compose**: Listo para despliegue en un solo clic desde GitHub en **Dokploy**.
- **Multi-Stage Dockerfile**: Imagen ultraligera basada en Alpine Linux (~25MB) con Nginx 1.27 optimizado, compresión Gzip, headers de seguridad HTTP y endpoint de salud `/health`.
- **Inyección de Variables en Caliente**: Configuración de nombre de tienda, divisa, teléfono de WhatsApp y colores sin necesidad de recompilar la imagen (`window.__RUNTIME_CONFIG__`).

---

## 📁 Estructura del Repositorio

```
.
├── docker-compose.yml              # Orquestación para Dokploy & GitHub
├── Dockerfile                      # Dockerfile multi-stage opcional en raíz
├── .env.example                    # Plantilla de variables de entorno
├── .dockerignore                   # Exclusiones de Docker
├── README.md                       # Documentación general del proyecto
├── DOKPLOY_DEPLOYMENT.md           # Guía paso a paso de despliegue en Dokploy
├── DOCKER_GUIDE.md                 # Guía técnica de contenedores y Nginx
├── RESPONSIVE_DESIGN.md            # Especificación del sistema de diseño responsive
├── PROJECT.md                      # Blueprint técnico y mapa de arquitectura
│
├── empires-jewelry-app/            # Aplicación principal React + Vite + TypeScript
│   ├── docker/                     # Archivos Docker específicos de la app
│   │   ├── Dockerfile              # Multi-stage build (Node 20 + Nginx 1.27)
│   │   ├── docker-compose.yml      # Compose local para desarrollo de tienda
│   │   ├── nginx.conf              # Servidor web optimizado con compresión y SPA fallback
│   │   └── entrypoint.sh           # Inyector de variables de entorno en caliente
│   ├── functions/                  # Cloudflare Pages Functions / REST API
│   │   └── api/                    # Rutas /api/products, /api/auth
│   ├── public/                     # Assets estáticos, logos, fotos y PWA manifest
│   ├── src/
│   │   ├── components/             # Componentes modulares (layout, home, product, admin, ui)
│   │   ├── context/                # Estados globales (AppContext, AdminContext)
│   │   ├── data/                   # Catálogo inicial de productos
│   │   ├── hooks/                  # Custom hooks (gestos, favoritos, filtros, preload)
│   │   ├── services/               # Clientes de API y almacenamiento resiliente
│   │   ├── types/                  # Definiciones de TypeScript
│   │   └── utils/                  # Formateadores, enlaces WhatsApp y contraste
│   └── tests/                      # Suite de 163+ pruebas automatizadas (Vitest)
│
├── empires-clothing-app/           # Módulo experimental de indumentaria complementaria
└── whatsapp-emprendedor-tool/      # Servidor MCP y herramientas para emprendedores
```

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js**: Versión 18 o superior (recomendado Node 20 LTS).
- **Docker & Docker Compose** (para ejecución en contenedores).

### 1. Desarrollo Local con Node / Vite
```bash
# Ingresar a la aplicación
cd empires-jewelry-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con Hot Module Replacement
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 2. Ejecutar Pruebas Automatizadas
```bash
cd empires-jewelry-app
npm test -- --run
```

### 3. Compilación para Producción
```bash
cd empires-jewelry-app
npm run build
```

### 4. Despliegue Local con Docker Compose
```bash
# Copiar variables de entorno
cp .env.example .env

# Construir y levantar contenedor
docker compose up --build -d
```
La tienda estará lista en `http://localhost:3000`.

---

## 🌐 Despliegue en Dokploy a través de GitHub

Para desplegar este proyecto en tu servidor VPS mediante **Dokploy**:
1. Sube este repositorio a tu cuenta de **GitHub**.
2. En tu panel de **Dokploy**, crea un nuevo servicio de tipo **Compose** (o **Application**).
3. Conecta tu repositorio de GitHub y selecciona la rama `main`.
4. Define las variables de entorno especificadas en `.env.example`.
5. Asigna tu dominio (ej. `joyeria.tudominio.com`). Dokploy generará automáticamente el certificado **SSL/TLS (Let's Encrypt)** mediante Traefik.

> 📖 Consulta la guía completa y detallada en [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md).

---

## 🔒 Acceso Administrativo (CMS)

- **Ruta Directa**: Ingresa a `/admin` o añade `#admin` a la URL.
- **Atajo de Teclado**: Presiona `Ctrl + Shift + A` (o `Cmd + Shift + A` en macOS).
- **Gesto Secreto**: Da **5 toques consecutivos** en el logotipo central de la cabecera.
- **PIN por Defecto**: `1879` (o `empires2026`). Se puede cambiar mediante la variable `STORE_ADMIN_PIN`.

---

## 📜 Licencia & Créditos

Desarrollado para **Empires Jewelry**. Todos los derechos reservados © 2026.
Diseñado con los más altos estándares de alta joyería, diseño editorial y rendimiento web moderno.
