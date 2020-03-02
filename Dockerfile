FROM ubuntu
FROM node:lts
LABEL maintainer="techyaura <techyaura@gmail.com>"
ENV DIRPATH /usr/src
WORKDIR $DIRPATH/instant-todo
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV development
EXPOSE 9000
CMD [ "node", "index.js" ]
