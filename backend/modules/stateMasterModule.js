// // const { sql, poolPromise } = require("../db");

// // exports.saveState = async (data) => {
// //   const pool = await poolPromise;

// //   return pool.request()
// //     .input("StateName", sql.VarChar, data.stateName)
// //     .query(`
// //       INSERT INTO StateMaster (StateName)
// //       VALUES (@StateName)
// //     `);
// // };


// const { sql, poolPromise } = require("../db");

// exports.saveState = async (data) => {
//   const pool = await poolPromise;

//   return pool.request()
//     .input("StateName", sql.VarChar(100), data.stateName) // ✅ lowercase
//     .query(`
//       INSERT INTO StateMaster (StateName)
//       VALUES (@StateName)
//     `);
// };


// const { sql, poolPromise } = require("../db");

// exports.checkDuplicateState = async (stateName) => {
//   const pool = await poolPromise;

//   const result = await pool.request()
//     .input("StateName", sql.VarChar(100), stateName)
//     .query(`
//       SELECT StateId 
//       FROM StateMaster 
//       WHERE StateName = @StateName
//     `);

//   return result.recordset.length > 0;
// };

// exports.saveState = async (data) => {
//   const pool = await poolPromise;

//   return pool.request()
//     .input("StateName", sql.VarChar(100), data.stateName)
//     .query(`
//       INSERT INTO StateMaster (StateName)
//       VALUES (@StateName)
//     `);
// };

// const { sql, poolPromise } = require("../db");

// /**
//  * 🔴 CHECK DUPLICATE STATE (CASE-INSENSITIVE)
//  * Returns true if state already exists
//  */
// exports.checkDuplicateState = async (stateName) => {
//   const pool = await poolPromise;

//   const result = await pool.request()
//     .input("StateName", sql.VarChar(100), stateName.trim())
//     .query(`
//       SELECT COUNT(*) AS cnt
//       FROM StateMaster
//       WHERE UPPER(StateName) = UPPER(@StateName)
//     `);

//   return result.recordset[0].cnt > 0;
// };

// /**
//  * 🟢 SAVE STATE (ONLY NEW STATE)
//  */
// exports.saveState = async ({ stateName }) => {
//   const pool = await poolPromise;

//   return pool.request()
//     .input("StateName", sql.VarChar(100), stateName.trim())
//     .query(`
//       INSERT INTO StateMaster (StateName)
//       VALUES (@StateName)
//     `);
// };



const { sql, poolPromise } = require("../db");

/* CHECK DUPLICATE (already exists) */
exports.checkDuplicateState = async (stateName) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("StateName", sql.VarChar(100), stateName)
    .query(`
      SELECT COUNT(*) cnt
      FROM StateMaster
      WHERE UPPER(StateName) = UPPER(@StateName)
    `);
  return result.recordset[0].cnt > 0;
};

/* SAVE (already exists) */
exports.saveState = async ({ stateName }) => {
  const pool = await poolPromise;
  return pool.request()
    .input("StateName", sql.VarChar(100), stateName)
    .query(`INSERT INTO StateMaster (StateName) VALUES (@StateName)`);
};

/* ✅ LIST */
exports.listStates = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      StateId,
      StateName
    FROM StateMaster
    ORDER BY StateName
  `);
  return result.recordset;
};

/* ✅ DELETE */
exports.deleteState = async (StateId) => {
  const pool = await poolPromise;
  return pool.request()
    .input("StateId", sql.Int, StateId)
    .query(`DELETE FROM StateMaster WHERE StateId = @StateId`);
};

/* CHECK DUPLICATE EXCEPT CURRENT */
exports.checkDuplicateStateExceptId = async (stateName, StateId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("StateName", sql.VarChar(100), stateName)
    .input("StateId", sql.Int, StateId)
    .query(`
      SELECT COUNT(*) cnt
      FROM StateMaster
      WHERE UPPER(StateName) = UPPER(@StateName)
      AND StateId <> @StateId
    `);

  return result.recordset[0].cnt > 0;
};

/* UPDATE */
exports.updateState = async (StateId, stateName) => {
  const pool = await poolPromise;
  return pool.request()
    .input("StateId", sql.Int, StateId)
    .input("StateName", sql.VarChar(100), stateName)
    .query(`
      UPDATE StateMaster
      SET StateName = @StateName
      WHERE StateId = @StateId
    `);
};

