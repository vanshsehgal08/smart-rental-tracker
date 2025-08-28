import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'available':
      return 'text-success-600 bg-success-50 border-success-200';
    case 'rented':
      return 'text-primary-600 bg-primary-50 border-primary-200';
    case 'maintenance':
      return 'text-warning-600 bg-warning-50 border-warning-200';
    case 'out_of_service':
      return 'text-danger-600 bg-danger-50 border-danger-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'low':
      return 'text-success-600 bg-success-50 border-success-200';
    case 'medium':
      return 'text-warning-600 bg-warning-50 border-warning-200';
    case 'high':
      return 'text-danger-600 bg-danger-50 border-danger-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isOverdue(endDate: string): boolean {
  const end = new Date(endDate);
  const now = new Date();
  return end < now;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
