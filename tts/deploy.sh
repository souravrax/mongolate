#!/bin/bash

set -e

# Configuration
IMAGE_NAME="tts"
CONTAINER_NAME="tts"
PORT=8558
TAG="${1:-latest}"

echo "Building Docker image: ${IMAGE_NAME}:${TAG}"
docker build -t "${IMAGE_NAME}:${TAG}" .

echo "Stopping and removing existing container (if any)..."
docker stop "${CONTAINER_NAME}" 2>/dev/null || true
docker rm "${CONTAINER_NAME}" 2>/dev/null || true

echo "Starting new container..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${PORT}:8000" \
  --restart unless-stopped \
  "${IMAGE_NAME}:${TAG}"

echo "Deployment complete!"
echo "Container is running on port ${PORT}"
echo "View logs with: docker logs -f ${CONTAINER_NAME}"
echo "Stop container with: docker stop ${CONTAINER_NAME}"

