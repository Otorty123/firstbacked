require('dotenv').config()
const express = require('express')
const connectDb = require('./ConnectDb/connect')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const route = require('./Router/handler')
const nodemailer = require('nodemailer')
const controller = require('./Controller/controller')

const router = require('./Router/handler')
// d5dcdd1af1ab965e963a730ae4efdaa1cac68b15

port = process.env.Port || 5000

// Middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(session({
    secret:'colab',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 24 * 64000}
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1', router)





app.listen(port, ()=>{
    connectDb();
    console.log(`server started on  ${port}`)
})