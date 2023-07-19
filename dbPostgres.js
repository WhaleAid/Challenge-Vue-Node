const Pool = require('pg').Pool;

const pool = new Pool({
    user : "jnvtfcfu",
    host : 'snuffleupagus.db.elephantsql.com',
    database : 'jnvtfcfu',
    password : "PDJ7cN40qgteDNLZPzg6oDEVQ64vKGtF",
    port : 5432,
})


module.exports = pool;
