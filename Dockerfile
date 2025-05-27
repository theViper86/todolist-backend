FROM node:18-alpine
RUN apk update && apk upgrade
RUN apk add --no-cache openssl
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run init
RUN npm run build

EXPOSE 80
CMD ["node", "dist/main"]
