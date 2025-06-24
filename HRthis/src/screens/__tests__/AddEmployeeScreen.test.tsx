import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils/test-utils';
import { AddEmployeeScreen } from '../AddEmployeeScreen';
import { useAuthStore } from '../../state/auth';
import { mockAdmin } from '../../test-utils/test-utils';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AddEmployeeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    
    // Set admin user
    useAuthStore.setState({
      user: mockAdmin,
      isAuthenticated: true,
      organization: { id: 'org1', name: 'Test Org', slug: 'test-org' },
    });
  });

  it('should render the form with all required fields', () => {
    render(<AddEmployeeScreen />);
    
    // Check header
    expect(screen.getByText('Neuen Mitarbeiter hinzufügen')).toBeInTheDocument();
    
    // Check required fields
    expect(screen.getByLabelText(/E-Mail-Adresse \*/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vorname \*/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nachname \*/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Position \*/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Abteilung \*/)).toBeInTheDocument();
    
    // Check optional fields
    expect(screen.getByLabelText('Private E-Mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Telefon')).toBeInTheDocument();
    expect(screen.getByLabelText('Wochenstunden')).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    render(<AddEmployeeScreen />);
    
    const submitButton = screen.getByText('Mitarbeiter erstellen');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('E-Mail ist erforderlich')).toBeInTheDocument();
      expect(screen.getByText('Vorname ist erforderlich')).toBeInTheDocument();
      expect(screen.getByText('Nachname ist erforderlich')).toBeInTheDocument();
      expect(screen.getByText('Position ist erforderlich')).toBeInTheDocument();
      expect(screen.getByText('Abteilung ist erforderlich')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    render(<AddEmployeeScreen />);
    
    const emailInput = screen.getByLabelText(/E-Mail-Adresse \*/);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByText('Mitarbeiter erstellen');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Ungültige E-Mail-Adresse')).toBeInTheDocument();
    });
  });

  it('should validate weekly hours range', async () => {
    render(<AddEmployeeScreen />);
    
    const hoursInput = screen.getByLabelText('Wochenstunden');
    fireEvent.change(hoursInput, { target: { value: '100' } });
    
    const submitButton = screen.getByText('Mitarbeiter erstellen');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Wochenstunden müssen zwischen 1 und 60 liegen')).toBeInTheDocument();
    });
  });

  it('should successfully create a new employee', async () => {
    const mockCreateUser = jest.fn().mockResolvedValue({
      id: 'new-user-id',
      email: 'new@example.com',
      name: 'New Employee',
    });
    
    useAuthStore.setState({
      createUser: mockCreateUser,
    });

    render(<AddEmployeeScreen />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/E-Mail-Adresse \*/), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Vorname \*/), {
      target: { value: 'New' },
    });
    fireEvent.change(screen.getByLabelText(/Nachname \*/), {
      target: { value: 'Employee' },
    });
    fireEvent.change(screen.getByLabelText(/Position \*/), {
      target: { value: 'Developer' },
    });
    fireEvent.change(screen.getByLabelText(/Abteilung \*/), {
      target: { value: 'IT' },
    });
    
    const submitButton = screen.getByText('Mitarbeiter erstellen');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@example.com',
          firstName: 'New',
          lastName: 'Employee',
          name: 'New Employee',
          position: 'Developer',
          department: 'IT',
        })
      );
      
      expect(mockNavigate).toHaveBeenCalledWith('/admin/team-management', {
        state: {
          message: 'Mitarbeiter New Employee wurde erfolgreich erstellt.',
          type: 'success',
        },
      });
    });
  });

  it('should handle cancel button', () => {
    render(<AddEmployeeScreen />);
    
    const cancelButton = screen.getByText('Abbrechen');
    fireEvent.click(cancelButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/admin/team-management');
  });

  it('should show loading state during submission', async () => {
    const mockCreateUser = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    useAuthStore.setState({
      createUser: mockCreateUser,
      isLoading: true,
    });

    render(<AddEmployeeScreen />);
    
    const submitButton = screen.getByText('Erstelle Mitarbeiter...');
    expect(submitButton).toBeDisabled();
  });

  it('should handle API errors gracefully', async () => {
    const mockCreateUser = jest.fn().mockRejectedValue(new Error('API Error'));
    
    useAuthStore.setState({
      createUser: mockCreateUser,
    });

    render(<AddEmployeeScreen />);
    
    // Fill in minimum required fields
    fireEvent.change(screen.getByLabelText(/E-Mail-Adresse \*/), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Vorname \*/), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/Nachname \*/), {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getByLabelText(/Position \*/), {
      target: { value: 'Tester' },
    });
    fireEvent.change(screen.getByLabelText(/Abteilung \*/), {
      target: { value: 'QA' },
    });
    
    const submitButton = screen.getByText('Mitarbeiter erstellen');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Fehler beim Erstellen des Mitarbeiters. Bitte versuchen Sie es erneut.')).toBeInTheDocument();
    });
  });
});