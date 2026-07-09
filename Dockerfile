FROM node:24-alpine AS build
# install simple http server for serving static content
RUN npm install -g serve
# enable pnpm via corepack
RUN corepack enable
# make the 'app' folder the current working directory
WORKDIR /app
# copy package manifests to install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# install dependencies
RUN pnpm install --frozen-lockfile
# copy files and folders to the current working directory (i.e. 'app' folder)
COPY . .
# build app for production with minification
RUN pnpm build


FROM nginx AS production-stage
RUN mkdir /app
COPY --from=build /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf