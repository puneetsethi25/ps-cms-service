FROM node:14.19.1-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app/
COPY ./package.json ./
ENV PATH /usr/src/app/node_modules/.bin:$PATH
RUN npm cache verify 
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 1337
CMD ["npm", "run", "develop"]
