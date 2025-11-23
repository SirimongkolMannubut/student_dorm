'use client';

import { useEffect, useState } from 'react';
import { isLoggedIn, isAdmin, getUserFromToken } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ถ้าเป็นหน้าแอดมิน ให้ผ่านไปเลย (ไม่ตรวจสอบ auth)
    if (requireAdmin) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    const checkAuth = () => {
      if (!isLoggedIn()) {
        window.location.href = '/login';
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [requireAdmin]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}