const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT||3000;
const {MONGOURI} = require('./keys')


mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on('connected',()=>{
    console.log('Connected to mongodb')
})
mongoose.connection.on('error',(err)=>{
    console.log('Cant Connect',err)
})


require('./models/user')
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.listen(PORT,()=>{
    console.log('server started')
})