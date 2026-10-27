import React, { useState } from 'react';
import { ServiceRequest, RequestStatus, STATUS_CONFIGS } from '../types.ts';
import { formatDateDisplay } from '../utils/dateUtils.ts';
import { 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Phone, 
  ArrowRight, 
  Check, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface ListViewProps {
  requests: ServiceRequest[];
  onStatusChange: (id: string, newStatus: RequestStatus) => void;
  onEdit: (request: ServiceRequest) => void;
  onDelete: (id: string, customerName: string) => void;
  onAddNew: () => void;
}

type SortField = 'date' | 'customerName' | 'serviceType' | 'status' | 'price';

export const ListView: React.FC<ListViewProps> = ({
  requests,
  onStatusChange,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      comparison = a.date.localeCompare(b.date);
    } else if (sortField === 'customerName') {
      comparison = a.customerName.localeCompare(b.customerName);
    } else if (sortField === 'serviceType') {
      comparison = a.serviceType.localeCompare(b.serviceType);
    } else if (sortField === 'status') {
      const order: Record<RequestStatus, number> = {
        new: 1,
        scheduled: 2,
        in_progress: 3,
        done: 4,
      };
      comparison = (order[a.status] || 0) - (order[b.status] || 0);
    } else if (sortField === 'price') {
      comparison = (a.estimatedPrice || 0) - (b.estimatedPrice || 0);
    }
    return sortAsc ? comparison : -comparison;
  });

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/80 border-b border-neutral-200 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => handleSort('customerName')}
                  className="flex items-center gap-1.5 hover:text-neutral-900 cursor-pointer"
                >
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => handleSort('serviceType')}
                  className="flex items-center gap-1.5 hover:text-neutral-900 cursor-pointer"
                >
                  <span>Service Type</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1.5 hover:text-neutral-900 cursor-pointer"
                >
                  <span>Date & Window</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  type="button"
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1.5 hover:text-neutral-900 cursor-pointer"
                >
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button
                  type="button"
                  onClick={() => handleSort('price')}
                  className="inline-flex items-center gap-1.5 hover:text-neutral-900 cursor-pointer"
                >
                  <span>Quote</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/70 text-xs sm:text-sm text-neutral-700">
            {sortedRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500">
                  <p className="text-sm font-medium text-neutral-800">No requests match your current filters</p>
                  <button
                    type="button"
                    onClick={onAddNew}
                    className="mt-2 text-xs font-medium text-neutral-900 underline underline-offset-2"
                  >
                    + Add a new request
                  </button>
                </td>
              </tr>
            ) : (
              sortedRequests.map((req) => {
                const statusCfg = STATUS_CONFIGS[req.status];
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-neutral-50/70 transition-colors group"
                  >
                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          {req.customerName}
                        </span>
                        {req.priority === 'urgent' && (
                          <span className="text-amber-600 text-xs flex items-center gap-0.5">
                            <AlertCircle className="w-3 h-3" />
                            <span className="text-[11px] font-medium">Urgent</span>
                          </span>
                        )}
                      </div>
                      {req.phone && (
                        <a
                          href={`tel:${req.phone}`}
                          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 mt-0.5"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{req.phone}</span>
                        </a>
                      )}
                    </td>

                    {/* Service Type */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-neutral-800">
                        {req.serviceType}
                      </div>
                      {req.notes && (
                        <div className="text-xs text-neutral-500 truncate max-w-[240px] mt-0.5">
                          {req.notes}
                        </div>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-900">
                        {formatDateDisplay(req.date)}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {req.timeWindow || 'Flexible'}
                      </div>
                    </td>

                    {/* Status with one-click change */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-xs ${statusCfg.accentColor}`}>
                          {statusCfg.shortLabel}
                        </span>

                        {/* One click transition button */}
                        {req.status === 'done' ? (
                          <button
                            type="button"
                            onClick={() => statusCfg.prevStatus && onStatusChange(req.id, statusCfg.prevStatus)}
                            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded"
                            title="Reopen"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          statusCfg.nextStatus && (
                            <button
                              type="button"
                              onClick={() => statusCfg.nextStatus && onStatusChange(req.id, statusCfg.nextStatus)}
                              className="px-2 py-0.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title={`Advance to ${STATUS_CONFIGS[statusCfg.nextStatus].shortLabel}`}
                            >
                              <span>{statusCfg.nextActionLabel}</span>
                              <ArrowRight className="w-3 h-3 text-neutral-500" />
                            </button>
                          )
                        )}
                      </div>
                    </td>

                    {/* Price Quote */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                      {req.estimatedPrice !== undefined && req.estimatedPrice > 0 ? (
                        <span className="font-medium text-neutral-900">
                          ${req.estimatedPrice}
                        </span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(req)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                          title="Edit request"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(req.id, req.customerName)}
                          className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
