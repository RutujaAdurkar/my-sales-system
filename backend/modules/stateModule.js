const { poolPromise } = require("../db");

exports.getStates = async () => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT StateId, StateName
    FROM StateMaster
    ORDER BY StateName
  `);

  return result.recordset;
};
