FROM docker.io/nginx:stable-alpine
COPY dist/apps/nicofeed-fe/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]