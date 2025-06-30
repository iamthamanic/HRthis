/**
 * Employee Form Screen - Create/Edit Employee with all new features
 */

import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Card, 
  Row, 
  Col, 
  Switch, 
  InputNumber,
  message,
  Divider,
  Space,
  Typography
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { employeeAPI } from '../services/api';
import { 
  Employee, 
  EmployeeFormData, 
  EmploymentType, 
  EmployeeStatus, 
  UserRole,
  ClothingSizes,
  EmergencyContact
} from '../types/employee';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface EmployeeFormScreenProps {
  employee?: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export const EmployeeFormScreen: React.FC<EmployeeFormScreenProps> = ({
  employee,
  onSave,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showCustomEmploymentType, setShowCustomEmploymentType] = useState(false);

  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      // Set form values for editing
      form.setFieldsValue({
        ...employee,
        birthDate: employee.birthDate ? dayjs(employee.birthDate) : null,
        startDate: dayjs(employee.startDate),
        endDate: employee.endDate ? dayjs(employee.endDate) : null,
        probationEnd: employee.probationEnd ? dayjs(employee.probationEnd) : null,
        // Clothing sizes
        clothingTop: employee.clothingSizes?.top,
        clothingPants: employee.clothingSizes?.pants,
        clothingShoes: employee.clothingSizes?.shoes,
        // Emergency contact
        emergencyName: employee.emergencyContact?.name,
        emergencyPhone: employee.emergencyContact?.phone,
        emergencyRelation: employee.emergencyContact?.relation,
      });
      
      setShowCustomEmploymentType(employee.employmentType === EmploymentType.OTHER);
    }
  }, [employee, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    try {
      // Prepare data
      const formData: any = {
        ...values,
        birthDate: values.birthDate?.toISOString(),
        startDate: values.startDate.toISOString(),
        endDate: values.endDate?.toISOString(),
        probationEnd: values.probationEnd?.toISOString(),
      };

      // Handle clothing sizes
      if (values.clothingTop || values.clothingPants || values.clothingShoes) {
        formData.clothingSizes = {
          top: values.clothingTop,
          pants: values.clothingPants,
          shoes: values.clothingShoes,
        };
      }

      // Handle emergency contact
      if (values.emergencyName || values.emergencyPhone || values.emergencyRelation) {
        formData.emergencyContact = {
          name: values.emergencyName,
          phone: values.emergencyPhone,
          relation: values.emergencyRelation,
        };
      }

      // Remove temporary form fields
      delete formData.clothingTop;
      delete formData.clothingPants;
      delete formData.clothingShoes;
      delete formData.emergencyName;
      delete formData.emergencyPhone;
      delete formData.emergencyRelation;

      let savedEmployee: Employee;
      
      if (isEdit) {
        savedEmployee = await employeeAPI.updateEmployee(employee.id, formData);
        message.success('Mitarbeiter erfolgreich aktualisiert');
      } else {
        savedEmployee = await employeeAPI.createEmployee(formData);
        message.success('Mitarbeiter erfolgreich erstellt');
      }
      
      onSave(savedEmployee);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Fehler beim Speichern';
      message.error(errorMessage);
      console.error('Save employee error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmploymentTypeChange = (value: EmploymentType) => {
    setShowCustomEmploymentType(value === EmploymentType.OTHER);
    if (value !== EmploymentType.OTHER) {
      form.setFieldValue('employmentTypeCustom', undefined);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
            Zurück
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            {isEdit ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}
          </Title>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: EmployeeStatus.ACTIVE,
          role: UserRole.USER,
          vacationDays: 24,
          employmentType: EmploymentType.FULLTIME,
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Grunddaten" style={{ marginBottom: 24 }}>
              <Form.Item
                name="employeeNumber"
                label="Mitarbeiternummer"
                rules={[{ required: true, message: 'Bitte Mitarbeiternummer eingeben' }]}
              >
                <Input placeholder="z.B. E001" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="Vorname"
                    rules={[{ required: true, message: 'Bitte Vorname eingeben' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Nachname"
                    rules={[{ required: true, message: 'Bitte Nachname eingeben' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="E-Mail"
                rules={[
                  { required: true, message: 'Bitte E-Mail eingeben' },
                  { type: 'email', message: 'Ungültige E-Mail-Adresse' }
                ]}
              >
                <Input />
              </Form.Item>

              {!isEdit && (
                <Form.Item
                  name="password"
                  label="Passwort"
                  rules={[{ required: true, message: 'Bitte Passwort eingeben' }]}
                >
                  <Input.Password placeholder="Mindestens 6 Zeichen" />
                </Form.Item>
              )}

              <Form.Item name="birthDate" label="Geburtsdatum">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="phone" label="Telefon">
                <Input />
              </Form.Item>

              <Form.Item name="address" label="Adresse">
                <TextArea rows={3} />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Beschäftigung" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="position"
                    label="Position"
                    rules={[{ required: true, message: 'Bitte Position eingeben' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="department" label="Abteilung">
                    <Select allowClear>
                      <Option value="IT">IT</Option>
                      <Option value="HR">HR</Option>
                      <Option value="Finance">Finance</Option>
                      <Option value="Operations">Operations</Option>
                      <Option value="Sales">Sales</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="employmentType"
                label="Beschäftigungsart"
                rules={[{ required: true, message: 'Bitte Beschäftigungsart wählen' }]}
              >
                <Select onChange={handleEmploymentTypeChange}>
                  <Option value={EmploymentType.FULLTIME}>Vollzeit</Option>
                  <Option value={EmploymentType.PARTTIME}>Teilzeit</Option>
                  <Option value={EmploymentType.MINIJOB}>Minijob</Option>
                  <Option value={EmploymentType.INTERN}>Praktikant</Option>
                  <Option value={EmploymentType.OTHER}>Sonstige</Option>
                </Select>
              </Form.Item>

              {showCustomEmploymentType && (
                <Form.Item
                  name="employmentTypeCustom"
                  label="Sonstige Beschäftigungsart"
                  rules={[{ required: true, message: 'Bitte Art der Beschäftigung eingeben' }]}
                >
                  <Input placeholder="z.B. Werkstudent, Freelancer..." />
                </Form.Item>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startDate"
                    label="Einstellungsdatum"
                    rules={[{ required: true, message: 'Bitte Einstellungsdatum wählen' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="endDate" label="Enddatum">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="probationEnd" label="Ende Probezeit">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="status" label="Status">
                    <Select>
                      <Option value={EmployeeStatus.ACTIVE}>Aktiv</Option>
                      <Option value={EmployeeStatus.PROBATION}>Probezeit</Option>
                      <Option value={EmployeeStatus.INACTIVE}>Inaktiv</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="role" label="Rolle">
                    <Select>
                      <Option value={UserRole.USER}>Benutzer</Option>
                      <Option value={UserRole.ADMIN}>Administrator</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Card title="Kleidungsgrößen" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="clothingTop" label="Oberteil">
                    <Select allowClear>
                      <Option value="XS">XS</Option>
                      <Option value="S">S</Option>
                      <Option value="M">M</Option>
                      <Option value="L">L</Option>
                      <Option value="XL">XL</Option>
                      <Option value="XXL">XXL</Option>
                      <Option value="XXXL">XXXL</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="clothingPants" label="Hose">
                    <Input placeholder="z.B. 32, W32/L34" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="clothingShoes" label="Schuhe">
                    <Input placeholder="z.B. 42, 9.5" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Notfallkontakt" style={{ marginBottom: 24 }}>
              <Form.Item name="emergencyName" label="Name">
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="emergencyPhone" label="Telefon">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="emergencyRelation" label="Beziehung">
                    <Select allowClear>
                      <Option value="spouse">Ehepartner</Option>
                      <Option value="parent">Elternteil</Option>
                      <Option value="child">Kind</Option>
                      <Option value="sibling">Geschwister</Option>
                      <Option value="friend">Freund/in</Option>
                      <Option value="other">Sonstiges</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Card title="HR-Daten" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="salary" label="Gehalt (in Cent)">
                    <InputNumber 
                      style={{ width: '100%' }}
                      placeholder="z.B. 350000 für 3500€"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="vacationDays" label="Urlaubstage">
                    <InputNumber 
                      style={{ width: '100%' }}
                      min={0}
                      max={365}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Onboarding" style={{ marginBottom: 24 }}>
              <Form.Item 
                name="sendOnboardingEmail" 
                label="Onboarding-E-Mail senden"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="onboardingPreset"
                label="E-Mail-Vorlage"
                tooltip="Welche Onboarding-Vorlage soll verwendet werden?"
              >
                <Select allowClear>
                  <Option value="driver">Fahrer</Option>
                  <Option value="accounting">Sachbearbeiter</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="intern">Praktikant</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Space>
            <Button onClick={onCancel}>
              Abbrechen
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              {isEdit ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};