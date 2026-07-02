import e from "express";
import pool from "../db";

const router = e.Router();

// GET /api/products?search=usb&category_id=2&lowStockOnly=true

router.get('/', async (req, res) => {
    const { search, category_id, lowStockOnly } = req.query;
    const conditions = [];
    const values = [];
    if (search) {
        values.push(`%${search}%`);
        conditions.push(`(p.name ILIKE $${values.length} or p.sku ILIKE $${values.length}`)
    }
    if (category_id) {
        values.push(category_id)
        conditions.push(`p.category_id = $${values.length}`)
    }
    if (lowStockOnly === 'true') {
        conditions.push('p.quantity <= p.reorder.level')
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : "";
    const result = await pool.query(`
        SELECT p.*, c.name AS category_name, s.name AS supplier_name,
        (p.quantity <= p.reorder_level) AS low_stock
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        ${where}
        ORDER BY p.name`, values);
    res.json(result.rows);
})