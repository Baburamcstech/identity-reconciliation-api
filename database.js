const mysql=require('mysql');
require('dotenv').config();

const connection=mysql.createConnection({
    host:process.env.database_host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database
})
module.exports=connection;
