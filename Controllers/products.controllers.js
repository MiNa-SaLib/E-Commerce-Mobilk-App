// let products = require('../Data/static.data');
let products = require("../models/products.models");
const {ERROR,FAIL,SUCCESS} = require('../Utilities/httpStatus');

const getAllPrd = async (req, res) => {
    // const query=req.query;
    // const limit=req.query.limit||4;
    // const page=req.query.page||1;
    // const skip=(page-1)*limit;
    // const data=await products.find({},{"__v":false}).limit(limit).skip(skip);
    const data=await products.find({},{"__v":false})
    res.json(
        {
            status:SUCCESS,
            data:{products:data},
            message:`products returned successfully`,
            TotalProducts:data.length
        }
    )
}
const recommended = async (req, res) => {
    const data=await products.find({"price":{$lt:1000}},{"__v":false});
    res.json(
        {
            status:SUCCESS,
            data:{products:data},
            message:`products returned successfully`,
            TotalProducts:data.length
        }
    )
}
const getPrd =async  (req, res) => {
    try{
        const prd=await products.findById(req.params.id)
        if (prd) {
            res.json(
                {
                    status:SUCCESS,
                    data:{product:prd},
                    message:`product returned successfully`
                }
            )
        }
        else{
            res.status(404).json(
                {
                    status:FAIL,
                    data:null,
                    message:`product with id ${req.params.id} not found!`
                }
            )
        }
    }catch(e){
        res.json(
            {
                status:ERROR,
                message:"invalid id"
            }
        )

    }

}

const addNewPrd = async (req,res)=>{
    
    if (req.body.price&&req.body.name) {
        const newPrd=new products(req.body)
        await newPrd.save();
        res.status(201).json(
            {
                status:SUCCESS,
                data:{product:newPrd},
                message:`product added successfully`

            }
        )  
    }
    else{
        res.status(404).json(
            {
                status:FAIL,
                data:null,
                message:`Data must be completed!`
            }
        )
    }
}

const updatePrd = async (req,res)=>{
    let prdId=req.params.id;
    console.log(prdId)
    try{
        let prd=await products.findOneAndUpdate({_id:prdId},{...req.body})
        res.json(
            {
                status:SUCCESS,
                data:{productAfterUpdate:await products.findById(prdId)},
                message:`product updated successfully`
            }
        )

    }catch(e){
        res.status(404).json(
            {
                status:FAIL,
                data:null,
                message:`product with id ${prdId} not found!`
            }
        )
    }
}
const deletePrd = async (req,res)=>{
    let prdId=req.params.id;
    try{
        let prd= await products.findOneAndDelete({_id:prdId})
        if (prd) {
            res.json(
                {
                    status:SUCCESS,
                    data:null,
                    message:`product with id ${prdId} has been deleted`
                }
            )
            
        }
        else{
            res.json(
                {
                    status:FAIL,
                    data:null,
                    message:`product with id ${prdId} not found to be deleted!`
                }
            )

        }
    }
    catch (e) {
        res.status(404).json(
            {
                status:ERROR,
                data:"null",
                data:`product with id ${prdId} is invalid!`
            })
    }
}
const invalidResource=(req, res) => {
    res.status(404).send(
        {
            status:ERROR,
            data:null,
            message:`can not redirect to resource ${req.url}`
        }
    )
}
module.exports={
    addNewPrd,
    deletePrd,
    getAllPrd,
    getPrd,
    updatePrd,
    invalidResource,
    recommended
}