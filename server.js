const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
// const io = require('socket.io')(3001)
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('assets'))

app.get('/',(req,res)=>{
  res.render('homePage.ejs')
})
// app.get('/Letestpost',(req,res)=>{
//   res.render('Latestpost.ejs')
// })
app.get('/chatting', (req, res) => {
  res.render('index.ejs')
     // res.render('room', { roomId: `/${uuidV4()}` })
})

 app.get('/meetNow', (req, res) => {
    res.redirect(`/${uuidV4()}`)
       // res.render('room', { roomId: `/${uuidV4()}` })
 })

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

app.get('/:room', (req, res) => {
  //  console.log(req.params.room);
   res.render(req.params.room)
   res.render('room', { roomId: req.params.room })
 })

 //new code
 io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})



const users={};

io.on('connection',socket=>{
  socket.on('new-user-joined',name=>{
    users[socket.id]=name;
    socket.broadcast.emit('user-joined',name);
  });

  socket.on('send',message=>{
    socket.broadcast.emit('receive',{message: message,name:users[socket.id]})
  });

  socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
  });


})

server.listen(process.env.PORT ||3000)