import { useMemo, useState } from 'react';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'supplier' | 'admin';
  status: 'Active' | 'Disabled';
  joinedAt: string;
};

const initialUsers: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Asha Buyer',
    email: 'asha@example.com',
    role: 'buyer',
    status: 'Active',
    joinedAt: '2026-01-18',
  },
  {
    id: 'user-2',
    name: 'Green Harvest Co-op',
    email: 'supplier@example.com',
    role: 'supplier',
    status: 'Active',
    joinedAt: '2025-12-01',
  },
  {
    id: 'user-3',
    name: 'Nimaya Admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'Active',
    joinedAt: '2025-10-14',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<'all' | AdminUser['role']>('all');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
      const matchesRole = role === 'all' || user.role === role;
      return matchesQuery && matchesRole;
    });
  }, [query, role, users]);

  const toggleStatus = (id: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' }
          : user,
      ),
    );
  };

  return (
    <div className="page-shell">
      <div className="summary-row">
        <div>
          <h1>Admin Users</h1>
          <p>Manage access and account status for platform users.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          className="search-input"
          placeholder="Search by name or email"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="search-input admin-select" value={role} onChange={(event) => setRole(event.target.value as 'all' | AdminUser['role'])}>
          <option value="all">All roles</option>
          <option value="buyer">Buyer</option>
          <option value="supplier">Supplier</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="table-card">
        <table className="order-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge">{user.role}</span>
                </td>
                <td>
                  <span className={user.status === 'Active' ? 'badge-green' : 'badge-muted'}>{user.status}</span>
                </td>
                <td>{user.joinedAt}</td>
                <td>
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => toggleStatus(user.id)}>
                    {user.status === 'Active' ? 'Disable' : 'Enable'}
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
