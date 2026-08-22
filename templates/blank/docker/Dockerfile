# ─────────────────────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: Runtime (Nginx + runtime env injection)
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Install envsubst (gettext) for runtime env injection
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

# Copy built assets
COPY --from=builder /app/dist .

# Copy Nginx config template
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint that injects runtime vars into a window.__RUNTIME_CONFIG__ script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Default runtime env vars — override via docker-compose or -e flags
ENV STORE_NAME="My Store"
ENV STORE_CURRENCY="USD"
ENV STORE_WHATSAPP_PHONE="573001234567"
ENV STORE_PRIMARY_COLOR="#111111"
ENV STORE_ACCENT_COLOR="#818CF8"
ENV STORE_ADMIN_PIN="1879"
ENV STORE_LOGO_URL=""
ENV STORE_TAGLINE="Powered by WhatsApp Sales Kit"

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
