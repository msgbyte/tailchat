FROM node:lts-alpine

# Working directory
WORKDIR /app/tailchat

# Install dependencies
RUN npm install -g pnpm@7.13.4
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

# Copy source
COPY . .
RUN pnpm install

# Build and cleanup (client and server)
ENV NODE_ENV=production
RUN pnpm run build

# web static service port
EXPOSE 3000

# Start server
CMD ["pnpm", "start:service"]
