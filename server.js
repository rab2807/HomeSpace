//configuring .env variables
require('dotenv').config();

const app = require('./app');
const database = require('./Database/database');


//need to set this for oracledb connection pool
process.env.UV_THREADPOOL_SIZE = 10;

const port = process.env.PORT || 3000; //is it 3000?

app.listen(port, async () => {
    try {
        //create database connection pool
        await database.startup();
        console.log(`listening on http://localhost:${port}`);
    } catch (err) {
        console.log("Error starting up database: " + err);
        process.exit(1);
    }
});

process
    .once('SIGTERM', database.shutdown)
    .once('SIGINT', database.shutdown);


//install dotenv: npm install dotenv
//node server.js