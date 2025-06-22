import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number; // positive for earning, negative for spending
  reason: string;
  type: 'ADMIN_GRANT' | 'RULE_EARNED' | 'BENEFIT_PURCHASE';
  adminId?: string; // Who granted the coins (for ADMIN_GRANT)
  benefitId?: string; // Which benefit was purchased (for BENEFIT_PURCHASE)
  ruleId?: string; // Which rule was fulfilled (for RULE_EARNED)
  createdAt: string;
}

export interface CoinRule {
  id: string;
  title: string;
  description: string;
  coinAmount: number;
  isActive: boolean;
  createdAt: string;
}

export interface UserCoinBalance {
  userId: string;
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  lastUpdated: string;
}

interface CoinsState {
  transactions: CoinTransaction[];
  rules: CoinRule[];
  balances: UserCoinBalance[];
  isLoading: boolean;
  
  // Coin distribution by admin
  grantCoins: (userId: string, amount: number, reason: string, adminId: string) => Promise<void>;
  
  // User coin management
  getUserBalance: (userId: string) => UserCoinBalance;
  getUserTransactions: (userId: string) => CoinTransaction[];
  getAllTransactions: () => CoinTransaction[];
  
  // Rules management
  getCoinRules: () => CoinRule[];
  addCoinRule: (rule: Omit<CoinRule, 'id' | 'createdAt'>) => Promise<void>;
  updateCoinRule: (ruleId: string, updates: Partial<CoinRule>) => Promise<void>;
  deleteCoinRule: (ruleId: string) => Promise<void>;
  
  // Internal methods
  updateUserBalance: (userId: string) => void;
}

// Mock data
const mockTransactions: CoinTransaction[] = [
  {
    id: '1',
    userId: '1',
    amount: 50,
    reason: 'Willkommensbonus',
    type: 'ADMIN_GRANT',
    adminId: '2',
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    amount: 25,
    reason: 'Überstunden geleistet',
    type: 'ADMIN_GRANT',
    adminId: '2',
    createdAt: '2024-12-15T14:30:00Z'
  },
  {
    id: '3',
    userId: '3',
    amount: 30,
    reason: 'Projektabschluss erfolgreich',
    type: 'ADMIN_GRANT',
    adminId: '2',
    createdAt: '2024-12-10T09:15:00Z'
  }
];

const mockRules: CoinRule[] = [
  {
    id: '1',
    title: 'Schulung abgeschlossen',
    description: 'Für jede erfolgreich abgeschlossene Schulung',
    coinAmount: 20,
    isActive: true,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Keine Krankheitstage im Monat',
    description: 'Bonus für komplette Anwesenheit im Monat',
    coinAmount: 15,
    isActive: true,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: '3',
    title: 'Überstunden (>5h/Monat)',
    description: 'Zusätzliche Coins für Flexibilität',
    coinAmount: 10,
    isActive: true,
    createdAt: '2024-11-01T10:00:00Z'
  }
];

export const useCoinsStore = create<CoinsState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      rules: mockRules,
      balances: [],
      isLoading: false,

      grantCoins: async (userId: string, amount: number, reason: string, adminId: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newTransaction: CoinTransaction = {
            id: Date.now().toString(),
            userId,
            amount,
            reason,
            type: 'ADMIN_GRANT',
            adminId,
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            transactions: [newTransaction, ...state.transactions],
            isLoading: false
          }));

          // Update user balance
          get().updateUserBalance(userId);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getUserBalance: (userId: string) => {
        const transactions = get().transactions.filter(t => t.userId === userId);
        const totalEarned = transactions
          .filter(t => t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0);
        const totalSpent = Math.abs(transactions
          .filter(t => t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0));
        const currentBalance = totalEarned - totalSpent;

        const existingBalance = get().balances.find(b => b.userId === userId);
        if (existingBalance) {
          return {
            ...existingBalance,
            totalEarned,
            totalSpent,
            currentBalance,
            lastUpdated: new Date().toISOString()
          };
        }

        return {
          userId,
          totalEarned,
          totalSpent,
          currentBalance,
          lastUpdated: new Date().toISOString()
        };
      },

      getUserTransactions: (userId: string) => {
        return get().transactions
          .filter(t => t.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getAllTransactions: () => {
        return get().transactions
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getCoinRules: () => {
        return get().rules.filter(rule => rule.isActive)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      addCoinRule: async (rule) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newRule: CoinRule = {
            ...rule,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            rules: [newRule, ...state.rules],
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateCoinRule: async (ruleId: string, updates: Partial<CoinRule>) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            rules: state.rules.map(rule =>
              rule.id === ruleId ? { ...rule, ...updates } : rule
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteCoinRule: async (ruleId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            rules: state.rules.filter(rule => rule.id !== ruleId),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateUserBalance: (userId: string) => {
        const balance = get().getUserBalance(userId);
        
        set(state => ({
          balances: [
            ...state.balances.filter(b => b.userId !== userId),
            balance
          ]
        }));
      }
    }),
    {
      name: 'coins-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        transactions: state.transactions,
        rules: state.rules,
        balances: state.balances
      }),
    }
  )
);