FROM node:latest

WORKDIR /concertspot/client

COPY package*.json ./
COPY .babelrc ./
COPY *.config* ./

RUN npm install webpack -g

RUN npm install

CMD ["npm", "run", "start"]
