nx run-many --target=build
docker buildx build --file apps/nicofeed/Dockerfile -t windsekirun/nicofeed .
docker buildx build --file apps/nicofeed-fe/Dockerfile -t windsekirun/nicofeed-fe .