import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { listingsApi, type Listing } from '../../services/listingsApi';
import { ordersApi, type OrderRecord } from '../../services/ordersApi';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../services/authStore';

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
  const completedOrders = supplierOrders.filter((order) => order.status === 'COMPLETED').length;
  const activeListings = listings.filter((listing) => listing.isActive !== false).length;

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
    <main className="seller-dashboard">
      <div className="seller-dashboard-content" id="overview">
        <div className="seller-dashboard-heading">
          <div>
            <p className="seller-kicker">Seller workspace</p>
            <h1>Good to see you, {user?.name ?? 'Seller'}</h1>
            <p>Track your products, orders, and revenue in one place.</p>
          </div>
          <Link className="seller-primary-button" to="/listing/create">
            <span>+</span> Add new listing
          </Link>
        </div>

        <div className="seller-stats-grid">
          <article className="seller-stat-card seller-stat-highlight">
            <div className="seller-stat-card-top"><span>Total revenue</span><span className="seller-stat-icon">↗</span></div>
            <strong>Rs.{totalRevenue.toFixed(2)}</strong>
            <small>{completedOrders} completed orders</small>
          </article>
          <article className="seller-stat-card">
            <div className="seller-stat-card-top"><span>Total orders</span><span className="seller-stat-icon">▣</span></div>
            <strong>{supplierOrders.length}</strong>
            <small>{pendingOrders} orders need attention</small>
          </article>
          <article className="seller-stat-card">
            <div className="seller-stat-card-top"><span>Active listings</span><span className="seller-stat-icon">◈</span></div>
            <strong>{activeListings}</strong>
            <small>{listings.length - activeListings} inactive listings</small>
          </article>
          <article className="seller-stat-card">
            <div className="seller-stat-card-top"><span>Products listed</span><span className="seller-stat-icon">⌘</span></div>
            <strong>{listings.length}</strong>
            <small>Across your catalog</small>
          </article>
        </div>

        <div className="seller-dashboard-grid">
          <section className="seller-panel seller-revenue-panel" id="analytics">
            <div className="seller-panel-heading">
              <div><p className="seller-panel-label">Performance</p><h2>Revenue overview</h2></div>
              <span className="seller-panel-filter">All time ▾</span>
            </div>
            {revenueData.length > 0 ? (
              <div className="seller-chart-box">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid stroke="#303b35" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="month" stroke="#8d9b92" axisLine={false} tickLine={false} />
                    <YAxis stroke="#8d9b92" axisLine={false} tickLine={false} width={55} />
                    <Tooltip contentStyle={{ background: '#202722', border: '1px solid #3b4a40', borderRadius: '10px', color: '#f2f7f2' }} />
                    <Bar dataKey="revenue" fill="#8bd27b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="seller-empty-chart">Complete orders will appear here as revenue data.</div>
            )}
          </section>

          <section className="seller-panel seller-orders-panel" id="orders">
            <div className="seller-panel-heading">
              <div><p className="seller-panel-label">Latest activity</p><h2>Incoming orders</h2></div>
              <Link to="/orders" className="seller-panel-link">View all</Link>
            </div>
            {supplierOrders.length === 0 ? (
              <p className="seller-empty-state">No orders yet.</p>
            ) : (
              <div className="seller-activity-list">
                {supplierOrders.slice(0, 5).map((order: OrderRecord) => (
                  <Link className="seller-activity-row" key={order.id} to={`/orders/${order.id}`}>
                    <span className="seller-activity-avatar">
                      {(order.buyer?.name ?? 'Customer').slice(0, 1).toUpperCase()}
                    </span>
                    <span className="seller-activity-main">
                      <strong>{order.buyer?.name ?? 'Customer'}</strong>
                      <small>#{order.id.slice(0, 8)} · {new Date(order.createdAt).toLocaleDateString()}</small>
                    </span>
                    <span className="seller-activity-amount">Rs.{Number(order.totalAmount).toFixed(2)}</span>
                    <span className={`seller-order-status seller-order-${order.status.toLowerCase()}`}>{order.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="seller-panel seller-listings-panel" id="products">
          <div className="seller-panel-heading">
            <div><p className="seller-panel-label">Catalog management</p><h2>My listings</h2></div>
            <Link to="/listing/create" className="seller-panel-link">+ Add product</Link>
          </div>
        {listings.length === 0 ? (
          <p className="seller-empty-state">
            No listings yet. <Link to="/listing/create">Create your first listing</Link>
          </p>
        ) : (
          <div className="seller-listing-cards">
            {listings.map((listing: Listing) => (
              <article className="seller-listing-card" key={listing.id}>
                <div className="seller-listing-image-wrap">
                  {listing.images?.[0] ? (
                    <>
                      <img
                        className="seller-listing-image"
                        src={listing.images[0]}
                        alt={listing.title}
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                          event.currentTarget.nextElementSibling?.removeAttribute('hidden');
                        }}
                      />
                      <div className="seller-listing-image-placeholder" hidden aria-hidden="true">
                        <span>Image unavailable</span>
                      </div>
                    </>
                  ) : (
                    <div className="seller-listing-image-placeholder" aria-hidden="true">
                      <span>No photo</span>
                    </div>
                  )}
                  <span className={listing.isActive === false ? 'seller-listing-status inactive' : 'seller-listing-status'}>
                    {listing.isActive === false ? 'Inactive' : 'Active'}
                  </span>
                </div>
                <div className="seller-listing-card-body">
                  <div className="seller-listing-title-row">
                    <div>
                      <h3>{listing.title}</h3>
                      <span>{listing.category}</span>
                    </div>
                    <strong>Rs.{Number(listing.price).toFixed(2)}</strong>
                  </div>
                  <div className="seller-listing-meta">
                    <span><small>Available</small>{listing.quantity} {listing.unit}</span>
                    <span><small>Listing status</small>{listing.isActive === false ? 'Paused' : 'Live'}</span>
                  </div>
                  <div className="seller-listing-actions">
                    <Link className="seller-table-action" to={`/listing/edit/${listing.id}`}>
                      Edit listing
                    </Link>
                    <button
                      type="button"
                      className="seller-table-action seller-delete-action"
                      onClick={() => handleDelete(listing.id, listing.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        </section>
      </div>
    </main>
  );
}