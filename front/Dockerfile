FROM node:22-alpine as build

ENV NODE_ENV=development


WORKDIR /usr/src/front

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

EXPOSE 5173


CMD ["npm", "run", "dev"]
