FROM node:18.18.0-alpine

# use with --build-arg VERSION=xxxx
ARG VERSION

# Working directory
WORKDIR /app/tailchat

RUN ulimit -n 10240

# Install dependencies
RUN npm install -g pnpm@8.15.8
RUN npm install -g tailchat-cli@latest

# Add mc for minio (dl.min.io binaries were removed; copy from the multi-arch quay.io image)
COPY --from=quay.io/minio/mc:RELEASE.2025-08-13T08-35-41Z /usr/bin/mc /usr/local/bin/mc

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

# Build and cleanup (client and server)
ENV NODE_ENV=production
ENV VERSION=$VERSION
RUN pnpm build

# web static service port
EXPOSE 3000

# Start server, ENV var is necessary
CMD ["pnpm", "start:service"]
