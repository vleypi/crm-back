const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
dotenv.config()
const PORT = process.env.PORT || 5001
const router = require('./routes/index')
const fileUpload = require('express-fileupload');

const cors = require('cors')

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(express.json({
    extended: true
}))
app.use(cookieParser())

app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

app.use('/static', express.static('public'))

app.use('/api',router)

app.listen(PORT,()=>console.log(PORT))
