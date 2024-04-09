# GROCERY STORE 🛒
## This is a demo grocery store application.

Want to see the deployed version ?
https://u4r.in/grocery_store_demo

## Tech Stack

**Client:** React.js, React Bootstrap

**Server:** Node, Express, MySQL, Prisma

**Deployment:** Docker


## Screenshots
### Home
![App Screenshot](https://github.com/jayesh-saini/qp-assessment/blob/develop/screenshots/Home.png?raw=true)
### Cart
![App Screenshot](https://github.com/jayesh-saini/qp-assessment/blob/develop/screenshots/Cart.png?raw=true)
### Orders
![App Screenshot](https://github.com/jayesh-saini/qp-assessment/blob/develop/screenshots/Orders.png?raw=true)
### Admin Home
![App Screenshot](https://github.com/jayesh-saini/qp-assessment/blob/develop/screenshots/Admin%20Home.png?raw=true)
### Product Edit
![App Screenshot](https://github.com/jayesh-saini/qp-assessment/blob/develop/screenshots/Admin%20Prod%20Desc.png?raw=true)

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

Once you see "Server running...", open localhost on your machine

## API Reference

https://documenter.getpostman.com/view/26792523/2sA3Bg8umd

