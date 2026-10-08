#!/usr/bin/env bash
set -eo pipefail

echo "=================================================="
echo "  Reconstruyendo y levantando contenedor Docker   "
echo "=================================================="

docker compose up -d --build
docker compose ps
