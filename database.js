const mysql=require('mysql');
require('dotenv').config();

const connection=mysql.createConnection({
    host:'localhost',
    user:process.env.user,
    password:process.env.password,
    database:process.env.database
})
module.exports=connection;
