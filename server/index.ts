import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { corsOptions } from './config'
import homeRoute from './routes/homeRoute'
import reviewRoute from './routes/reviewRoute'
import uploadRoute from './routes/uploadRoute'
import db from './config/db'

// load env files
dotenv.config({
    debug: process.env.NODE_ENV !== 'production'
})

//connect database
const connectMongodb = async () => {
    await db.connect()
}
connectMongodb()

// initialize application
const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

app.get('/api', (req, res) => {
    return res.status(200).json({ msg: 'hello express' })
})

// load routes
app.use('/api/home', homeRoute)
app.use('/api/review', reviewRoute)
app.use('/api/upload', uploadRoute)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(
        `NODE_ENV is ${
            String(process.env.NODE_ENV) === 'production'
                ? 'production'
                : 'development'
        }`
    )
    console.log(`server running port 5000 at http://localhost:${port}`)
})
