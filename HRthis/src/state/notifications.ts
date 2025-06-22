import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Notification {
  id: string;
  userId: string;
  type: 'leave_request' | 'leave_approved' | 'leave_rejected' | 'training_completed' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // ID of related entity (leave request, training, etc.)
}

interface NotificationsState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
  getNotificationsForUser: (userId: string) => Notification[];
  getUnreadNotificationsForUser: (userId: string) => Notification[];
  removeNotification: (notificationId: string) => void;
}

// Mock notifications - initially empty, will be populated when actions happen
const mockNotifications: Notification[] = [];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },

      markAsRead: (notificationId: string) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        }));
      },

      markAllAsRead: (userId: string) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.userId === userId
              ? { ...notification, isRead: true }
              : notification
          )
        }));
      },

      getUnreadCount: (userId: string) => {
        return get().notifications.filter(
          notification => notification.userId === userId && !notification.isRead
        ).length;
      },

      getNotificationsForUser: (userId: string) => {
        return get().notifications
          .filter(notification => notification.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getUnreadNotificationsForUser: (userId: string) => {
        return get().notifications
          .filter(notification => notification.userId === userId && !notification.isRead)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      removeNotification: (notificationId: string) => {
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.id !== notificationId
          )
        }));
      }
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        notifications: state.notifications
      }),
    }
  )
);