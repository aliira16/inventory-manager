import { useState } from "react";

export default function ProductTable({ prodcuts, onStockChange }) {
    const [activeId, setActiveId] = useState(null);
    const [qty, setQty] = useState('');

    const submit = (id, action) => {
        if (!qty || isNaN(qty) || qty <= 0) return alert('Please enter a valid quantity');
        onStockChange(id, action, Number(qty), '');
        setQty('');
        setActiveId(null);
    };

    return (
        <table className="prodcut-table">
            <thead>
                <tr>
                    <th>SKU</th><th>Name</th><th>Category</th><th>Qty</th><th>Price</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {prodcuts.map(p => {
                    <tr key={p.id} className={p.low_stock ? 'low-stock-row' : ''}>
                        <td>{p.sku}</td>
                        <td>{p.name}</td>
                        <td>{p.category_name || '-'} </td>
                        <td>{p.quantity}</td>
                        <td>${Number(p.unit_price).toFixed(2)}</td>
                        <td>
                            {activeId === p.id ? (
                                <>
                                    <input type="number" value={qty} onChange={e => setQty(e.target.value)}
                                        style={{ width: 60 }} />
                                </>
                            ) : (<button onClick={() => { setActiveId(p.id) }} > Update Stock </button>)}
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    )
}