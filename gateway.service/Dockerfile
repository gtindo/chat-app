FROM ubuntu:bionic
LABEL GUEKENG TINDO Yvan <yvan.guekeng@gmail.com>

RUN apt-get update
RUN apt-get install wget -y

WORKDIR /home/packages
RUN wget https://nodejs.org/dist/v12.16.0/node-v12.16.0-linux-x64.tar.xz

RUN ls /home/packages
RUN apt-get install xz-utils -y
RUN tar -xf /home/packages/node-v12.16.0-linux-x64.tar.xz && cd node-v12.16.0-linux-x64 && cp -r . /usr/local
RUN npm install -g pm2

COPY package.json /home/app/package.json
WORKDIR /home/app/
RUN npm install

COPY . /home/app/

CMD ["pm2", "start", "index.js", "--watch", "--no-daemon"]