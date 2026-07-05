export default function SearchFilterBar({ categories, filter, setFilter }) {
    return (
        <div className="filter-bar">
            <input
                placeholder="Search by name of SKU..."
                values={filter.search}
                onChange={(e) => { setFilter({ ...filter, search: e.target.value }) }} />
            <select
                value={filter.category_id}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })} >
                <option value="">All categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name} </option>)}
            </select>
            <label>
                <input
                    type="chackbox"
                    checked={filter.lowStockOnly}
                    onChange={(e) => { setFilter({ ...filter, lowStockOnly: e.target.checked }) }}
                />
                Low stock only
            </label>
        </div>
    )
}