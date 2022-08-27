FROM node:lts-alpine

# Working directory
WORKDIR /app

# Install dependencies
RUN npm install -g pnpm@7.1.9

# Install plugins and sdk dependency
COPY ./server/packages ./server/packages
COPY ./server/plugins ./server/plugins
COPY ./server/package.json ./server/package.json
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./.npmrc ./
RUN pnpm install

# Copy source
COPY . .
RUN pnpm install

# Build and cleanup
ENV NODE_ENV=production
RUN cd server && \
  pnpm run build && \
  # Install plugins(whitelist)
  pnpm run plugin:install com.msgbyte.tasks com.msgbyte.linkmeta com.msgbyte.github com.msgbyte.simplenotify

# Copy public files
RUN cd server && mkdir -p ./dist/public && cp -r ./public/plugins ./dist/public && cp ./public/registry.json ./dist/public

# web static service port
EXPOSE 3000

# Start server
CMD ["pnpm", "start:service"]
