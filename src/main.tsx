import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import App from './App';
import './index.css';

L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl,
});

const queryClient = new QueryClient();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container missing in index.html');
}

createRoot(container).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster position="top-right" />
  </QueryClientProvider>,
);