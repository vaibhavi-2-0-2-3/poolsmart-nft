
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';

interface ProtectedActionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  onAuthRequired?: () => void;
}

export const ProtectedAction: React.FC<ProtectedActionProps> = ({
  children,
  fallback,
  requireAuth = true,
  onAuthRequired
}) => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return fallback || <div>Loading...</div>;
  }

  if (requireAuth && !user) {
    const handleAuthRequired = () => {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        setShowAuthModal(true);
      }
    };

    return (
      <>
        <div onClick={handleAuthRequired}>
          {fallback || children}
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="signup"
        />
      </>
    );
  }

  return <>{children}</>;
};
