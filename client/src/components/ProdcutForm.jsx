import { useState } from "react";

export default function ProductForm({ categories, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category_id: "",
    quantity: "",
    unit_price: "",
    reorder_level: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({
        name: form.name.trim(),
        sku: form.sku.trim() || null,
        category_id: form.category_id || null,
        quantity: form.quantity ? Number(form.quantity) : 0,
        unit_price: form.unit_price ? Number(form.unit_price) : 0,
        reorder_level: form.reorder_level ? Number(form.reorder_level) : 0,
      });
      setForm({
        name: "",
        sku: "",
        category_id: "",
        quantity: "",
        unit_price: "",
        reorder_level: "",
      });
    } catch (err) {
      setError("Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add product</h2>
      {error && <p className="form-error">{error}</p>}

      <div className="form-row">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          SKU
          <input name="sku" value={form.sku} onChange={handleChange} />
        </label>
      </div>

      <div className="form-row">
        <label>
          Category
          <select name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Quantity
          <input type="number" name="quantity" min="0" value={form.quantity} onChange={handleChange} />
        </label>
        <label>
          Unit price
          <input type="number" name="unit_price" min="0" step="0.01" value={form.unit_price} onChange={handleChange} />
        </label>
        <label>
          Reorder level
          <input type="number" name="reorder_level" min="0" value={form.reorder_level} onChange={handleChange} />
        </label>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add product"}
      </button>
    </form>
  );
}