const db = require("../config/db.js");

class ResortModel
{

    static async createResort(resort)
    {
    
        const results= await db.query(`
        INSERT INTO resorts 
        (title,description,type,rules,location,photo_url,bestseller,price) 
        VALUES($1,$2,$3,$4,$5,$6,$7,$8) 
        RETURNING id,title,description,type,rules,location,photo_url,bestseller,price`,
        [
            resort.title,
            resort.description,
            resort.type,
            resort.rules,
            resort.location,
            resort.photo_url,
            resort.bestseller,
            resort.price
        ]
        );
        return results.rows[0];
    }
    static async getAllResorts()
    {

        const results= await db.query("SELECT * FROM resorts;");
  
        return results.rows; 
    }

    static async getResortsByBestseller(value)
    {

        const results= await db.query(`
        SELECT * FROM resorts 
        WHERE bestseller=$1`,
        [value]);
  
        return results.rows; 
    }

    static async getResort(id)
    {

        const results=  await db.query(`
        SELECT * 
        FROM resorts 
        WHERE id = $1`,
        [id]);
        return results.rows[0];
         
    }

    static async getResortByTitle(title)
    {
        const results=  await db.query(`
        SELECT * 
        FROM resorts 
        WHERE title = $1`,
        [title]);
        return results.rows[0];
    }


    static async deleteResort(id)
    {
        const results=  await db.query(`
        DELETE FROM resorts 
        WHERE id = $1 
        RETURNING *`,
        [
            id
        ]);
        return results.rows[0];
    }

    static async updateResort(resort_form_data,id)
    {

        const results= await db.query(`
        UPDATE resorts 
        SET title =$1,
        description=$2,
        type=$3,
        rules=$4,
        location=$5,
        photo_url=$6,
        bestseller=$7,
        price=$8
        WHERE id=$9 RETURNING id,title,description,type,rules,location,photo_url,bestseller,price;`,
        [
            resort_form_data.title,
            resort_form_data.description,
            resort_form_data.type,
            resort_form_data.rules,
            resort_form_data.location,
            resort_form_data.photo_url,
            resort_form_data.bestseller,
            resort_form_data.price,
            id
        ])
        return results.rows[0];
    }



}

module.exports = ResortModel;