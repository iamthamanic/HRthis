/**
 * Employee List Screen mit neuen Backend-Features
 */

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Modal, 
  message,
  Tooltip,
  Card
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons';
import { employeeAPI } from '../services/api';
import type { Employee, EmployeeFilters } from '../types/employee';

const { Option } = Select;
const { Search } = Input;

interface EmployeeListScreenProps {
  onEmployeeSelect?: (employee: Employee) => void;
  onCreateEmployee?: () => void;
}

export const EmployeeListScreen: React.FC<EmployeeListScreenProps> = ({
  onEmployeeSelect,
  onCreateEmployee
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState<EmployeeFilters>({});

  // Load employees with filters
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getEmployees({
        ...filters,
        page,
        size: pageSize
      });
      
      setEmployees(response.employees);
      setTotal(response.total);
    } catch (error) {
      message.error('Fehler beim Laden der Mitarbeiterdaten');
      console.error('Load employees error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [filters, page]);

  // Handle search
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof EmployeeFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Send onboarding email
  const handleSendOnboardingEmail = async (employeeId: string, preset: string) => {
    try {
      await employeeAPI.sendOnboardingEmail(employeeId, preset);
      message.success('Onboarding-E-Mail erfolgreich versendet');
      loadEmployees(); // Refresh to show updated status
    } catch (error) {
      message.error('Fehler beim Versenden der E-Mail');
    }
  };

  // Delete employee
  const handleDeleteEmployee = (employeeId: string, employeeName: string) => {
    Modal.confirm({
      title: 'Mitarbeiter löschen',
      content: `Möchten Sie ${employeeName} wirklich löschen?`,
      okText: 'Löschen',
      okType: 'danger',
      cancelText: 'Abbrechen',
      onOk: async () => {
        try {
          await employeeAPI.deleteEmployee(employeeId);
          message.success('Mitarbeiter erfolgreich gelöscht');
          loadEmployees();
        } catch (error) {
          message.error('Fehler beim Löschen des Mitarbeiters');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Mitarbeiternummer',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      width: 120,
    },
    {
      title: 'Name',
      key: 'name',
      render: (record: Employee) => (
        <Space>
          <UserOutlined />
          <span>{record.fullName}</span>
        </Space>
      ),
    },
    {
      title: 'E-Mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Abteilung',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Beschäftigungsart',
      key: 'employmentType',
      render: (record: Employee) => (
        <Tag color="blue">
          {record.employmentTypeDisplay}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Employee) => {
        const statusColors = {
          active: 'green',
          probation: 'orange',
          inactive: 'red',
          terminated: 'default'
        };
        return (
          <Tag color={statusColors[record.status]}>
            {record.status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Onboarding',
      key: 'onboarding',
      render: (record: Employee) => (
        <Space>
          {record.onboardingCompleted ? (
            <Tag color="green">Abgeschlossen</Tag>
          ) : (
            <Tag color="orange">Ausstehend</Tag>
          )}
          {record.onboardingEmailSent && (
            <Tooltip title={`E-Mail gesendet: ${new Date(record.onboardingEmailSent).toLocaleString()}`}>
              <MailOutlined style={{ color: '#52c41a' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Aktionen',
      key: 'actions',
      width: 150,
      render: (record: Employee) => (
        <Space size="small">
          <Tooltip title="Bearbeiten">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => onEmployeeSelect?.(record)}
            />
          </Tooltip>
          <Tooltip title="Onboarding-E-Mail senden">
            <Button 
              type="text" 
              icon={<MailOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Onboarding-E-Mail senden',
                  content: 'Welche Vorlage möchten Sie verwenden?',
                  okText: 'Fahrer',
                  cancelText: 'Sachbearbeiter',
                  onOk: () => handleSendOnboardingEmail(record.id, 'driver'),
                  onCancel: () => handleSendOnboardingEmail(record.id, 'accounting')
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Löschen">
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteEmployee(record.id, record.fullName)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Search
              placeholder="Suche nach Name, E-Mail oder Mitarbeiternummer"
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Abteilung"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => handleFilterChange('department', value)}
            >
              <Option value="IT">IT</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Operations">Operations</Option>
            </Select>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="active">Aktiv</Option>
              <Option value="probation">Probezeit</Option>
              <Option value="inactive">Inaktiv</Option>
            </Select>
          </Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onCreateEmployee}
          >
            Neuer Mitarbeiter
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: setPage,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} von ${total} Mitarbeitern`,
        }}
      />
    </Card>
  );
};