/**
 * Employees Page - Live API Integration Test
 * Tests the complete Frontend ↔ Backend integration
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, Button, message, Modal, Form, Input, Select, Space } from 'antd';
import { UserAddOutlined, ReloadOutlined } from '@ant-design/icons';
import { antdTheme } from '../../lib/antd-theme';
import { useEmployees, useCreateEmployee } from '../../features/hr/hooks/useEmployees';
import { EmployeeCardSimple } from '../../features/hr/components/EmployeeCardSimple';
import { CreateEmployeeRequest, EmploymentType, UserRole } from '../../features/hr/types/employee';
import { HRthisLayout } from '../../components/layout/HRthisLayout';

// Query Client Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface CreateEmployeeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const createEmployeeMutation = useCreateEmployee();

  const handleSubmit = async (values: any) => {
    try {
      const employeeData: CreateEmployeeRequest = {
        ...values,
        sendOnboardingEmail: values.sendOnboardingEmail || false,
        onboardingPreset: values.sendOnboardingEmail ? 'default' : undefined,
        startDate: new Date().toISOString(),
        vacationDays: 30,
      };

      await createEmployeeMutation.mutateAsync(employeeData);
      form.resetFields();
      onSuccess();
      message.success('Mitarbeiter erfolgreich erstellt!');
    } catch (error: any) {
      message.error(error.message || 'Fehler beim Erstellen');
    }
  };

  return (
    <Modal
      title="Neuen Mitarbeiter erstellen"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          role: UserRole.USER,
          employmentType: EmploymentType.FULLTIME,
        }}
      >
        <Form.Item
          name="firstName"
          label="Vorname"
          rules={[{ required: true, message: 'Bitte Vorname eingeben' }]}
        >
          <Input placeholder="Max" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Nachname"
          rules={[{ required: true, message: 'Bitte Nachname eingeben' }]}
        >
          <Input placeholder="Mustermann" />
        </Form.Item>

        <Form.Item
          name="employeeNumber"
          label="Mitarbeiternummer"
          rules={[{ required: true, message: 'Bitte Mitarbeiternummer eingeben' }]}
        >
          <Input placeholder="EMP001" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-Mail"
          rules={[
            { required: true, message: 'Bitte E-Mail eingeben' },
            { type: 'email', message: 'Ungültige E-Mail' }
          ]}
        >
          <Input placeholder="max.mustermann@company.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Passwort"
          rules={[{ required: true, message: 'Bitte Passwort eingeben' }]}
        >
          <Input.Password placeholder="Mindestens 8 Zeichen" />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: 'Bitte Position eingeben' }]}
        >
          <Input placeholder="Developer" />
        </Form.Item>

        <Form.Item name="department" label="Abteilung">
          <Input placeholder="IT" />
        </Form.Item>

        <Form.Item name="employmentType" label="Beschäftigungsart">
          <Select>
            <Select.Option value={EmploymentType.FULLTIME}>Vollzeit</Select.Option>
            <Select.Option value={EmploymentType.PARTTIME}>Teilzeit</Select.Option>
            <Select.Option value={EmploymentType.MINIJOB}>Minijob</Select.Option>
            <Select.Option value={EmploymentType.INTERN}>Praktikant</Select.Option>
            <Select.Option value={EmploymentType.OTHER}>Sonstige</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="role" label="Rolle">
          <Select>
            <Select.Option value={UserRole.USER}>Mitarbeiter</Select.Option>
            <Select.Option value={UserRole.ADMIN}>Admin</Select.Option>
            <Select.Option value={UserRole.SUPERADMIN}>Super Admin</Select.Option>
          </Select>
        </Form.Item>

        {/* NEW: Clothing Sizes */}
        <div style={{ marginBottom: 16 }}>
          <h4>Kleidungsgrößen (optional)</h4>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name={['clothingSizes', 'top']} style={{ marginBottom: 0, flex: 1 }}>
              <Input placeholder="Oberteil (L)" />
            </Form.Item>
            <Form.Item name={['clothingSizes', 'pants']} style={{ marginBottom: 0, flex: 1 }}>
              <Input placeholder="Hose (32)" />
            </Form.Item>
            <Form.Item name={['clothingSizes', 'shoes']} style={{ marginBottom: 0, flex: 1 }}>
              <Input placeholder="Schuhe (42)" />
            </Form.Item>
          </Space.Compact>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>Abbrechen</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createEmployeeMutation.isPending}
            >
              Erstellen
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

const EmployeesContent: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: employeesData, isLoading, error, refetch } = useEmployees();
  
  console.log('Employee Page Debug:', { employeesData, isLoading, error });

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Backend-Verbindung fehlgeschlagen
          </h2>
          <p className="text-gray-600 mb-4">
            Stelle sicher, dass das Backend auf http://localhost:8001 läuft
          </p>
          <Button type="primary" onClick={() => refetch()}>
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <HRthisLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mitarbeiter Verwaltung
            </h1>
            <p className="text-gray-600 mt-2">
              Live API Integration Test - Backend: http://localhost:8001
            </p>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isLoading}
            >
              Aktualisieren
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setShowCreateModal(true)}
            >
              Mitarbeiter hinzufügen
            </Button>
          </Space>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Integration Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Backend: http://localhost:8001</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Frontend: http://localhost:3001</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>SQLite Datenbank: ✅</span>
            </div>
          </div>
        </div>

        {/* Employee List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Lade Mitarbeiter...</div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Mitarbeiter ({employeesData?.total || 0})
              </h2>
            </div>

            {employeesData?.employees?.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-500 mb-4">
                  <UserAddOutlined style={{ fontSize: 48 }} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Noch keine Mitarbeiter
                </h3>
                <p className="text-gray-600 mb-6">
                  Erstelle den ersten Mitarbeiter, um die API-Integration zu testen.
                </p>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setShowCreateModal(true)}
                >
                  Ersten Mitarbeiter erstellen
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employeesData?.employees?.map((employee) => (
                  <EmployeeCardSimple
                    key={employee.id}
                    employee={employee}
                    onEdit={(emp) => message.info(`Edit: ${emp.fullName}`)}
                    onDelete={(emp) => message.info(`Delete: ${emp.fullName}`)}
                    onSendOnboarding={(emp) => message.info(`Onboarding: ${emp.fullName}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Modal */}
        <CreateEmployeeModal
          visible={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
        </div>
      </div>
    </HRthisLayout>
  );
};

export default function EmployeesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <EmployeesContent />
      </ConfigProvider>
    </QueryClientProvider>
  );
}