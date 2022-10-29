
const { Client,types } = require('pg');
const db = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  database:process.env.DATABASE_NAME
})
//this is to ensure that numeric values return as numbers and not text
types.setTypeParser(1700, 'text', parseFloat);

db.connect()
.then(()=>console.log("Connected to db"))
.catch(err=>console.log("Error",err))

module.exports =db;



