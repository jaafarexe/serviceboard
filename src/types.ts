export type RequestStatus = 'new' | 'scheduled' | 'in_progress' | 'done';

export type PriorityLevel = 'normal' | 'urgent';

export interface ServiceRequest {
  id: string;
  customerName: string;
  phone?: string;
  email?: string;
  serviceType: string;
  date: string; // YYYY-MM-DD
  timeWindow: string; // e.g., "09:00 - 11:00 AM", "Morning (8am - 12pm)", etc.
  notes?: string;
  estimatedPrice?: number;
  priority?: PriorityLevel;
  status: RequestStatus;
  createdAt: number;
  updatedAt: number;
}

export type ViewMode = 'board' | 'today' | 'list';

export type DateFilterOption = 'all' | 'today' | 'tomorrow' | 'week' | 'custom';

export interface FilterState {
  status: RequestStatus | 'all';
  dateFilter: DateFilterOption;
  customDate?: string;
  serviceType: string;
  searchQuery: string;
}

export interface StatusConfig {
  key: RequestStatus;
  label: string;
  shortLabel: string;
  description: string;
  nextStatus?: RequestStatus;
  nextActionLabel?: string;
  prevStatus?: RequestStatus;
  prevActionLabel?: string;
  accentColor: string;
  surfaceColor: string;
  borderColor: string;
}

export const STATUS_CONFIGS: Record<RequestStatus, StatusConfig> = {
  new: {
    key: 'new',
    label: 'New Requests',
    shortLabel: 'New',
    description: 'Fresh inbound inquiries to review',
    nextStatus: 'scheduled',
    nextActionLabel: 'Schedule',
    accentColor: 'text-amber-700 dark:text-amber-300',
    surfaceColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800/60',
  },
  scheduled: {
    key: 'scheduled',
    label: 'Scheduled',
    shortLabel: 'Scheduled',
    description: 'Confirmed date & time window',
    prevStatus: 'new',
    prevActionLabel: 'To New',
    nextStatus: 'in_progress',
    nextActionLabel: 'Start Job',
    accentColor: 'text-blue-700 dark:text-blue-300',
    surfaceColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800/60',
  },
  in_progress: {
    key: 'in_progress',
    label: 'In Progress',
    shortLabel: 'In Progress',
    description: 'Currently being serviced',
    prevStatus: 'scheduled',
    prevActionLabel: 'Back to Scheduled',
    nextStatus: 'done',
    nextActionLabel: 'Mark Done',
    accentColor: 'text-purple-700 dark:text-purple-300',
    surfaceColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800/60',
  },
  done: {
    key: 'done',
    label: 'Done',
    shortLabel: 'Done',
    description: 'Completed & ready for pickup / billed',
    prevStatus: 'in_progress',
    prevActionLabel: 'Reopen Job',
    accentColor: 'text-emerald-700 dark:text-emerald-300',
    surfaceColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800/60',
  },
};

export const COMMON_SERVICES = [
  'General Service & Tune-up',
  'Bike Repair & Brake Bleed',
  'Dog Walking (60 min)',
  'Pet Sitting & Feeding',
  'Custom Baking & Pastry Order',
  'Lawn Mowing & Edging',
  'Garden Weeding & Pruning',
  'Workshop Restoration & Woodwork',
  'Appliance Diagnostic & Repair',
  'Home Deep Cleaning',
];

export const TIME_WINDOW_PRESETS = [
  '08:00 - 10:00 AM',
  '09:00 - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:30 - 03:30 PM',
  '03:30 - 05:30 PM',
  'Morning (8 AM - 12 PM)',
  'Afternoon (12 PM - 5 PM)',
  'Flexible / All Day',
];
