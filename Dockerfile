FROM ubuntu:latest
FROM node:10.16.1
LABEL maintainer="techyaura <techyaura@gmail.com>"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV development
CMD [ "node", "index.js" ]
