// Basit bir toast hook
import { useState, useCallback } from "react";

type ToastVariant = "default" | "destructive" | "success";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface Toast extends ToastProps {
  id: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 3000 }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, title, description, variant, duration };

      setToasts(prev => [...prev, newToast]);

      // Otomatik kaldırma
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toast, dismiss, toasts };
}
