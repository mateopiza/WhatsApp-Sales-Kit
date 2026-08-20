# 🇨🇴 WhatsApp Sales Kit & Empires E-Commerce — Edición Open Source & Solidaria

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Solidaridad Colombia](https://img.shields.io/badge/🇨🇴_Solidaridad-Colombia_Terremoto-green.svg)](MANIFESTO_COLOMBIA.md)
[![Google Antigravity Ready](https://img.shields.io/badge/Google_Antigravity-AI_Ready-4285F4.svg)](GUIA_ANTIGRAVITY.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-163%20Passing-brightgreen.svg)](#-pruebas-automatizadas-y-calidad)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed.svg)](https://www.docker.com/)
[![Dokploy](https://img.shields.io/badge/Deploy-Dokploy-00c853.svg)](DOKPLOY_DEPLOYMENT.md)
[![WCAG AA](https://img.shields.io/badge/WCAG%20AA-Compliant-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

**Plataforma de comercio electrónico móvil, catálogo interactivo y ventas directas por WhatsApp, liberada como software 100% libre y de código abierto (MIT) para impulsar la reactivación económica de emprendedores y artesanos colombianos.**

[🕊️ Leer Manifiesto Solidario](MANIFESTO_COLOMBIA.md) • [🚀 Guía Google Antigravity](GUIA_ANTIGRAVITY.md) • [🌐 Despliegue en Dokploy](DOKPLOY_DEPLOYMENT.md) • [🐳 Guía Docker](DOCKER_GUIDE.md)

</div>

---

## 🕊️ Misión Moral: Solidaridad con los Emprendedores Afectados por el Terremoto en Colombia

> En momentos de crisis y desastres naturales, como los terremotos que han impactado diversas regiones de Colombia, los pequeños comerciantes, artesanos, joyeros y microempresarios pierden con frecuencia sus locales físicos, talleres y puntos de venta.
>
> Para reconstruirse, **no necesitan costos fijos mensuales de plataformas de comercio electrónico (SaaS de $30 - $300 USD/mes), ni comisiones bancarias asfixiantes, ni trámites burocráticos**. Necesitan una vitrina digital inmediata, elegante y de costo $0 que les permita vender directamente a través del canal más utilizado en Colombia y América Latina: **WhatsApp**.
>
> Por esta razón ética y humanitaria, este proyecto se ha liberado bajo la **Licencia MIT (Open Source)**: para que cualquier persona, fundación o negocio pueda clonarlo, adaptarlo con Inteligencia Artificial en **Google Antigravity** y poner a vender su negocio sin pagar un solo peso de comisiones ni licencias.
>
> 📖 *Conoce todos los detalles en nuestro [Manifiesto de Solidaridad para Colombia](MANIFESTO_COLOMBIA.md).*

---

## 📑 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Arquitectura y Stack Tecnológico](#-arquitectura-y-stack-tecnológico)
3. [Cómo Editar y Personalizar en Google Antigravity](#-cómo-editar-y-personalizar-en-google-antigravity)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Inicio Rápido Local](#-inicio-rápido-local)
6. [Pruebas Automatizadas y Calidad](#-pruebas-automatizadas-y-calidad)
7. [Despliegue a Producción (Costo $0)](#-despliegue-a-producción-costo-0)
8. [Portal Administrativo (CMS)](#-portal-administrativo-cms)
9. [Contribuir al Proyecto](#-contribuir-al-proyecto)
10. [Licencia](#-licencia)

---

## 💎 Características Principales

```
                                  ┌────────────────────────────────┐
                                  │   EXPERIENCIA WHATSAPP SALES   │
                                  └───────────────┬────────────────┘
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         │                                        │                                        │
         ▼                                        ▼                                        ▼
┌──────────────────┐                    ┌──────────────────┐                     ┌──────────────────┐
│  Mobile-First UI │                    │ Cotización 1-Clic│                     │   Panel CMS /    │
│  Visor 75% VH    │                    │ Enlaces WhatsApp │                     │  Persistencia D1 │
│  Gestos táctiles │                    │ COP, USD, EUR    │                     │  0ms Latencia    │
└──────────────────┘                    └──────────────────┘                     └──────────────────┘
```

### 1. Experiencia de Usuario Mobile-First de Lujo
- **Diseñado para Pantallas Táctiles**:
  - **Móvil (360px - 640px)**: Visor de productos inmersivo (65-75% VH), gestos de deslizamiento (*swipe*), pellizco para zoom (*pinch-to-zoom*), doble toque y barra de navegación inferior táctil (`BottomNav`).
  - **Tablets y Escritorio (1024px+)**: Vista de catálogo en 2 columnas con galería fija y panel interactivo de especificaciones.
- **Sistema de Diseño Empires**:
  - Paleta refinada: Crema (`#F5EDE6`), Taupe (`#8A8176`), Oro 18k (`#D4B48C`), Tinta (`#3A332D`).
  - Tipografía editorial: *Cinzel* (títulos de alta gama) + *Montserrat* (cuerpo y precios).
  - **Zero Emojis en Interfaz**: 100% iconos vectoriales SVG de alta definición mediante **Lucide React**.
  - **Accesibilidad Total (WCAG AA)** con ratios de contraste probados ≥ 4.5:1.

### 2. Conversión Directa por WhatsApp & Moneda en Vivo
- **Cotización de Producto Individual**: Enlace automático que envía la referencia exacta, nombre, precio calculado en `COP`, `USD` o `EUR` y foto de la joya.
- **Selección Privada & Cotización por Lote (*Bulk Inquiry*)**: El cliente guarda sus productos favoritos y genera una cotización unificada con un solo toque.
- **Agendamiento VIP**: Botón para programar asesoría personalizada presencial o por videollamada.

### 3. CMS Administrativo Integrado
- Acceso seguro mediante PIN/Contraseña en la ruta `/admin` o con el atajo `Ctrl + Shift + A` (o 5 toques en el logotipo).
- **CRUD Completo**: Crear, editar, duplicar y eliminar piezas del catálogo en tiempo real con actualización optimista (0ms de latencia) y persistencia en segundo plano.

### 4. Modo Offline & PWA
- Funcionamiento garantizado en redes móviles inestables con almacenamiento local seguro en `localStorage` y soporte PWA.

---

## 🛠️ Arquitectura y Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 18, TypeScript 5.5, Vite 5.4, Tailwind CSS 3.4, Lucide React |
| **Testing** | Vitest 1.3, React Testing Library, JSDOM (163+ pruebas automatizadas) |
| **Backend Opcional / Edge** | Cloudflare Pages Functions, Cloudflare Workers, Cloudflare D1 (SQLite) |
| **Contenedores** | Docker Multi-Stage (Node 20 Alpine + Nginx 1.27 con compresión Gzip) |
| **Orquestación & VPS** | Dokploy, Docker Compose, Traefik con SSL automático Let's Encrypt |
| **IA & Desarrollo Agéntico** | Google Antigravity (AGY IDE, SDK & Prompts en Lenguaje Natural) |
| **MCP (Model Context)** | Servidor MCP integrado para gestión conversacional del catálogo |

---

## 🤖 Cómo Editar y Personalizar en Google Antigravity

Este proyecto está 100% optimizado para ser desarrollado, editado y extendido mediante **Google Antigravity (AGY)**. Con Antigravity, puedes modificar todo el proyecto usando simples instrucciones en español.

### ¿Cómo empezar con Antigravity?
1. Abre esta carpeta en el entorno de **Google Antigravity**.
2. Utiliza los comandos slash y prompts en lenguaje natural:
   - `/goal`: Ejecuta tareas autónomas de refactorización o auditoría profunda.
   - `/teamwork-preview`: Activa equipos multi-agente para grandes expansiones de catálogo o nuevas funciones.
   - `/browser`: Previsualiza e interactúa en vivo con la tienda en el navegador integrado.
   - `/grill-me`: Realiza una sesión interactiva para definir los productos y precios de tu tienda.
   - `/learn`: Guarda las preferencias de tu marca para futuras sesiones.

### Ejemplos de Prompts Rápidos para Antigravity:
```text
"Antigravity, cambia el número de WhatsApp a +573001234567, el nombre a 'Joyería La Candelaria' y pon como moneda principal el Peso Colombiano (COP)."
```
```text
"Agrega 4 nuevos anillos de compromiso al catálogo en src/data/products.ts con fotos y descripciones elegantes."
```

> 📘 **Aprende todo sobre cómo trabajar con Antigravity en la [Guía Maestra de Antigravity (GUIA_ANTIGRAVITY.md)](GUIA_ANTIGRAVITY.md).**

---

## 📁 Estructura del Proyecto

```
.
├── LICENSE                         # Licencia Open Source MIT
├── MANIFESTO_COLOMBIA.md           # Manifiesto humanitario para emprendedores de Colombia
├── GUIA_ANTIGRAVITY.md             # Manual completo de desarrollo con Google Antigravity
├── CONTRIBUTING.md                 # Guía de contribución para la comunidad Open Source
├── DOKPLOY_DEPLOYMENT.md           # Guía de despliegue en Dokploy (VPS)
├── DOCKER_GUIDE.md                 # Manual de contenedores Docker y Nginx
├── RESPONSIVE_DESIGN.md            # Especificación del sistema responsive
├── PROJECT.md                      # Blueprint técnico y arquitectura de componentes
├── docker-compose.yml              # Orquestación de contenedores para producción
├── .env.example                    # Plantilla de variables de entorno
│
├── empires-jewelry-app/            # Aplicación principal de comercio electrónico
│   ├── src/
│   │   ├── components/             # Componentes modulares (UI, Home, ProductViewer, Admin, Cart)
│   │   ├── context/                # Contextos globales (AppContext, AdminContext)
│   │   ├── data/products.ts        # 📦 Catálogo de productos
│   │   ├── hooks/                  # Custom hooks (gestos táctiles, favoritos, búsqueda, precarga)
│   │   ├── utils/                  # Generador de enlaces WhatsApp, formateadores de moneda
│   │   └── types/                  # Definiciones estrictas de TypeScript
│   ├── functions/                  # API serverless opcional para Cloudflare Workers
│   ├── public/                     # Assets estáticos, logos, fotos y manifiesto PWA
│   ├── tests/                      # 163+ pruebas automatizadas con Vitest
│   └── docker/                     # Dockerfile y configuración Nginx
│
├── empires-clothing-app/           # Módulo complementario de indumentaria y moda
└── whatsapp-emprendedor-tool/      # Servidor MCP y herramientas de asistencia conversacional
```

---

## 🚀 Inicio Rápido Local

### Requisitos Previos
- **Node.js**: Versión 18 o superior (recomendado Node 20 LTS).
- **Docker & Docker Compose** (opcional, para ejecución contenerizada).

### 1. Desarrollo con Hot Reload (Vite)
```bash
# Ingresar al directorio de la aplicación
cd empires-jewelry-app

# Instalar dependencias
npm install

# Iniciar servidor local
npm run dev
```
La aplicación estará disponible inmediatamente en `http://localhost:5173`.

### 2. Ejecutar con Docker Compose
```bash
# Copiar variables de entorno
cp .env.example .env

# Levantar contenedor
docker compose up --build -d
```
Accede a la tienda en `http://localhost:3000`.

---

## 🧪 Pruebas Automatizadas y Calidad

El proyecto incluye una batería exhaustiva de **163 pruebas automatizadas** que cubren:
- Reglas de contraste WCAG AA en todas las combinaciones de color.
- Verificación estricta de **cero emojis no controlados** en la UI.
- Generación de enlaces y encoding de mensajes para WhatsApp.
- Flujos de usuario completos: navegación por gestos, búsqueda, carrito, selección privada y panel CMS.

Para correr toda la suite de pruebas:
```bash
cd empires-jewelry-app
npm test
```

---

## 🌐 Despliegue a Producción (Costo $0)

### Opción A: Despliegue en Dokploy (Recomendado para VPS)
1. Conecta este repositorio en tu panel de **Dokploy**.
2. Selecciona la rama `main` y tipo de servicio `Compose`.
3. Dokploy levantará el contenedor Docker y configurará tu dominio con SSL gratuito (Let's Encrypt).
4. *Guía paso a paso en [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md).*

### Opción B: Cloudflare Pages (Hosting Gratuito en el Edge)
```bash
cd empires-jewelry-app
npm run build
npm run deploy
```

---

## 🔒 Portal Administrativo (CMS)

- **Acceso Directo**: Dirígete a la ruta `/admin` en tu navegador.
- **Atajo de Teclado**: Presiona `Ctrl + Shift + A` (o `Cmd + Shift + A` en Mac).
- **Gesto Secreto en Móvil**: Pulsa **5 veces consecutivas** sobre el logo de la cabecera.
- **PIN por Defecto**: `1879` (configurable mediante la variable de entorno `STORE_ADMIN_PIN`).

---

## 🤝 Contribuir al Proyecto

¡Las contribuciones de la comunidad son bienvenidas! Si deseas agregar nuevas plantillas para otros sectores (ropa, café, artesanías, calzado), mejorar el rendimiento o reportar mejoras:
1. Lee nuestra [Guía de Contribución (CONTRIBUTING.md)](CONTRIBUTING.md).
2. Abre un Issue o un Pull Request.

---

## 📜 Licencia & Créditos

Este proyecto es software libre distribuido bajo la **[Licencia MIT](LICENSE)**.

Creado con amor y solidaridad para los emprendedores, artesanos y joyeros de Colombia y América Latina.  
**¡La tecnología abierta al servicio de la reconstrucción y el progreso! 🇨🇴✨**
