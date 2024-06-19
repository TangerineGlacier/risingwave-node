# Use an official Node.js runtime as a parent image

FROM node:18.16.1

WORKDIR /middleware/src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8008



CMD [ "npm", "start" ]

