import { useState } from 'react';

type AdminListing = {
  id: string;
  title: string;
  supplier: string;
  category: string;
  price: number;
  quantity: number;
  status: 'Active' | 'Disabled';
};

const initialListings: AdminListing[] = [
  {
    id: 'listing-1',
    title: 'Organic Spinach Bundle',
    supplier: 'Green Harvest Co-op',
    category: 'Leafy Greens',
    price: 3.5,
    quantity: 12,
    status: 'Active',
  },
  {
    id: 'listing-2',
    title: 'Sunrise Tomato Box',
    supplier: 'Riverside Farm',
    category: 'Produce',
    price: 4.25,
    quantity: 9,
    status: 'Active',
  },
  {
    id: 'listing-3',
    title: 'Berry Fresh Crate',
    supplier: 'Maple Grove Produce',
    category: 'Fruit',
    price: 5.75,
    quantity: 4,
    status: 'Active',
  },
];

export default function AdminListingsPage() {
  const [listings, setListings] = useState(initialListings);

  const disableListing = (id: string) => {
    const target = listings.find((listing) => listing.id === id);
    if (!target) {
      return;
    }

    const shouldDisable = window.confirm(`Disable ${target.title}?`);
    if (!shouldDisable) {
      return;
    }

    setListings((current) =>
      current.map((listing) =>
        listing.id === id ? { ...listing, status: listing.status === 'Active' ? 'Disabled' : 'Active' } : listing,
      ),
    );
  };

  return (
    <div className="page-shell">
      <div className="summary-row">
        <div>
          <h1>Admin Listings</h1>
          <p>Review supplier inventory and disable problematic listings.</p>
        </div>
      </div>

      <div className="table-card">
        <table className="order-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Supplier</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td>{listing.title}</td>
                <td>{listing.supplier}</td>
                <td>{listing.category}</td>
                <td>Rs.{Number(listing.price).toFixed(2)}</td>
                <td>{listing.quantity}</td>
                <td>
                  <span className={listing.status === 'Active' ? 'badge-green' : 'badge-muted'}>{listing.status}</span>
                </td>
                <td>
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => disableListing(listing.id)}>
                    Disable listing
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
