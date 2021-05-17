var express = require('express');

var app = express();

var mongoose = require('mongoose');
var dbUrl = 'mongodb://username:pass@ds257981.mlab.com:57981/simple-chat';


var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

var server = app.listen(3001, () => {
    console.log("server is running on port", server.address().port);
});

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        res.sendStatus(200);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    })
  })

io.on('connection', () => {
    console.log('a user is connected')
})