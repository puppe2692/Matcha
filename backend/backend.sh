#!/bin/sh

export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@dev-db:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

echo "--- Installing dependencies ----"
npm install

echo "-----Starting backend-----"
npm run dev