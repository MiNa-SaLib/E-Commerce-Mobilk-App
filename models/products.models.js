const mongoose = require('mongoose');
const validator = require('validator');
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    availableQuantity:{
        type:Number,
        required:true
    },
    image:{
        type:String,
    },
    category:{
        type:String,
        required:true,
    
    }
})
module.exports=mongoose.model("products",schema)