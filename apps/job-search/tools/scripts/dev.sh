#!/bin/bash

docker compose -f 'docker/docker-compose.dev.yml' down elasticsearch
docker volume prune -f
docker compose -f 'docker/docker-compose.dev.yml' up -d --build elasticsearch