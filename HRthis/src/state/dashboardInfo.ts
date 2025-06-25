/**
 * Dashboard Info Store
 * 
 * Zustand store for managing dashboard info items that admins can upload
 * and users can view in their dashboard news section.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  DashboardInfoStore, 
  DashboardInfo, 
  DashboardInfoFile,
  CreateDashboardInfoForm,
  UpdateDashboardInfoForm,
  FileValidationResult,
  DashboardInfoFileType,
  SupportedMimeType,
  DashboardInfoStats
} from '../types/dashboardInfo';

/**
 * Default display configuration for dashboard info
 */
const defaultDisplayConfig = {
  maxItems: 5,
  showDescriptions: true,
  showDates: true,
  cardStyle: 'expanded' as const
};

/**
 * File type validation mapping
 */
const MIME_TYPE_MAP: Record<string, DashboardInfoFileType> = {
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/svg+xml': 'image',
  'application/pdf': 'pdf'
};

/**
 * Maximum file size (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Mock data for demonstration
 */
const mockDashboardInfoItems: DashboardInfo[] = [
  {
    id: 'info-1',
    title: 'Neues Urlaubsverfahren 2025',
    description: 'Ab sofort gelten neue Regelungen für die Urlaubsbeantragung. Bitte beachten Sie die aktualisierten Fristen und Verfahren.',
    file: {
      id: 'file-1',
      filename: 'urlaubsverfahren-2025.pdf',
      mimeType: 'application/pdf',
      type: 'pdf',
      size: 245760,
      data: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKE5ldWVzIFVybGF1YnN2ZXJmYWhyZW4gMjAyNSkKL1Byb2R1Y2VyIChIUlRoaXMpCi9DcmVhdGlvbkRhdGUgKEQ6MjAyNTA2MjQwMDAwMDBaKQo+PgplbmRvYmoK',
      uploadedAt: '2025-06-24T10:30:00Z'
    },
    isActive: true,
    createdAt: '2025-06-24T10:30:00Z',
    updatedAt: '2025-06-24T10:30:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'info-2',
    title: 'Team Building Event 2025',
    description: 'Freut euch auf unser jährliches Team Building Event! Mehr Details in der angehängten Einladung.',
    file: {
      id: 'file-2',
      filename: 'team-building-2025.jpg',
      mimeType: 'image/jpeg',
      type: 'image',
      size: 156720,
      data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      uploadedAt: '2025-06-23T14:15:00Z'
    },
    isActive: true,
    createdAt: '2025-06-23T14:15:00Z',
    updatedAt: '2025-06-23T14:15:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'info-3',
    title: 'Neue Bürozeiten',
    description: 'Ab dem 1. Juli gelten neue flexible Bürozeiten. Alle Details finden Sie im angehängten Dokument.',
    file: {
      id: 'file-3',
      filename: 'neue-buerozeiten.pdf',
      mimeType: 'application/pdf',
      type: 'pdf',
      size: 189440,
      data: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKE5ldWUgQsO8cm96ZWl0ZW4pCi9Qcm9kdWNlciAoSFJUaGlzKQovQ3JlYXRpb25EYXRlIChEOjIwMjUwNjIyMDAwMDAwWikKPj4KZW5kb2JqCg==',
      uploadedAt: '2025-06-22T09:00:00Z'
    },
    isActive: true,
    createdAt: '2025-06-22T09:00:00Z',
    updatedAt: '2025-06-22T09:00:00Z',
    createdBy: 'admin-1'
  }
];

/**
 * Dashboard Info Store Implementation
 */
export const useDashboardInfoStore = create<DashboardInfoStore>()(
  persist(
    (set, get) => ({
      // State
      items: mockDashboardInfoItems,
      uploadProgress: {},
      isLoading: false,
      error: null,
      displayConfig: defaultDisplayConfig,
      sortBy: 'newest',
      filters: {},

      // Actions
      loadItems: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { items } = get();
          // Filter out expired items
          const activeItems = items.filter(item => {
            if (!item.expiresAt) return true;
            return new Date(item.expiresAt) > new Date();
          });
          
          set({ items: activeItems, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load items',
            isLoading: false 
          });
        }
      },

      createItem: async (data: CreateDashboardInfoForm): Promise<DashboardInfo> => {
        if (!data.file) {
          throw new Error('File is required');
        }

        const { validateFile, fileToBase64 } = get();
        const validation = validateFile(data.file);
        
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        set({ isLoading: true, error: null });

        try {
          // Convert file to base64
          const base64Data = await fileToBase64(data.file);
          
          // Create file object
          const file: DashboardInfoFile = {
            id: uuidv4(),
            filename: data.file.name,
            mimeType: data.file.type as SupportedMimeType,
            type: validation.type!,
            size: data.file.size,
            data: base64Data,
            uploadedAt: new Date().toISOString()
          };

          // Create dashboard info item
          const newItem: DashboardInfo = {
            id: uuidv4(),
            title: data.title,
            description: data.description || undefined,
            file,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-admin', // TODO: Get from auth store
            expiresAt: data.expiresAt
          };

          const { items } = get();
          set({ 
            items: [newItem, ...items], 
            isLoading: false 
          });

          return newItem;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create item',
            isLoading: false 
          });
          throw error;
        }
      },

      updateItem: async (id: string, data: UpdateDashboardInfoForm): Promise<DashboardInfo> => {
        const { items, validateFile, fileToBase64 } = get();
        const itemIndex = items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
          throw new Error('Item not found');
        }

        set({ isLoading: true, error: null });

        try {
          const existingItem = items[itemIndex];
          let updatedFile = existingItem.file;

          // Handle file replacement
          if (data.file) {
            const validation = validateFile(data.file);
            if (!validation.isValid) {
              throw new Error(validation.error);
            }

            const base64Data = await fileToBase64(data.file);
            updatedFile = {
              id: uuidv4(),
              filename: data.file.name,
              mimeType: data.file.type as SupportedMimeType,
              type: validation.type!,
              size: data.file.size,
              data: base64Data,
              uploadedAt: new Date().toISOString()
            };
          }

          const updatedItem: DashboardInfo = {
            ...existingItem,
            title: data.title ?? existingItem.title,
            description: data.description !== undefined ? data.description : existingItem.description,
            file: updatedFile,
            isActive: data.isActive ?? existingItem.isActive,
            updatedAt: new Date().toISOString(),
            expiresAt: data.expiresAt !== undefined ? data.expiresAt : existingItem.expiresAt
          };

          const updatedItems = [...items];
          updatedItems[itemIndex] = updatedItem;

          set({ items: updatedItems, isLoading: false });
          return updatedItem;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update item',
            isLoading: false 
          });
          throw error;
        }
      },

      deleteItem: async (id: string): Promise<void> => {
        const { items } = get();
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const updatedItems = items.filter(item => item.id !== id);
          set({ items: updatedItems, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete item',
            isLoading: false 
          });
          throw error;
        }
      },

      toggleActive: async (id: string): Promise<void> => {
        const { items } = get();
        const itemIndex = items.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
          throw new Error('Item not found');
        }

        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const updatedItems = [...items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            isActive: !updatedItems[itemIndex].isActive,
            updatedAt: new Date().toISOString()
          };

          set({ items: updatedItems, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to toggle item',
            isLoading: false 
          });
          throw error;
        }
      },

      getActiveItems: (): DashboardInfo[] => {
        const { items, sortBy, filters } = get();
        
        let filteredItems = items.filter(item => {
          // Only active items
          if (!item.isActive) return false;
          
          // Check expiry
          if (item.expiresAt && new Date(item.expiresAt) <= new Date()) {
            return false;
          }

          // Apply filters
          if (filters.fileType && item.file.type !== filters.fileType) {
            return false;
          }

          if (filters.dateRange) {
            const createdDate = new Date(item.createdAt);
            const start = new Date(filters.dateRange.start);
            const end = new Date(filters.dateRange.end);
            if (createdDate < start || createdDate > end) {
              return false;
            }
          }

          return true;
        });

        // Apply sorting
        filteredItems.sort((a, b) => {
          switch (sortBy) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'title-asc':
              return a.title.localeCompare(b.title);
            case 'title-desc':
              return b.title.localeCompare(a.title);
            case 'size-asc':
              return a.file.size - b.file.size;
            case 'size-desc':
              return b.file.size - a.file.size;
            default:
              return 0;
          }
        });

        return filteredItems;
      },

      getStats: (): DashboardInfoStats => {
        const { items } = get();
        const now = new Date();
        
        const activeItems = items.filter(item => item.isActive);
        const expiredItems = items.filter(item => 
          item.expiresAt && new Date(item.expiresAt) <= now
        );
        
        const totalStorageUsed = items.reduce((total, item) => total + item.file.size, 0);
        const imageCount = items.filter(item => item.file.type === 'image').length;
        const pdfCount = items.filter(item => item.file.type === 'pdf').length;

        return {
          totalItems: items.length,
          activeItems: activeItems.length,
          expiredItems: expiredItems.length,
          totalStorageUsed,
          imageCount,
          pdfCount
        };
      },

      setSortBy: (sortBy) => {
        set({ sortBy });
      },

      setFilters: (newFilters) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },

      updateDisplayConfig: (config) => {
        const { displayConfig } = get();
        set({ displayConfig: { ...displayConfig, ...config } });
      },

      validateFile: (file: File): FileValidationResult => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          return {
            isValid: false,
            error: `Datei ist zu groß. Maximale Größe: ${get().formatFileSize(MAX_FILE_SIZE)}`
          };
        }

        // Check file type
        const fileType = MIME_TYPE_MAP[file.type];
        if (!fileType) {
          return {
            isValid: false,
            error: 'Nicht unterstützter Dateityp. Erlaubt sind: PNG, JPG, SVG, PDF'
          };
        }

        return {
          isValid: true,
          type: fileType
        };
      },

      fileToBase64: (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      },

      formatFileSize: (bytes: number): string => {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
    }),
    {
      name: 'dashboard-info-store',
      partialize: (state) => ({
        items: state.items,
        displayConfig: state.displayConfig,
        sortBy: state.sortBy,
        filters: state.filters
      })
    }
  )
);