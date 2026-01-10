// const { sql, poolPromise } = require("../db");

// exports.saveCity = async (data) => {
//   const pool = await poolPromise;

//   return pool.request()
//     .input("CityId", sql.Int, data.cityId)
//     .input("CityName", sql.VarChar, data.cityName)
//     .input("AreaName", sql.VarChar, data.areaName)
//     .input("StateName", sql.VarChar, data.state)
//     .query(`
//       INSERT INTO CityMaster (CityId, CityName, AreaName, StateName)
//       VALUES (@CityId, @CityName, @AreaName, @StateName)
//     `);
// };



const { sql, poolPromise } = require("../db");

/* SAVE */
exports.saveCity = async (data) => {
  const pool = await poolPromise;
  return pool.request()
    .input("CityId", sql.Int, data.cityId)
    .input("CityName", sql.VarChar, data.cityName)
    .input("AreaName", sql.VarChar, data.areaName)
    .input("StateName", sql.VarChar, data.state)
    .query(`
      INSERT INTO CityMaster (CityId, CityName, AreaName, StateName)
      VALUES (@CityId, @CityName, @AreaName, @StateName)
    `);
};

/* LIST */
exports.listCities = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT CityId as cityId,
           CityName as cityName,
           AreaName as areaName,
           StateName as state
    FROM CityMaster
    ORDER BY CityName
  `);
  return result.recordset;
};

/* DELETE */
exports.deleteCity = async (cityId) => {
  const pool = await poolPromise;
  return pool.request()
    .input("CityId", sql.Int, cityId)
    .query(`DELETE FROM CityMaster WHERE CityId = @CityId`);
};

/* UPDATE */
exports.updateCity = async (cityId, data) => {
  const pool = await poolPromise;
  return pool.request()
    .input("CityId", sql.Int, cityId)
    .input("CityName", sql.VarChar, data.cityName)
    .input("AreaName", sql.VarChar, data.areaName)
    .input("StateName", sql.VarChar, data.state)
    .query(`
      UPDATE CityMaster
      SET CityName = @CityName,
          AreaName = @AreaName,
          StateName = @StateName
      WHERE CityId = @CityId
    `);
};

