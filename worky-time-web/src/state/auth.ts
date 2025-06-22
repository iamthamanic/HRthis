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
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  getAllUsers: () => User[];
}

// Mock authentication data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'max.mustermann@workytime.de',
    name: 'Max Mustermann',
    role: 'EMPLOYEE',
    organizationId: 'org1',
    firstName: 'Max',
    lastName: 'Mustermann',
    privateEmail: 'max.privat@gmail.com',
    position: 'Senior Developer',
    department: 'IT',
    weeklyHours: 40,
    employmentType: 'FULL_TIME',
    joinDate: '2022-01-15',
    employmentStatus: 'ACTIVE',
    vacationDays: 30,
    address: {
      street: 'Musterstraße 123',
      postalCode: '12345',
      city: 'Berlin'
    },
    phone: '+49 30 12345678',
    bankDetails: {
      iban: 'DE89 3704 0044 0532 0130 00',
      bic: 'COBADEFFXXX'
    }
  },
  {
    id: '2',
    email: 'anna.admin@workytime.de',
    name: 'Anna Admin',
    role: 'ADMIN',
    organizationId: 'org1',
    firstName: 'Anna',
    lastName: 'Admin',
    privateEmail: 'anna.privat@gmail.com',
    position: 'HR Manager',
    department: 'Human Resources',
    weeklyHours: 40,
    employmentType: 'FULL_TIME',
    joinDate: '2021-03-01',
    employmentStatus: 'ACTIVE',
    vacationDays: 30
  },
  {
    id: '3',
    email: 'tom.teilzeit@workytime.de',
    name: 'Tom Teilzeit',
    role: 'EMPLOYEE',
    organizationId: 'org1',
    firstName: 'Tom',
    lastName: 'Teilzeit',
    privateEmail: 'tom.privat@gmail.com',
    position: 'Designer',
    department: 'Marketing',
    weeklyHours: 20,
    employmentType: 'PART_TIME',
    joinDate: '2023-06-01',
    employmentStatus: 'ACTIVE',
    vacationDays: 15
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
      },

      updateUser: async (userId: string, updates: Partial<User>) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Update mock data
          const userIndex = mockUsers.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
          }
          
          // Update current user if it's the same
          const currentUser = get().user;
          if (currentUser && currentUser.id === userId) {
            set({ user: { ...currentUser, ...updates } });
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getAllUsers: () => {
        return mockUsers;
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