/**
 * File Upload Component für HR-Dokumente
 */

import React, { useState } from 'react';
import { 
  Upload, 
  Button, 
  List, 
  Tag, 
  Modal, 
  Select, 
  Input, 
  message,
  Progress,
  Space,
  Typography
} from 'antd';
import { 
  UploadOutlined, 
  DeleteOutlined, 
  DownloadOutlined,
  EyeOutlined,
  FileOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

// File categories for HR documents
const FILE_CATEGORIES = [
  { value: 'profile_photo', label: 'Profilbild' },
  { value: 'contract', label: 'Arbeitsvertrag' },
  { value: 'id_document', label: 'Ausweisdokument' },
  { value: 'drivers_license', label: 'Führerschein' },
  { value: 'insurance_card', label: 'Krankenkassenkarte' },
  { value: 'bank_details', label: 'Bankverbindung' },
  { value: 'application_docs', label: 'Bewerbungsunterlagen' },
  { value: 'certificate', label: 'Zertifikat/Abschluss' },
  { value: 'medical_record', label: 'Gesundheitszeugnis' },
  { value: 'training_record', label: 'Schulungsnachweis' },
  { value: 'other', label: 'Sonstiges' }
];

interface FileUploadProps {
  employeeId?: string;
  onUploadSuccess?: (file: any) => void;
  onDeleteSuccess?: (fileId: string) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface UploadedFile {
  id: string;
  filename: string;
  fileSize: number;
  fileSizeMB: number;
  mimeType: string;
  category: string;
  description?: string;
  uploadedAt: string;
  isImage: boolean;
  isDocument: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  employeeId,
  onUploadSuccess,
  onDeleteSuccess,
  maxFiles = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif']
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('other');
  const [description, setDescription] = useState<string>('');

  // Upload file to backend
  const handleUpload = async (file: File) => {
    if (uploadedFiles.length >= maxFiles) {
      message.error(`Maximum ${maxFiles} Dateien erlaubt`);
      return false;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedCategory) formData.append('category', selectedCategory);
      if (description) formData.append('description', description);
      if (employeeId) formData.append('employee_id', employeeId);

      // Simulate progress (in real implementation, use XMLHttpRequest for progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload fehlgeschlagen');
      }

      const uploadedFile = await response.json();
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
      onUploadSuccess?.(uploadedFile);
      
      message.success('Datei erfolgreich hochgeladen');
      setUploadModalVisible(false);
      setDescription('');
      
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload fehlgeschlagen');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }

    return false; // Prevent default upload
  };

  // Delete file
  const handleDelete = async (fileId: string) => {
    Modal.confirm({
      title: 'Datei löschen',
      content: 'Möchten Sie diese Datei wirklich löschen?',
      okText: 'Löschen',
      okType: 'danger',
      cancelText: 'Abbrechen',
      onOk: async () => {
        try {
          const response = await fetch(`/api/files/${fileId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (!response.ok) {
            throw new Error('Löschen fehlgeschlagen');
          }

          setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
          onDeleteSuccess?.(fileId);
          message.success('Datei erfolgreich gelöscht');

        } catch (error) {
          console.error('Delete error:', error);
          message.error('Löschen fehlgeschlagen');
        }
      }
    });
  };

  // Download file
  const handleDownload = (fileId: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `/api/files/${fileId}/download`;
    link.download = filename;
    link.click();
  };

  // Get file icon based on type
  const getFileIcon = (file: UploadedFile) => {
    if (file.isImage) return '🖼️';
    if (file.isDocument) return '📄';
    return '📁';
  };

  // Get category display name
  const getCategoryName = (category: string) => {
    const cat = FILE_CATEGORIES.find(c => c.value === category);
    return cat?.label || category;
  };

  const uploadProps: UploadProps = {
    accept: acceptedTypes.join(','),
    beforeUpload: handleUpload,
    showUploadList: false,
    multiple: false
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            onClick={() => setUploadModalVisible(true)}
            disabled={uploadedFiles.length >= maxFiles}
          >
            Datei hochladen
          </Button>
          <Text type="secondary">
            {uploadedFiles.length}/{maxFiles} Dateien
          </Text>
        </Space>
      </div>

      {/* File List */}
      <List
        dataSource={uploadedFiles}
        renderItem={(file) => (
          <List.Item
            actions={[
              <Button 
                type="text" 
                icon={<EyeOutlined />}
                onClick={() => handleDownload(file.id, file.filename)}
                title="Ansehen/Download"
              />,
              <Button 
                type="text" 
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(file.id, file.filename)}
                title="Download"
              />,
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(file.id)}
                title="Löschen"
              />
            ]}
          >
            <List.Item.Meta
              avatar={<span style={{ fontSize: 20 }}>{getFileIcon(file)}</span>}
              title={
                <Space>
                  <span>{file.filename}</span>
                  <Tag color="blue">{getCategoryName(file.category)}</Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">
                    {file.fileSizeMB} MB • {file.mimeType}
                  </Text>
                  {file.description && (
                    <Text type="secondary">{file.description}</Text>
                  )}
                  <Text type="secondary">
                    Hochgeladen: {new Date(file.uploadedAt).toLocaleString()}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'Keine Dateien hochgeladen' }}
      />

      {/* Upload Modal */}
      <Modal
        title="Datei hochladen"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Kategorie:</label>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
            >
              {FILE_CATEGORIES.map(cat => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Beschreibung (optional):</label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Zusätzliche Informationen zur Datei..."
              rows={3}
            />
          </div>

          {uploading && (
            <div style={{ marginBottom: 16 }}>
              <Progress percent={uploadProgress} />
            </div>
          )}

          <Upload {...uploadProps}>
            <Button 
              icon={<UploadOutlined />} 
              loading={uploading}
              style={{ width: '100%' }}
            >
              {uploading ? 'Wird hochgeladen...' : 'Datei auswählen'}
            </Button>
          </Upload>

          <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
            <p>Erlaubte Dateitypen: {acceptedTypes.join(', ')}</p>
            <p>Maximale Dateigröße: 10 MB</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};