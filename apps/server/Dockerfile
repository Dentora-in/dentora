# ----------------------------------------
# Stage 1: Dependencies
# ----------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Copy workspace metadata
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy workspace packages (needed for pnpm resolution)
COPY packages ./packages
COPY apps/server/package.json ./apps/server/package.json

# Install all deps (dev deps required for build)
RUN pnpm install --frozen-lockfile


# ----------------------------------------
# Stage 2: Builder
# ----------------------------------------
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Reuse installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/server ./apps/server
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy full source (schemas, ts files, etc.)
COPY . .

# Generate Prisma client (AFTER schema exists)
RUN pnpm --filter @dentora/database db:generate

# Build server (and its workspace deps)
RUN pnpm --filter server build

# ----------------------------------------
# Stage 3: Runner (Production)
# ----------------------------------------
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 dentora

# Copy runtime artifacts only
COPY --from=builder --chown=dentora:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=dentora:nodejs /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder --chown=dentora:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=dentora:nodejs /app/packages ./packages
COPY --from=builder --chown=dentora:nodejs /app/package.json ./package.json
COPY --from=builder --chown=dentora:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=dentora:nodejs /app/apps/server/node_modules ./apps/server/node_modules

USER dentora
WORKDIR /app/apps/server

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/index.js"]
