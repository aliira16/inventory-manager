import e from "express";
import pool from "../db";

const router = e.Router();

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM supplies ORDER BY name')
    res.json(result.rows)
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(404).json({ error: 'Name required' })
    const result = pool.query('INSERT INTO suppliers (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
})

export default router