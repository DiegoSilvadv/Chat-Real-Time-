const express = require('express');

const path = require('path');

const app = express();

//configurando os dois protocolos
//definindo protocolo http
const server = require('http').createServer(app);
//protocolo wss para o websocket
const io = require('socket.io')(server);

// Arquivos front end da aplicação irão ficar na pasta public 
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
//falando para o node como que ele interpreta o html
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html')
});

let messages = [  ];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    //emit seria mesma coisa que so ele mesmo ouvir
    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        //passando mensagens para o array de messages
        messages.push(data);

        //envia mensagem para todos que estão ouvindo ou seja no servidor  
        socket.broadcast.emit('receivedMessage', data);
    });

});

server.listen(3000);