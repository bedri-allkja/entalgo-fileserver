# Node file

FROM node:14.17.5

WORKDIR /home/entalgo-fileserver

RUN npm install -g pm2

COPY package.json /home/entalgo-fileserver/

RUN npm install

RUN npm install -g nodemon

COPY . .

RUN npm run build

EXPOSE 3002

CMD npm run watch:fileserver
