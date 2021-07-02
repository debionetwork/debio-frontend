#!/bin/sh
echo "clean up old container ........"
docker stop debio_frontend_dev || true && docker rm debio_frontend_dev || true
docker rmi hub.theapps.dev/debio_frontend_dev:latest
docker pull hub.theapps.dev/debio_frontend_dev:latest
echo "reload container .............."
docker run -d --name=debio_frontend_dev --env=debioenv=development -v /etc/localtime:/etc/localtime:ro -p 0.0.0.0:8000:80 --restart=always hub.theapps.dev/debio_frontend_dev:latest
