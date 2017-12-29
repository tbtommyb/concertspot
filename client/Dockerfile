FROM node:latest

WORKDIR /concertspot/

COPY package*.json ./
COPY .babelrc ./
COPY *.config* ./

RUN npm install webpack mocha -g

RUN npm install

CMD ["npm", "run", "start"]
