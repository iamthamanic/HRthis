import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Organization } from '../types';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setOrganization: (org: Organization) => void;
}

// Mock authentication data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'max.mustermann@workytime.de',
    name: 'Max Mustermann',
    role: 'EMPLOYEE',
    organizationId: 'org1'
  },
  {
    id: '2',
    email: 'anna.admin@workytime.de',
    name: 'Anna Admin',
    role: 'ADMIN',
    organizationId: 'org1'
  }
];

const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'WorkyTime GmbH',
    slug: 'workytime-gmbh'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock authentication - in real app, this would be API call
          const user = mockUsers.find(u => u.email === email);
          
          if (!user || password !== 'password') {
            throw new Error('Ungültige Anmeldedaten');
          }
          
          const organization = mockOrganizations.find(org => org.id === user.organizationId);
          
          set({ 
            user, 
            organization, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          organization: null, 
          isAuthenticated: false 
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setOrganization: (organization: Organization) => {
        set({ organization });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        organization: state.organization,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);