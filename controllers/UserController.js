const express = require('express');
const jsonschema = require("jsonschema");//jsonschema LIB
const userCreateSchema = require("../schemas/userRegister.json"); // this is the schema that you created with the rules
const adminUserCreateSchema = require("../schemas/adminUserRegister.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const {ensureAdmin,ensureCorrectUserOrAdmin,ensureLoggedIn} = require("../middleware/auth");
const userModel = require("../models/UserModel");
const {BadRequestError,NotFoundError} = require("../helpers/expressError.js");
const cleanUpErrorMesssages = require("../helpers/jsonSchemaHelper");


const router = express.Router();

router.get("/",async(req,res)=>{

    const listOfUsers = await userModel.getAllUsers();
    res.json({
        message : "A list of all the users",
        data : listOfUsers
    }) 
    
})

router.get("/:id",ensureCorrectUserOrAdmin,async(req,res)=>{

const id = parseInt(req.params.id);

const user = await userModel.getUserById(id);


if(!user)
{

    throw new NotFoundError(`User with id :${id} cannot be found`);
}
else 
{
    res.json({
        message : `User with id ${id}`,
        data : user
    })
}


})


router.post("/",async(req,res)=>{

    const userData = req.body;

    const validator = jsonschema.validate(req.body, userCreateSchema);

    if (!validator.valid) 
    {
        //this is called to shape the validator errors to how I want it to be
        const errs =cleanUpErrorMesssages(validator.errors);

        throw new BadRequestError(errs);
    }


    //Check to see if the title already exists
    const foundUser = await userModel.getUserByEmail(userData.email);

    if(foundUser)
    {
    
       throw new BadRequestError({"email":`Sorry the email ${req.body.email} already exists`});
    }

    const user = await userModel.createUser(userData) // create
    res.status(201).json({
        message: "A User was created!",
        data : user 
    })

})

router.post("/admin",ensureAdmin,async(req,res)=>{

    const userData = req.body;

    const validator = jsonschema.validate(req.body, adminUserCreateSchema);

    if (!validator.valid) 
    {

        //this is called to shape the validator errors to how I want it to be
        const errs =cleanUpErrorMesssages(validator.errors);
        throw new BadRequestError(errs);

    }


    //Check to see if the title already exists
    const foundUser = await userModel.getUserByEmail(userData.email);

    if(foundUser)
    {
    
       throw new BadRequestError({email:`Sorry the email ${req.body.email} already exists`});
    }

    const user = await userModel.createAdminUser(userData) // create

    console.log("User",user)
    res.status(201).json({
        message: "An Admin User was created!",
        data : user 
    })

})


router.patch("/:id",ensureCorrectUserOrAdmin,async (req,res)=>{


    const id  = parseInt(req.params.id);
    let fetchedUser = await userModel.getUserById(id);

    if(!fetchedUser)
    {

        res.status(404).json({
            message : `User with id :${id} cannot be found`
        })
    }
    else
    { 


        const validator = jsonschema.validate(req.body, userUpdateSchema);
    
        if (!validator.valid) {
    
            //this is called to shape the validator errors to how I want it to be
            const errs =cleanUpErrorMesssages(validator.errors);
            throw new BadRequestError(errs);
        
        }


        /*
            This allows your the client application to pass only the fields that the want to update
        */
        const userData = {
            first_name : req.body.first_name ? req.body.first_name : fetchedUser.first_name,
            last_name : req.body.last_name ? req.body.last_name: fetchedUser.last_name, 
        }
        
        const user = await userModel.updateUser(userData,id);


        res.json({
            message : `User with id ${user.id} was updated`,
            data : user
        })

    }
})

router.delete("/:id",ensureCorrectUserOrAdmin,async(req,res)=>{

    const id = parseInt(req.params.id);

    const user = await userModel.getUserById(id);
    
    if(!user)
    {
        res.status(404).json({
            message : `User with id :${id} cannot be found`
        })
    }
    
    else 
    {
        await userModel.deleteUser(id)
        res.json({
            message : `User with id ${id} was deleted`
            
        })
    }
    
})

module.exports=router;