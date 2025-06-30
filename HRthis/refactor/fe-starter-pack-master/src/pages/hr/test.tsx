/**
 * HR Test Page
 * Test page for migrated HR components
 */

import React from 'react';
import { ConfigProvider } from 'antd';
import { EmployeeCard } from '../../features/hr/components/EmployeeCard';
import { Employee, EmploymentType, EmployeeStatus, UserRole } from '../../features/hr/types/employee';
import { antdTheme } from '../../lib/antd-theme';

// Mock employee data
const mockEmployee: Employee = {
  id: '1',
  employeeNumber: 'EMP001',
  email: 'max.mustermann@hrthis.de',
  firstName: 'Max',
  lastName: 'Mustermann',
  fullName: 'Max Mustermann',
  birthDate: '1990-05-15',
  phone: '+49 30 12345678',
  address: 'Musterstraße 123, 10115 Berlin',
  emergencyContact: {
    name: 'Maria Mustermann',
    phone: '+49 30 87654321',
    relation: 'Ehefrau'
  },
  employmentType: EmploymentType.FULLTIME,
  employmentTypeDisplay: 'Vollzeit',
  position: 'Senior Developer',
  department: 'IT',
  startDate: '2023-01-15',
  clothingSizes: {
    top: 'L',
    pants: '32',
    shoes: '42'
  },
  status: EmployeeStatus.ACTIVE,
  role: UserRole.USER,
  isActive: true,
  isAdmin: false,
  onboardingCompleted: false,
  onboardingEmailSent: '2024-01-15T10:30:00Z',
  onboardingPreset: 'developer',
  vacationDays: 30,
  documents: [],
  createdAt: '2023-01-15T09:00:00Z',
  updatedAt: '2024-06-29T10:00:00Z',
  createdBy: 'admin'
};

const mockAdminEmployee: Employee = {
  ...mockEmployee,
  id: '2',
  employeeNumber: 'EMP002',
  firstName: 'Anna',
  lastName: 'Admin',
  fullName: 'Anna Admin',
  email: 'anna.admin@hrthis.de',
  position: 'HR Manager',
  department: 'Human Resources',
  role: UserRole.ADMIN,
  isAdmin: true,
  onboardingCompleted: true,
  clothingSizes: {
    top: 'M',
    pants: '28',
    shoes: '38'
  }
};

const mockInternEmployee: Employee = {
  ...mockEmployee,
  id: '3',
  employeeNumber: 'INT001',
  firstName: 'Julia',
  lastName: 'Praktikantin',
  fullName: 'Julia Praktikantin',
  email: 'julia.praktikantin@hrthis.de',
  position: 'Marketing Praktikantin',
  department: 'Marketing',
  employmentType: EmploymentType.INTERN,
  employmentTypeDisplay: 'Praktikant',
  status: EmployeeStatus.PROBATION,
  onboardingCompleted: false,
  onboardingEmailSent: undefined,
  clothingSizes: {
    top: 'S',
    shoes: '36'
  }
};

const mockCustomEmployee: Employee = {
  ...mockEmployee,
  id: '4',
  employeeNumber: 'EXT001',
  firstName: 'Tom',
  lastName: 'Freelancer',
  fullName: 'Tom Freelancer',
  email: 'tom.freelancer@hrthis.de',
  position: 'Freelance Designer',
  department: 'Design',
  employmentType: EmploymentType.OTHER,
  employmentTypeCustom: 'Freier Mitarbeiter',
  employmentTypeDisplay: 'Freier Mitarbeiter',
  onboardingCompleted: true,
  clothingSizes: undefined
};

export default function HRTestPage() {
  const handleEdit = (employee: Employee) => {
    console.log('Edit employee:', employee);
  };

  const handleDelete = (employee: Employee) => {
    console.log('Delete employee:', employee);
  };

  const handleSendOnboarding = (employee: Employee) => {
    console.log('Send onboarding email to:', employee);
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div className=\"min-h-screen bg-gray-50 p-8\">
        <div className=\"max-w-7xl mx-auto\">
          <h1 className=\"text-3xl font-bold text-gray-900 mb-8\">
            HR Komponenten Test
          </h1>
          
          <div className=\"mb-8\">
            <h2 className=\"text-xl font-semibold text-gray-800 mb-4\">
              Employee Cards - Verschiedene Szenarien
            </h2>
            
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
              {/* Normaler Mitarbeiter */}
              <EmployeeCard
                employee={mockEmployee}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSendOnboarding={handleSendOnboarding}
              />
              
              {/* Admin Mitarbeiter */}
              <EmployeeCard
                employee={mockAdminEmployee}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              
              {/* Praktikant mit ausstehender Onboarding */}
              <EmployeeCard
                employee={mockInternEmployee}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSendOnboarding={handleSendOnboarding}
              />
              
              {/* Custom Employment Type */}
              <EmployeeCard
                employee={mockCustomEmployee}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
          
          <div className=\"mb-8\">
            <h2 className=\"text-xl font-semibold text-gray-800 mb-4\">
              Compact Employee Cards
            </h2>
            
            <div className=\"space-y-4\">
              <EmployeeCard
                employee={mockEmployee}
                compact={true}
                showActions={false}
              />
              <EmployeeCard
                employee={mockAdminEmployee}
                compact={true}
                showActions={false}
              />
              <EmployeeCard
                employee={mockInternEmployee}
                compact={true}
                showActions={false}
              />
            </div>
          </div>
          
          <div className=\"bg-white rounded-lg shadow p-6\">
            <h2 className=\"text-xl font-semibold text-gray-800 mb-4\">
              Migration Status
            </h2>
            <div className=\"space-y-2 text-sm\">
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-green-500 rounded-full\"></span>
                <span>✅ Next.js 15 Setup</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-green-500 rounded-full\"></span>
                <span>✅ Ant Design + Radix UI Integration</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-green-500 rounded-full\"></span>
                <span>✅ Employee Card Component</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-green-500 rounded-full\"></span>
                <span>✅ TypeScript Types</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-green-500 rounded-full\"></span>
                <span>✅ API Service Layer</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-green-500 rounded-full\"></span>
                <span>✅ React Query Hooks</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-blue-500 rounded-full\"></span>
                <span>🔄 Neue Features: Kleidungsgrößen implementiert</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-blue-500 rounded-full\"></span>
                <span>🔄 Neue Features: Beschäftigungsart \"Sonstige\" mit Freitext</span>
              </div>
              <div className=\"flex items-center space-x-2\">
                <span className=\"w-3 h-3 bg-blue-500 rounded-full\"></span>
                <span>🔄 Onboarding Email Status Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}