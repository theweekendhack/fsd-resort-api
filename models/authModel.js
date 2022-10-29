const db = require("../config/db.js");
const bcrypt= require("bcryptjs");
const {UnauthorizedError} = require("../helpers/expressError.js");

class AuthModel
{
    static async authenticate(email,password)
    {
       
      const results=  await db.query(`
      SELECT
        id,
        first_name,
        last_name,
        email,
        password,
        isadmin 
      FROM users 
      WHERE email = $1`,
      [email]);
        const user = results.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
              return user;
            }
          }

          //if you get to this line of code it  means,  your email and/or password is incorrect 
          throw new UnauthorizedError({email:"Invalid Email/password"});

    }
   
}


module.exports = AuthModel;