/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ServiceRequest, 
  RequestStatus, 
  ViewMode, 
  FilterState, 
  DateFilterOption 
} from './types.ts';
import { getInitialRequests } from './data/initialData.ts';
import { 
  loadRequestsFromStorage, 
  saveRequestsToStorage, 
  exportRequestsAsJSON, 
  importRequestsFromJSON 
} from './utils/storage.ts';
import { 
  getTodayString, 
  isToday, 
  isTomorrow, 
  isWithinWeek 
} from './utils/dateUtils.ts';
import { Header } from './components/Header.tsx';
import { SummaryCounts } from './components/SummaryCounts.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { BoardView } from './components/BoardView.tsx';
import { TodayView } from './components/TodayView.tsx';
import { ListView } from './components/ListView.tsx';
import { RequestModal } from './components/RequestModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { PrintWorkSheetModal } from './components/PrintWorkSheetModal.tsx';

export default function App() {
  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    return loadRequestsFromStorage();
  });

  const [viewMode, setViewMode] = useState<ViewMode>('board');

  const [filter, setFilter] = useState<FilterState>({
    status: 'all',
    dateFilter: 'all',
    serviceType: 'all',
    searchQuery: '',
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<RequestStatus>('new');
  
  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Print worksheet modal state
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Sync to localStorage
  useEffect(() => {
    saveRequestsToStorage(requests);
  }, [requests]);

  // Extract distinct service types for filtering
  const uniqueServiceTypes = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (r.serviceType) set.add(r.serviceType);
    });
    return Array.from(set).sort();
  }, [requests]);

  // Compute counts
  const counts = useMemo(() => {
    const today = getTodayString();
    let newCount = 0;
    let scheduledCount = 0;
    let inProgressCount = 0;
    let doneCount = 0;
    let todayCount = 0;

    requests.forEach((r) => {
      if (r.status === 'new') newCount++;
      else if (r.status === 'scheduled') scheduledCount++;
      else if (r.status === 'in_progress') inProgressCount++;
      else if (r.status === 'done') doneCount++;

      if (r.date === today) todayCount++;
    });

    return {
      total: requests.length,
      open: newCount + scheduledCount + inProgressCount,
      new: newCount,
      scheduled: scheduledCount,
      in_progress: inProgressCount,
      done: doneCount,
      today: todayCount,
    };
  }, [requests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Status filter
      if (filter.status !== 'all' && r.status !== filter.status) {
        return false;
      }

      // Date filter
      if (filter.dateFilter === 'today' && !isToday(r.date)) {
        return false;
      }
      if (filter.dateFilter === 'tomorrow' && !isTomorrow(r.date)) {
        return false;
      }
      if (filter.dateFilter === 'week' && !isWithinWeek(r.date)) {
        return false;
      }
      if (filter.dateFilter === 'custom' && filter.customDate && r.date !== filter.customDate) {
        return false;
      }

      // Service type filter
      if (filter.serviceType !== 'all' && r.serviceType !== filter.serviceType) {
        return false;
      }

      // Customer name / notes search
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchesName = r.customerName.toLowerCase().includes(q);
        const matchesService = r.serviceType.toLowerCase().includes(q);
        const matchesNotes = r.notes?.toLowerCase().includes(q);
        const matchesPhone = r.phone?.toLowerCase().includes(q);
        if (!matchesName && !matchesService && !matchesNotes && !matchesPhone) {
          return false;
        }
      }

      return true;
    });
  }, [requests, filter]);

  // Status Change Handler (One-Click)
  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: Date.now() } : r))
    );
    const target = requests.find((r) => r.id === id);
    const label = newStatus === 'in_progress' ? 'In Progress' : newStatus.toUpperCase();
    showToast(`Updated "${target?.customerName || 'Request'}" to ${label}`);
  };

  // Add or Edit Request
  const handleSaveRequest = (
    data: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    const now = Date.now();
    if (id) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data, updatedAt: now } : r))
      );
      showToast(`Updated request for "${data.customerName}"`);
    } else {
      const newRequest: ServiceRequest = {
        ...data,
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      };
      setRequests((prev) => [newRequest, ...prev]);
      showToast(`Added request for "${data.customerName}"`);
    }
  };

  // Open Edit Modal
  const handleEditRequest = (request: ServiceRequest) => {
    setEditingRequest(request);
    setModalOpen(true);
  };

  // Open Add Modal
  const handleOpenNew = (status: RequestStatus = 'new') => {
    setEditingRequest(null);
    setDefaultStatusForNew(status);
    setModalOpen(true);
  };

  // Delete Handlers
  const handleDeletePrompt = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setRequests((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast(`Deleted request for "${deleteTarget.name}"`);
      setDeleteTarget(null);
    }
  };

  // Reset to initial demo requests
  const handleResetDemo = () => {
    const initial = getInitialRequests();
    setRequests(initial);
    saveRequestsToStorage(initial);
    setFilter({
      status: 'all',
      dateFilter: 'all',
      serviceType: 'all',
      searchQuery: '',
    });
    showToast('Reset to 3 demo example requests');
  };

  // Export JSON
  const handleExport = () => {
    exportRequestsAsJSON(requests);
    showToast('Downloaded requests backup');
  };

  // Import JSON
  const handleImport = (file: File) => {
    importRequestsFromJSON(
      file,
      (imported) => {
        setRequests(imported);
        showToast(`Imported ${imported.length} requests successfully`);
      },
      (error) => {
        showToast(`Import failed: ${error}`);
      }
    );
  };

  // Quick switch from summary count bar
  const handleSummaryStatusSelect = (st: RequestStatus | 'all') => {
    setFilter((prev) => ({ ...prev, status: st }));
    if (viewMode === 'today') {
      setViewMode('board');
    }
  };

  const handleSelectToday = () => {
    setViewMode('today');
  };

  return (
    <div className="min-h-screen bg-neutral-100/50 text-neutral-900 flex flex-col font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Top Header Contract */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewRequest={() => handleOpenNew('new')}
        todayCount={counts.today}
        totalCount={counts.total}
        onExport={handleExport}
        onImport={handleImport}
        onResetDemo={handleResetDemo}
        onPrintSheet={() => setPrintModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Simple Summary Counts Banner */}
        <SummaryCounts
          counts={counts}
          activeStatusFilter={filter.status}
          onSelectStatus={handleSummaryStatusSelect}
          onSelectToday={handleSelectToday}
          isTodayActive={viewMode === 'today'}
        />

        {/* Filter & Search Bar (displayed in board & list modes) */}
        {viewMode !== 'today' && (
          <FilterBar
            filter={filter}
            onChange={(updated) => setFilter((prev) => ({ ...prev, ...updated }))}
            onReset={() =>
              setFilter({
                status: 'all',
                dateFilter: 'all',
                serviceType: 'all',
                searchQuery: '',
              })
            }
            serviceTypes={uniqueServiceTypes}
            totalMatches={filteredRequests.length}
          />
        )}

        {/* View Router */}
        {viewMode === 'board' && (
          <BoardView
            requests={filteredRequests}
            onStatusChange={handleStatusChange}
            onEdit={handleEditRequest}
            onDelete={handleDeletePrompt}
            onAddWithStatus={(st) => handleOpenNew(st)}
          />
        )}

        {viewMode === 'today' && (
          <TodayView
            requests={requests}
            onStatusChange={handleStatusChange}
            onEdit={handleEditRequest}
            onDelete={handleDeletePrompt}
            onAddNewToday={() => handleOpenNew('scheduled')}
            onViewAll={() => setViewMode('board')}
          />
        )}

        {viewMode === 'list' && (
          <ListView
            requests={filteredRequests}
            onStatusChange={handleStatusChange}
            onEdit={handleEditRequest}
            onDelete={handleDeletePrompt}
            onAddNew={() => handleOpenNew('new')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <div>
            <span className="font-semibold text-neutral-700">ServiceBoard</span> — Small service business request organizer.
          </div>
          <div className="flex items-center gap-4">
            <span>Data stored locally in browser</span>
            <span>·</span>
            <button
              type="button"
              onClick={handleResetDemo}
              className="hover:text-neutral-800 underline underline-offset-2"
            >
              Reset to 3 demo requests
            </button>
          </div>
        </div>
      </footer>

      {/* Add / Edit Request Modal */}
      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveRequest}
        initialData={editingRequest}
        defaultStatus={defaultStatusForNew}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        customerName={deleteTarget?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Printable Work Sheet Modal */}
      <PrintWorkSheetModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        requests={filteredRequests}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
