# Stage 0: Build the React application
FROM node:22.21.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install
COPY . .
RUN npm run build

# Stage 1: Serve the built application with Nginx
FROM nginx:stable-alpine

# Copia o build
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Cria diretórios necessários e ajusta permissões
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx \
    && chmod -R 755 /var/cache/nginx /var/run /var/log/nginx

EXPOSE 80
