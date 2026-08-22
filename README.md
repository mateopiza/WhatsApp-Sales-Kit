# WhatsApp Sales Kit

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-163%20passing-brightgreen.svg)](#-características)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed.svg)](https://www.docker.com/)
[![Dokploy](https://img.shields.io/badge/Deploy-Dokploy-00c853.svg)](docs/DOKPLOY_DEPLOYMENT.md)

**Open-source starter kit for WhatsApp-first commerce.**

Una plataforma reutilizable para que pequeños negocios creen catálogo digital, reciban solicitudes de compra y conviertan clientes directamente por WhatsApp — sin depender de una plataforma de e-commerce con comisiones mensuales.

[🚀 Quick Start](#-quick-start) • [📦 Templates](#-templates-incluidos) • [🏗️ Arquitectura](#-arquitectura) • [🌐 Deploy](#-deploy) • [🤖 Personalización con IA](#-personalización-con-ia)

</div>

---

## 🧭 Cómo funciona

```
WhatsApp Sales Kit
       ↓
   Starter Kit
       ↓
 Elige un Template
       ↓
   Personaliza
       ↓
 Carga Productos
       ↓
 Conecta WhatsApp
       ↓
    Deploy
```

`WhatsApp-Sales-Kit` es el framework base. Las demos de **jewelry** y
**clothing** existen para *mostrar de qué es capaz* — no son productos
independientes ni tiendas reales de una marca. Cualquiera puede tomar una
plantilla (o partir de `blank`, la base limpia), cambiar branding,
productos y número de WhatsApp, y desplegar su propia tienda en minutos.

---

## 💎 Características

- **Storefront mobile-first**: visor de producto a pantalla completa con gestos táctiles (swipe, pinch-zoom), diseño responsive de móvil a escritorio 4K.
- **Catálogo de productos**: categorías, colecciones, disponibilidad, búsqueda y filtros instantáneos.
- **Solicitudes por WhatsApp**: enlace de cotización de un clic por producto, con precio, referencia y mensaje pre-formateado.
- **Cotización por lote**: el cliente guarda favoritos y genera una sola consulta de WhatsApp con todos los productos seleccionados.
- **CMS de administración**: portal protegido por PIN para crear, editar y eliminar productos, con sincronización optimista.
- **PWA / modo offline**: instalable en el celular, catálogo disponible sin conexión vía almacenamiento local.
- **Multi-moneda**: USD, COP, EUR listos de fábrica.
- **Docker & Dokploy**: contenedor multi-stage con inyección de configuración en caliente (rebrandea sin recompilar).
- **Cloudflare Pages / Workers**: backend opcional con D1 (SQL), KV (caché) y fallback local — funciona con o sin Cloudflare.
- **Tests automatizados**: 163 pruebas (Vitest) en cada template con backend completo.
- **Personalización asistida por IA**: pensado para editarse con Google Antigravity, Claude Code u otras herramientas agénticas usando lenguaje natural.

---

## 🚀 Quick Start

```bash
git clone https://github.com/mateopiza/WhatsApp-Sales-Kit.git
cd WhatsApp-Sales-Kit
```

Para crear tu propia tienda, parte de `templates/blank` — la base limpia
sin branding de ninguna demo:

```bash
cp -r templates/blank my-store
cd my-store
npm install
npm run dev        # http://localhost:5173
```

¿Prefieres ver primero una demo completa en acción?

```bash
cd templates/jewelry   # o templates/clothing
npm install
npm run dev
```

---

## 📦 Templates incluidos

| Template | Uso | Stack completo |
|---|---|---|
| [`jewelry`](templates/jewelry) | Demo de joyería y productos premium — muestra el sistema completo: CMS, PWA, API Cloudflare | ✅ |
| [`clothing`](templates/clothing) | Demo de moda y prendas — build más ligero, solo frontend | Parcial (sin CMS backend) |
| [`blank`](templates/blank) | **Base limpia recomendada** para cualquier negocio nuevo | ✅ |

Las plantillas `jewelry` y `clothing` son **implementaciones de
referencia**, no productos separados. Puedes clonarlas, cambiar
branding, productos y número de WhatsApp, y desplegar tu propia tienda —
pero si vas a construir algo nuevo, `blank` es el punto de partida
pensado para eso (mismo motor que `jewelry`, sin nada que borrar).

### Crea tu propia tienda

**Paso 1 — Copia la base limpia**
```bash
cp -r templates/blank my-store && cd my-store
```

**Paso 2 — Configura tu negocio** en `src/config/storeConfig.ts` (o vía
variables de entorno si usas Docker, sin rebuild):
- nombre y tagline
- logo
- colores (`theme.primary` / `theme.secondary`)
- número de WhatsApp
- moneda y país

**Paso 3 — Carga tus productos** en `src/data/products.ts` (categorías y
materiales son texto libre — defines los que necesites), o desde el CMS
en `/admin` una vez la app esté corriendo.

**Paso 4 — Ejecuta las pruebas**
```bash
npm test
```

**Paso 5 — Deploy** (ver sección [Deploy](#-deploy) abajo).

En pocos minutos alguien con conocimientos técnicos básicos puede tener
su propia tienda corriendo. Ver [`templates/blank/README.md`](templates/blank/README.md) para el detalle completo.

---

## 🏗️ Arquitectura

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 18, TypeScript 5.5, Vite 5.4, Tailwind CSS 3.4, Lucide React |
| **Testing** | Vitest 1.3, React Testing Library, JSDOM |
| **Backend opcional / Edge** | Cloudflare Pages Functions, Cloudflare Workers, Cloudflare D1 (SQLite), KV |
| **Contenedores** | Docker multi-stage (Node 20 Alpine + Nginx 1.27 con Gzip) |
| **Orquestación / VPS** | Dokploy, Docker Compose, Traefik con SSL automático (Let's Encrypt) |
| **IA & desarrollo agéntico** | Google Antigravity, Claude Code, y cualquier herramienta compatible con MCP |
| **MCP** | Servidor MCP en `whatsapp-emprendedor-tool/` para gestión conversacional de tiendas |

```
WhatsApp-Sales-Kit/
│
├── templates/
│   ├── jewelry/            # Demo: joyería (CMS + PWA + API completa)
│   ├── clothing/           # Demo: moda (frontend-only)
│   └── blank/              # Base limpia — punto de partida recomendado
│
├── whatsapp-emprendedor-tool/   # Servidor MCP y asistente conversacional
│
├── docs/                   # Guías técnicas (Docker, Dokploy, arquitectura, diseño responsive)
│
├── docker-compose.yml      # Orquestación raíz (selecciona template vía STORE_TEMPLATE)
├── .env.example
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

Cada template es una app independiente con su propio `package.json` —
no es un monorepo con paquetes compartidos. Ver
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para el análisis de qué
código se duplica entre templates y por qué (por ahora) no se extrajo un
paquete compartido.

---

## 🌐 Deploy

### Costos — sé claro sobre esto

| Concepto | Costo |
|---|---|
| Licencia de software (este repositorio) | **$0 — MIT** |
| Self-hosting (correr tú mismo el código) | Soportado, sin restricciones |
| Infraestructura (VPS, dominio, Cloudflare) | **Depende del proveedor y tu uso** — no es necesariamente $0 |

El software es y seguirá siendo gratuito. Correrlo en producción implica
costos reales de infraestructura (un VPS, un dominio, tráfico en
Cloudflare si excedes el tier gratuito). Algunos proveedores ofrecen
tiers gratuitos generosos que alcanzan para una tienda pequeña — pero no
prometemos infraestructura permanentemente gratuita.

### Opción A: Dokploy (VPS)
1. Conecta este repositorio en tu panel de Dokploy.
2. Configura `STORE_TEMPLATE` (`jewelry`, `blank`, etc.) y las variables `STORE_*` en `.env`.
3. Dokploy levanta el contenedor Docker con SSL automático (Let's Encrypt).
4. Guía paso a paso: [`docs/DOKPLOY_DEPLOYMENT.md`](docs/DOKPLOY_DEPLOYMENT.md).

### Opción B: Docker Compose (cualquier VPS)
```bash
cp .env.example .env
# edita STORE_TEMPLATE y las variables STORE_* en .env
docker compose up --build -d
```
Detalle de la arquitectura Docker: [`docs/DOCKER_GUIDE.md`](docs/DOCKER_GUIDE.md).

### Opción C: Cloudflare Pages (edge, tier gratuito disponible)
```bash
cd templates/jewelry   # o templates/blank
npm run build
npm run deploy
```

---

## 🤖 Personalización con IA

Este proyecto está diseñado para editarse con herramientas de desarrollo
agéntico usando instrucciones en español o inglés — no necesitas saber
programar para cambiar branding, agregar productos o ajustar colores.

```text
"Cambia el número de WhatsApp a +573001234567, el nombre a 'Joyería La Candelaria'
y la moneda principal a Pesos Colombianos (COP)."
```

```text
"Agrega 4 productos nuevos al catálogo en src/data/products.ts con fotos y
descripciones."
```

Guía completa para Google Antigravity: [`docs/GUIA_ANTIGRAVITY.md`](docs/GUIA_ANTIGRAVITY.md).
Para lanzar una tienda conversando con un asistente (Claude Desktop,
Cursor, Antigravity) vía el servidor MCP incluido:
[`whatsapp-emprendedor-tool/GUIA_EMPRENDIMIENTO.md`](whatsapp-emprendedor-tool/GUIA_EMPRENDIMIENTO.md).

---

## 🕊️ Impacto y misión

Este proyecto nació para apoyar la reactivación económica de
emprendedores y artesanos colombianos y latinoamericanos afectados por
desastres naturales, que necesitan una vitrina digital sin las barreras
de las plataformas de e-commerce tradicionales (costos fijos mensuales,
comisiones, trámites). Por eso se liberó bajo licencia MIT.

📖 Lee el [Manifiesto de Solidaridad para Colombia](MANIFESTO_COLOMBIA.md) completo.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas — desde reportar errores hasta
agregar un template nuevo para otro rubro (café, calzado, artesanías).
Lee la [Guía de Contribución (CONTRIBUTING.md)](CONTRIBUTING.md) para el
flujo de trabajo completo.

---

## 📜 Licencia

Software libre bajo la **[Licencia MIT](LICENSE)**. Úsalo, modifícalo y
despliega tu propia tienda sin restricciones.
