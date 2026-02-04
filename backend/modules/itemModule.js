const { sql, poolPromise } = require("../db");

module.exports = {

  // GET (ALL or BY ID)
  getAllItems: async (id = null) => {
    const pool = await poolPromise;
    const req = pool.request();

    req.input("ID", sql.Int, id);

    const result = await req.execute("usp_getItemMaster");
    return result.recordset;
  },

  // SET (INSERT + UPDATE)
  setItem: async (data) => {
    const pool = await poolPromise;
    const req = pool.request();

    const paramTypes = {
      ID: sql.Int,
      UOM: sql.NVarChar(6),
      GroupId: sql.Int,
      OpeningStock: sql.Decimal(18,2),
      ItemName: sql.NVarChar(100),
      TypeDesignation: sql.NVarChar(100),
      ItemCode: sql.NVarChar(20),
      MasterId: sql.Int,
      CurrentStock: sql.Decimal(18,2),
      FF_HW: sql.NVarChar(10),
      SalesPrice: sql.Decimal(18,2),
      DateOfValidity: sql.DateTime,
      BasicPrice: sql.Decimal(18,2),
      OpeningValue: sql.Decimal(18,2),
      Location: sql.NVarChar(50),
      DeliveryCode: sql.NVarChar(5),
      ReorderLevel: sql.Decimal(18,2),
      MinLevel: sql.Decimal(18,2),
      MaxLevel: sql.Decimal(18,2),
      Make: sql.NVarChar(50),
      StockFactor: sql.Decimal(18,2),
      HSNCode: sql.NVarChar(15),
      CGST: sql.Decimal(18,2),
      SGST: sql.Decimal(18,2),
      IGST: sql.Decimal(18,2),
      Comments: sql.NVarChar(500),
      SubstituteItem: sql.NVarChar(20),
      QuotationCurrency: sql.NVarChar(3),
      TransitDays: sql.Int,
      CustomDuty: sql.Decimal(18,2),
      Details: sql.NVarChar(400),
      ISBOM: sql.Bit
    };

    Object.keys(data).forEach((key) => {
      const val = data[key];
      const type = paramTypes[key];
      if (type) {
        req.input(key, type, val);
      } else {
        req.input(key, sql.NVarChar(sql.MAX), val);
      }
    });

    const result = await req.execute("usp_setItemMaster");
    return result.recordset;
  },

  // DELETE (keep separate – good practice)
  // deleteItem: async (id) => {
  //   const pool = await poolPromise;
  //   await pool.request()
  //     .input("ID", sql.Int, id)
  //     .query("DELETE FROM ItemMaster WHERE ID=@ID");
  // }
  deleteItem: async (id) => {
  const pool = await poolPromise;
  await pool.request()
    .input("ID", sql.Int, id)
    .execute("usp_deleteItemMaster");
}

};


