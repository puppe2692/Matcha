#!/bin/sh

echo "--- Installing dependencies ----"
npm install

echo "-----Starting backend-----"
npm run dev

echo "-----Postgres set up-----"
npm install pg