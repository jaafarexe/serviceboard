import { ServiceRequest } from '../types.ts';
import { getInitialRequests } from '../data/initialData.ts';

const STORAGE_KEY = 'serviceboard_requests_v1';

export function loadRequestsFromStorage(): ServiceRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialRequests();
      saveRequestsToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getInitialRequests();
  } catch (error) {
    console.warn('Failed to parse saved requests from localStorage, resetting to initial', error);
    return getInitialRequests();
  }
}

export function saveRequestsToStorage(requests: ServiceRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to save requests to localStorage', error);
  }
}

export function exportRequestsAsJSON(requests: ServiceRequest[]): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(requests, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `serviceboard-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importRequestsFromJSON(
  file: File,
  onSuccess: (imported: ServiceRequest[]) => void,
  onError: (errMsg: string) => void
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        // Validate items loosely
        const valid = parsed.filter(
          (item) => item && typeof item.customerName === 'string' && typeof item.serviceType === 'string'
        );
        if (valid.length === 0) {
          onError('The selected JSON file did not contain any valid service requests.');
          return;
        }
        saveRequestsToStorage(valid);
        onSuccess(valid);
      } else {
        onError('Invalid file format. Expected a JSON array of requests.');
      }
    } catch {
      onError('Unable to parse JSON file. Please ensure it is a valid backup.');
    }
  };
  reader.onerror = () => {
    onError('Failed to read the selected file.');
  };
  reader.readAsText(file);
}
