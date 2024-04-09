function isAllowed(...roles) {
    return (req,res,next)=>{
        if(!roles.includes(req.currentUser.role)){
            next(res.status(401).json({message:"not allowed"}))
        }
        next();
    }
}
module.exports=isAllowed;