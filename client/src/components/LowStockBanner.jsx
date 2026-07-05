export default function LowStockBanner({ products }) {
    if (products.length === 0) return null;
    return (
        <div className="low-stock-banner" >
            ⚠️ {products.length} prodcts(s) at or below reorder level: {products.map(p => p.name).join(',')}
        </div>
    );
};

