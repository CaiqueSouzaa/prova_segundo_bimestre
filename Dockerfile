# ---- Stage 1: build ----
FROM node:26-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production=false

COPY . .

RUN npm run build

# ---- Stage 2: produção ----
FROM node:26-alpine AS runner

WORKDIR /app

# Copia só o necessário
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 8080

CMD ["node", "server.js"]
