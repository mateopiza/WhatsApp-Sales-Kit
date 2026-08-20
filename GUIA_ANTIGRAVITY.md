# 🚀 Guía Maestra: Cómo Editar y Personalizar este Proyecto en Google Antigravity

Bienvenido a la guía completa para desarrollar, personalizar y potenciar el **WhatsApp Sales Kit** utilizando **Google Antigravity (AGY)**, el entorno de desarrollo agéntico avanzado impulsado por Google.

---

## 📋 Tabla de Contenido
1. [¿Qué es Google Antigravity?](#-qué-es-google-antigravity)
2. [Estructura del Proyecto en Antigravity](#-estructura-del-proyecto-en-antigravity)
3. [Inicio Rápido en Antigravity](#-inicio-rápido-en-antigravity)
4. [Cómo Personalizar Tu Tienda Usando Prompts en Lenguaje Natural](#-cómo-personalizar-tu-tienda-usando-prompts-en-lenguaje-natural)
5. [Guía de Personalización Técnica Paso a Paso](#-guía-de-personalización-técnica-paso-a-paso)
6. [Slash Commands Potenciados en Antigravity](#-slash-commands-potenciados-en-antigravity)
7. [Conexión y Uso del Servidor MCP Integrado](#-conexión-y-uso-del-servidor-mcp-integrado)
8. [Verificación, Pruebas Automatizadas y QA](#-verificación-pruebas-automatizadas-y-qa)
9. [Despliegue a Producción desde Antigravity](#-despliegue-a-producción-desde-antigravity)
10. [Prompts Listos para Usar (Cheatsheet)](#-prompts-listos-para-usar-cheatsheet)

---

## 🧠 ¿Qué es Google Antigravity?

Google Antigravity es una plataforma agéntica de pair-programming diseñada para resolver tareas complejas de software de principio a fin. Permite a cualquier persona (desde emprendedores sin conocimientos de programación hasta desarrolladores senior) crear, modificar, probar y desplegar aplicaciones web completas mediante conversación inteligente y herramientas automáticas de código.

### Capacidades Destacadas en este Proyecto:
- **Edición Quirúrgica de Código**: Modifica archivos sin romper la arquitectura existente.
- **Terminal y Tareas Asíncronas**: Ejecuta servidores Vite, Docker y suites de prueba en segundo plano.
- **Soporte Multi-Agente (`teamwork`)**: Orquesta equipos de agentes especializados para diseño, código, pruebas y documentación.
- **Soporte MCP (Model Context Protocol)**: Conecta herramientas externas para administrar catálogos y servidores de forma conversacional.

---

## 📁 Estructura del Proyecto en Antigravity

Cuando abras el proyecto en el explorador de Antigravity, encontrarás los siguientes módulos clave:

```
├── empires-jewelry-app/            # Aplicación Frontend React 18 + Vite + Tailwind + TypeScript
│   ├── src/
│   │   ├── components/             # Componentes de UI (Header, Hero, ProductViewer, Cart, WhatsApp CTA)
│   │   ├── context/                # Estados de la app (Monedas USD/COP/EUR, Favoritos, Carrito, Admin)
│   │   ├── data/products.ts        # 📦 CATÁLOGO DE PRODUCTOS (Edítalo aquí)
│   │   ├── utils/whatsapp.ts       # 💬 GENERADOR DE MENSAJES Y ENLACES DE WHATSAPP
│   │   └── types/catalog.ts        # Definición de tipos TypeScript para productos
│   ├── tests/                      # Suite de 163+ pruebas automatizadas (Vitest)
│   └── docker/                     # Dockerfile y Nginx para producción
├── whatsapp-emprendedor-tool/      # Servidor MCP y herramientas de ayuda conversacional
├── DOKPLOY_DEPLOYMENT.md           # Guía de despliegue en VPS Dokploy
├── MANIFESTO_COLOMBIA.md           # Manifiesto solidario para emprendedores
└── LICENSE                         # Licencia Open Source MIT
```

---

## ⚡ Inicio Rápido en Antigravity

### Paso 1: Abrir la Terminal Integrada en Antigravity
Puedes pedirle al agente de Antigravity que instale las dependencias o ejecutarlo tú mismo en la pestaña de Terminal:

```bash
cd empires-jewelry-app
npm install
```

### Paso 2: Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
El agente de Antigravity levantará el entorno local en `http://localhost:5173` con **Hot Module Replacement (HMR)** instantáneo: cada cambio que hagas o que el agente aplique se reflejará en vivo sin recargar la página.

---

## 🗣️ Cómo Personalizar Tu Tienda Usando Prompts en Lenguaje Natural

En Antigravity, no necesitas escribir código manualmente. Solo pídeselo al agente en la ventana de chat:

### Ejemplo 1: Cambiar el Número de WhatsApp y Nombre del Negocio
> *"Antigravity, cambia el número de WhatsApp de la tienda a `+573001234567`, ponle de nombre 'Artesanías del Valle' y ajusta la moneda predeterminada a Pesos Colombianos (COP)."*

### Ejemplo 2: Agregar Nuevos Productos al Catálogo
> *"Agrega 3 nuevos collares de esmeraldas colombianas a la categoría 'Collares' en `src/data/products.ts`, con precios entre 250.000 y 800.000 COP y fotos de muestra."*

### Ejemplo 3: Cambiar la Paleta de Colores de la Marca
> *"Quiero cambiar el color de acento dorado `#D4B48C` por un verde esmeralda colombiano `#0F52BA` o `#007A5E`, adaptando los contrastes para cumplir con la norma de accesibilidad WCAG AA."*

---

## 🛠️ Guía de Personalización Técnica Paso a Paso

Si deseas comprender o guiar las modificaciones manuales, estos son los archivos clave:

### 1. Configurar Datos de Contacto y Moneda
Archivo: [`src/utils/whatsapp.ts`](file:///mnt/nvme/004%20-%20B2B/MIguel/empires-jewelry-app/src/utils/whatsapp.ts) y [`src/context/AppContext.tsx`](file:///mnt/nvme/004%20-%20B2B/MIguel/empires-jewelry-app/src/context/AppContext.tsx)
- Define el número internacional (ej: `573001234567` para Colombia).
- Modifica el mensaje de bienvenida y plantilla de cotización.

### 2. Modificar el Catálogo de Productos
Archivo: [`src/data/products.ts`](file:///mnt/nvme/004%20-%20B2B/MIguel/empires-jewelry-app/src/data/products.ts)
Cada producto tiene la siguiente estructura:
```typescript
{
  id: "joya-01",
  name: "Anillo Aurora Esmeralda",
  category: "rings", // "rings" | "necklaces" | "bracelets" | "earrings"
  priceUSD: 450,
  priceCOP: 1800000,
  priceEUR: 410,
  description: "Pieza artesanal elaborada en oro amarillo de 18 quilates con esmeralda natural colombiana.",
  images: [
    "/assets/products/anillo-aurora-1.webp",
    "/assets/products/anillo-aurora-2.webp"
  ],
  material: "Oro 18k & Esmeralda",
  inStock: true,
  featured: true
}
```

### 3. Personalizar Colores y Tipografía
- **Colores**: Edita [`tailwind.config.js`](file:///mnt/nvme/004%20-%20B2B/MIguel/empires-jewelry-app/tailwind.config.js).
- **Tipografías**: Cambia las fuentes en [`src/index.css`](file:///mnt/nvme/004%20-%20B2B/MIguel/empires-jewelry-app/src/index.css) y [`index.html`](file:///mnt/nvme/004%20-%20B2B/MIguel/empires-jewelry-app/index.html).

### 4. PIN y Seguridad del Panel Administrativo (CMS)
- La aplicación incluye un panel de administración accesible en `/admin` o con el atajo `Ctrl + Shift + A`.
- Para cambiar el PIN predeterminado, edita la variable `STORE_ADMIN_PIN` en `.env` o en [`src/context/AdminContext.tsx`](file:///mnt/nvme/004%20-%20B2B/MIguel/empires-jewelry-app/src/context/AdminContext.tsx).

---

## 🪄 Slash Commands Potenciados en Antigravity

Aprovecha los comandos especiales de Antigravity para automatizar tu trabajo:

| Comando | Cuándo Usarlo | Ejemplo de Uso |
|---|---|---|
| `/goal` | Tareas complejas y de larga duración sin interrupción. | `/goal Audita todo el catálogo, verifica que las 163 pruebas pasen y optimiza las imágenes WebP.` |
| `/teamwork-preview` | Coordinación de múltiples agentes para grandes expansiones. | `/teamwork-preview Crea un módulo de pasarela de pagos opcional para Nequi y Daviplata.` |
| `/browser` | Pruebas visuales interactivas en vivo. | `/browser Abre http://localhost:5173 e inspecciona el flujo de compra en móvil.` |
| `/grill-me` | Entrevista interactiva para afinar requerimientos. | `/grill-me Ayúdame a definir las categorías y estrategia de precios para mi tienda de café artesanal.` |
| `/learn` | Persistir reglas y estilo de tu marca en la memoria del agente. | `/learn Recuerda que en este proyecto usamos siempre la paleta de colores de café y orfebrería.` |

---

## 🔌 Conexión y Uso del Servidor MCP Integrado

El repositorio incluye un servidor **MCP (Model Context Protocol)** en [`whatsapp-emprendedor-tool/mcp-server`](file:///mnt/nvme/004%20-%20B2B/MIguel/whatsapp-emprendedor-tool/mcp-server).

### Cómo Conectarlo en Antigravity:
1. Compila el servidor:
   ```bash
   cd whatsapp-emprendedor-tool/mcp-server
   npm install
   npm run build
   ```
2. Agrega la configuración a tu archivo MCP en Antigravity (`~/.gemini/antigravity/mcp/`):
   ```json
   {
     "mcpServers": {
       "whatsapp-emprendedor": {
         "command": "node",
         "args": ["/ruta-absoluta/whatsapp-emprendedor-tool/mcp-server/dist/index.js"],
         "env": {
           "MCP_TRANSPORT": "stdio"
         }
       }
     }
   }
   ```
3. Ahora puedes pedirle a Antigravity: *"Consulta los productos con bajo inventario usando la herramienta MCP y actualiza las existencias."*

---

## 🧪 Verificación, Pruebas Automatizadas y QA

El proyecto cuenta con una suite rigurosa de **163+ pruebas automatizadas** que garantizan:
- Cumplimiento de accesibilidad WCAG AA.
- Cero emojis no controlados (uso exclusivo de iconos vectoriales SVG de alta definición).
- Generación correcta de enlaces de WhatsApp con encoding de caracteres especiales.
- Integración de API, persistencia local y soporte de modo sin conexión (PWA).

Para ejecutar las pruebas en Antigravity:
```bash
cd empires-jewelry-app
npm test
```

---

## 🚢 Despliegue a Producción desde Antigravity

Una vez que personalices tu catálogo, tienes 3 formas sencillas de publicarlo:

### 1. Dokploy (Recomendado para Servidor Propio / VPS)
- Sube tus cambios a GitHub.
- Conecta el repositorio en tu panel Dokploy como aplicación Compose.
- Dokploy construirá la imagen Docker automáticamente y configurará HTTPS con Let's Encrypt.
- *Consulta los detalles en [DOKPLOY_DEPLOYMENT.md](file:///mnt/nvme/004%20-%20B2B/MIguel/DOKPLOY_DEPLOYMENT.md).*

### 2. Cloudflare Pages (100% Gratuito)
```bash
cd empires-jewelry-app
npm run build
npm run deploy
```

### 3. Docker Compose Local o en Servidor
```bash
docker compose up --build -d
```
Tu tienda estará disponible inmediatamente en el puerto `3000`.

---

## 📝 Prompts Listos para Usar (Cheatsheet)

Copia y pega cualquiera de estos prompts en el chat de Antigravity para transformar la tienda según tu necesidad:

### 🛍️ Transformar a Tienda de Moda / Ropa
```
Antigravity, adapta esta tienda para una marca de ropa de mujer colombiana llamada "Aluna Moda Ética".
1. Cambia las categorías a: Vestidos, Blusas, Pantalones y Accesorios.
2. Agrega selector de tallas (XS, S, M, L, XL) antes de enviar el mensaje a WhatsApp.
3. Actualiza los colores a tonos tierra orgánicos y mantén la estética minimalista y elegante.
```

### ☕ Transformar a Tienda de Café Especial y Artesanías
```
Antigravity, quiero convertir este catálogo en una tienda de café de origen especial de Huila y Quindío.
1. Categorías: Café en Grano, Café Molido, Métodos de Filtrado y Artesanías de Barro.
2. Incluye opciones de molienda (Fina, Media, Gruesa) en el pedido de WhatsApp.
3. Precios en Pesos Colombianos (COP) y Dólares (USD).
```

### 🎨 Auditoría de Accesibilidad y Rendimiento
```
Antigravity, realiza una auditoría completa de contraste y accesibilidad WCAG AA en todos los botones y textos. Asegúrate de que todos los enlaces a WhatsApp funcionen perfectamente tanto en dispositivos móviles iOS/Android como en WhatsApp Web de escritorio.
```

---

<div align="center">
  <b>¿Tienes dudas o necesitas ayuda?</b><br/>
  Abre un issue en GitHub o consulta con el agente de Google Antigravity en cualquier momento. 🇨🇴✨
</div>
