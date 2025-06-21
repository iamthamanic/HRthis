export interface Benefit {
  id: string;
  title: string;
  description: string;
  coinCost: number;
  category: 'WELLNESS' | 'FOOD' | 'OFFICE' | 'TIME' | 'LEARNING';
  icon: string;
  isActive: boolean;
  quantity: number | null; // null = unlimited
  redeemCount: number;
  createdAt: string;
}

export interface UserCoins {
  userId: string;
  totalCoins: number;
  spentCoins: number;
  availableCoins: number;
  lastUpdated: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'EARNED' | 'SPENT' | 'ADMIN_ADDED';
  reason: string;
  benefitId?: string;
  adminId?: string;
  createdAt: string;
}

export interface BenefitRedemption {
  id: string;
  userId: string;
  benefitId: string;
  coinsCost: number;
  status: 'PENDING' | 'APPROVED' | 'FULFILLED' | 'REJECTED';
  requestedAt: string;
  fulfilledAt?: string;
  notes?: string;
}