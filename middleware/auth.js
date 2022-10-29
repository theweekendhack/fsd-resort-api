
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the email,first_name,last_name & isadmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {

    //Extracting the token from the header of the request
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {

      //strip off the word Bearer infront from the token
      const token = authHeader.replace(/^[Bb]earer /, "").trim();

      //assigns the payload from the token to a global variable
      res.locals.user = jwt.verify(token, process.env.SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError();
    }
    return next(); //if you are logged in
  } catch (err) {
    return next(err);
  }
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
  try {

    if (!res.locals.user || res.locals.user.isadmin===false) {
      throw new UnauthorizedError();
    }
    return next(); // only way you would come here is if isadmin key is true
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;

    if (!(user && (user.isadmin || user.id === parseInt(req.params.id)))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};
