/**
 * Login Screen für HRthis Backend Integration
 */

import React, { useState } from 'react';
import { Form, Input, Button, Alert, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';

const { Title } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(values.username, values.password);
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.access_token);
      
      // Call success callback with user data
      onLoginSuccess(response.user);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login fehlgeschlagen';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>HRthis Login</Title>
          <p style={{ color: '#666', marginTop: 8 }}>
            Willkommen zurück! Bitte melden Sie sich an.
          </p>
        </div>

        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="E-Mail oder Mitarbeiternummer"
            rules={[
              { required: true, message: 'Bitte geben Sie Ihre E-Mail oder Mitarbeiternummer ein!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="E-Mail oder Mitarbeiternummer"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Passwort"
            rules={[
              { required: true, message: 'Bitte geben Sie Ihr Passwort ein!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Passwort"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', height: 40 }}
            >
              Anmelden
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <p style={{ color: '#666', fontSize: '12px' }}>
            HRthis v1.0 - Powered by Browo AI
          </p>
        </div>
      </Card>
    </div>
  );
};