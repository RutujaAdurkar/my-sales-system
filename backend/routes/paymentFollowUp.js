const express = require("express");
const router = express.Router();
const sql = require("mssql");

router.post("/save", async (req, res) => {
  try {
    console.log('POST /api/payment/save body:', req.body);

    const {
      projectNo,
      projectDate,
      customerName,
      projectName,
      createdBy,
      followBy1,
      followBy2,
      notes,
      followUpDate,
      noFollowUpRequired
    } = req.body;

    const toSqlString = (v) => (v === undefined || v === null || v === '') ? null : String(v);

    const pool = await sql.connect();

    await pool
      .request()
      .input("ProjectNo", sql.VarChar, toSqlString(projectNo))
      .input("ProjectDate", sql.Date, projectDate ? projectDate : null)
      .input("CustomerName", sql.VarChar, toSqlString(customerName))
      .input("ProjectName", sql.VarChar, toSqlString(projectName))
      .input("CreatedBy", sql.VarChar, toSqlString(createdBy))
      .input("FollowBy1", sql.VarChar, toSqlString(followBy1))
      .input("FollowBy2", sql.VarChar, toSqlString(followBy2))
      .input("Notes", sql.NVarChar(sql.MAX), toSqlString(notes))
      .input("FollowUpDate", sql.Date, followUpDate ? followUpDate : null)
      .input("NoFollowUpRequired", sql.Bit, noFollowUpRequired ? 1 : 0)

      .query(`
        INSERT INTO PaymentFollowUp
        (ProjectNo, ProjectDate, CustomerName, ProjectName, CreatedBy, 
        FollowBy1, FollowBy2, Notes, FollowUpDate, NoFollowUpRequired)
        VALUES 
        (@ProjectNo, @ProjectDate, @CustomerName, @ProjectName, @CreatedBy, 
        @FollowBy1, @FollowBy2, @Notes, @FollowUpDate, @NoFollowUpRequired)
      `);

    res.json({ message: "Saved successfully" });
  } catch (err) {
    console.error('POST /api/payment/save error:', err);
    res.status(500).json({ error: err.message || "Error saving record" });
  }
});

// get list of follow-ups
router.get('/list', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT * FROM PaymentFollowUp ORDER BY ProjectDate DESC
    `);
    const rows = (result.recordset || []).map(r => ({
      ...r,
      ProjectDate: r.ProjectDate ? r.ProjectDate.toISOString().substr(0,10) : null,
      FollowUpDate: r.FollowUpDate ? r.FollowUpDate.toISOString().substr(0,10) : null,
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching list');
  }
});

// get single record
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect();
    const result = await pool.request().input('Id', sql.Int, id).query(`
      SELECT * FROM PaymentFollowUp WHERE Id = @Id
    `);
    const row = result.recordset[0];
    if (row) {
      row.ProjectDate = row.ProjectDate ? row.ProjectDate.toISOString().substr(0,10) : null;
      row.FollowUpDate = row.FollowUpDate ? row.FollowUpDate.toISOString().substr(0,10) : null;
    }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching record');
  }
});

// update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('PUT /api/payment/:id body:', id, req.body);

    const {
      projectNo,
      projectDate,
      customerName,
      projectName,
      createdBy,
      followBy1,
      followBy2,
      notes,
      followUpDate,
      noFollowUpRequired,
    } = req.body;

    const toSqlString = (v) => (v === undefined || v === null || v === '') ? null : String(v);

    const pool = await sql.connect();
    await pool
      .request()
      .input('Id', sql.Int, id)
      .input('ProjectNo', sql.VarChar, toSqlString(projectNo))
      .input('ProjectDate', sql.Date, projectDate ? projectDate : null)
      .input('CustomerName', sql.VarChar, toSqlString(customerName))
      .input('ProjectName', sql.VarChar, toSqlString(projectName))
      .input('CreatedBy', sql.VarChar, toSqlString(createdBy))
      .input('FollowBy1', sql.VarChar, toSqlString(followBy1))
      .input('FollowBy2', sql.VarChar, toSqlString(followBy2))
      .input('Notes', sql.NVarChar(sql.MAX), toSqlString(notes))
      .input('FollowUpDate', sql.Date, followUpDate ? followUpDate : null)
      .input('NoFollowUpRequired', sql.Bit, noFollowUpRequired ? 1 : 0)
      .query(`
        UPDATE PaymentFollowUp SET
          ProjectNo = @ProjectNo,
          ProjectDate = @ProjectDate,
          CustomerName = @CustomerName,
          ProjectName = @ProjectName,
          CreatedBy = @CreatedBy,
          FollowBy1 = @FollowBy1,
          FollowBy2 = @FollowBy2,
          Notes = @Notes,
          FollowUpDate = @FollowUpDate,
          NoFollowUpRequired = @NoFollowUpRequired
        WHERE Id = @Id
      `);

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error('PUT /api/payment/:id error:', err);
    res.status(500).json({ error: err.message || 'Error updating record' });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect();
    await pool.request().input('Id', sql.Int, id).query(`
      DELETE FROM PaymentFollowUp WHERE Id = @Id
    `);
    res.send('Deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting record');
  }
});

module.exports = router;
