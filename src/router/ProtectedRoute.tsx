import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../services/authStore';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<'BUYER' | 'SUPPLIER' | 'ADMIN'>;
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role?.toUpperCase() as any ?? 'BUYER')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}