#!/bin/sh
docker build -f release.dockerfile -t hub.debio.network/debio_frontend_dev:latest .
docker push hub.debio.network/debio_frontend_dev:latest
