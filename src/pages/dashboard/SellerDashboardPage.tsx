import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { listingsApi, type Listing } from '../../services/listingsApi';
import { ordersApi, type OrderRecord } from '../../services/ordersApi';
import { useAuthStore } from '../../services/authStore';
import toast from 'react-hot-toast';

export default function SellerDashboardPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const { data: listings = [] } = useQuery({
    queryKey: ['seller-listings'],
    queryFn: listingsApi.getMany,
  });

  const { data: supplierOrders = [] } = useQuery({
    queryKey: ['orders', 'supplier'],
    queryFn: () => ordersApi.getHistory('supplier'),
  });

  const pendingOrders = supplierOrders.filter(
    (order: OrderRecord) => ['PLACED', 'CONFIRMED'].includes(order.status)
  ).length;

  const totalRevenue = supplierOrders
    .filter((order: OrderRecord) => order.status === 'COMPLETED')
    .reduce((sum: number, order: OrderRecord) => sum + Number(order.totalAmount), 0);

  // Build revenue by month from real orders
  const revenueByMonth = supplierOrders
    .filter((o: OrderRecord) => o.status === 'COMPLETED')
    .reduce((acc: Record<string, number>, order: OrderRecord) => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(order.totalAmount);
      return acc;
    }, {});

  const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await listingsApi.delete(id);
      toast.success('Listing deleted');
      queryClient.invalidateQueries({ queryKey: ['seller-listings'] });
    } catch {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="page-shell">
      <div className="summary-row">
        <h1>Seller Dashboard</h1>
        <Link className="btn btn-primary" to="/listing/create">
          Add New Listing
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{listings.length}</strong>
          <span>Total Listings</span>
        </div>
        <div className="stat-card">
          <strong>{pendingOrders}</strong>
          <span>Pending Orders</span>
        </div>
        <div className="stat-card">
          <strong>Rs.{totalRevenue.toFixed(2)}</strong>
          <span>Total Revenue</span>
        </div>
        <div className="stat-card">
          <strong>{supplierOrders.length}</strong>
          <span>Total Orders</span>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>My Listings</h2>
        {listings.length === 0 ? (
          <p style={{ color: '#64748b', padding: '1rem 0' }}>
            No listings yet. <Link to="/listing/create">Create your first listing</Link>
          </p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing: Listing) => (
                <tr key={listing.id}>
                  <td>{listing.title}</td>
                  <td>{listing.category}</td>
                  <td>Rs.{Number(listing.price).toFixed(2)}</td>
                  <td>{listing.quantity}</td>
                  <td>
                    <span className={listing.isActive === false ? 'badge-red' : 'badge-green'}>
                      {listing.isActive === false ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <Link className="btn btn-secondary" to={`/listing/edit/${listing.id}`}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleDelete(listing.id, listing.title)}
                      style={{ marginLeft: '0.5rem', color: '#dc2626' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {revenueData.length > 0 && (
        <section className="dashboard-section">
          <h2>Revenue by Month</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className="dashboard-section">
        <div className="summary-row">
          <h2>Incoming Orders</h2>
          <Link to="/orders">View All</Link>
        </div>
        {supplierOrders.length === 0 ? (
          <p style={{ color: '#64748b', padding: '1rem 0' }}>No orders yet.</p>
        ) : (
          <div className="order-list-grid">
            {supplierOrders.slice(0, 5).map((order: OrderRecord) => (
              <article key={order.id} className="order-card">
                <div className="summary-row">
                  <span>#{order.id.slice(0, 8)}</span>
                  <span className={`badge-${
                    order.status === 'COMPLETED' ? 'green' :
                    order.status === 'CANCELLED' ? 'red' : 'yellow'
                  }`}>{order.status}</span>
                </div>
                <div className="muted-text">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <strong>Rs.{Number(order.totalAmount).toFixed(2)}</strong>
                <Link className="btn btn-secondary" to={`/orders/${order.id}`}>
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}