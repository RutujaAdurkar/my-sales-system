const { poolPromise } = require("../db");

module.exports = {
  getStatisticGroups: async () => {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT GroupId, GroupCode FROM StatisticGroup ORDER BY GroupId"
    );
    return result.recordset;
  },

  getMasters: async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(
    "SELECT Id, MasterIdName FROM Master ORDER BY MasterIdName"
  );
  return result.recordset;
},

  getProductInFocus: async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(
    "SELECT DISTINCT ItemCode FROM ProductInFocus ORDER BY ItemCode"
  );
  return result.recordset;
},

  getSubstituteItems: async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(
    "SELECT Id, ItemCode FROM SubstituteItem ORDER BY ItemCode"
  );
  return result.recordset;
},

  getTypeSelections: async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(
    "SELECT TypeId, TypeName FROM TypeSelection ORDER BY TypeName"
  );
  return result.recordset;
}
};
