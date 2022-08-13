FROM node:16.15.1-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]