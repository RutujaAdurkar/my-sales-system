const express = require("express");
const sql = require("mssql");
const router = express.Router();

router.get("/customers", async (req, res) => {
  try {
    const pool = await sql.connect(req.dbConfig);
    const result = await pool.request().query(`
       SELECT CustomerID, CustomerName, CustomerDetail 
       FROM Customers
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Customer load error", err });
  }
});

router.get("/attention", async (req, res) => {
  try {
    const pool = await sql.connect(req.dbConfig);
    const result = await pool.request().query(`
       SELECT PersonID, PersonName
       FROM AttentionPersons
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Attention load error", err });
  }
});

module.exports = router;
