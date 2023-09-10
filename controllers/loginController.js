const authorModel = require("../models/authorModel.js");
const jwt = require('jsonwebtoken'); 

const login = async function(req,res){
    try {
      const data = req.body;
  
      if (!data.email) {
        return res.status(400).send({status:false, msg:"email is required"});
        
      }
  
      if (!data.password) {
        return res.status(400).send({status:false, msg:"password is required"});
        
      }
      const userMatch = await authorModel.findOne({email:data.email,password:data.password})
  
     
   if (!userMatch) {
  
        return res.status(400).send({status:false, msg:"email or password is incorrect"});
        
      }
   
      //const token = jwt.sign({userId:userMatch._id.toString}, process.env.SECRET_KEY,{expiresIn:'80h'})
      const token = jwt.sign({userId: userMatch._id.toString()}, process.env.SECRET_KEY,{expiresIn:'80h'})
      return res.status(200).send({status:true,msg:"you have successfully logged in", token});
  
  
    } catch (error) {
  
      res.status(500).send({status:false, error:error.msg})
      
    }
  }
  
  module.exports.login=login;