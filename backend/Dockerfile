FROM node:alpine

WORKDIR /backend

COPY prisma/. /backend/prisma/

RUN npx prisma generate

COPY package*.json ./

RUN npm install

COPY . .

RUN npm i -g typescript 

EXPOSE 3000

CMD ["npm", "run", "start"]