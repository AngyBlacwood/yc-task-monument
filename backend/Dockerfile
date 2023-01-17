FROM node:16-slim

WORKDIR /app
RUN npm install express
RUN npm install crypto-js
RUN npm install ydb-sdk
COPY ./index.js .

CMD [ "node", "index.js" ]
