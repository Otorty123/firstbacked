require('dotenv').config()
const mongoose = require('mongoose')
password = process.env.pass



const connectionString = `mongodb+srv://Drazzy:${password}@cluster0.35p4stg.mongodb.net/?retryWrites=true&w=majority`

const connectDb = async()=>{
    await mongoose.connect(connectionString)
    return console.log("db connected")
}


module.exports = connectDb