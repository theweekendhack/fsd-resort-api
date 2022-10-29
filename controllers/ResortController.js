const express = require('express');
const jsonschema = require("jsonschema");//jsonschema LIB
const resortCreateSchema = require("../schemas/resortCreate.json"); // this is the schema that you created with the rules
const resortUpdateSchema = require("../schemas/resortUpdate.json");
const resortModel = require("../models/ResortModel.js");
const {BadRequestError,NotFoundError} = require("../helpers/expressError.js");
const cleanUpErrorMesssages = require("../helpers/jsonSchemaHelper");

const router = express.Router();


//GET ALL Resorts and GET SOME resorts
router.get("/",async(req,res)=>{


    const bestSellerValue= req.query.bestSeller;

    if(bestSellerValue)
    {
        const listOfResorts = await resortModel.getResortsByBestseller(bestSellerValue);
        res.json({
            message : "A list of all the resorts by bestseller",
            data : listOfResorts
        })
    }

    else
    {
        const listOfResorts = await resortModel.getAllResorts();
        res.json({
            message : "A list of all the resorts",
            data : listOfResorts
        }) 
    }


})


router.get("/:id",async(req,res)=>{

const id = parseInt(req.params.id);

const resort = await resortModel.getResort(id);


if(!resort)
{

    throw new NotFoundError(`Resort with id :${id} cannot be found`);
}
else 
{

    
    res.json({
        message : `Resort with id ${id}`,
        data : resort
    })
}


})


router.post("/",async(req,res)=>{

    const resortData = req.body;

    const validator = jsonschema.validate(req.body, resortCreateSchema);

    if (!validator.valid) {
        
        //this is called to shape the validator errors to how I want it to be
        const errs =cleanUpErrorMesssages(validator.errors);

        throw new BadRequestError(errs);
    }


    //Check to see if the title already exists
    const foundResort = await resortModel.getResortByTitle(resortData.title);

    if(foundResort)
    {
    
       throw new BadRequestError({title:`Sorry the title ${req.body.title} already exists`});
    }


    const resort = await resortModel.createResort(resortData) // create
    res.status(201).json({
        message: "A Resort was created!",
        data : resort 
    })


})


router.put("/:id",async (req,res)=>{


    const id  = parseInt(req.params.id);
    let fetchedResort = await resortModel.getResort(id);



    if(!fetchedResort)
    {

        res.status(404).json({
            message : `Resort with id :${id} cannot be found`
        })
    }
    else
    { 

        const validator = jsonschema.validate(req.body, resortUpdateSchema);

        if (!validator.valid) {
            
            //this is called to shape the validator errors to how I want it to be
            const errs =cleanUpErrorMesssages(validator.errors);
    
            throw new BadRequestError(errs);
        }

        /*
            This allows your the client application to pass only the fields that the want to update
        */
        // const resortData = {
        //     title : req.body.title ? req.body.title : fetchedResort.title,
        //     description : req.body.description ? req.body.description: fetchedResort.description, 
        //     type : req.body.type ? req.body.type : fetchedResort.type, 
        //     rules : req.body.rules ? req.body.rules : fetchedResort.rules,
        //     location : req.body.location ? req.body.location: fetchedResort.location, 
        //     photo_url : req.body.photo_url ? req.body.photo_url : fetchedResort.photo_url, 
        //     bestseller : req.body.bestseller ? req.body.bestseller: fetchedResort.bestseller, 
        //     price : req.body.price ? req.body.price : fetchedResort.price
        // }
        
        const resort = await resortModel.updateResort(req.body,id);


        res.json({
            message : `Resort with id ${resort.id} was updated`,
            data : resort
        })

    }
})

router.delete("/:id",async(req,res)=>{

    const id = parseInt(req.params.id);

    const resort = await resortModel.deleteResort(id);
    
    if(!resort)
    {
        res.status(404).json({
            message : `Resort with id :${id} cannot be found`
        })
    }
    
    else 
    {
        await resortModel.deleteResort(id)
        res.json({
            message : `Resort with id ${id} was deleted`
            
        })
    }
    


})

module.exports=router;