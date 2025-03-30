#!/bin/bash

CONTAINER_NAME="node_app"
IMAGE_NAME="your-dockerhub-username/node-app:latest"

echo "Stopping the existing container..."
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME

echo "Pulling the latest image..."
docker pull $IMAGE_NAME

echo "Starting a new container..."
docker run -d --name $CONTAINER_NAME -p 3000:3000 --env-file .env $IMAGE_NAME

echo "Application updated successfully!"
