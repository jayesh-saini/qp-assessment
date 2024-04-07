from node:alpine

WORKDIR /backend

COPY prisma/. /backend/prisma/

RUN npx prisma generate

COPY package*.json ./

RUN npm install

COPY . .

RUN npm i -g typescript 

EXPOSE 3000

# CMD ["node", "dist/app.js"]
CMD ["npm", "run", "start"]

# docker build -t qp_assessment .
# docker run -d -it -p 80:80 -p 3030:3000 qp_assessment 
# docker exec -it _ /bin/bash