import { useAuthStore } from '../../store/auth.store';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="dashboard-page">
      <h1>My Dashboard</h1>
      <p>Welcome back{user?.name ? `, ${user.name}` : ''}.</p>
      <p>This is a protected dashboard page.</p>
    </div>
  );
}
