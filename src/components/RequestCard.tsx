import React from 'react';
import { ServiceRequest, RequestStatus, STATUS_CONFIGS } from '../types.ts';
import { formatDateDisplay } from '../utils/dateUtils.ts';
import { 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  Check, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface RequestCardProps {
  request: ServiceRequest;
  onStatusChange: (id: string, newStatus: RequestStatus) => void;
  onEdit: (request: ServiceRequest) => void;
  onDelete: (id: string, customerName: string) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onStatusChange,
  onEdit,
  onDelete,
  onDragStart,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const statusCfg = STATUS_CONFIGS[request.status];

  const handleNextStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (statusCfg.nextStatus) {
      onStatusChange(request.id, statusCfg.nextStatus);
    }
  };

  const handlePrevStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (statusCfg.prevStatus) {
      onStatusChange(request.id, statusCfg.prevStatus);
    }
  };

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, request.id)}
      className="group relative bg-white rounded-lg border border-neutral-200/90 hover:border-neutral-300 transition-all p-3.5 sm:p-4 text-left shadow-2xs hover:shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Top Row: Customer Name, Priority & Menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">
                {request.customerName}
              </h4>
              {request.priority === 'urgent' && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Urgent</span>
                </span>
              )}
            </div>

            {/* Service Type: Clean Unboxed Text (Zero-pill compliance) */}
            <p className="text-xs sm:text-sm font-medium text-neutral-700 mt-0.5 line-clamp-1">
              {request.serviceType}
            </p>
          </div>

          {/* Quick Actions Menu */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors"
              aria-label="Request options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-6 w-44 bg-white rounded-md shadow-md border border-neutral-200 py-1 z-40 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(request);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Edit details</span>
                  </button>

                  <div className="h-px bg-neutral-100 my-1" />
                  <div className="px-3 py-1 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    Move to Status:
                  </div>
                  {(['new', 'scheduled', 'in_progress', 'done'] as RequestStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onStatusChange(request.id, st);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center justify-between text-xs ${
                          request.status === st
                            ? 'font-semibold text-neutral-900 bg-neutral-50'
                            : 'text-neutral-600'
                        }`}
                      >
                        <span>{STATUS_CONFIGS[st].shortLabel}</span>
                        {request.status === st && <Check className="w-3 h-3" />}
                      </button>
                    )
                  )}

                  <div className="h-px bg-neutral-100 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(request.id, request.customerName);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Delete request</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Unboxed Metadata: Date, Time Window, Quote */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 mt-2">
          <span className="flex items-center gap-1 text-neutral-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>{formatDateDisplay(request.date)}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{request.timeWindow || 'Flexible time'}</span>
          </span>
          {request.estimatedPrice !== undefined && request.estimatedPrice > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-medium text-neutral-900">
                ${request.estimatedPrice}
              </span>
            </>
          )}
        </div>

        {/* Customer contact affordances */}
        {(request.phone || request.email) && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-2 pt-2 border-t border-neutral-100">
            {request.phone && (
              <a
                href={`tel:${request.phone}`}
                className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
                title="Call customer"
              >
                <Phone className="w-3 h-3 text-neutral-400" />
                <span>{request.phone}</span>
              </a>
            )}
            {request.email && (
              <a
                href={`mailto:${request.email}`}
                className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
                title="Email customer"
              >
                <Mail className="w-3 h-3 text-neutral-400" />
                <span className="truncate max-w-[140px]">{request.email}</span>
              </a>
            )}
          </div>
        )}

        {/* Notes (if any) */}
        {request.notes && (
          <p className="mt-2.5 text-xs text-neutral-600 bg-neutral-50 rounded p-2 border border-neutral-100 leading-relaxed line-clamp-3">
            {request.notes}
          </p>
        )}
      </div>

      {/* Bottom Pipeline Progress & One-Click Status Controls */}
      <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
        {/* Status text label (unboxed) */}
        <div className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
          <span className="text-neutral-400">Status:</span>
          <span className={`font-semibold ${statusCfg.accentColor}`}>
            {statusCfg.shortLabel}
          </span>
        </div>

        {/* One-click status forward / transition buttons */}
        <div className="flex items-center gap-1.5">
          {request.status === 'done' ? (
            <button
              type="button"
              onClick={handlePrevStatus}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors cursor-pointer"
              title="Reopen as In Progress"
            >
              <RotateCcw className="w-3 h-3 text-neutral-500" />
              <span>Reopen</span>
            </button>
          ) : (
            <>
              {statusCfg.nextStatus && (
                <button
                  type="button"
                  onClick={handleNextStatus}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    statusCfg.nextStatus === 'done'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      : statusCfg.nextStatus === 'in_progress'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xs'
                  }`}
                  title={`Advance to ${STATUS_CONFIGS[statusCfg.nextStatus].shortLabel}`}
                >
                  {statusCfg.nextStatus === 'done' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                  <span>{statusCfg.nextActionLabel}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
