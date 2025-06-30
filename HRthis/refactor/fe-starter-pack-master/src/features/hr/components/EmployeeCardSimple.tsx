import React from 'react';
import { Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface Employee {
  id: string;
  fullName: string;
  position: string;
  status: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onSendOnboarding?: (employee: Employee) => void;
}

export const EmployeeCardSimple: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onSendOnboarding
}) => {
  return (
    <div className="w-full p-4 border rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{employee.fullName}</h3>
            <p className="text-sm text-gray-500">{employee.position}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge status="success" text={employee.status} />
        </div>
      </div>
    </div>
  );
};