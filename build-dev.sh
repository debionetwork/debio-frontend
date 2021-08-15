#!/bin/sh
docker build -t debio_frontend_dev .
docker tag debio_frontend_dev hub.debio.network/debio_frontend_dev:latest
docker push hub.debio.network/debio_frontend_dev:latest
