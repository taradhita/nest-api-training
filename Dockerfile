FROM node:20-alpine3.19
WORKDIR /usr/src/app
COPY package.json yarn.lock  ./
RUN yarn install
COPY . .
ARG HTTP_PORT
ENV HTTP_PORT=$HTTP_PORT
EXPOSE $HTTP_PORT
CMD ["yarn", "start:dev"]
