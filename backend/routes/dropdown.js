const express = require("express");
const router = express.Router();
const sql = require("mssql");

// get customer list
router.get("/customers", async (req, res) => {
  const pool = await sql.connect();
  const result = await pool.request().query(`
    SELECT CustomerID, CustomerName FROM Customers
  `);
  res.json(result.recordset);
});


// get employee list
router.get("/employees", async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT Id, EmployeeName FROM Employees
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error loading employees");
  }
});

// get follow team 1 list
router.get("/followteam1", async (req, res) => {
  try {
    const pool = await sql.connect();
    // FollowTeam1 stores member names in MemberName; return as EmployeeName for frontend compatibility
    const result = await pool.request().query(`
      SELECT Id, MemberName AS EmployeeName FROM FollowTeam1
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error loading FollowTeam1', err);
    // return an empty array so frontend still works if table doesn't exist
    res.json([]);
  }
});

// get follow team 2 list
router.get("/followteam2", async (req, res) => {
  try {
    const pool = await sql.connect();
    // FollowTeam2 stores member names in MemberName; return as EmployeeName for frontend compatibility
    const result = await pool.request().query(`
      SELECT Id, MemberName AS EmployeeName FROM FollowTeam2
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error loading FollowTeam2', err);
    res.json([]);
  }
});

module.exports = router;
