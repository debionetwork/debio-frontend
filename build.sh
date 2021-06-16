#!/bin/sh
docker build -t debio_frontend_service .
docker tag debio_frontend_service hub.theapps.dev/debio_frontend_service:latest
docker push hub.theapps.dev/debio_frontend_service:latest
