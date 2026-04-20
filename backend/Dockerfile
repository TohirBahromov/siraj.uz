FROM node:22-alpine AS builder
WORKDIR /app/backend
COPY package*.json ./
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=10000
COPY . .
RUN npx prisma generate
RUN npm run build && ls dist/src/main.js

FROM node:22-alpine
WORKDIR /app/backend
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/prisma.config.ts ./prisma.config.ts
COPY package*.json ./
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
