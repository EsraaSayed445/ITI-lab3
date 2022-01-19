const { validateUser,validateloginUser } = require("../userHelpers");
const express = require("express");
const router = express.Router();
var jwt = require('jsonwebtoken');
const serverConfig = require('../serverConfig')
const { auth } = require('../middlewares/auth')
const User = require('../models/User')
require('../mongoConnect')

/* 
Lab 5: 
user database instead of files
user jwt to authenticate users after login 
check if the user delete/patch/get his own document
checl if user who use GET /user is authenticated
*/


router.post("/", async (req, res, next) => {
  try {
    const { username , age , password}=req.body;
     const user = new User({username, age, password})
      await user.save()
      res.send({ message: "sucess" });
  } catch (error) {
    next({ status: 500, internalMessage: error.message });
  }
  });
  
router.post('/login', async (req,res,next) => {
    const {username, password} = req.body
    const user = await User.findOne({ username })
    if(!user) return next({status:401, message:"username or passord is incorrect"})
    if(user.password !== password) next({status:401, message:"username or passord is incorrect"})
    const payload = {id:user.id }
    const token = jwt.sign(payload, serverConfig.secret);
    return res.status(200).send({message:"Logged in Successfully", token}) 
});


router.patch("/:userId",auth, async (req, res, next) => {
      if(req.user.id !== req.params.userId) next({status:403, message:"Authorization error 2"})
      try {
        const {password, age} = req.body
        req.user.password = password
        req.user.age = age
        await req.user.save()
        res.send("sucess")
      } catch (error) {
        next({ status: 500, internalMessage: error.message });
      }
  });
  
  
  router.get('/', auth,async (req,res,next)=>{
    try {
      const query = req.query.age ? {age:req.query.age}:{}
      const users = await User.find(query,{password:0})
      res.send(users)
    } catch (error) {
    next({ status: 500, internalMessage: error.message });
    }
  
  })
  
  
  router.get('/:userId',auth, async (req,res,next)=>{
    try {
      const id = req.params.userId 
      const users = await User.findById(id)
      res.send(users) 
    } catch (error) {
        next({status:500, internalMessage:error.message})
    }
  });
  
  router.delete('/:userId',auth, async (req,res,next)=>{
    try{
      const id = req.params.userId.toString().trim()
      User.findByIdAndDelete(id, function(err){
        if(err){
          next({status:200, internalMessage:error.message});
        }
      res.send("delete")
      })   
  } catch (error) {
    next({status:500, internalMessage:error.message});
  }
  });
  

module.exports = router;
