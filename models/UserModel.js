const db = require("../config/db.js");
const bcrypt= require("bcryptjs");

class UserModel
{

    static async createUser(user)
    {
    
        const salt = await bcrypt.genSalt(10); 
        const hashPassword = await bcrypt.hash(user.password,salt);


        const results= await db.query(`
        INSERT INTO users 
        (
            first_name,
            last_name,
            email,
            password
        ) 
        VALUES($1,$2,$3,$4) 
        RETURNING id,first_name,last_name,email,isadmin`,
        [
            user.first_name,
            user.last_name,
            user.email,
            hashPassword
        ]);
        return results.rows[0];
    }

    static async createAdminUser(user)
    {

        const salt = await bcrypt.genSalt(10); 
        const hashPassword = await bcrypt.hash(user.password,salt);
    
        const results= await db.query(`
        INSERT INTO users 
        (
            first_name,
            last_name,
            email,
            password,
            isadmin
        ) 
        VALUES($1,$2,$3,$4,$5) 
        RETURNING id,first_name,last_name,email,isadmin`,
        [
            user.first_name,
            user.last_name,
            user.email,
            hashPassword,
            user.isadmin
        ]);
        return results.rows[0];
    }


    static async getAllUsers()
    {

        const results= await db.query(`
        SELECT 
            id,
            first_name,
            last_name,
            email,
            isadmin 
        FROM users;`);
  
        return results.rows; 
    }

    static async getUserByEmail(email)
    {
        const results= await db.query(`
        SELECT 
            id,
            first_name,
            last_name,
            email,
            isadmin
        FROM users 
        WHERE email=$1`,
        [email]);
  
        return results.rows[0]; 
    }

    static async getUserById(id)
    {

        const results=  await db.query(`
        SELECT 
            id,
            first_name,
            last_name,
            email,
            isadmin
        FROM users 
        WHERE id = $1`,
        [id]);
        return results.rows[0];
         
    }

    static async deleteUser(id)
    {
        const results=  await db.query(`
        DELETE FROM users 
        WHERE id = $1 
        RETURNING *`,
        [
            id
        ]);
        return results.rows[0];
    }

    static async updateUser(user_form,id)
    {

        const results= await db.query(`
        UPDATE users 
        SET first_name =$1,
        last_name=$2
        WHERE id=$3
        RETURNING id,first_name,last_name,email,isadmin;`,
        [
            user_form.first_name,
            user_form.last_name,
            id
        ])
        return results.rows[0];
    }



}

module.exports = UserModel;