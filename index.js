const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
dotenv.config()
const PORT = process.env.PORT || 5001
const router = require('./routes/index')

const cors = require('cors')

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(express.json({
    extended: true
}))
app.use(cookieParser())

app.use('/api',router)

app.listen(PORT,()=>console.log(PORT))
