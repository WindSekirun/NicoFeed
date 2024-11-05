#!/bin/bash

OUTPUT_FILE="apps/nicofeed-fe/.env"
CURRENT_COMMIT=$(git rev-parse --short HEAD)
CURRENT_DATE=$(date +"%Y.%m.%d")

rm -rf $OUTPUT_FILE

echo "VITE_APP_COMMIT_HASH=${CURRENT_COMMIT}" > "$OUTPUT_FILE"
echo "VITE_APP_COMMIT_DATE=${CURRENT_DATE}" >> "$OUTPUT_FILE"