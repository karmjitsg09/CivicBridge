# Stage 1: Build Frontend Client
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend Server
FROM node:22-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Stage 3: Production Runner (Hardened with non-root user)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install production dependencies for server
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled artifacts
COPY --from=server-builder /app/server/dist ./dist
COPY --from=client-builder /app/client/dist ./public

# Security: Run as non-root user
USER node

EXPOSE 8080

CMD ["node", "dist/index.js"]
