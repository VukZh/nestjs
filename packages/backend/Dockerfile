FROM node:24-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN npm install

WORKDIR /app/packages/backend
RUN npx prisma generate
RUN npm run build

WORKDIR /app
RUN rm -rf \
    packages/frontend \
    packages/backend/src \
    packages/backend/test \
    .git \
    node_modules/.cache \
    packages/backend/node_modules/.cache

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app /app

WORKDIR /app/packages/backend

USER nestjs
EXPOSE 3000
ENV PORT=3000

CMD ["/bin/sh", "-c", "sleep 5 && npx prisma migrate deploy && node dist/src/main.js"]
