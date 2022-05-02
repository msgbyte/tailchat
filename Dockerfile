FROM node:lts-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY . .
RUN npm install -g pnpm@6.24.2
RUN pnpm install

EXPOSE 11011

RUN cd web && pnpm build

CMD npx http-server -p 11011 ./web/dist
