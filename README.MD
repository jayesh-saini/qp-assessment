# GROCERY STORE 🛒
## This is a demo grocery store application.

## Tech Stack

**Client:** React.js, React Bootstrap

**Server:** Node, Express, MySQL, Prisma

**Deployment:** Docker


## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Run Locally

Clone the project

```bash
  git clone https://github.com/jayesh-saini/qp-assessment
```

Go to the project directory

```bash
  cd qp-assessment
```

Update Env variables
```bash
nano backend/.env
nano backend/prisma/.env
nano frontend/src/settings.tsx
```

Install dependencies for backend

```bash
  cd backend 
  npm install
```

Generate the prisma client (only use when you run for the first time)
```bash
  npx prisma generate
```

Migrate and seed the database (only use when you run for the first time)
```bash
  npx prisma migrate dev --name init
  npx prisma db seed
```

Start the server
```bash
  npm run dev
```

Go to frontend directory in a seperate terminal and install it's dependencies and start the server
  ```bash
    cd frontend
    npm install
    npm run dev
  ```

## Run using docker

Start docker on your machine

```bash
  docker-compose up
```


## API Reference

https://documenter.getpostman.com/view/26792523/2sA3Bg8umd

