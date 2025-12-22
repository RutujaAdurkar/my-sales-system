const { sql, poolPromise } = require("../db");

exports.saveReport = async (req, res) => {
  try {
    console.log('POST /api/appReport body:', req.body, 'file:', !!req.file);
    const pool = await poolPromise;

    const filePath = req.file ? `uploads/${req.file.filename}` : null;

    const toSql = (v) => (v === undefined || v === null || v === '') ? null : v;
    const quantityVal = req.body.quantity ? parseInt(req.body.quantity, 10) : null;

    await pool.request()
      .input("ReportNo", sql.VarChar, toSql(req.body.reportNo))
      .input("Date", sql.Date, toSql(req.body.date))
      .input("Customer", sql.VarChar, toSql(req.body.customer))
      .input("QuotationNo", sql.VarChar, toSql(req.body.quotationNo))
      .input("Duration", sql.VarChar, toSql(req.body.duration))
      .input("MachineName", sql.VarChar, toSql(req.body.machineName))
      .input("ContactPerson", sql.VarChar, toSql(req.body.contactPerson))
      .input("OEMsInvolved", sql.Text, toSql(req.body.oemsInvolved))
      .input("PartNumber", sql.Text, toSql(req.body.partNumber))
      .input("Quantity", sql.Int, quantityVal)
      .input("ApplicationText", sql.Text, toSql(req.body.application))
      .input("IFMSolution", sql.Text, toSql(req.body.ifmSolution))
      .input("KindAttention", sql.VarChar, toSql(req.body.kindAttention))
      .input("filePath", sql.VarChar, filePath)
      .query(`
        INSERT INTO application_report (
          ReportNo, Date, Customer, QuotationNo, Duration,
          MachineName, ContactPerson, OEMsInvolved, PartNumber,
          Quantity, ApplicationText, IFMSolution, KindAttention,FileName
        )
        VALUES (
          @ReportNo, @Date, @Customer, @QuotationNo, @Duration,
          @MachineName, @ContactPerson, @OEMsInvolved,
          @PartNumber, @Quantity, @ApplicationText,
          @IFMSolution, @KindAttention, @filePath
        )
      `);

    res.json({ message: "Inserted Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};


// const { sql, poolPromise } = require("../db");

// exports.saveReport = async (req, res) => {
//   try {

//     const filename = req.file ? req.file.filename : null;

//     const pool = await poolPromise;

//     await pool.request()
//       .input("reportNo", sql.VarChar, req.body.reportNo)
//       .input("date", sql.VarChar, req.body.date)
//       .input("customer", sql.VarChar, req.body.customer)
//       .input("quantity", sql.Int, req.body.quantity)
//       .input("fileName", sql.VarChar, filename)
//       .query(`
//         INSERT INTO application_report 
//         (ReportNo, Date, Customer, Quantity, FileName)
//         VALUES (@reportNo, @date, @customer, @quantity, @fileName)
//       `);

//     res.json({ message: "Inserted successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "DB error", err });
//   }
// };
