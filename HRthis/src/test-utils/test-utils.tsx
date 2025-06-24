import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock stores for testing
import { useAuthStore } from '../state/auth';
import { User, Organization } from '../types';

// Create mock user
export const mockUser: User = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  role: 'EMPLOYEE',
  organizationId: 'org1',
  position: 'Developer',
  department: 'IT',
  weeklyHours: 40,
  employmentType: 'FULL_TIME',
  employmentStatus: 'ACTIVE',
  vacationDays: 30,
  joinDate: '2023-01-01',
};

export const mockAdmin: User = {
  ...mockUser,
  id: 'test-admin-1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'ADMIN',
};

export const mockOrganization: Organization = {
  id: 'org1',
  name: 'Test Organization',
  slug: 'test-org',
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  user?: User | null;
  isAuthenticated?: boolean;
}

const AllTheProviders = ({ children, initialRoute = '/' }: { children: React.ReactNode; initialRoute?: string }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export const customRender = (ui: ReactElement, {
    initialRoute = '/', user = mockUser, isAuthenticated = true, ...renderOptions
  }: CustomRenderOptions = {}) => {
  // Mock auth store state
  useAuthStore.setState({
    user,
    isAuthenticated,
    organization: mockOrganization,
    isLoading: false,
  });

  window.history.pushState({}, 'Test page', initialRoute);

  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders initialRoute={initialRoute}>{children}</AllTheProviders>,
    ...renderOptions,
  });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };

// Utility functions for testing
export const waitForLoadingToFinish = async () => {
  // Wait for any loading states to resolve
  await new Promise(resolve => setTimeout(resolve, 0));
};

// Mock navigation
export const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockClear();
  
  // Reset store states
  useAuthStore.setState({
    user: null,
    organization: null,
    isAuthenticated: false,
    isLoading: false,
  });
});