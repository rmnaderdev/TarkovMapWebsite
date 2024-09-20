ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-alpine AS build
# install simple http server for serving static content
RUN npm install -g serve
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


FROM nginx AS production-stage
RUN mkdir /app
COPY --from=build /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf