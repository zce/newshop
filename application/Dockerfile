FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm i
COPY . .

EXPOSE 3080
CMD [ "npm", "run", "prod" ]
