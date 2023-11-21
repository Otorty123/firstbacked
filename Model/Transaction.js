const mongoose = require('mongoose')
const {Schema, model} = mongoose

const TransactionSchema = new Schema({
    deposit: {
        type: String,
        required: true
    },
    
})