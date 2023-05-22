FROM node:lts-alpine

# use with --build-arg VERSION=xxxx
ARG VERSION

# Working directory
WORKDIR /app/tailchat

# Install dependencies
RUN npm install -g pnpm@8.2.0
RUN npm install -g tailchat-cli@latest

# Add mc for minio
RUN wget https://dl.min.io/client/mc/release/linux-amd64/mc -O /usr/local/bin/mc
RUN chmod +x /usr/local/bin/mc

# Install plugins and sdk dependency
COPY ./tsconfig.json ./tsconfig.json
COPY ./server/packages ./server/packages
COPY ./server/plugins ./server/plugins
COPY ./server/package.json ./server/package.json
COPY ./server/tsconfig.json ./server/tsconfig.json
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./.npmrc ./
COPY ./patches ./patches
RUN pnpm install

# Copy client
COPY ./client ./client
RUN pnpm install

# Copy all source
COPY . .
RUN pnpm install

# Build and cleanup (client and server)
ENV NODE_ENV=production
ENV VERSION=$VERSION
RUN pnpm build

# web static service port
EXPOSE 3000

# health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget localhost:3000/health -q -O - > /dev/null 2>&1

# Start server, ENV var is necessary
CMD ["pnpm", "start:service"]
