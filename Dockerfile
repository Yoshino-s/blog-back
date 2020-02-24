FROM node:lts-alpine

WORKDIR /app

COPY dist-single /app

EXPOSE 3000

CMD [ "node", "/app/index.js" ]