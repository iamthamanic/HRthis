import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ShopBenefit {
  id: string;
  title: string;
  description: string;
  coinCost: number;
  category: 'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER';
  imageUrl?: string;
  isActive: boolean;
  stockLimit?: number; // null = unlimited
  currentStock?: number;
  createdAt: string;
}

export interface BenefitPurchase {
  id: string;
  userId: string;
  benefitId: string;
  coinCost: number;
  status: 'PENDING' | 'APPROVED' | 'DELIVERED' | 'CANCELLED';
  purchasedAt: string;
  deliveredAt?: string;
  notes?: string;
}

interface ShopState {
  benefits: ShopBenefit[];
  purchases: BenefitPurchase[];
  isLoading: boolean;
  
  // Shop management
  getActiveBenefits: () => ShopBenefit[];
  getBenefitsByCategory: (category: string) => ShopBenefit[];
  
  // Admin benefit management
  addBenefit: (benefit: Omit<ShopBenefit, 'id' | 'createdAt'>) => Promise<void>;
  updateBenefit: (benefitId: string, updates: Partial<ShopBenefit>) => Promise<void>;
  deleteBenefit: (benefitId: string) => Promise<void>;
  
  // Purchase management
  purchaseBenefit: (userId: string, benefitId: string) => Promise<void>;
  getUserPurchases: (userId: string) => BenefitPurchase[];
  getAllPurchases: () => BenefitPurchase[];
  updatePurchaseStatus: (purchaseId: string, status: BenefitPurchase['status'], notes?: string) => Promise<void>;
}

// Mock data
const mockBenefits: ShopBenefit[] = [
  {
    id: '1',
    title: 'Massage Gutschein',
    description: '60 Minuten entspannende Massage',
    coinCost: 150,
    category: 'WELLNESS',
    isActive: true,
    stockLimit: 10,
    currentStock: 8,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Lunch Gutschein',
    description: 'Mittagessen im Restaurant nach Wahl (bis 25€)',
    coinCost: 75,
    category: 'FOOD',
    isActive: true,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: '3',
    title: 'Zusätzlicher freier Tag',
    description: 'Ein zusätzlicher bezahlter Urlaubstag',
    coinCost: 200,
    category: 'TIME_OFF',
    isActive: true,
    stockLimit: 5,
    currentStock: 3,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: '4',
    title: 'Tech Gadget Budget',
    description: '50€ Budget für Tech-Zubehör',
    coinCost: 125,
    category: 'TECH',
    isActive: true,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: '5',
    title: 'Fitness Studio Monat',
    description: '1 Monat kostenlose Mitgliedschaft',
    coinCost: 100,
    category: 'WELLNESS',
    isActive: true,
    stockLimit: 20,
    currentStock: 15,
    createdAt: '2024-11-01T10:00:00Z'
  }
];

const mockPurchases: BenefitPurchase[] = [
  {
    id: '1',
    userId: '1',
    benefitId: '2',
    coinCost: 75,
    status: 'DELIVERED',
    purchasedAt: '2024-12-10T14:30:00Z',
    deliveredAt: '2024-12-12T10:00:00Z',
    notes: 'Gutschein per E-Mail versendet'
  }
];

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      benefits: mockBenefits,
      purchases: mockPurchases,
      isLoading: false,

      getActiveBenefits: () => {
        return get().benefits
          .filter(benefit => benefit.isActive)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getBenefitsByCategory: (category: string) => {
        return get().benefits
          .filter(benefit => benefit.isActive && benefit.category === category)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      addBenefit: async (benefit) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newBenefit: ShopBenefit = {
            ...benefit,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            benefits: [newBenefit, ...state.benefits],
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateBenefit: async (benefitId: string, updates: Partial<ShopBenefit>) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            benefits: state.benefits.map(benefit =>
              benefit.id === benefitId ? { ...benefit, ...updates } : benefit
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteBenefit: async (benefitId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            benefits: state.benefits.filter(benefit => benefit.id !== benefitId),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      purchaseBenefit: async (userId: string, benefitId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const benefit = get().benefits.find(b => b.id === benefitId);
          if (!benefit) throw new Error('Benefit nicht gefunden');
          
          // Check stock
          if (benefit.stockLimit && benefit.currentStock && benefit.currentStock <= 0) {
            throw new Error('Dieses Benefit ist ausverkauft');
          }
          
          const newPurchase: BenefitPurchase = {
            id: Date.now().toString(),
            userId,
            benefitId,
            coinCost: benefit.coinCost,
            status: 'PENDING',
            purchasedAt: new Date().toISOString()
          };
          
          // Update stock if limited
          if (benefit.stockLimit && benefit.currentStock) {
            set(state => ({
              benefits: state.benefits.map(b =>
                b.id === benefitId
                  ? { ...b, currentStock: (b.currentStock || 0) - 1 }
                  : b
              )
            }));
          }
          
          set(state => ({
            purchases: [newPurchase, ...state.purchases],
            isLoading: false
          }));

          // Deduct coins from user's balance by creating a negative transaction
          const { useCoinsStore } = await import('./coins');
          const coinsStore = useCoinsStore.getState();
          
          // Create negative transaction for benefit purchase
          const purchaseTransaction = {
            id: `purchase-${Date.now()}`,
            userId,
            amount: -benefit.coinCost,
            reason: `${benefit.title} eingekauft`,
            type: 'BENEFIT_PURCHASE' as const,
            benefitId,
            createdAt: new Date().toISOString()
          };
          
          coinsStore.transactions.unshift(purchaseTransaction);
          coinsStore.updateUserBalance(userId);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getUserPurchases: (userId: string) => {
        return get().purchases
          .filter(purchase => purchase.userId === userId)
          .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());
      },

      getAllPurchases: () => {
        return get().purchases
          .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());
      },

      updatePurchaseStatus: async (purchaseId: string, status: BenefitPurchase['status'], notes?: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            purchases: state.purchases.map(purchase =>
              purchase.id === purchaseId
                ? {
                    ...purchase,
                    status,
                    notes,
                    deliveredAt: status === 'DELIVERED' ? new Date().toISOString() : purchase.deliveredAt
                  }
                : purchase
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'shop-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        benefits: state.benefits,
        purchases: state.purchases
      }),
    }
  )
);