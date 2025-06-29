import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Organization } from '../types';

// Helper to create basic user fields
const createBasicUserFields = (userData: Partial<User>) => ({
  id: `user-${Date.now()}`,
  email: userData.email || '',
  name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
  role: userData.role || 'EMPLOYEE',
  organizationId: userData.organizationId || 'org1',
  firstName: userData.firstName || '',
  lastName: userData.lastName || ''
});

// Helper to create employment fields
const createEmploymentFields = (userData: Partial<User>) => ({
  position: userData.position || '',
  department: userData.department || '',
  weeklyHours: userData.weeklyHours || 40,
  employmentType: userData.employmentType || 'FULL_TIME',
  joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
  employmentStatus: 'ACTIVE' as const,
  vacationDays: userData.vacationDays || 30
});

// Helper to create gamification fields
const createGamificationFields = () => ({
  coinWallet: 0,
  coinProgress: 0,
  level: 1
});

// Helper to create team fields
const createTeamFields = (userData: Partial<User>) => ({
  teamIds: userData.teamIds || [],
  primaryTeamId: userData.primaryTeamId
});

// Helper function to create new user with defaults
const createUserWithDefaults = (userData: Partial<User>): User => {
  return {
    ...createBasicUserFields(userData),
    ...createEmploymentFields(userData),
    ...createGamificationFields(),
    ...createTeamFields(userData),
    ...userData
  };
};

// Helper function to simulate API delay
const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 500));

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
  createUser: (userData: Partial<User>) => Promise<User>;
  getAllUsers: () => User[];
}

// Mock authentication data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'max.mustermann@hrthis.de',
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
    },
    coinWallet: 1500,
    coinProgress: 2200,
    level: 3,
    teamIds: ['team1'],
    primaryTeamId: 'team1'
  },
  {
    id: '2',
    email: 'anna.admin@hrthis.de',
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
    vacationDays: 30,
    coinWallet: 2500,
    coinProgress: 3800,
    level: 5,
    teamIds: ['team1', 'team2', 'team3'],
    leadTeamIds: ['team1', 'team2', 'team3']
  },
  {
    id: '3',
    email: 'tom.teilzeit@hrthis.de',
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
    vacationDays: 15,
    coinWallet: 800,
    coinProgress: 1200,
    level: 2,
    teamIds: ['team2'],
    primaryTeamId: 'team2'
  },
  {
    id: '4',
    email: 'test@hrthis.de',
    name: 'Test User',
    role: 'EMPLOYEE',
    organizationId: 'org1',
    firstName: 'Test',
    lastName: 'User',
    privateEmail: 'test.user@gmail.com',
    position: 'Software Tester',
    department: 'Quality Assurance',
    weeklyHours: 35,
    employmentType: 'FULL_TIME',
    joinDate: '2024-01-15',
    employmentStatus: 'ACTIVE',
    vacationDays: 28,
    address: {
      street: 'Teststraße 42',
      postalCode: '10115',
      city: 'Berlin'
    },
    phone: '+49 30 98765432',
    bankDetails: {
      iban: 'DE89 1001 0010 0987 6543 21',
      bic: 'PBNKDEFFXXX'
    },
    coinWallet: 950,
    coinProgress: 1500,
    level: 2,
    teamIds: ['team3'],
    primaryTeamId: 'team3'
  }
];

const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'HRthis GmbH',
    slug: 'hrthis-gmbh'
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

      createUser: async (userData: Partial<User>) => {
        set({ isLoading: true });
        
        try {
          await simulateApiCall();
          
          const newUser = createUserWithDefaults(userData);
          mockUsers.push(newUser);
          
          set({ isLoading: false });
          return newUser;
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