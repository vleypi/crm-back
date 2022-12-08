module.exports = (app) =>{

    const io = app.get('socketio')
    io.on('connection', async (socket)=>{
        socket.on('hello',()=>{
            console.log(2)
        })
    })
}<AuthProvider {...pageProps}>
<Component {...pageProps} />
</AuthProvider>