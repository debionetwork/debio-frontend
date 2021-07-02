#!/bin/sh
docker build -t debio_frontend_dev .
docker tag debio_frontend_dev hub.theapps.dev/debio_frontend_dev:latest
docker push hub.theapps.dev/debio_frontend_dev:latest
