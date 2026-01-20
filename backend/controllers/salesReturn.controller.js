const { sql, poolPromise } = require("../db");

exports.saveSalesReturn = async (req, res) => {
  try {
    const pool = await poolPromise;

    const {
      salesReturnNo,
      salesReturnDate,
      customer,
      docNo,
      docDate,
      packingPer,
      packing,
      freight,
      cgst,
      sgst,
      igst,
      totalCgst,
      totalSgst,
      totalIgst,
      grandTotal,
      narration,
      invoiceCancel,
      items
    } = req.body;

    // 1️⃣ SAVE HEADER
    await pool.request()
      .input("SalesReturnNo", sql.VarChar, salesReturnNo)
      .input("SalesReturnDate", sql.Date, salesReturnDate)
      .input("Customer", sql.VarChar, customer)
      .input("DocNo", sql.VarChar, docNo)
      .input("DocDate", sql.Date, docDate)
      .input("PackingPer", sql.Decimal(10,2), packingPer || 0)
      .input("Packing", sql.Decimal(10,2), packing || 0)
      .input("Freight", sql.Decimal(10,2), freight || 0)
      .input("CGST", sql.Decimal(10,2), cgst || 0)
      .input("SGST", sql.Decimal(10,2), sgst || 0)
      .input("IGST", sql.Decimal(10,2), igst || 0)
      .input("TotalCGST", sql.Decimal(10,2), totalCgst || 0)
      .input("TotalSGST", sql.Decimal(10,2), totalSgst || 0)
      .input("TotalIGST", sql.Decimal(10,2), totalIgst || 0)
      .input("GrandTotal", sql.Decimal(10,2), grandTotal || 0)
      .input("Narration", sql.VarChar, narration)
      .input("InvoiceCancel", sql.Bit, invoiceCancel)
      .query(`
        INSERT INTO dbo.SalesReturn (
         SalesReturnNo,
         SalesReturnDate,
         Customer,
         DocNo,
         DocDate,
         PackingPer,
         Packing,
         Freight,
         CGST,
         SGST,
         IGST,
         TotalCGST,
         TotalSGST,
         TotalIGST,
         GrandTotal,
         Narration,
         InvoiceCancel
        )
        VALUES (
         @SalesReturnNo,
         @SalesReturnDate,
         @Customer,
         @DocNo,
         @DocDate,
         @PackingPer,
         @Packing,
         @Freight,
         @CGST,
         @SGST,
         @IGST,
         @TotalCGST,
         @TotalSGST,
         @TotalIGST,
         @GrandTotal,
         @Narration,
         @InvoiceCancel
        );
      `);

    // 2️⃣ SAVE ITEMS
    for (const item of items) {
      await pool.request()
        .input("SalesReturnNo", sql.VarChar, salesReturnNo)
        .input("SrNo", sql.Int, item.srNo)
        .input("ItemCode", sql.VarChar, item.itemCode)
        .input("ItemName", sql.VarChar, item.itemName)
        .input("CGST", sql.Decimal(10,2), item.cgst || 0)
        .input("SGST", sql.Decimal(10,2), item.sgst || 0)
        .input("IGST", sql.Decimal(10,2), item.igst || 0)
        .input("Quantity", sql.Decimal(10,2), item.qty)
        .input("PurchaseCost", sql.Decimal(10,2), item.purchaseCost || 0)
        .input("Rate", sql.Decimal(10,2), item.rate)
        .input("Amount", sql.Decimal(10,2), item.amount)
        .input("Details", sql.VarChar, item.details)
        .query(`
         INSERT INTO dbo.SalesReturnItems (
          SalesReturnNo,
          SrNo,
          ItemCode,
          ItemName,
          CGST,
          SGST,
          IGST,
          Quantity,
          PurchaseCost,
          Rate,
          Amount,
          Details
         )
        VALUES (
         @SalesReturnNo,
         @SrNo,
         @ItemCode,
         @ItemName,
         @CGST,
         @SGST,
         @IGST,
         @Quantity,
         @PurchaseCost,
         @Rate,
         @Amount,
         @Details
        )
     `);
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
