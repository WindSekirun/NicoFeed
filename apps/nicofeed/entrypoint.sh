#!/bin/sh
export NODE_TLS_REJECT_UNAUTHORIZED=0
npm config set strict-ssl false

npx prisma migrate deploy
dumb-init node main.js