import React from 'react';
import { ServiceRequest, RequestStatus, STATUS_CONFIGS } from '../types.ts';
import { getTodayString, formatFullDate } from '../utils/dateUtils.ts';
import { RequestCard } from './RequestCard.tsx';
import { 
  CalendarCheck2, 
  Clock, 
  Plus, 
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface TodayViewProps {
  requests: ServiceRequest[];
  onStatusChange: (id: string, newStatus: RequestStatus) => void;
  onEdit: (request: ServiceRequest) => void;
  onDelete: (id: string, customerName: string) => void;
  onAddNewToday: () => void;
  onViewAll: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  requests,
  onStatusChange,
  onEdit,
  onDelete,
  onAddNewToday,
  onViewAll,
}) => {
  const todayStr = getTodayString();
  const todayRequests = requests.filter((r) => r.date === todayStr);

  const completedToday = todayRequests.filter((r) => r.status === 'done').length;
  const inProgressToday = todayRequests.filter((r) => r.status === 'in_progress').length;
  const pendingToday = todayRequests.filter(
    (r) => r.status === 'new' || r.status === 'scheduled'
  ).length;

  const totalToday = todayRequests.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Sort by time window or priority
  const sortedToday = [...todayRequests].sort((a, b) => {
    // Sort urgent first
    if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
    if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
    return (a.timeWindow || '').localeCompare(b.timeWindow || '');
  });

  return (
    <div className="space-y-6">
      {/* Today Header Hero Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today&apos;s Dispatch & Agenda</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
              {formatFullDate(todayStr)}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {totalToday === 0
                ? 'No service requests scheduled for today yet.'
                : `${totalToday} ${totalToday === 1 ? 'request' : 'requests'} on your schedule today: ${completedToday} completed, ${inProgressToday} in progress, ${pendingToday} upcoming.`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onAddNewToday}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule for Today</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {totalToday > 0 && (
          <div className="mt-5 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Today&apos;s Completion</span>
              </div>
              <span className="font-mono tabular-nums font-semibold text-neutral-900">
                {progressPercent}% ({completedToday}/{totalToday} done)
              </span>
            </div>
            <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main List of Today's Requests */}
      {totalToday === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-8 sm:p-12 text-center shadow-2xs">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">
            Schedule is clear for today!
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-1 mb-5">
            You don&apos;t have any service requests scheduled for today. You can add one or check the rest of your pipeline board.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onAddNewToday}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              + Add Today&apos;s Request
            </button>
            <button
              type="button"
              onClick={onViewAll}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              View Pipeline Board
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedToday.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
