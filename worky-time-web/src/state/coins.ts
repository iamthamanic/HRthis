import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Benefit, UserCoins, CoinTransaction, BenefitRedemption } from '../types/benefits';

interface CoinsState {
  benefits: Benefit[];
  userCoins: UserCoins[];
  transactions: CoinTransaction[];
  redemptions: BenefitRedemption[];
  isLoading: boolean;
  
  // User functions
  getUserCoins: (userId: string) => UserCoins | null;
  redeemBenefit: (userId: string, benefitId: string) => Promise<void>;
  getUserRedemptions: (userId: string) => BenefitRedemption[];
  getUserTransactions: (userId: string) => CoinTransaction[];
  
  // Admin functions
  addCoinsToUser: (userId: string, amount: number, reason: string, adminId: string) => Promise<void>;
  createBenefit: (benefit: Omit<Benefit, 'id' | 'createdAt' | 'redeemCount'>) => Promise<void>;
  updateBenefit: (benefitId: string, updates: Partial<Benefit>) => void;
  approveBenefitRedemption: (redemptionId: string) => void;
  rejectBenefitRedemption: (redemptionId: string, reason?: string) => void;
}

// Mock data
const mockBenefits: Benefit[] = [
  {
    id: '1',
    title: 'Extra Urlaubstag',
    description: 'Ein zusätzlicher freier Tag nach Wahl',
    coinCost: 500,
    category: 'TIME',
    icon: '🏖️',
    isActive: true,
    quantity: null,
    redeemCount: 3,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Massage im Büro',
    description: '30-minütige Entspannungsmassage am Arbeitsplatz',
    coinCost: 250,
    category: 'WELLNESS',
    icon: '💆‍♀️',
    isActive: true,
    quantity: 20,
    redeemCount: 12,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Mittagessen Gutschein',
    description: '25€ Gutschein für lokale Restaurants',
    coinCost: 150,
    category: 'FOOD',
    icon: '🍽️',
    isActive: true,
    quantity: null,
    redeemCount: 28,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Home Office Tag',
    description: 'Ein zusätzlicher Home Office Tag pro Monat',
    coinCost: 200,
    category: 'OFFICE',
    icon: '🏠',
    isActive: true,
    quantity: null,
    redeemCount: 15,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Kurs-Gutschein',
    description: 'Online-Kurs deiner Wahl (bis 100€)',
    coinCost: 400,
    category: 'LEARNING',
    icon: '📚',
    isActive: true,
    quantity: 10,
    redeemCount: 5,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    title: 'Ergonomisches Zubehör',
    description: 'Mauspad, Handgelenkstütze oder ähnliches',
    coinCost: 100,
    category: 'OFFICE',
    icon: '🖱️',
    isActive: true,
    quantity: null,
    redeemCount: 22,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockUserCoins: UserCoins[] = [
  {
    userId: '1',
    totalCoins: 750,
    spentCoins: 150,
    availableCoins: 600,
    lastUpdated: '2024-12-01T10:00:00Z'
  },
  {
    userId: '2',
    totalCoins: 1200,
    spentCoins: 400,
    availableCoins: 800,
    lastUpdated: '2024-12-01T10:00:00Z'
  }
];

const mockTransactions: CoinTransaction[] = [
  {
    id: '1',
    userId: '1',
    amount: 50,
    type: 'EARNED',
    reason: 'Projekt erfolgreich abgeschlossen',
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    amount: 100,
    type: 'ADMIN_ADDED',
    reason: 'Monatsbonus für gute Leistung',
    adminId: '2',
    createdAt: '2024-12-05T14:30:00Z'
  },
  {
    id: '3',
    userId: '1',
    amount: -150,
    type: 'SPENT',
    reason: 'Mittagessen Gutschein eingelöst',
    benefitId: '3',
    createdAt: '2024-12-10T12:15:00Z'
  }
];

export const useCoinsStore = create<CoinsState>()(
  persist(
    (set, get) => ({
      benefits: mockBenefits,
      userCoins: mockUserCoins,
      transactions: mockTransactions,
      redemptions: [],
      isLoading: false,

      getUserCoins: (userId: string) => {
        return get().userCoins.find(coins => coins.userId === userId) || null;
      },

      redeemBenefit: async (userId: string, benefitId: string) => {
        set({ isLoading: true });
        
        try {
          const benefit = get().benefits.find(b => b.id === benefitId);
          const userCoins = get().getUserCoins(userId);
          
          if (!benefit || !userCoins) {
            throw new Error('Benefit oder Benutzer nicht gefunden');
          }
          
          if (!benefit.isActive) {
            throw new Error('Dieser Benefit ist nicht mehr verfügbar');
          }
          
          if (userCoins.availableCoins < benefit.coinCost) {
            throw new Error('Nicht genügend Coins verfügbar');
          }
          
          if (benefit.quantity !== null && benefit.quantity !== undefined && benefit.quantity <= benefit.redeemCount) {
            throw new Error('Dieser Benefit ist ausverkauft');
          }
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const redemptionId = Date.now().toString();
          const transactionId = (Date.now() + 1).toString();
          
          // Create redemption
          const newRedemption: BenefitRedemption = {
            id: redemptionId,
            userId,
            benefitId,
            coinsCost: benefit.coinCost,
            status: 'PENDING',
            requestedAt: new Date().toISOString()
          };
          
          // Create transaction
          const newTransaction: CoinTransaction = {
            id: transactionId,
            userId,
            amount: -benefit.coinCost,
            type: 'SPENT',
            reason: benefit.title,
            benefitId,
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            redemptions: [...state.redemptions, newRedemption],
            transactions: [...state.transactions, newTransaction],
            userCoins: state.userCoins.map(coins => 
              coins.userId === userId 
                ? { 
                    ...coins, 
                    spentCoins: coins.spentCoins + benefit.coinCost,
                    availableCoins: coins.availableCoins - benefit.coinCost,
                    lastUpdated: new Date().toISOString()
                  }
                : coins
            ),
            benefits: state.benefits.map(b => 
              b.id === benefitId 
                ? { ...b, redeemCount: b.redeemCount + 1 }
                : b
            ),
            isLoading: false
          }));
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getUserRedemptions: (userId: string) => {
        return get().redemptions.filter(r => r.userId === userId)
          .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
      },

      getUserTransactions: (userId: string) => {
        return get().transactions.filter(t => t.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      addCoinsToUser: async (userId: string, amount: number, reason: string, adminId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const transactionId = Date.now().toString();
          
          const newTransaction: CoinTransaction = {
            id: transactionId,
            userId,
            amount,
            type: 'ADMIN_ADDED',
            reason,
            adminId,
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            transactions: [...state.transactions, newTransaction],
            userCoins: state.userCoins.map(coins => 
              coins.userId === userId 
                ? { 
                    ...coins, 
                    totalCoins: coins.totalCoins + amount,
                    availableCoins: coins.availableCoins + amount,
                    lastUpdated: new Date().toISOString()
                  }
                : coins
            ),
            isLoading: false
          }));
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      createBenefit: async (benefitData) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newBenefit: Benefit = {
            ...benefitData,
            id: Date.now().toString(),
            redeemCount: 0,
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            benefits: [...state.benefits, newBenefit],
            isLoading: false
          }));
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateBenefit: (benefitId: string, updates: Partial<Benefit>) => {
        set(state => ({
          benefits: state.benefits.map(benefit => 
            benefit.id === benefitId 
              ? { ...benefit, ...updates }
              : benefit
          )
        }));
      },

      approveBenefitRedemption: (redemptionId: string) => {
        set(state => ({
          redemptions: state.redemptions.map(redemption => 
            redemption.id === redemptionId 
              ? { 
                  ...redemption, 
                  status: 'APPROVED' as const,
                  fulfilledAt: new Date().toISOString()
                }
              : redemption
          )
        }));
      },

      rejectBenefitRedemption: (redemptionId: string, reason?: string) => {
        set(state => {
          const redemption = state.redemptions.find(r => r.id === redemptionId);
          if (!redemption) return state;
          
          // Refund coins
          const updatedUserCoins = state.userCoins.map(coins => 
            coins.userId === redemption.userId 
              ? { 
                  ...coins, 
                  spentCoins: coins.spentCoins - redemption.coinsCost,
                  availableCoins: coins.availableCoins + redemption.coinsCost,
                  lastUpdated: new Date().toISOString()
                }
              : coins
          );
          
          // Add refund transaction
          const refundTransaction: CoinTransaction = {
            id: Date.now().toString(),
            userId: redemption.userId,
            amount: redemption.coinsCost,
            type: 'EARNED',
            reason: `Rückerstattung: ${reason || 'Antrag abgelehnt'}`,
            createdAt: new Date().toISOString()
          };
          
          return {
            ...state,
            redemptions: state.redemptions.map(r => 
              r.id === redemptionId 
                ? { 
                    ...r, 
                    status: 'REJECTED' as const,
                    notes: reason
                  }
                : r
            ),
            userCoins: updatedUserCoins,
            transactions: [...state.transactions, refundTransaction]
          };
        });
      }
    }),
    {
      name: 'coins-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        benefits: state.benefits,
        userCoins: state.userCoins,
        transactions: state.transactions,
        redemptions: state.redemptions
      }),
    }
  )
);