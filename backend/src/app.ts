import express from 'express'
const app = express()
import dotenv from 'dotenv'
import cors from 'cors'

app.use(cors())
app.use(express.json())

dotenv.config()

const { PORT } = process.env

import adminRouter from './routers/admin-router'
import userRouter from './routers/user-router'

app.use((req, res, next) => {
    console.log('-------------------')
    console.log(new Date().toString())
    console.log(`${req.method} - ${req.path}`)
    next()
})

// Routers
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

// Health Check API
app.get('/api/health', (req, res) => {
    res.json({status: 200, message: 'Server is alive!'})
})

process.on('SIGINT', () => {
    console.log('Stopping server')
    process.exit()
})

process.on('uncaughtException', (errorCaught) => {
    console.log('===========[Uncaught Exception Occured. Please check!]================\n')
    console.log(errorCaught)
    console.log('Stopping server')
    process.exit()
})

app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
})
