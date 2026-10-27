import React from 'react';
import { ServiceRequest, STATUS_CONFIGS } from '../types.ts';
import { formatFullDate, getTodayString } from '../utils/dateUtils.ts';
import { Printer, X, FileText, CheckSquare, Clock } from 'lucide-react';

interface PrintWorkSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ServiceRequest[];
}

export const PrintWorkSheetModal: React.FC<PrintWorkSheetModalProps> = ({
  isOpen,
  onClose,
  requests,
}) => {
  if (!isOpen) return null;

  const todayStr = getTodayString();
  const todayJobs = requests.filter((r) => r.date === todayStr);
  const displayJobs = todayJobs.length > 0 ? todayJobs : requests;
  const isTodayOnly = todayJobs.length > 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden my-6 print:shadow-none print:border-none print:m-0 print:max-w-none">
        
        {/* Controls Bar (hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-neutral-700" />
            <h3 className="text-base font-bold text-neutral-900">
              Printable Service Dispatch Sheet
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-6 sm:p-8 space-y-6 text-neutral-900">
          <div className="border-b border-neutral-300 pb-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                ServiceBoard Dispatch Summary
              </h1>
              <p className="text-xs text-neutral-600 mt-1">
                {isTodayOnly ? `Schedule for: ${formatFullDate(todayStr)}` : 'Full Active Work Orders'}
              </p>
            </div>
            <div className="text-right text-xs text-neutral-500 font-mono">
              Printed on {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-4">
            {displayJobs.map((job, idx) => (
              <div
                key={job.id}
                className="p-4 border border-neutral-200 rounded-lg bg-neutral-50/40 break-inside-avoid"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400">#{idx + 1}</span>
                      <h4 className="text-base font-bold text-neutral-900">
                        {job.customerName}
                      </h4>
                      {job.priority === 'urgent' && (
                        <span className="text-xs font-semibold text-red-600 uppercase">
                          [URGENT]
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-neutral-800 mt-0.5">
                      {job.serviceType}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                      Status: {STATUS_CONFIGS[job.status].shortLabel}
                    </span>
                    {job.estimatedPrice !== undefined && (
                      <div className="font-mono text-xs font-semibold text-neutral-900 mt-0.5">
                        Quote: ${job.estimatedPrice}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 mt-2">
                  <span>Date: {job.date}</span>
                  <span>·</span>
                  <span>Time: {job.timeWindow}</span>
                  {job.phone && (
                    <>
                      <span>·</span>
                      <span>Phone: {job.phone}</span>
                    </>
                  )}
                </div>

                {job.notes && (
                  <div className="mt-2 text-xs text-neutral-700 bg-white p-2.5 rounded border border-neutral-200">
                    <span className="font-semibold text-neutral-900">Instructions: </span>
                    {job.notes}
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-dashed border-neutral-200 flex items-center justify-between text-[11px] text-neutral-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 border border-neutral-400 inline-block rounded-xs" />
                      Arrived / Started
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 border border-neutral-400 inline-block rounded-xs" />
                      Completed
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 border border-neutral-400 inline-block rounded-xs" />
                      Customer Signed / Paid
                    </span>
                  </div>
                  <span>Tech Signature: __________________</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-neutral-400 pt-6 border-t border-neutral-200">
            ServiceBoard — Small Service Business Request Organizer
          </div>
        </div>

      </div>
    </div>
  );
};
