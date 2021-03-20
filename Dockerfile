FROM alpine:3.13
FROM node:alpine
RUN apk add --no-cache && npm i -g nodemon
LABEL maintainer="techyaura <techyaura@gmail.com>"
ENV TZ Asia/Kolkata
ENV DIRPATH /app
ENV NODE_ENV development
WORKDIR $DIRPATH
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "watch" ]
