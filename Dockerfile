FROM node:lts-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY . .
RUN npm install -g pnpm@6.24.2 http-server-spa@1.3.0
RUN pnpm install

EXPOSE 11011

RUN cd web && pnpm build

CMD node scripts/sync-config-from-env.js && http-server-spa ./web/dist index.html 11011
