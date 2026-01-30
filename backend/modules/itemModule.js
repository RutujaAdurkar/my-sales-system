// const { sql, poolPromise } = require("../db");

// module.exports = {

//   getAllItems: async () => {
//     const pool = await poolPromise;
//     const result = await pool.request().query("SELECT * FROM ItemMaster");
//     return result.recordset;
//   },

//   insertItem: async (data) => {
//   const pool = await poolPromise; 
//   const req = pool.request();

//   req.input("UOM", data.UOM ?? null);
//   req.input("StatisticGroupId", data.StatisticGroupId ?? null); 
//   req.input("OpeningStock", data.OpeningStock ?? null);
//   req.input("ItemName", data.ItemName ?? null);
//   req.input("TypeDesignation", data.TypeDesignation ?? null);
//   req.input("ItemCode", data.ItemCode ?? null);
//   req.input("MasterId", data.MasterId ?? null);
//   req.input("CurrentStock", data.CurrentStock ?? null);
//   req.input("FF_HW", data.FF_HW ?? null);
//   req.input("SalesPrice", data.SalesPrice ?? null);
//   req.input("DateOfValidity", data.DateOfValidity ?? null);
//   req.input("BasicPrice", data.BasicPrice ?? null);
//   req.input("OpeningValue", data.OpeningValue ?? null);
//   req.input("StoreLocation", data.StoreLocation ?? null);
//   req.input("DeliveryCode", data.DeliveryCode ?? null);
//   req.input("ReorderLevel", data.ReorderLevel ?? null);
//   req.input("MinLevel", data.MinLevel ?? null);
//   req.input("MaxLevel", data.MaxLevel ?? null);
//   req.input("Make", data.Make ?? null);
//   req.input("Factor", data.Factor ?? null);
//   req.input("HSNCode", data.HSNCode ?? null);
//   req.input("CGST", data.CGST ?? null);
//   req.input("SGST", data.SGST ?? null);
//   req.input("IGST", data.IGST ?? null);
//   req.input("Comments", data.Comments ?? null);
//   req.input("SubstituteItem", data.SubstituteItem ?? null);
//   req.input("ExciseHeadNo", data.ExciseHeadNo ?? null);
//   req.input("QuotationFor", data.QuotationFor ?? null);
//   req.input("TransitDays", data.TransitDays ?? null);
//   req.input("CustomDuty", data.CustomDuty ?? null);
//   req.input("Details", data.Details ?? null);
//   req.input("ISBOM", data.ISBOM ?? 0);

//   const query = `
//     INSERT INTO ItemMaster (
//       UOM, StatisticGroupId, OpeningStock, ItemName, TypeDesignation,
//       ItemCode, MasterId, CurrentStock, FF_HW, SalesPrice, DateOfValidity,
//       BasicPrice, OpeningValue, StoreLocation, DeliveryCode, ReorderLevel,
//       MinLevel, MaxLevel, Make, Factor, HSNCode, CGST, SGST,
//       IGST, Comments, SubstituteItem, ExciseHeadNo, QuotationFor,
//       TransitDays, CustomDuty, Details, ISBOM
//     )
//     VALUES (
//       @UOM, @StatisticGroupId, @OpeningStock, @ItemName, @TypeDesignation,
//       @ItemCode, @MasterId, @CurrentStock, @FF_HW, @SalesPrice, @DateOfValidity,
//       @BasicPrice, @OpeningValue, @StoreLocation, @DeliveryCode, @ReorderLevel,
//       @MinLevel, @MaxLevel, @Make, @Factor, @HSNCode, @CGST, @SGST,
//       @IGST, @Comments, @SubstituteItem, @ExciseHeadNo, @QuotationFor,
//       @TransitDays, @CustomDuty, @Details, @ISBOM
//     );
//   `;

//   await req.query(query);
// },


//   updateItem: async (id, data) => {
//   const pool = await poolPromise;
//   const req = pool.request();

//   Object.keys(data).forEach((key) => {
//     req.input(key, data[key]);
//   });

//   req.input("ID", sql.Int, id);   

//   const query = `
//     UPDATE ItemMaster SET
//       UOM=@UOM,
//       StatisticGroupId=@StatisticGroupId,
//       OpeningStock=@OpeningStock,
//       ItemName=@ItemName,
//       TypeDesignation=@TypeDesignation,
//       ItemCode=@ItemCode,
//       MasterId=@MasterId,
//       CurrentStock=@CurrentStock,
//       FF_HW=@FF_HW,
//       SalesPrice=@SalesPrice,
//       DateOfValidity=@DateOfValidity,
//       BasicPrice=@BasicPrice,
//       OpeningValue=@OpeningValue,
//       StoreLocation=@StoreLocation,
//       DeliveryCode=@DeliveryCode,
//       ReorderLevel=@ReorderLevel,
//       MinLevel=@MinLevel,
//       MaxLevel=@MaxLevel,
//       Make=@Make,
//       Factor=@Factor,
//       HSNCode=@HSNCode,
//       CGST=@CGST,
//       SGST=@SGST,
//       IGST=@IGST,
//       Comments=@Comments,
//       SubstituteItem=@SubstituteItem,
//       ExciseHeadNo=@ExciseHeadNo,
//       QuotationFor=@QuotationFor,
//       TransitDays=@TransitDays,
//       CustomDuty=@CustomDuty,
//       Details=@Details,
//       ISBOM=@ISBOM
//     WHERE ID=@ID
//   `;

//   await req.query(query);
// }
// ,
//   deleteItem: async (id) => {
//     const pool = await poolPromise;
//     await pool.request()
//       .input("ID", sql.Int, id)
//       .query("DELETE FROM ItemMaster WHERE ID=@ID");
//   }
// };



const { sql, poolPromise } = require("../db");

module.exports = {

  // GET
  getAllItems: async () => {
    const pool = await poolPromise;
    const result = await pool.request()
      .execute("sp_GetItemMaster");
    return result.recordset;
  },

  // INSERT
  insertItem: async (data) => {
    const pool = await poolPromise;
    const req = pool.request();

    Object.keys(data).forEach(key => {
      req.input(key, data[key]);
    });

    await req.execute("sp_InsertItemMaster");
  },

  // UPDATE
  updateItem: async (id, data) => {
    const pool = await poolPromise;
    const req = pool.request();

    req.input("ID", sql.Int, id);
    Object.keys(data).forEach(key => {
      req.input(key, data[key]);
    });

    await req.execute("sp_UpdateItemMaster");
  },

  // DELETE
  deleteItem: async (id) => {
    const pool = await poolPromise;
    await pool.request()
      .input("ID", sql.Int, id)
      .execute("sp_DeleteItemMaster");
  }
};

