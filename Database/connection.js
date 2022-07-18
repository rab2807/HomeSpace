const oracledb = require('oracledb');
async function checkConnection(){
    try{
        const connection = await oracledb.getConnection({
            user:'system',
            password:'lIght299792458#',
            connectString:'127.0.0.1/orcl'
        });
        const result = await connection.execute('Select count(*) from employees');
        console.log('result',result.rows);
    }catch(e){console.log('exception',e);}
}

 checkConnection();

//npm install oracledb --save. Next on writing the function goto Database folder. To run js command: node .\connection.js. Another important thing is to find the ip address of oracle is running on.