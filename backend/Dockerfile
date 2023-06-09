FROM node:18-alpine AS builder

RUN apk add --no-cache \
  build-base \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS app

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY assets /app/assets
COPY data /app/data

RUN apk add --no-cache \
  build-base \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]

