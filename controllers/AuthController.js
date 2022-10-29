const express = require('express');
const jsonschema = require("jsonschema");//jsonschema 
const jwt  = require("jsonwebtoken");
const {BadRequestError} = require("../helpers/expressError.js");
const cleanUpErrorMesssages = require("../helpers/jsonSchemaHelper");

const userAuthSchema = require("../schemas/userAuth.json");
const authModel = require("../models/authModel");

const router = express.Router();

router.post("/login",async(req,res)=>{

  //validate 
    const validator = jsonschema.validate(req.body, userAuthSchema);
    
    if (!validator.valid) {

      const errs =cleanUpErrorMesssages(validator.errors);


      throw new BadRequestError(errs);
    }
  
    const {email, password } = req.body;

    //authenticate
    const user = await authModel.authenticate(email, password);
    
    //creates my payload
    let payload = {
        id: user.id,
        email: user.email,
        first_name : user.first_name,
        last_name : user.last_name,
        isadmin : user.isadmin
      };
    
      console.log("payload",payload);
      //creates  token
    const token= jwt.sign(payload,process.env.SECRET_KEY);
  
    //return token
    return res.json({ token });

})

module.exports=router;