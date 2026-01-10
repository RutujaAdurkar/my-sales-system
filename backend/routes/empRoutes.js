const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

router.get("/emp", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                MenuID,
                MenuName,
                ParentID,
                LevelNo,
                Visible
            FROM Emp
            WHERE Visible = 1
            ORDER BY ParentID, MenuID;
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error("❌ Emp Route Error:", err);
        res.status(500).json({ error: "Failed to load menu" });
    }
});

module.exports = router;