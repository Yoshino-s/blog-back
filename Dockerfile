FROM node:lts-alpine

COPY dist/index.js /

EXPOSE 3000

CMD [ "node /index.js" ]