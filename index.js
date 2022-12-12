const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const socket = require('./socket/index')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
dotenv.config()
const PORT = process.env.PORT || 5001
const router = require('./routes/index')
const fileUpload = require('express-fileupload');
const cors = require('cors')

app.use(cors({
    origin: ['http://62.113.96.105:3000'],
    credentials: true
}))
app.use(express.json({
    extended: true,
    limit: '50mb'
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

app.set('socketio',io)
socket(app)

server.listen(PORT,()=>console.log(PORT))
