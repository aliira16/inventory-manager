import e from "express";
import pool from "../db.js"

const router = e.Router();

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' })
    const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *')[name];
    res.status(201).json(result.rows[0]);
});

export default router;