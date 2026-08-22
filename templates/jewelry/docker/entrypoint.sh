#!/bin/sh
# ─────────────────────────────────────────────────────────────
# entrypoint.sh — Runtime Configuration Injection
# Injects env vars into a <script> tag before Nginx starts,
# so no recompile is needed per store instance.
# ─────────────────────────────────────────────────────────────
set -e

RUNTIME_CONFIG_FILE="/usr/share/nginx/html/runtime-config.js"

echo "==> Generating runtime-config.js for store: ${STORE_NAME}"

cat > "$RUNTIME_CONFIG_FILE" << EOF
window.__RUNTIME_CONFIG__ = {
  storeName: "${STORE_NAME}",
  storeCurrency: "${STORE_CURRENCY}",
  storeWhatsappPhone: "${STORE_WHATSAPP_PHONE}",
  storePrimaryColor: "${STORE_PRIMARY_COLOR}",
  storeAccentColor: "${STORE_ACCENT_COLOR}",
  storeAdminPin: "${STORE_ADMIN_PIN}",
  storeLogoUrl: "${STORE_LOGO_URL}",
  storeTagline: "${STORE_TAGLINE}"
};
EOF

echo "==> Runtime config injected. Launching Nginx..."
exec "$@"
