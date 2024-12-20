oracledb = require('oracledb')
oracledb.autoCommit = true;

//create connection pool for oracledb
async function startup() {
    console.log('starting up database.');
    await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectstring: process.env.DB_CONNECTSTRING,
        poolMin: 4,
        poolMax: 10,
        poolIncrement: 1
    });
    console.log('Pool Created....');
}

//close connection pool for oracledb
async function shutdown() {
    console.log('Shutting down database.');
    try {
        //If this hangs, I may need DISABLE_OOB=ON in a sqlnet.ora file.
        await oracledb.getPool().close(10);
        console.log('Pool closed');
    } catch (err) {
        console.log("Error shutting down database: " + err.message);
    }
}

//code to execute sql
async function execute(sql, binds, options) {
    let connection, results;
    try {
        connection = await oracledb.getConnection();
        results = await connection.execute(sql, binds, options = {outFormat: oracledb.OUT_FORMAT_OBJECT});
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.log("Error closing connection: " + err);
            }
        }
    }
    return results;
}

//code to execute many sql
async function executeMany(sql, binds, options) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        let results = await connection.executeMany(sql, binds, options = {outFormat: oracledb.OUT_FORMAT_OBJECT});
    } catch (err) {
        console.log("Error executing sql: " + err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.log("Error closing connection: " + err);
            }
        }
    }
    return;
}

//output for execution of sql
const options = {}

module.exports = {
    startup,
    shutdown,
    execute,
    executeMany,
    options
};