FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web ./apps/web
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY . .

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

RUN pnpm --filter @dentora/database db:generate
RUN pnpm --filter web add -D @tailwindcss/postcss
RUN pnpm --filter web build

FROM node:22-alpine AS runner
RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 dentora

COPY --from=builder --chown=dentora:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder --chown=dentora:nodejs /app/package.json ./package.json
COPY --from=builder --chown=dentora:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY --from=builder --chown=dentora:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=dentora:nodejs /app/packages ./packages
COPY --from=builder --chown=dentora:nodejs /app/apps/web/node_modules ./apps/web/node_modules

COPY --from=builder --chown=dentora:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=dentora:nodejs /app/apps/web/public ./apps/web/public

USER dentora
WORKDIR /app/apps/web

CMD ["pnpm", "start"]