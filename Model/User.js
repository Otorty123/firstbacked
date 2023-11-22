const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose")
const{Schema, model} = mongoose;
const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    rquestCount:{
        type:Number,
        default:0
    },
    subscription:{
        type:String,
        enum:["free","basic","premium"],
        default:"free"
    },
    wallet:{
        type:mongoose.Schema.ObjectId,
        ref:"Wallet"
    }

})

userSchema.plugin(passportLocalMongoose)

const Usermodel = model("User", userSchema) ;

passport.use(Usermodel.createStrategy())

passport.serializeUser(Usermodel.serializeUser())

passport.deserializeUser(Usermodel.deserializeUser())

module.express = Usermodel