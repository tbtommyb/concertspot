FROM node:9

WORKDIR /concertspot/

COPY package*.json ./
COPY .babelrc ./
COPY *.config* ./

RUN npm install -g webpack mocha

RUN npm install

CMD ["npm", "run", "start"]
