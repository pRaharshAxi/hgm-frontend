import axios from 'axios';

const searchApiClient = axios.create({
  baseURL: import.meta.env.VITE_SYSTEM_B_API_BASE_URL || 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
});

export type SearchResultItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
  unit?: string;
  images?: string[];
  supplierName?: string;
  rating?: number;
  distanceKm?: number;
};

export type SearchResponse = {
  items: SearchResultItem[];
  totalPages?: number;
  page?: number;
  total?: number;
};

export const searchApi = {
  search: (params: Record<string, string | number | boolean | undefined>) =>
    searchApiClient.get<SearchResponse>('/search', { params }),
  nearby: (params: Record<string, string | number | boolean | undefined>) =>
    searchApiClient.get<SearchResponse>('/search/nearby', { params }),
};
