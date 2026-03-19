FROM node:20-slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --production=false

COPY . .
RUN npx tsc || true

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/server.js"]
