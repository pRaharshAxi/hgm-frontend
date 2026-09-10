import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { listingsApi, type Listing } from '../../services/listingsApi';
import { ordersApi, type OrderRecord } from '../../services/ordersApi';
import { reviewsApi } from '../../services/reviewsApi';


const revenueData = [
  { month: 'Jan', revenue: 220 },
  { month: 'Feb', revenue: 340 },
  { month: 'Mar', revenue: 290 },
  { month: 'Apr', revenue: 410 },
];

export default function SellerDashboardPage() {
  const { data: listings = [] } = useQuery({
    queryKey: ['seller-listings'],
    queryFn: listingsApi.getMany,
  });

  const { data: supplierOrders = [] } = useQuery({
    queryKey: ['orders', 'supplier'],
    queryFn: () => ordersApi.getHistory('supplier'),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews-seller'],
    queryFn: () => reviewsApi.getBySeller('supplier-1'),
  });

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const pendingOrders = supplierOrders.filter((order: OrderRecord) => ['PLACED', 'CONFIRMED'].includes(order.status)).length;
  const totalRevenue = supplierOrders
    .filter((order: OrderRecord) => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

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
          <strong>Rs.{Number(totalRevenue).toFixed(2)}</strong>
          <span>Total Revenue</span>
        </div>
        <div className="stat-card">
          <strong>{averageRating.toFixed(1)}</strong>
          <span>Rating</span>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>My Listings</h2>
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
                <td><span className="badge-green">Active</span></td>
                <td>
                  <Link className="btn btn-secondary" to={`/listing/edit/${listing.id}`}>
                    Edit
                  </Link>
                  <button type="button" className="btn btn-secondary" onClick={() => window.confirm('Delete this listing?') && undefined}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

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

      <section className="dashboard-section">
        <div className="summary-row">
          <h2>Incoming Orders</h2>
          <Link to="/orders">View All</Link>
        </div>
        <div className="order-list-grid">
          {supplierOrders.slice(0, 5).map((order: OrderRecord) => (
            <article key={order.id} className="order-card">
              <div className="summary-row">
                <span>#{order.id.slice(0, 8)}</span>
                <span>{order.status}</span>
              </div>
              <div className="muted-text">{new Date(order.createdAt).toLocaleDateString()}</div>
              <strong>Rs.{Number(order.totalAmount).toFixed(2)}</strong>
              <Link className="btn btn-secondary" to={`/orders/${order.id}`}>
                View Details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
