FROM node:lts-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY . .
RUN npm install -g pnpm
RUN pnpm install

RUN cd web
RUN pnpm build

EXPOSE 11011
CMD npx http-server -p 11011 ./dist
