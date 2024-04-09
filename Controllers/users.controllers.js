const { json } = require('body-parser');
const { SUCCESS, FAIL, ERROR } = require('../Utilities/httpStatus');
const allUsers = require('../models/users.models');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const getAllUsers= async (req,res)=>{
    const users=await allUsers.find({},{'__v':false,"password":false});
    res.json(
        {
            status:SUCCESS,
            data:{users},
            message:`users returned successfully`
        }
    )
}
const getUser=async (req,res)=>{
    try {
    const user=await allUsers.findById(req.params.id)
    if (user) {
        res.status(200).json({
            status:SUCCESS,
            data:{user},
            message:`user returned successfully`
        })
    }else{
        res.status(404).json({
            status:FAIL,
            data:null,
            message:`Not found user`
        })
    }
    
   } catch (error) {
        res.status(400).json({
            status:ERROR,
            data:null,
            message:`Invalid user id`
        })
   }

}
const register=async(req,res)=>{
    try {
        const{firstName,lastName,email,password,role}=req.body;
        console.log(req.body)
        const oldUser= await allUsers.findOne({email:email});
        if (oldUser) {
            return res.status(400).json({status:FAIL,data:null,message:`user with email ${email} already exist`})
        }
        const hashedPass=await bcrypt.hash(password,10)
        const newUser= new allUsers({firstName,lastName,email,password:hashedPass,role})
        await newUser.save();
        res.status(201).json({status:SUCCESS,data:{newUser}})
        
    } catch (error) {
        res.status(400).json({status:FAIL,message:(error.message)});
    }
    
}
const login=async(req,res)=>{
    const {email,password}=req.body;
    if (!email&&!password) {
        return res.status(400).json({status:FAIL,message:`Email and password are required`});
    }
    if (!email) {
        return res.status(400).json({status:FAIL,message:`Email is required`});
    }
    if (!password) {
        return res.status(400).json({status:FAIL,message:`password is required`});
    }

    const user=await allUsers.findOne({'email':email})
    if(user){
        const matchedPassword=await bcrypt.compare(password,user.password)
        if (matchedPassword) {
            const token=await JWT.sign({email:user.email,id:user._id,role:user.role},process.env.JWT_PRIVATE_KEY,{expiresIn:'60m'})
             user.token=token;
             user.save()
            return res.status(200).json({status:SUCCESS,data:user,message:`user logged successfully`})
            //generate TOKENS
        }else{
            return res.json({status:FAIL,message:`Password does not match`}) 
        }
    }
    else{
        return res.status(500).json({status:FAIL,message:`please register first`})
    }

}
const addToCard= async(req,res)=>{
    try {
        const userId= req.params.id;
        // console.log(userId)
        // console.log(req.body)
        const user=await allUsers.findById(userId);
        if (user) {
            // let arr=[1,2,3,4]
            // console.log(arr.find(num=>num==4));
            // console.log(req.body,user.card[0]);
            
            const oldProduct= user.card.find(product=>product._id==req.body._id)
            if(!oldProduct){
                user.card.push(req.body);
                user.save()
                return res.json({status:SUCCESS,message:`Product added to the card`,cardLength:user.card.length})
            }else{
                return res.json({status:FAIL,message:`Product already exist in the card`})
            }
        }       
    } catch (error) {
        res.json({status:FAIL,error,message:`Can not add the product to the card`})
    }
}
const getCard=async(req,res)=>{
    const userId=req.params.id;
    try {
        
        const user=await allUsers.findById(userId);
        if (user) {
            res.json({status:SUCCESS,data:user.card,message:`Product returned successfully`,cardLength:user.card.length});
        }else{
            res.json({status:FAIL,message:`You must login first`})
        }
    } catch (error) {
        res.json({status:FAIL,error,message:`You must login first`})
        
    }

}
const DeleteCard=async(req,res)=>{
    const userId=req.params.id;
    try {
        
        const user=await allUsers.findById(userId);
        if (user) {
            (user.card).splice(0,user.card.length)
            user.save();
            res.json({status:SUCCESS,data:user.card,message:`Products deleted successfully`,cardLength:user.card.length});
        }else{
            res.json({status:FAIL,message:`You must login first`})
        }
    } catch (error) {
        res.json({status:FAIL,error,message:`You must login first`})
        
    }

}
module.exports={
    DeleteCard,
    getCard,
    getAllUsers,
    getUser,
    register,
    login,
    addToCard
}