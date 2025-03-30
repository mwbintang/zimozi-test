#!/bin/bash

CONTAINER_NAME="node_app"

echo "Stopping the container..."
docker stop $CONTAINER_NAME

echo "Removing the container..."
docker rm $CONTAINER_NAME

echo "Application stopped and removed successfully!"
