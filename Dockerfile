ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-alpine AS development
# install simple http server for serving static content
RUN npm install -g http-server
# make the 'app' folder the current working directory
WORKDIR /app
# copy 'package.json' to install dependencies
COPY package*.json ./
# install dependencies
RUN yarn
# copy files and folders to the current working directory (i.e. 'app' folder)
COPY . .
# build app for production with minification
RUN yarn build
EXPOSE 8080
CMD [ "http-server", "dist" ]