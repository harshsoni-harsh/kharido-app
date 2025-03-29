FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm @nestjs/cli

RUN pnpm config set auto-install-peers true
RUN pnpm config set auto-build true

COPY pnpm-lock.yaml package.json ./

RUN pnpm i

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["nest", "start", "public"]
