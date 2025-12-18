FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/worker/package.json ./apps/worker/package.json

RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/worker ./apps/worker
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY . .

RUN pnpm --filter @dentora/database db:generate
RUN pnpm --filter worker build

FROM node:22-alpine AS runner
RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 dentora

COPY --from=builder --chown=dentora:nodejs /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder --chown=dentora:nodejs /app/apps/worker/package.json ./apps/worker/package.json
COPY --from=builder --chown=dentora:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=dentora:nodejs /app/packages ./packages
COPY --from=builder --chown=dentora:nodejs /app/package.json ./package.json
COPY --from=builder --chown=dentora:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=dentora:nodejs /app/apps/worker/node_modules ./apps/worker/node_modules

USER dentora
WORKDIR /app/apps/worker

EXPOSE 6379

CMD ["node", "dist/worker.js"]