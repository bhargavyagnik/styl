FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base as builder
WORKDIR /app
COPY . .
RUN npm run build


FROM base as production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public

RUN mkdir .next

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"

CMD node server.js;

# FROM base as dev
# ENV NODE_ENV=development
# RUN npm install 
# COPY . .
# CMD npm run dev