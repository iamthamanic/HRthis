/**
 * Main HR Application Component
 * Handles auth state and screen routing
 */

import React, { useState, useEffect } from 'react';
import { Layout, Spin, message } from 'antd';
import { LoginScreen } from './screens/LoginScreen';
import { EmployeeListScreen } from './screens/EmployeeListScreen';
import { EmployeeFormScreen } from './screens/EmployeeFormScreen';
import { authAPI } from './services/api';
import type { Employee } from './types/employee';

const { Content } = Layout;

enum Screen {
  LOGIN = 'login',
  EMPLOYEE_LIST = 'employee_list',
  EMPLOYEE_FORM = 'employee_form'
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  isAdmin: boolean;
}

export const HRApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setCurrentScreen(Screen.EMPLOYEE_LIST);
        } catch (error) {
          console.log('Auth check failed, user needs to login');
          localStorage.removeItem('auth_token');
          setCurrentScreen(Screen.LOGIN);
        }
      } else {
        setCurrentScreen(Screen.LOGIN);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setCurrentScreen(Screen.EMPLOYEE_LIST);
    message.success(`Willkommen zurück, ${userData.firstName}!`);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setCurrentScreen(Screen.LOGIN);
      message.success('Erfolgreich abgemeldet');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentScreen(Screen.EMPLOYEE_FORM);
  };

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setCurrentScreen(Screen.EMPLOYEE_FORM);
  };

  const handleEmployeeSave = (employee: Employee) => {
    setCurrentScreen(Screen.EMPLOYEE_LIST);
    setSelectedEmployee(null);
    message.success('Mitarbeiter erfolgreich gespeichert');
  };

  const handleCancel = () => {
    setCurrentScreen(Screen.EMPLOYEE_LIST);
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      
      case Screen.EMPLOYEE_LIST:
        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Layout.Header style={{ 
              background: '#fff', 
              padding: '0 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div>
                <h2 style={{ margin: 0 }}>HRthis - Mitarbeiterverwaltung</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>Willkommen, {user?.fullName}</span>
                <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Abmelden
                </a>
              </div>
            </Layout.Header>
            <Content style={{ padding: 24 }}>
              <EmployeeListScreen 
                onEmployeeSelect={handleEmployeeSelect}
                onCreateEmployee={handleCreateEmployee}
              />
            </Content>
          </Layout>
        );
      
      case Screen.EMPLOYEE_FORM:
        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Layout.Header style={{ 
              background: '#fff', 
              padding: '0 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div>
                <h2 style={{ margin: 0 }}>HRthis - Mitarbeiterverwaltung</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>Willkommen, {user?.fullName}</span>
                <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Abmelden
                </a>
              </div>
            </Layout.Header>
            <Content>
              <EmployeeFormScreen 
                employee={selectedEmployee || undefined}
                onSave={handleEmployeeSave}
                onCancel={handleCancel}
              />
            </Content>
          </Layout>
        );
      
      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return renderCurrentScreen();
};