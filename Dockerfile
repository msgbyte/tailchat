#
# Stage 1: build web, server, admin and plugins
#
FROM node:18.18.0-alpine AS builder

# use with --build-arg VERSION=xxxx
ARG VERSION

WORKDIR /app/tailchat

RUN npm install -g pnpm@8.15.8

# Install plugins and sdk dependency
COPY ./tsconfig.json ./tsconfig.json
COPY ./packages ./packages
COPY ./server/packages ./server/packages
COPY ./server/plugins ./server/plugins
COPY ./server/package.json ./server/package.json
COPY ./server/tsconfig.json ./server/tsconfig.json
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./.npmrc ./
COPY ./patches ./patches
RUN pnpm install --frozen-lockfile

# Copy client
COPY ./client ./client
RUN pnpm install --frozen-lockfile

# Copy all source
COPY . .
RUN pnpm install --frozen-lockfile

# Build (client and server)
ENV NODE_ENV=production
ENV VERSION=$VERSION
RUN pnpm build

#
# Stage 2: runtime image, server side workspace only (no client toolchain, no source)
#
FROM node:18.18.0-alpine

ARG VERSION

WORKDIR /app/tailchat

RUN npm install -g pnpm@8.15.8 && npm cache clean --force
RUN npm install -g tailchat-cli@latest && npm cache clean --force

# Add mc for minio (dl.min.io binaries were removed; copy from the multi-arch quay.io image)
COPY --from=quay.io/minio/mc:RELEASE.2025-08-13T08-35-41Z /usr/bin/mc /usr/local/bin/mc

# Install server / sdk / plugins / admin dependencies
COPY ./tsconfig.json ./tsconfig.json
COPY ./packages ./packages
COPY ./server/packages ./server/packages
COPY ./server/plugins ./server/plugins
COPY ./server/package.json ./server/package.json
COPY ./server/tsconfig.json ./server/tsconfig.json
# admin servers read vite.config.ts and public/ at runtime (vite-express), so copy the whole (small) dirs
COPY ./server/admin ./server/admin
COPY ./server/admin-next ./server/admin-next
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./.npmrc ./
COPY ./patches ./patches
# The content-addressable store is not needed at runtime; drop it in the same layer
RUN pnpm install --frozen-lockfile && rm -rf "$(pnpm store path)"

# Copy build output
COPY --from=builder /app/tailchat/packages/types/dist ./packages/types/dist
COPY --from=builder /app/tailchat/server/packages/sdk/dist ./server/packages/sdk/dist
COPY --from=builder /app/tailchat/server/dist ./server/dist
COPY --from=builder /app/tailchat/server/admin/dist ./server/admin/dist
COPY --from=builder /app/tailchat/server/admin-next/dist ./server/admin-next/dist

ENV NODE_ENV=production
ENV VERSION=$VERSION

# web static service port
EXPOSE 3000

# Start server, ENV var is necessary
CMD ["pnpm", "start:service"]
