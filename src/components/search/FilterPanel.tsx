type FilterPanelProps = {
  onFiltersChange: (filters: Record<string, string>) => void;
  currentFilters: Record<string, string>;
  aggregations?: Record<string, number>;
};

const categories = ['FRUITS', 'VEGETABLES', 'HERBS', 'SPICES', 'LEAFY_GREENS', 'OTHER'];

export default function FilterPanel({ onFiltersChange, currentFilters, aggregations }: FilterPanelProps) {
  const selectedCategory = currentFilters.category || '';
  const priceMin = currentFilters.priceMin || '';
  const priceMax = currentFilters.priceMax || '';

  const applyFilters = () => {
    onFiltersChange({
      category: selectedCategory,
      priceMin,
      priceMax,
    });
  };

  const clearFilters = () => {
    onFiltersChange({ category: '', priceMin: '', priceMax: '' });
  };

  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters</h2>
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center justify-between text-sm text-gray-700">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => onFiltersChange({ ...currentFilters, category: selectedCategory === category ? '' : category })}
                  />
                  {category}
                </span>
                {aggregations?.[category] !== undefined && <span className="text-gray-400">({aggregations[category]})</span>}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600">Price range</h3>
          <div className="grid gap-2">
            <input
              type="number"
              value={priceMin}
              onChange={(event) => onFiltersChange({ ...currentFilters, priceMin: event.target.value })}
              placeholder="Min Price"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={priceMax}
              onChange={(event) => onFiltersChange({ ...currentFilters, priceMax: event.target.value })}
              placeholder="Max Price"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={applyFilters} className="flex-1 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white">
            Apply Filters
          </button>
          <button onClick={clearFilters} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">
            Clear All
          </button>
        </div>
      </div>
    </aside>
  );
}
