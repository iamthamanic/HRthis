/**
 * Employee Hooks
 * React Query hooks for employee data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { employeeAPI } from '../services/api';
import { 
  Employee, 
  EmployeeFilters, 
  CreateEmployeeRequest, 
  UpdateEmployeeRequest 
} from '../types/employee';

// Query Keys
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: EmployeeFilters) => [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
  onboarding: (id: string) => [...employeeKeys.all, 'onboarding', id] as const,
};

// Get Employees List
export const useEmployees = (filters: EmployeeFilters = {}) => {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => employeeAPI.getEmployees(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Single Employee
export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeAPI.getEmployee(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get Onboarding Status
export const useOnboardingStatus = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.onboarding(id),
    queryFn: () => employeeAPI.getOnboardingStatus(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create Employee
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeRequest) => employeeAPI.createEmployee(data),
    onSuccess: (newEmployee) => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      // Add the new employee to cache
      queryClient.setQueryData(
        employeeKeys.detail(newEmployee.id),
        newEmployee
      );

      message.success(`Mitarbeiter ${newEmployee.fullName} wurde erfolgreich erstellt`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Fehler beim Erstellen des Mitarbeiters';
      message.error(errorMessage);
    },
  });
};

// Update Employee
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeRequest }) =>
      employeeAPI.updateEmployee(id, data),
    onSuccess: (updatedEmployee, { id }) => {
      // Update employee in cache
      queryClient.setQueryData(
        employeeKeys.detail(id),
        updatedEmployee
      );

      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });

      message.success(`Mitarbeiter ${updatedEmployee.fullName} wurde aktualisiert`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Fehler beim Aktualisieren des Mitarbeiters';
      message.error(errorMessage);
    },
  });
};

// Delete Employee
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeAPI.deleteEmployee(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: employeeKeys.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });

      message.success('Mitarbeiter wurde erfolgreich gelöscht');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Fehler beim Löschen des Mitarbeiters';
      message.error(errorMessage);
    },
  });
};

// Send Onboarding Email
export const useSendOnboardingEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, preset }: { id: string; preset: string }) =>
      employeeAPI.sendOnboardingEmail(id, preset),
    onSuccess: (_, { id }) => {
      // Invalidate employee data and onboarding status
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.onboarding(id) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });

      message.success('Onboarding-Email wurde erfolgreich versendet');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Fehler beim Versenden der Onboarding-Email';
      message.error(errorMessage);
    },
  });
};

// Prefetch Employee
export const usePrefetchEmployee = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: employeeKeys.detail(id),
      queryFn: () => employeeAPI.getEmployee(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// Optimistic Updates Helper
export const useOptimisticEmployeeUpdate = () => {
  const queryClient = useQueryClient();

  return {
    updateEmployee: (id: string, updatedData: Partial<Employee>) => {
      queryClient.setQueryData(
        employeeKeys.detail(id),
        (old: Employee | undefined) => old ? { ...old, ...updatedData } : undefined
      );
    },
    rollbackEmployee: (id: string) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
    },
  };
};