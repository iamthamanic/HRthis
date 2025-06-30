/**
 * Employee Card Component
 * Migrated from HRthis - Modern version with Radix UI + Ant Design theming
 */

import React from 'react';
import { Badge, Tag, Tooltip } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CalendarOutlined,
  TruckOutlined,
  ShirtOutlined 
} from '@ant-design/icons';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Employee, EmployeeStatus, EmploymentType, UserRole } from '../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onSendOnboarding?: (employee: Employee) => void;
  showActions?: boolean;
  compact?: boolean;
}

// Status-Farben für Badges
const getStatusColor = (status: EmployeeStatus) => {
  switch (status) {
    case EmployeeStatus.ACTIVE:
      return 'success';
    case EmployeeStatus.PROBATION:
      return 'warning';
    case EmployeeStatus.INACTIVE:
      return 'default';
    case EmployeeStatus.TERMINATED:
      return 'error';
    default:
      return 'default';
  }
};

// Employment Type Display
const getEmploymentTypeDisplay = (employee: Employee) => {
  if (employee.employmentType === EmploymentType.OTHER && employee.employmentTypeCustom) {
    return employee.employmentTypeCustom;
  }
  
  const typeMap = {
    [EmploymentType.FULLTIME]: 'Vollzeit',
    [EmploymentType.PARTTIME]: 'Teilzeit',
    [EmploymentType.MINIJOB]: 'Minijob',
    [EmploymentType.INTERN]: 'Praktikant',
    [EmploymentType.OTHER]: 'Sonstige'
  };
  
  return typeMap[employee.employmentType];
};

// Role Display
const getRoleDisplay = (role: UserRole) => {
  const roleMap = {
    [UserRole.USER]: 'Mitarbeiter',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.SUPERADMIN]: 'Super Admin'
  };
  
  return roleMap[role];
};

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onSendOnboarding,
  showActions = true,
  compact = false
}) => {
  const hasClothingSizes = employee.clothingSizes && 
    (employee.clothingSizes.top || employee.clothingSizes.pants || employee.clothingSizes.shoes);

  if (compact) {
    return (
      <Card className=\"w-full hover:shadow-md transition-shadow\">
        <CardContent className=\"p-4\">
          <div className=\"flex items-center justify-between\">
            <div className=\"flex items-center space-x-3\">
              <div className=\"w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center\">
                <UserOutlined className=\"text-blue-600\" />
              </div>
              <div>
                <h3 className=\"font-semibold text-gray-900\">{employee.fullName}</h3>
                <p className=\"text-sm text-gray-500\">{employee.position}</p>
              </div>
            </div>
            <div className=\"flex items-center space-x-2\">
              <Badge 
                status={getStatusColor(employee.status) as any} 
                text={employee.status}
              />
              {employee.isAdmin && (
                <Tag color=\"blue\">{getRoleDisplay(employee.role)}</Tag>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className=\"w-full hover:shadow-lg transition-shadow duration-200\">
      <CardHeader className=\"pb-3\">
        <div className=\"flex items-start justify-between\">
          <div className=\"flex items-center space-x-3\">
            <div className=\"w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center\">
              <span className=\"text-white font-bold text-lg\">
                {employee.firstName[0]}{employee.lastName[0]}
              </span>
            </div>
            <div>
              <h3 className=\"text-lg font-semibold text-gray-900\">{employee.fullName}</h3>
              <p className=\"text-sm text-gray-500\">#{employee.employeeNumber}</p>
            </div>
          </div>
          
          <div className=\"flex flex-col items-end space-y-1\">
            <Badge 
              status={getStatusColor(employee.status) as any} 
              text={employee.status}
            />
            {employee.isAdmin && (
              <Tag color=\"blue\">{getRoleDisplay(employee.role)}</Tag>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className=\"space-y-4\">
        {/* Contact Info */}
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-3 text-sm\">
          <div className=\"flex items-center space-x-2 text-gray-600\">
            <MailOutlined className=\"text-blue-500\" />
            <span>{employee.email}</span>
          </div>
          {employee.phone && (
            <div className=\"flex items-center space-x-2 text-gray-600\">
              <PhoneOutlined className=\"text-green-500\" />
              <span>{employee.phone}</span>
            </div>
          )}
        </div>

        {/* Employment Details */}
        <div className=\"bg-gray-50 rounded-lg p-3 space-y-2\">
          <div className=\"flex items-center justify-between text-sm\">
            <span className=\"text-gray-600\">Position:</span>
            <span className=\"font-medium\">{employee.position}</span>
          </div>
          
          <div className=\"flex items-center justify-between text-sm\">
            <span className=\"text-gray-600\">Abteilung:</span>
            <span className=\"font-medium\">{employee.department || 'Nicht zugewiesen'}</span>
          </div>
          
          <div className=\"flex items-center justify-between text-sm\">
            <span className=\"text-gray-600\">Beschäftigungsart:</span>
            <span className=\"font-medium\">{getEmploymentTypeDisplay(employee)}</span>
          </div>
          
          <div className=\"flex items-center justify-between text-sm\">
            <span className=\"text-gray-600 flex items-center space-x-1\">
              <CalendarOutlined />
              <span>Eintritt:</span>
            </span>
            <span className=\"font-medium\">
              {new Date(employee.startDate).toLocaleDateString('de-DE')}
            </span>
          </div>
        </div>

        {/* NEW: Clothing Sizes */}
        {hasClothingSizes && (
          <div className=\"bg-blue-50 rounded-lg p-3\">
            <div className=\"flex items-center space-x-2 mb-2\">
              <ShirtOutlined className=\"text-blue-600\" />
              <span className=\"text-sm font-medium text-blue-800\">Kleidungsgrößen</span>
            </div>
            <div className=\"grid grid-cols-3 gap-2 text-xs\">
              {employee.clothingSizes?.top && (
                <div className=\"text-center\">
                  <div className=\"text-gray-600\">Oberteil</div>
                  <div className=\"font-medium\">{employee.clothingSizes.top}</div>
                </div>
              )}
              {employee.clothingSizes?.pants && (
                <div className=\"text-center\">
                  <div className=\"text-gray-600\">Hose</div>
                  <div className=\"font-medium\">{employee.clothingSizes.pants}</div>
                </div>
              )}
              {employee.clothingSizes?.shoes && (
                <div className=\"text-center\">
                  <div className=\"text-gray-600\">Schuhe</div>
                  <div className=\"font-medium\">{employee.clothingSizes.shoes}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onboarding Status */}
        {!employee.onboardingCompleted && (
          <div className=\"bg-orange-50 border border-orange-200 rounded-lg p-3\">
            <div className=\"flex items-center justify-between\">
              <div className=\"flex items-center space-x-2\">
                <TruckOutlined className=\"text-orange-600\" />
                <span className=\"text-sm text-orange-800\">
                  {employee.onboardingEmailSent ? 'Onboarding läuft' : 'Onboarding ausstehend'}
                </span>
              </div>
              {!employee.onboardingEmailSent && onSendOnboarding && (
                <Button 
                  size=\"sm\"
                  variant=\"outline\"
                  onClick={() => onSendOnboarding(employee)}
                  className=\"text-orange-600 border-orange-300 hover:bg-orange-100\"
                >
                  Email senden
                </Button>
              )}
            </div>
            {employee.onboardingEmailSent && (
              <p className=\"text-xs text-orange-600 mt-1\">
                Email gesendet: {new Date(employee.onboardingEmailSent).toLocaleDateString('de-DE')}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className=\"flex justify-end space-x-2 pt-2 border-t\">
            {onEdit && (
              <Button variant=\"outline\" size=\"sm\" onClick={() => onEdit(employee)}>
                Bearbeiten
              </Button>
            )}
            {onDelete && (
              <Button 
                variant=\"outline\" 
                size=\"sm\" 
                onClick={() => onDelete(employee)}
                className=\"text-red-600 border-red-300 hover:bg-red-50\"
              >
                Löschen
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};