#!/bin/bash

CONTAINER_NAME="node_app"
IMAGE_NAME="your-dockerhub-username/node-app:latest"
PORT=3000

echo "Pulling the latest image..."
docker pull $IMAGE_NAME

echo "Starting the container..."
docker run -d --name $CONTAINER_NAME -p $PORT:3000 --env-file .env $IMAGE_NAME

echo "Application started successfully!"
