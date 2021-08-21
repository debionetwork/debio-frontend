#!/bin/sh
echo "clean up old container ........"
docker stop debio_frontend_demo || true && docker rm debio_frontend_demo || true
docker rmi hub.debio.network/debio_frontend_demo:latest
docker pull hub.debio.network/debio_frontend_demo:latest
echo "reload container .............."
docker run -d --name=debio_frontend_demo --env=NODE_ENV=demo -v /etc/localtime:/etc/localtime:ro -p 0.0.0.0:8080:80 --restart=always hub.debio.network/debio_frontend_demo:latest
