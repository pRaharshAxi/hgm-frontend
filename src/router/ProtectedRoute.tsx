import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<'buyer' | 'supplier' | 'admin'>;
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role ?? 'buyer')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
