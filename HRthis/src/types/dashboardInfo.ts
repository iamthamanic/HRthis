/**
 * Dashboard Info Types
 * 
 * Type definitions for the dashboard info system that allows admins
 * to upload and manage files (images, PDFs) for display in user dashboards.
 */

/**
 * Supported file types for dashboard info uploads
 */
export type DashboardInfoFileType = 'image' | 'pdf';

/**
 * Supported image MIME types
 */
export type ImageMimeType = 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/svg+xml';

/**
 * Supported PDF MIME type
 */
export type PdfMimeType = 'application/pdf';

/**
 * All supported MIME types
 */
export type SupportedMimeType = ImageMimeType | PdfMimeType;

/**
 * File upload information
 */
export interface DashboardInfoFile {
  /** Unique identifier for the file */
  id: string;
  /** Original filename */
  filename: string;
  /** File MIME type */
  mimeType: SupportedMimeType;
  /** File type category */
  type: DashboardInfoFileType;
  /** File size in bytes */
  size: number;
  /** Base64 encoded file data (for demo purposes) */
  data: string;
  /** File URL (when using cloud storage) */
  url?: string;
  /** Upload timestamp */
  uploadedAt: string;
}

/**
 * Dashboard info item that will be displayed to users
 */
export interface DashboardInfo {
  /** Unique identifier */
  id: string;
  /** Title of the info item (required) */
  title: string;
  /** Optional description */
  description?: string;
  /** Attached file */
  file: DashboardInfoFile;
  /** Whether the info is currently active/visible */
  isActive: boolean;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** ID of admin who created this */
  createdBy: string;
  /** Optional expiry date for automatic deactivation */
  expiresAt?: string;
}

/**
 * Form data for creating new dashboard info
 */
export interface CreateDashboardInfoForm {
  /** Title of the info item */
  title: string;
  /** Optional description */
  description: string;
  /** File to upload */
  file: File | null;
  /** Optional expiry date */
  expiresAt?: string;
}

/**
 * Form data for updating existing dashboard info
 */
export interface UpdateDashboardInfoForm {
  /** Updated title */
  title?: string;
  /** Updated description */
  description?: string;
  /** Replacement file (optional) */
  file?: File | null;
  /** Updated expiry date */
  expiresAt?: string;
  /** Whether to activate/deactivate */
  isActive?: boolean;
}

/**
 * File upload validation result
 */
export interface FileValidationResult {
  /** Whether the file is valid */
  isValid: boolean;
  /** Error message if invalid */
  error?: string;
  /** File type if valid */
  type?: DashboardInfoFileType;
}

/**
 * Dashboard info display configuration
 */
export interface DashboardInfoDisplayConfig {
  /** Maximum number of items to show */
  maxItems: number;
  /** Whether to show descriptions */
  showDescriptions: boolean;
  /** Whether to show upload dates */
  showDates: boolean;
  /** Card layout style */
  cardStyle: 'compact' | 'expanded';
}

/**
 * File upload progress information
 */
export interface FileUploadProgress {
  /** File identifier */
  fileId: string;
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Whether upload is complete */
  isComplete: boolean;
  /** Error message if upload failed */
  error?: string;
}

/**
 * Dashboard info statistics for admin overview
 */
export interface DashboardInfoStats {
  /** Total number of info items */
  totalItems: number;
  /** Number of active items */
  activeItems: number;
  /** Number of expired items */
  expiredItems: number;
  /** Total storage used in bytes */
  totalStorageUsed: number;
  /** Number of image files */
  imageCount: number;
  /** Number of PDF files */
  pdfCount: number;
}

/**
 * Sort options for dashboard info list
 */
export type DashboardInfoSortOption = 
  | 'newest'
  | 'oldest' 
  | 'title-asc'
  | 'title-desc'
  | 'size-asc'
  | 'size-desc';

/**
 * Filter options for dashboard info list
 */
export interface DashboardInfoFilters {
  /** Filter by file type */
  fileType?: DashboardInfoFileType;
  /** Filter by active status */
  isActive?: boolean;
  /** Filter by creator */
  createdBy?: string;
  /** Filter by date range */
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Dashboard info store state
 */
export interface DashboardInfoState {
  /** All dashboard info items */
  items: DashboardInfo[];
  /** Currently uploading files */
  uploadProgress: Record<string, FileUploadProgress>;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Display configuration */
  displayConfig: DashboardInfoDisplayConfig;
  /** Current sort option */
  sortBy: DashboardInfoSortOption;
  /** Current filters */
  filters: DashboardInfoFilters;
}

/**
 * Dashboard info store actions
 */
export interface DashboardInfoActions {
  /** Load all dashboard info items */
  loadItems: () => Promise<void>;
  /** Create new dashboard info item */
  createItem: (data: CreateDashboardInfoForm) => Promise<DashboardInfo>;
  /** Update existing dashboard info item */
  updateItem: (id: string, data: UpdateDashboardInfoForm) => Promise<DashboardInfo>;
  /** Delete dashboard info item */
  deleteItem: (id: string) => Promise<void>;
  /** Toggle active status */
  toggleActive: (id: string) => Promise<void>;
  /** Get active items for user dashboard */
  getActiveItems: () => DashboardInfo[];
  /** Get statistics */
  getStats: () => DashboardInfoStats;
  /** Update sort option */
  setSortBy: (sortBy: DashboardInfoSortOption) => void;
  /** Update filters */
  setFilters: (filters: Partial<DashboardInfoFilters>) => void;
  /** Update display configuration */
  updateDisplayConfig: (config: Partial<DashboardInfoDisplayConfig>) => void;
  /** Validate file for upload */
  validateFile: (file: File) => FileValidationResult;
  /** Convert file to base64 */
  fileToBase64: (file: File) => Promise<string>;
  /** Calculate file size in human readable format */
  formatFileSize: (bytes: number) => string;
}

/**
 * Complete dashboard info store type
 */
export type DashboardInfoStore = DashboardInfoState & DashboardInfoActions;