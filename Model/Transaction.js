const mongoose = require('mongoose')
const {Schema, model} = mongoose

const TransactionSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    old_balance: {
        type: String,
        required: true
    },
    new_balance: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum:["credit", "debit"],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
        required: true
    },
    amount: {
        type: Number,
        required: [true, "transaction amount not indicated"]
    },
    description: {
        type: String,
        required: [true, "no description"]
    },
    deposit: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        trim: true,
        required: [true, "transaction not referenced"],
    },
},
    {timestamps: true}
);


const Transaction = model("Transaction", TransactionSchema)

module.exports = Transaction;