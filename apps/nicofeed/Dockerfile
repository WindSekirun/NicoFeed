FROM docker.io/node:22-alpine3.19 as deps
RUN apk add --no-cache --no-check-certificate libc6-compat sed curl
WORKDIR /usr/src/app

COPY dist/apps/nicofeed/package*.json ./
RUN npm install --omit=dev --loglevel verbose
RUN npm install prisma --save-dev --loglevel verbose

FROM deps as prisma-client

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm config set strict-ssl false

COPY apps/nicofeed/prisma ./prisma/
RUN rm -rf prisma/dev.db
RUN sed -i '/\/\/ START: REMOVE IN PRODUCTION/,/\/\/ END: REMOVE IN PRODUCTION/d' ./prisma/schema.prisma
RUN npx prisma generate

FROM docker.io/node:18-alpine3.18 as runner

RUN apk add --no-cache --no-check-certificate dumb-init curl
ENV NODE_ENV production
ENV PORT 3000

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY --from=prisma-client /usr/src/app/node_modules ./node_modules
COPY --from=prisma-client /usr/src/app/prisma ./prisma/
COPY dist/apps/nicofeed .

COPY apps/nicofeed/entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

RUN chown -R node:node .

USER node
EXPOSE 3000
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]