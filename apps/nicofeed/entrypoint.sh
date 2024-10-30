#!/bin/sh
while ! nc -z postgres 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

export NODE_TLS_REJECT_UNAUTHORIZED=0
npm config set strict-ssl false

npx prisma migrate deploy
dumb-init node main.js