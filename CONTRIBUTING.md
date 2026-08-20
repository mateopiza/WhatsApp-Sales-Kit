# Guía de Contribución al Proyecto Open Source 🇨🇴🤝

¡Gracias por tu interés en contribuir a este proyecto de código abierto! Este repositorio está dedicado a apoyar la reactivación económica de emprendedores y artesanos mediante herramientas de comercio móvil de alta calidad y costo cero.

---

## 📜 Código de Conducta

Nos comprometemos a mantener un entorno respetuoso, inclusivo y colaborativo para todos los participantes, independientemente de su nivel de experiencia, origen o identidad.

---

## 🛠️ Cómo Contribuir

### 1. Reportar Errores o Proponer Ideas
Si encuentras un error o tienes una idea para mejorar la plataforma:
1. Revisa los **Issues** existentes para no duplicar reportes.
2. Abre un nuevo **Issue** describiendo con claridad el problema o la propuesta.

### 2. Flujo de Trabajo para Pull Requests (PRs)
1. Haz un **Fork** del repositorio.
2. Crea una rama descriptiva para tu cambio:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   # o
   git checkout -b fix/correccion-error
   ```
3. Realiza tus modificaciones respetando los estándares de código.
4. Ejecuta la suite de pruebas automatizadas:
   ```bash
   cd empires-jewelry-app
   npm test
   ```
5. Haz commit de tus cambios siguiendo la convención de *Conventional Commits*:
   ```bash
   git commit -m "feat(catalog): agregar soporte para selección de variantes personalizadas"
   ```
6. Haz push a tu fork y abre un **Pull Request** hacia la rama `main`.

---

## 💎 Estándares Técnicos del Proyecto

- **TypeScript Estricto**: No usar `any` implícito o no justificado.
- **Accesibilidad (WCAG AA)**: Todo texto debe mantener un contraste ≥ 4.5:1 contra su fondo.
- **Diseño Libre de Emojis (Zero Emojis en UI)**: Usar exclusivamente iconos vectoriales SVG de **Lucide React**.
- **Mobile-First & Rendimiento**: Mantener el bundle ligero y priorizar la experiencia en pantallas móviles táctiles.

---

## 📄 Licencia

Al contribuir a este repositorio, aceptas que tus contribuciones queden licenciadas bajo los términos de la **Licencia MIT**.
