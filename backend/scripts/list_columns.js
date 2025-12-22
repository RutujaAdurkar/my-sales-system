const { sql, poolPromise } = require('../db');

async function listColumns() {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('tableName', sql.VarChar, 'application_report')
      .query(`
        SELECT COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = @tableName
        ORDER BY ORDINAL_POSITION
      `);

    console.log('Columns for application_report:');
    result.recordset.forEach(r => console.log(r.COLUMN_NAME, r.DATA_TYPE));
    process.exit(0);
  } catch (err) {
    console.error('Error querying columns:', err);
    process.exit(1);
  }
}

listColumns();
