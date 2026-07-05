import { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "./components/productTable.jsx";
import ProductForm from "./components/ProdcutForm.jsx";
import LowStockBanner from "./components/LowStockBanner.jsx";
import SearchFilterBar from "./components/SearchFilterBar.jsx";
import "./index.css";

const API_URL = "http://localhost:3000/api";

function App() {
  const [products, setPorducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    lowStockOnly: false
  })


  useEffect(() => {
    axios.get(`${API_URL}/categories`).then(res => setCategories(res.data));
    fetchSummary();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [filters]);



  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.lowStockOnly) params.set('lowStockOnly', 'true');
    const res = await axios.get(`${API_URL}/products?${params}`);
    setPorducts(res.data);
  }

  const fetchSummary = async () => {
    const res = await axios.get(`${API_URL}/products/summary`);
    setSummary(res.data);
  };

  const handleAddProduct = async (formData) => {
    await axios.post(`${API_URL}/products`, formData);
    fetchProducts();
    fetchSummary();
  };

  const handleStockChange = async (id, action, quantity, note) => {
    await axios.post(`${API_URL}/products/${id}/${action}`, { quantity, note });
    fetchProducts();
    fetchSummary();
  }

  // Render the component
  return (
    <div className="contain">
      <h1>📦 Inventory manager</h1>
      {summary && (
        <div className="summary-bar">
          <span>Products : {summary.total_products}</span>
          <span>Values : ${Number(summary.total_values).toFixed(2)}</span>
          <span className="low">Low Stock : {summary.low_stock_count}</span>
          <LowStockBanner products={products.filter(p => p.low_stock)} />
          <SearchFilterBar categories={categories} filter={filters} setFilter={setFilters} />
          <ProductForm categories={categories} onAdd={handleAddProduct} />
          <ProductTable products={products} onStockChange={handleStockChange} />
        </div>
      )}
    </div>
  )
};
export default App;