const express=require('express');
const router =express.Router()
const  { usersignincontroller }=require('../controller/usersignin')
const  { usersignupcontroller }=require('../controller/usersignup') 
router.post('/signin',usersignincontroller)
router.post('/signup',usersignupcontroller)
module.exports=router


