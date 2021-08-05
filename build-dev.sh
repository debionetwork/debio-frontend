#!/bin/sh
docker build -t debio_frontend_dev .
docker tag debio_frontend_dev asia.gcr.io/degenics/debio_frontend_dev:latest
docker push asia.gcr.io/degenics/debio_frontend_dev:latest
