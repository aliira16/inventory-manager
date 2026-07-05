import e from "express";
import pool from "../db.js";

const router = e.Router();

// GET /api/products?search=usb&category_id=2&lowStockOnly=true

router.get('/', async (req, res) => {
    const { search, category_id, lowStockOnly } = req.query;
    const conditions = [];
    const values = [];
    if (search) {
        values.push(`%${search}%`);
        conditions.push(`(p.name ILIKE $${values.length} or p.sku ILIKE $${values.length})`)
    }
    if (category_id) {
        values.push(category_id)
        conditions.push(`p.category_id = $${values.length}`)
    }
    if (lowStockOnly === 'true') {
        conditions.push('p.quantity <= p.reorder_level')
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

// POST /api/products/:id/restock  { quantity, note }

router.post(('/:id/restock'), async (req, res) => {
    const { id } = req.params;
    const { quantity, note } = req.body;

    if (!quantity || quantity <= 0) return res.status(400).json({ error: 'input a valide quantity' });
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updated = await client.query('UPDATE products SET quantity = quantity + $1 WHERe id = $2 RETURNING *', [quantity, id]);
        if (updated.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'product not found' });
        }
        await client.query(
            'INSERT INTO stock_movement (product_id, change_type, qunatity, note) VALUES ($1,$2,$3,$4)', [id, 'restock', quantity, note || null]);
        await client.query('COMMIT');
        res.json(updated.rows[0])
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(404).json({ error: 'server ERROR' });
    } finally {
        client.release();
    }
});

// POST /api/products/:id/sale  { quantity, note }

router.post('/:id/sale', async (req, res) => {
    const { id } = req.params;
    const { quantity, note } = req.body;
    if (!quantity || quantity <= 0) return res.status(401).json({ error: 'input a valide quantity' });
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const product = await client.query('SELECT quantity FROM products WHERE id = $1 FOR UPDATE', [id]);
        if (product.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'PRODUCT not found' });
        }
        if (product.rows[0].quantity < quantity) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'not enough stock for this sale' });
        }
        const updated = (await client.query('UPDATE products SET quantity = quantity - $1 WHERE id = $2 RETURNING *', [quantity, id]));
        await client.query(`INSERT INTO stock_movement (product_id, change_type, quantity, note) VALUES ($1,'sale',$2,$3)`, [id, quantity, note || null]);
        await client.query('COMMIT');
        res.json(updated.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'SERVER ERROR' })
    } finally {
        client.release();
    }
})

export default router;