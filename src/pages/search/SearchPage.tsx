import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/listing/ProductCard';
import FilterPanel from '../../components/search/FilterPanel';
import SortDropdown from '../../components/search/SortDropdown';
import { searchApi, type SearchResultItem } from '../../services/search.api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';
  const page = Number(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'relevance';
  const nearby = searchParams.get('nearby') === 'true';
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const queryParams = useMemo(
    () => ({ q, category, priceMin, priceMax, page, sort }),
    [category, page, priceMax, priceMin, q, sort],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', q, category, priceMin, priceMax, page, sort],
    queryFn: async () => {
      const response = nearby
        ? await searchApi.nearby(queryParams)
        : await searchApi.search(queryParams);
      return response.data;
    },
    staleTime: 60_000,
  });

  const items = (data?.items || []) as SearchResultItem[];
  const totalPages = Math.max(1, data?.totalPages || 1);

  const updateFilters = (filters: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.set('page', '1');
    setSearchParams(next);
  };

  useEffect(() => {
    if (!searchParams.get('page')) {
      const next = new URLSearchParams(searchParams);
      next.set('page', '1');
      setSearchParams(next);
    }
  }, [searchParams, setSearchParams]);

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', value);
    next.set('page', '1');
    setSearchParams(next);
  };

  const changePage = (direction: 1 | -1) => {
    const next = new URLSearchParams(searchParams);
    const nextPage = Math.max(1, Math.min(totalPages, page + direction));
    next.set('page', String(nextPage));
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="hidden w-72 shrink-0 lg:block">
          <FilterPanel currentFilters={{ category, priceMin, priceMax }} onFiltersChange={updateFilters} />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Search results</h1>
              <p className="text-sm text-gray-500">{isLoading ? 'Loading...' : `${items.length} results`}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 lg:hidden" onClick={() => setMobileFiltersOpen((open) => !open)}>
                Filter
              </button>
              <SortDropdown value={sort} onChange={handleSortChange} />
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="mb-4 lg:hidden">
              <FilterPanel currentFilters={{ category, priceMin, priceMax }} onFiltersChange={updateFilters} />
            </div>
          )}

          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-4">
                  <div className="mb-4 h-32 rounded bg-gray-200" />
                  <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="text-4xl">🥬</div>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">No produce found</h2>
              <p className="mt-2 text-sm text-gray-500">Try different search terms</p>
            </div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((item) => (
                <ProductCard key={item.id} listing={item as any} showDistance={nearby} distanceKm={item.distanceKm} />
              ))}
            </div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <button onClick={() => changePage(-1)} disabled={page <= 1} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50">
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button onClick={() => changePage(1)} disabled={page >= totalPages} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
