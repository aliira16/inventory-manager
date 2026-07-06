import e from "express";
import pool from "../db.js";

const router = e.Router();

// GET /api/movements/:product_id — full audit history for one product
router.get('/:product_id', async (req, res) => {
    const result = await pool.query('SELECT * FROM stock_movement WHERE product_id = $1 ORDER BY created_at DESC', [req.params.product_id]);
    res.json(result.rows);
});

export default router;