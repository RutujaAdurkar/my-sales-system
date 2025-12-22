const { sql, poolPromise } = require('../db');

async function getReport() {
  try {
    const pool = await poolPromise;
    const res = await pool.request()
      .input('reportNo', sql.VarChar, 'TEST-123')
      .query('SELECT TOP 1 * FROM application_report WHERE ReportNo = @reportNo ORDER BY ID DESC');

    console.log(res.recordset);
    process.exit(0);
  } catch (err) {
    console.error('err', err);
    process.exit(1);
  }
}

getReport();
