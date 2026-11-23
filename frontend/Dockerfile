# syntax=docker/dockerfile:1

# Stage 1: Build the React frontend with Vite
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# Use npm install because no package-lock.json is committed yet.
# Switch to `npm ci` once a lockfile is added for reproducible builds.
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2: Serve static production assets as a non-root user
FROM nginxinc/nginx-unprivileged:alpine AS runtime

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
