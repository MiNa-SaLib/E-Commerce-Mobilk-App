const mongoose = require('mongoose');
const validator = require('validator');
const userSchema=new mongoose.Schema({
    firstName:{
        required:true,
        type:String
    },
    lastName:{
        required:true,
        type:String
    },
    email:{
        required:true,
        unique:true,
        validate:[validator.isEmail,'You should enter a valid email'],
        type:String
    },
    password:{
        required:true,
        type:String,
    },
    token:{
        type:String
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
    },
    card:{
        type:Array
    }
})

module.exports=mongoose.model("users",userSchema)