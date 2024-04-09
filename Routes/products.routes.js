const express = require('express');
const router=express.Router();
const prdController = require('../Controllers/products.controllers');
const TokenVerification = require('../middleWares/tokenVerification');
const isAllowed = require('../middleWares/isAllowed');

router.get('/',prdController.getAllPrd )
router.get('/recommended',prdController.recommended )
router.get('/:id',prdController.getPrd)
router.post('/',prdController.addNewPrd)
router.patch('/:id',prdController.updatePrd)
router.delete('/:id',TokenVerification,isAllowed("ADMIN"),prdController.deletePrd)
router.get('*', prdController.invalidResource)

module.exports=router;