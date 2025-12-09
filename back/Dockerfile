FROM node:22-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/back

COPY package*.json ./
RUN npm ci --include=dev
RUN npm install -g nodemon

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]