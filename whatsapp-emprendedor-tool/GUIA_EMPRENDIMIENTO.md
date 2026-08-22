# Guía de Emprendimiento — Lanza Tu Tienda de Joyería en Minutos

> Antes de empezar, necesitas: **Docker Desktop instalado** y una **IA compatible con MCP** (Claude Desktop, Cursor o Antigravity).

---

## ¿Qué es esto?

Este sistema te permite lanzar tu propia tienda de joyería profesional en línea **hablando con una IA en el chat**. Sin tocar código. Sin configurar servidores manualmente. Solo dices lo que quieres y la IA lo hace por ti.

---

## Paso 1: Instala el Servidor MCP (una sola vez)

```bash
# Clona el proyecto
git clone https://github.com/mateopiza/WhatsApp-Sales-Kit.git
cd WhatsApp-Sales-Kit/whatsapp-emprendedor-tool/mcp-server

# Instala dependencias y compila
npm install
npm run build
```

### Conecta con Claude Desktop

Edita `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) o `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "empires-jewelry": {
      "command": "node",
      "args": ["/RUTA_ABSOLUTA/WhatsApp-Sales-Kit/whatsapp-emprendedor-tool/mcp-server/dist/index.js"],
      "env": {
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

Reinicia Claude Desktop. Verás el ícono 🔧 (herramientas) en el chat cuando el servidor esté activo.

### Conecta con Antigravity / Cursor

Agrega al `mcp` de tu configuración:
```json
{
  "name": "empires-jewelry",
  "command": "node /RUTA/WhatsApp-Sales-Kit/whatsapp-emprendedor-tool/mcp-server/dist/index.js",
  "env": { "MCP_TRANSPORT": "stdio" }
}
```

---

## Paso 2: Lanza Tu Tienda con el Chat

### Ejemplo de Conversación Real

> **Tú:** Hola, quiero lanzar mi tienda de accesorios llamada "Perla Negra". Vendo en Pesos Mexicanos, mi WhatsApp de ventas es +52 55 9876 5432 y quiero un PIN de admin "pn2024". Los colores que quiero son negro oscuro #1A1A1A y dorado #E5C158.

> **IA:** ¡Perfecto! Voy a desplegar tu tienda "Perla Negra" ahora mismo...
>
> ✅ ¡Tienda "Perla Negra" desplegada con éxito!
>
> 🌐 **URL de tu Tienda:** http://localhost:3100
> 🔐 **Panel de Administración:** http://localhost:3100/admin
> 📲 **WhatsApp de Ventas:** +525598765432
> 💰 **Moneda:** MXN
> 🔑 **PIN Admin:** pn2024
>
> ¿Quieres que agreguemos tus primeros productos ahora?

---

## Paso 3: Agrega Tus Productos

> **Tú:** Sí, quiero agregar 3 productos:
> 1. "Pulsera Obsidiana" - $450 MXN - categoría pulseras - "Obsidiana natural con cierre de plata", disponible
> 2. "Collar Luna" - $680 MXN - categoría collares - "Piedra de luna con cadena dorada", disponible
> 3. "Set Noche Estrellada" - $1,200 MXN - categoría alta-joyeria - "Collar + pulsera a juego, pieza única", pieza-unica

> **IA:** ✅ Catálogo importado: 3/3 productos creados.
>
> Tus productos ya están visibles en tu tienda. ¿Quieres actualizar algo de la marca o agregar más productos?

---

## Paso 4: Personaliza Tu Marca en Cualquier Momento

> **Tú:** Quiero cambiar el color dorado por un rosa palo #E8B4B8 y la frase de marca a "Joyería con Alma"

> **IA:** ✅ Marca actualizada para "perla-negra":
>   • storePrimaryColor: #E8B4B8
>   • storeTagline: Joyería con Alma
>
> Los cambios ya están en vivo (5 segundos de reinicio).

---

## Paso 5: Verifica el Estado de Tu Tienda

> **Tú:** ¿Cómo está mi tienda? ¿Está corriendo bien?

> **IA:** 📊 Estado de tienda: **perla-negra**
>
> 📦 Contenedor: `perla-negra-store`
>   Estado: running
>   Salud: healthy
>   Puertos: 0.0.0.0:3100->80/tcp

---

## Comandos Útiles para Docker (Opcional)

```bash
# Ver todas tus tiendas corriendo
docker ps

# Detener una tienda
docker compose --project-name perla-negra down

# Ver logs de una tienda
docker compose --project-name perla-negra logs -f

# Reiniciar una tienda
docker compose --project-name perla-negra restart
```

---

## Preguntas Frecuentes

**¿Necesito saber programar?**
No. El chat hace todo por ti. Solo necesitas saber qué quieres vender y a qué precio.

**¿Puedo tener varias tiendas?**
Sí. Cada tienda es independiente. Solo dile a la IA el nombre de cada una y las desplegará en puertos separados.

**¿Cómo comparten los clientes mi tienda?**
Mientras desarrollo: `http://localhost:3100`. Para producción, necesitas un VPS con dominio propio y un reverse proxy (Caddy). La IA puede ayudarte con eso también.

**¿Y si quiero cambiar el logo?**
Sube tu imagen a cualquier servicio de imágenes (Cloudinary, ImgBB, tu propio servidor) y pídele a la IA: *"Actualiza el logo de mi tienda perla-negra con esta URL: https://..."*

**¿Los datos de mis productos se guardan?**
Sí, en un volumen Docker persistente. Aunque reinicies el contenedor, tus productos se conservan.

**¿Cómo hago pedidos por WhatsApp?**
Los clientes que ven un producto que les gusta hacen clic en el botón "Consultar por WhatsApp" y se abre una conversación directa a tu número de ventas con el nombre del producto incluido.

---

## Categorías de Productos Disponibles

| Categoría | Clave para el chat |
|-----------|-------------------|
| Anillos | `anillos` |
| Collares | `collares` |
| Pulseras | `pulseras` |
| Aretes | `aretes` |
| Alta Joyería | `alta-joyeria` |

## Disponibilidad de Productos

| Estado | Clave | Descripción |
|--------|-------|-------------|
| Disponible | `disponible` | Listo para entrega inmediata |
| Bajo Pedido | `bajo-pedido` | Se fabrica al hacer el pedido |
| Pieza Única | `pieza-unica` | Una sola unidad disponible |
| Agotado | `agotado` | Temporalmente sin stock |

---

*Creado con ❤️ para emprendedores de joyería — Empires Jewelry Engine v1.0*
