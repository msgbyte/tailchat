FROM node:lts-alpine

# Working directory
WORKDIR /app

# Install dependencies
RUN npm install -g pnpm@7.3.0
RUN npm install -g tailchat-cli@1.4.0

# Install plugins and sdk dependency
COPY ./server/packages ./server/packages
COPY ./server/plugins ./server/plugins
COPY ./server/package.json ./server/package.json
COPY ./server/tsconfig.json ./server/tsconfig.json
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./.npmrc ./patches ./
RUN pnpm install

# Copy client
COPY ./client ./client
RUN pnpm install

# Copy source
COPY . .
RUN pnpm install

# Build and cleanup
ENV NODE_ENV=production
RUN pnpm run build

# web static service port
EXPOSE 3000

# Start server
CMD ["pnpm", "start:service"]
