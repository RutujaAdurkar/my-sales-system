const { sql, poolPromise } = require('../db');

async function addColumnIfMissing() {
  try {
    const pool = await poolPromise;
    const check = await pool.request()
      .input('tableName', sql.VarChar, 'application_report')
      .input('columnName', sql.VarChar, 'ContactPerson')
      .query(`
        SELECT 1 AS existsFlag
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = @tableName
          AND COLUMN_NAME = @columnName
      `);

    if (check.recordset.length > 0) {
      console.log('Column ContactPerson already exists. No changes made.');
      process.exit(0);
    }

    await pool.request().query(
      `ALTER TABLE application_report ADD ContactPerson VARCHAR(255) NULL;`
    );

    console.log('Added column ContactPerson (VARCHAR(255) NULL) to application_report');
    process.exit(0);
  } catch (err) {
    console.error('Error while adding column:', err);
    process.exit(1);
  }
}

addColumnIfMissing();
