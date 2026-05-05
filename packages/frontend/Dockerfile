FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
WORKDIR /app/packages/frontend
RUN npm install
RUN npx vite build
FROM nginx:1.30.0-alpine
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
