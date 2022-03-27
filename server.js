const express = require('express')
const app = express()
const http = require('http').createServer(app)

//for profanity checking using npm package
var filter = require('leo-profanity');
filter.loadDictionary();

const PORT = process.env.PORT || 8000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// using static and public files
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('New Connection Joined')
    //it activates when an event named message is activated by client 
    // then emits another event or dislpaying message
    socket.on('message', (msg) => {
        //profanity cleaner
        msg.message=filter.clean(msg.message)
        //emits to all 
        socket.broadcast.emit('message', msg)
    })

})