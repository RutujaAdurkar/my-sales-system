const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { saveReport } = require("../controllers/appReportController");
const { poolPromise, sql } = require("../db");

// create
router.post("/", upload, saveReport);

// list
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM application_report ORDER BY Date DESC
    `);
    const rows = (result.recordset || []).map(r => ({
      ...r,
      Date: r.Date ? r.Date.toISOString().substr(0,10) : null,
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching list');
  }
});

// single
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) return res.status(400).send('Invalid id');

    const pool = await poolPromise;
    const result = await pool.request().input('Id', sql.Int, idNum).query(`
      SELECT * FROM application_report WHERE Id = @Id
    `);
    const row = result.recordset[0];
    if (row) row.Date = row.Date ? row.Date.toISOString().substr(0,10) : null;
    res.json(row || null);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching record');
  }
});

// update (no file upload in update)
router.put('/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) return res.status(400).send('Invalid id');

    const {
      reportNo, date, customer, quotationNo, duration,
      machineName, contactPerson, oemsInvolved, partNumber,
      quantity, application: applicationText, ifmSolution, kindAttention
    } = req.body;

    const pool = await poolPromise;
    await pool.request()
      .input('Id', sql.Int, idNum)
      .input('ReportNo', sql.VarChar, reportNo)
      .input('Date', sql.Date, date || null)
      .input('Customer', sql.VarChar, customer)
      .input('QuotationNo', sql.VarChar, quotationNo)
      .input('Duration', sql.VarChar, duration)
      .input('MachineName', sql.VarChar, machineName)
      .input('ContactPerson', sql.VarChar, contactPerson)
      .input('OEMsInvolved', sql.Text, oemsInvolved)
      .input('PartNumber', sql.Text, partNumber)
      .input('Quantity', sql.Int, quantity || null)
      .input('ApplicationText', sql.Text, applicationText)
      .input('IFMSolution', sql.Text, ifmSolution)
      .input('KindAttention', sql.VarChar, kindAttention)
      .query(`
        UPDATE application_report SET
          ReportNo = @ReportNo,
          Date = @Date,
          Customer = @Customer,
          QuotationNo = @QuotationNo,
          Duration = @Duration,
          MachineName = @MachineName,
          ContactPerson = @ContactPerson,
          OEMsInvolved = @OEMsInvolved,
          PartNumber = @PartNumber,
          Quantity = @Quantity,
          ApplicationText = @ApplicationText,
          IFMSolution = @IFMSolution,
          KindAttention = @KindAttention
        WHERE Id = @Id
      `);

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error('PUT /api/appReport/:id error:', err);
    res.status(500).json({ error: err.message || 'Error updating record' });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request().input('Id', sql.Int, id).query(`
      DELETE FROM application_report WHERE Id = @Id
    `);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /api/appReport/:id error:', err);
    res.status(500).send('Error deleting record');
  }
});

module.exports = router;
