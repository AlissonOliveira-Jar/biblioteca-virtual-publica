# Stage 0: Build the React application
FROM node:22.21.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install
COPY . .
RUN npm run build

# Stage 1: Serve the built application with Nginx
FROM nginx:1.29.3

RUN apt-get update && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

COPY nginx-mime.conf /etc/nginx/conf.d/mime.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN sed -i -e 's|/run/nginx.pid|/tmp/nginx.pid|' \
           -e 's|^user .*nginx.*|#&|' /etc/nginx/nginx.conf

RUN mkdir -p /var/cache/nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx

USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]