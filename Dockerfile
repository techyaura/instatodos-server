FROM ubuntu
FROM node:lts
LABEL maintainer="techyaura <techyaura@gmail.com>"
ENV DIRPATH /usr/src/app
WORKDIR $DIRPATH
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "watch" ]
