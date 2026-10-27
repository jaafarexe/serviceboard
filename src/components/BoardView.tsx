import React, { useState } from 'react';
import { ServiceRequest, RequestStatus, STATUS_CONFIGS } from '../types.ts';
import { RequestCard } from './RequestCard.tsx';
import { Plus } from 'lucide-react';

interface BoardViewProps {
  requests: ServiceRequest[];
  onStatusChange: (id: string, newStatus: RequestStatus) => void;
  onEdit: (request: ServiceRequest) => void;
  onDelete: (id: string, customerName: string) => void;
  onAddWithStatus: (status: RequestStatus) => void;
}

const COLUMNS: RequestStatus[] = ['new', 'scheduled', 'in_progress', 'done'];

export const BoardView: React.FC<BoardViewProps> = ({
  requests,
  onStatusChange,
  onEdit,
  onDelete,
  onAddWithStatus,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<RequestStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: RequestStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: RequestStatus) => {
    // Only reset if leaving current column boundary
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: RequestStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      onStatusChange(id, status);
    }
    setDraggedId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((colKey) => {
        const config = STATUS_CONFIGS[colKey];
        const colRequests = requests.filter((r) => r.status === colKey);
        const isDragOver = dragOverColumn === colKey;

        return (
          <div
            key={colKey}
            onDragOver={(e) => handleDragOver(e, colKey)}
            onDragLeave={(e) => handleDragLeave(e, colKey)}
            onDrop={(e) => handleDrop(e, colKey)}
            className={`flex flex-col bg-neutral-100/70 rounded-xl p-3 border transition-colors min-h-[500px] ${
              isDragOver
                ? 'border-neutral-900 bg-neutral-100 ring-2 ring-neutral-900/10'
                : 'border-neutral-200/80'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1 border-b border-neutral-200/60 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  colKey === 'new' ? 'bg-amber-500' :
                  colKey === 'scheduled' ? 'bg-blue-500' :
                  colKey === 'in_progress' ? 'bg-purple-500' : 'bg-emerald-500'
                }`} />
                <h3 className="text-sm font-semibold text-neutral-900">
                  {config.shortLabel}
                </h3>
                <span className="font-mono text-xs tabular-nums text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200/70">
                  {colRequests.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAddWithStatus(colKey)}
                className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 rounded transition-colors"
                title={`Add request directly to ${config.shortLabel}`}
                aria-label={`Add request to ${config.shortLabel}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Request Cards Container */}
            <div className="space-y-3 flex-1">
              {colRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-44 text-center px-4 rounded-lg border border-dashed border-neutral-300 text-neutral-400 bg-white/40">
                  <p className="text-xs">No {config.shortLabel.toLowerCase()} requests</p>
                  <button
                    type="button"
                    onClick={() => onAddWithStatus(colKey)}
                    className="mt-2 text-xs text-neutral-700 hover:text-neutral-900 font-medium underline underline-offset-2"
                  >
                    + Add one here
                  </button>
                </div>
              ) : (
                colRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onStatusChange={onStatusChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
