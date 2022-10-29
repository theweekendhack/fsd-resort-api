const express = require("express");
const cors = require("cors");
const {authenticateJWT} = require("./middleware/auth");
const {NotFoundError} = require("./helpers/expressError.js");

//This must be loaded before all your controllers imports

require("dotenv").config();

const resortController = require("./controllers/ResortController");
const userController = require("./controllers/UserController");
const authController = require("./controllers/AuthController");


const app = express();
//This must be loaded before your controllers
app.use(express.json()); 

//This is how we relax our Single Origin Policy
//The below means Every Front-End can send an AJAX request to my Back-End
app.use(cors());

app.use(authenticateJWT)

//load controllers
app.use("/api/auth",authController);
app.use("/api/users",userController);
app.use("/api/resorts",resortController);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    throw new NotFoundError();
  });
  

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {

    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  

//starts up server
app.listen(process.env.PORT, ()=>{
    console.log(`API is up and running on port ${process.env.PORT}`);
})

