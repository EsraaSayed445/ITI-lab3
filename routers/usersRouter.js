const fs = require("fs");
const { validateUser } = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.post("/", validateUser, async (req, res, next) => {
    try {
        const { username, age, password } = req.body;
        const data = await fs.promises
            .readFile("./user.json", { encoding: "utf8" })
            .then((data) => JSON.parse(data));
        const id = uuidv4();
        data.push({ id, username, age, password });
        await fs.promises.writeFile("./user.json", JSON.stringify(data), {
            encoding: "utf8",
        });
        res.send({ id, message: "sucess" });
    } catch (error) {
        next({ status: 500, internalMessage: error.message });
    }
  });
  
  router.patch("/:userId", async (req, res, next) => {
    try {
        const { username , password , age } = req.body;
        const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
        const users = JSON.parse(data);
        const newUser = users.map((user)=> {
            if(user.id !== req.params.userId) return user ;
            return {
                username,
                password,
                age,
                id:req.params.userId,
            };
      
        })
        fs.promises.writeFile("./user.json",JSON.stringify(newUser),{encoding:"utf8"});
        res.status(200).send("user edited")
    } catch (error) {
        next({status:500, internalMessage:error.message})
    }
  });
  
  
  router.get('/', async (req,res,next)=>{
    try {
    const age = Number(req.query.age)
    const users = await fs.promises
    .readFile("./user.json", { encoding: "utf8" })
    .then((data) => JSON.parse(data));
    const filteredUsers = users.filter(user=>user.age===age)
    res.send(filteredUsers)
    } catch (error) {
    next({ status: 500, internalMessage: error.message });
    }
  
  })
  
  
  router.post('/login', async (req,res,next) => {
    try {
        const {username , password} = req.body;
  
        const data = await fs.promises.readFile('./user.json',{encoding:'utf8'});
        const users = JSON.parse(data);
  
        const uname = users.find((ele)=>ele.username === username && ele.password === password)
        
        if(uname){
            return next({status:200,message:"login success"}) 
        }
        else{
           return  next({status:403,message:"login field"}) 
        }
        
    }catch(error){
        next({status:500, internalMessage:error.message})
    }
  
  }); 
  
  router.get('/:userId', async (req,res,next)=>{
    try {
      const id = req.params.userId
      const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
      const users = JSON.parse(data);
      const filteredUsers = users.filter(user=>user.id===id)
      res.status(200).send(filteredUsers)
    } catch (error) {
        next({status:404, message:"not found"})
    }
  
  });
  
  router.delete('/:userId', async (req,res,next)=>{
    try {
      const id = req.params.userId
      const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
      const users = JSON.parse(data);
      const filteredUsers = users.filter(user=>user.id !== id)
      fs.promises.writeFile('./user.json',JSON.stringify(filteredUsers),{encoding:'utf8'})
      res.status(200).send("deleted user")
  } catch (error) {
      next({status:404, message:"error"})
  }
  });
  

module.exports = router;
