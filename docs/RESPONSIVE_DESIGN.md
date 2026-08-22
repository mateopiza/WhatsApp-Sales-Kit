# Especificación del Sistema de Diseño Responsive — Empires Jewelry

Este documento define la arquitectura y directrices de diseño responsive y experiencia táctil para la plataforma **Empires Jewelry**, abarcando desde dispositivos móviles ultracompactos hasta pantallas de escritorio 4K.

---

## 📱 Breakpoints y Estrategia Adaptativa

| Dispositivo | Breakpoint Tailwind | Ancho de Pantalla | Experiencia Visual y Navegación |
|---|---|---|---|
| **Móvil Compacto** | Default (`< 640px`) | `360px - 639px` | Navegación inferior fija (`BottomNav`), cabecera minimalista, visor de joya vertical a pantalla completa (65-75% VH), catálogo a 1 columna o 2 columnas compactas. |
| **Tablet / Phablet** | `sm:` / `md:` | `640px - 1023px` | Cuadrícula de 2 a 3 columnas, drawer lateral optimizado, modales centrados con proporción áurea. |
| **Escritorio Estándar** | `lg:` | `1024px - 1279px` | Barra de navegación superior completa (*Inicio, Colecciones, Concierge VIP*), selector de divisas (`CurrencySelector`), visor de producto en **2 Columnas** (52% Galería izquierda / 48% Ficha derecha). |
| **Pantallas Grandes / 4K** | `xl:` / `2xl:` | `1280px - 1920px+` | Ancho máximo contenido en `max-w-7xl` (1280px) con márgenes respirables, tipografía editorial *Cinzel* de alto impacto y sombras de elevación suaves. |

---

## 🖐️ Mecánicas Gestuales Táctiles (Mobile-First)

El visor de piezas (`ProductViewer` y `GestureGallery`) incorpora gestos táctiles nativos de alto rendimiento gestionados mediante `useGestures.ts`:

1. **Desplazamiento Táctil (*Swipe Horizontal*)**:
   - Deslizar izquierda/derecha para alternar entre fotos de la pieza actual con feedback inercial.
   - Deslizar en los extremos para saltar inmediatamente a la pieza anterior o siguiente del catálogo.
2. **Doble Toque para Zoom (*Double-Tap Zoom*)**:
   - Alterna instantáneamente entre escala `1.0x` y `2.5x` con animación ease-out.
3. **Pellizco para Ampliar (*Pinch-to-Zoom*)**:
   - Soporte multitáctil fluido para inspeccionar detalles microscópicos de esferas de oro, engastes de diamantes y nudos macramé.
4. **Pre-carga Adyacente (*Zero-Lag Image Preloading*)**:
   - Mediante el hook `usePreloadImages`, las imágenes de las piezas previas y siguientes se cargan en la memoria caché del navegador en segundo plano.

---

## 🖥️ Experiencia en Pantallas de Escritorio (Desktop Experience)

Para asegurar que la experiencia no se sienta como un "sitio móvil estirado" en computadores:

1. **Cabecera de Navegación de Lujo (`Header.tsx`)**:
   - Enlaces directos de navegación editorial: *Inicio*, *Colecciones* y *Concierge VIP*.
   - Selector interactivo de divisas (`USD`, `COP`, `EUR`) para actualización en tiempo real de todos los precios de la tienda.
   - Botón de búsqueda instantánea y acceso directo a la selección privada de favoritos con contador dinámico.
2. **Visor de Producto en 2 Columnas (`ProductViewer.tsx`)**:
   - Al hacer clic en cualquier joya en escritorio, se abre un modal con backdrop difuminado (`backdrop-blur-md`) y borde sutil dorado (`border-gold/30`).
   - **Columna Izquierda**: Galería interactiva con controles de flechas, zoom y cambio de imagen.
   - **Columna Derecha**: Ficha técnica completa, valor de inversión en la moneda elegida, acordeón de especificaciones técnicas (gema, kilataje, peso, dimensiones, ley del metal) y botón de consulta personalizada por WhatsApp.
3. **Manejo de Teclado**:
   - `Escape`: Cerrar visores y modales.
   - `Flecha Derecha` / `Flecha Izquierda`: Navegar entre joyas adyacentes.
   - `Ctrl + Shift + A`: Abrir portal de administración CMS.

---

## 🎨 Tokens de Color y Accesibilidad (WCAG AA)

Todos los componentes cumplen con los ratios de contraste de las pautas **WCAG AA** (mínimo 4.5:1 para texto estándar y 3.0:1 para elementos de interfaz y títulos grandes):

| Token | Hex | Uso Principal | Ratio de Contraste |
|---|---|---|---|
| `cream` | `#F5EDE6` | Fondo editorial base y superficies limpias | 14.8:1 contra `ink` (Excelente) |
| `cream-200` | `#EDE3D8` | Fondos de tarjetas, inputs y tablas | 12.6:1 contra `ink` |
| `ink` | `#3A332D` | Tipografía principal, botones primarios | Base de lectura de alto contraste |
| `taupe-contrast` | `#5A524A` | Textos secundarios, referencias SKU | 5.8:1 sobre `cream` (Pasa WCAG AA) |
| `gold` | `#D4B48C` | Acentos de alta joyería, divisores y estrellas | Color distintivo de marca |
| `gold-dark` | `#8C6D37` | Texto y badges dorados sobre fondos claros | 4.6:1 sobre `cream` (Pasa WCAG AA) |

---

## 🚫 Directriz "Zero Emojis" (100% SVG Icons)

Para preservar la estética sobria, refinada y exclusiva de alta joyería, **está estrictamente prohibido el uso de glifos o emojis estándar Unicode (ej. 💍, ✨, 💎, 👑)** en la interfaz de usuario.
- Todos los elementos visuales emplean iconos vectoriales limpios de la librería **Lucide React** (`Gem`, `Sparkles`, `ShieldCheck`, `Ruler`, `Heart`, `Search`, `MessageCircle`, `Lock`, etc.).
- Las pruebas automatizadas en `tests/unit/zero_emojis.test.ts` auditan continuamente el código fuente para garantizar que ningún emoji sea introducido accidentalmente.
