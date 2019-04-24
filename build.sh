docker tag shanohl/openfact-backend shanohl/openfact-backend:$(git rev-parse --short HEAD)
docker push shanohl/openfact-backend:$(git rev-parse --short HEAD)
# docker push shanohl/openfact-backend:lastest
