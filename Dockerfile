FROM ubuntu:latest
FROM node:10.16.1
LABEL maintainer="techyaura <techyaura@gmail.com>"
ENV TZ Asia/Kolkata
ENV DIRPATH /usr/src/app
WORKDIR $DIRPATH
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "watch" ]
