const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express(); 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

//route
const userRouter = require('./routes/user.route');

app.use((req, res, next)=>{
    next();
});

app.use('/user', userRouter);

const server = http.createServer(app);
server.listen(3000);