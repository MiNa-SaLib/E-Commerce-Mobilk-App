const express = require('express')
const usersController=require('../Controllers/users.controllers')
const router = express.Router()
const TokenVerification = require('../middleWares/tokenVerification');

router.get('/',usersController.getAllUsers)
router.get('/:id',usersController.getUser)
router.post('/:id/:card',usersController.addToCard)
router.get('/:id/:card',usersController.getCard)
router.delete('/:id/:card',usersController.DeleteCard)

router.post('/register',usersController.register)
router.post('/login',usersController.login)
module.exports=router