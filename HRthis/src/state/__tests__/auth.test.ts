import { useAuthStore } from '../auth';
import { User } from '../../types';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Clear localStorage
    localStorage.clear();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const { login } = useAuthStore.getState();
      
      await login('admin@hrthis.de', 'admin123');
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeDefined();
      expect(state.user?.email).toBe('admin@hrthis.de');
      expect(state.organization).toBeDefined();
    });

    it('should fail login with invalid credentials', async () => {
      const { login } = useAuthStore.getState();
      
      await expect(login('invalid@email.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it('should set loading state during login', async () => {
      const { login } = useAuthStore.getState();
      
      const loginPromise = login('admin@hrthis.de', 'admin123');
      
      // Check loading state immediately
      expect(useAuthStore.getState().isLoading).toBe(true);
      
      await loginPromise;
      
      // Check loading state after completion
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', async () => {
      // First login
      const { login, logout } = useAuthStore.getState();
      await login('admin@hrthis.de', 'admin123');
      
      // Verify logged in
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      
      // Logout
      logout();
      
      // Verify logged out
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.organization).toBeNull();
    });
  });

  describe('createUser', () => {
    beforeEach(async () => {
      // Login as admin
      const { login } = useAuthStore.getState();
      await login('admin@hrthis.de', 'admin123');
    });

    it('should create a new user with required fields', async () => {
      const { createUser, getAllUsers } = useAuthStore.getState();
      
      const newUserData: Omit<User, 'id' | 'organizationId'> = {
        email: 'newuser@example.com',
        name: 'New User',
        firstName: 'New',
        lastName: 'User',
        role: 'EMPLOYEE',
        position: 'Developer',
        department: 'IT',
        weeklyHours: 40,
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        vacationDays: 30,
        joinDate: '2024-01-01',
      };

      const initialUserCount = getAllUsers().length;
      const createdUser = await createUser(newUserData);
      
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toBe('newuser@example.com');
      expect(createdUser.organizationId).toBe('org1');
      
      // Verify user was added to the list
      const updatedUsers = getAllUsers();
      expect(updatedUsers.length).toBe(initialUserCount + 1);
      expect(updatedUsers.find(u => u.id === createdUser.id)).toBeDefined();
    });

    it('should set default values for optional fields', async () => {
      const { createUser } = useAuthStore.getState();
      
      const minimalUserData: Omit<User, 'id' | 'organizationId'> = {
        email: 'minimal@example.com',
        name: 'Minimal User',
        firstName: 'Minimal',
        lastName: 'User',
        position: 'Tester',
        department: 'QA',
      };

      const createdUser = await createUser(minimalUserData);
      
      // Check default values
      expect(createdUser.role).toBe('EMPLOYEE');
      expect(createdUser.employmentStatus).toBe('ACTIVE');
      expect(createdUser.employmentType).toBe('FULL_TIME');
      expect(createdUser.weeklyHours).toBe(40);
      expect(createdUser.vacationDays).toBe(30);
      expect(createdUser.coinWallet).toBe(0);
      expect(createdUser.level).toBe(1);
      expect(createdUser.teamIds).toEqual([]);
    });

    it('should generate unique IDs for new users', async () => {
      const { createUser } = useAuthStore.getState();
      
      const user1 = await createUser({
        email: 'user1@example.com',
        name: 'User 1',
        firstName: 'User',
        lastName: 'One',
        position: 'Dev',
        department: 'IT',
      });

      const user2 = await createUser({
        email: 'user2@example.com',
        name: 'User 2',
        firstName: 'User',
        lastName: 'Two',
        position: 'Dev',
        department: 'IT',
      });

      expect(user1.id).toBeDefined();
      expect(user2.id).toBeDefined();
      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('updateUser', () => {
    beforeEach(async () => {
      const { login } = useAuthStore.getState();
      await login('admin@hrthis.de', 'admin123');
    });

    it('should update user data', async () => {
      const { updateUser, getAllUsers } = useAuthStore.getState();
      const users = getAllUsers();
      const userToUpdate = users[0];
      
      await updateUser(userToUpdate.id, {
        position: 'Senior Developer',
        weeklyHours: 35,
      });
      
      const updatedUsers = getAllUsers();
      const updatedUser = updatedUsers.find(u => u.id === userToUpdate.id);
      
      expect(updatedUser?.position).toBe('Senior Developer');
      expect(updatedUser?.weeklyHours).toBe(35);
    });

    it('should update current user if updating self', async () => {
      const { updateUser, user } = useAuthStore.getState();
      
      if (!user) throw new Error('User should be logged in');
      
      await updateUser(user.id, {
        position: 'Updated Position',
      });
      
      const updatedState = useAuthStore.getState();
      expect(updatedState.user?.position).toBe('Updated Position');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const { login, getAllUsers } = useAuthStore.getState();
      await login('admin@hrthis.de', 'admin123');
      
      const users = getAllUsers();
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      expect(users.every(user => user.id && user.email)).toBe(true);
    });
  });
});