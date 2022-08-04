oracledb = require('oracledb')
oracledb.autoCommit = true;

//create connection pool for oracledb
async function startup() {
    console.log('starting up database.');
    await oracledb.createPool({
        user: process.env.DB_USER || 'system',
        password: process.env.DB_PASS || '*************', //pass de tor database er mama *************** er jaygay 
        connectstring: process.env.DB_CONNECTSTRING || 'localhost/XEPDB1',
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
async function executeSql(sql, binds, options) {
    let connection, results;
    try {
        connection = await oracledb.getConnection();
        results = await connection.executeSql(sql, binds, options);
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
    return results;
}

//code to execute many sql
async function executeManySql(sql, binds, options) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        results = await connection.executeManySql(sql, binds, options);
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
const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
}

module.exports = {
    startup,
    shutdown,
    executeSql,
    executeManySql,
    options
};