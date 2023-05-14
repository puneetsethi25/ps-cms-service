FROM node:16.17.0-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev
# Installing yarn
RUN apk add --no-cache yarn
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app/
# Ensure both package.json and yarn.lock are copied
COPY package.json yarn.lock ./
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# Using yarn instead of npm
RUN yarn cache clean
RUN yarn install --ignore-optional
COPY . .
RUN yarn run build
EXPOSE 1337
CMD ["yarn", "run", "develop"]
