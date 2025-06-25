import { useState, useEffect } from 'react';
import { useAuthStore } from '../state/auth';
import { useCoinsStore } from '../state/coins';

export const useBenefitsData = () => {
  const { user } = useAuthStore();
  const { getUserBalance } = useCoinsStore();
  
  const [userBalance, setUserBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const balance = getUserBalance(user.id);
      setUserBalance(balance.currentBalance);
      setIsAdmin(user.role === 'ADMIN' || user.role === 'SUPERADMIN');
    }
  }, [user, getUserBalance]);

  const updateUserBalance = () => {
    if (user) {
      const balance = getUserBalance(user.id);
      setUserBalance(balance.currentBalance);
    }
  };

  return {
    user,
    userBalance,
    isAdmin,
    error,
    setError,
    updateUserBalance
  };
};