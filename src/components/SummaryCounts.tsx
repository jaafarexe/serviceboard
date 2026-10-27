import React from 'react';
import { RequestStatus, STATUS_CONFIGS } from '../types.ts';

interface SummaryCountsProps {
  counts: {
    total: number;
    open: number;
    new: number;
    scheduled: number;
    in_progress: number;
    done: number;
    today: number;
  };
  activeStatusFilter: RequestStatus | 'all';
  onSelectStatus: (status: RequestStatus | 'all') => void;
  onSelectToday: () => void;
  isTodayActive: boolean;
}

export const SummaryCounts: React.FC<SummaryCountsProps> = ({
  counts,
  activeStatusFilter,
  onSelectStatus,
  onSelectToday,
  isTodayActive,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {/* 1. All Active / Open */}
      <button
        type="button"
        onClick={() => onSelectStatus('all')}
        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
          activeStatusFilter === 'all' && !isTodayActive
            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
        }`}
      >
        <div className={`text-xs font-medium uppercase tracking-wider ${
          activeStatusFilter === 'all' && !isTodayActive ? 'text-neutral-300' : 'text-neutral-500'
        }`}>
          Total Open
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-2xl font-semibold tracking-tight font-mono tabular-nums">
            {counts.open}
          </span>
          <span className={`text-xs ${
            activeStatusFilter === 'all' && !isTodayActive ? 'text-neutral-300' : 'text-neutral-400'
          }`}>
            of {counts.total} total
          </span>
        </div>
      </button>

      {/* 2. New */}
      <button
        type="button"
        onClick={() => onSelectStatus('new')}
        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
          activeStatusFilter === 'new' && !isTodayActive
            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
            : 'bg-white hover:bg-amber-50/50 border-neutral-200 text-neutral-800'
        }`}
      >
        <div className={`text-xs font-medium uppercase tracking-wider ${
          activeStatusFilter === 'new' && !isTodayActive ? 'text-amber-100' : 'text-amber-700'
        }`}>
          {STATUS_CONFIGS.new.shortLabel}
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-2xl font-semibold tracking-tight font-mono tabular-nums">
            {counts.new}
          </span>
          <span className={`text-xs ${
            activeStatusFilter === 'new' && !isTodayActive ? 'text-amber-100' : 'text-neutral-400'
          }`}>
            inbox
          </span>
        </div>
      </button>

      {/* 3. Scheduled */}
      <button
        type="button"
        onClick={() => onSelectStatus('scheduled')}
        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
          activeStatusFilter === 'scheduled' && !isTodayActive
            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
            : 'bg-white hover:bg-blue-50/50 border-neutral-200 text-neutral-800'
        }`}
      >
        <div className={`text-xs font-medium uppercase tracking-wider ${
          activeStatusFilter === 'scheduled' && !isTodayActive ? 'text-blue-100' : 'text-blue-700'
        }`}>
          {STATUS_CONFIGS.scheduled.shortLabel}
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-2xl font-semibold tracking-tight font-mono tabular-nums">
            {counts.scheduled}
          </span>
          <span className={`text-xs ${
            activeStatusFilter === 'scheduled' && !isTodayActive ? 'text-blue-100' : 'text-neutral-400'
          }`}>
            booked
          </span>
        </div>
      </button>

      {/* 4. In Progress */}
      <button
        type="button"
        onClick={() => onSelectStatus('in_progress')}
        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
          activeStatusFilter === 'in_progress' && !isTodayActive
            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
            : 'bg-white hover:bg-purple-50/50 border-neutral-200 text-neutral-800'
        }`}
      >
        <div className={`text-xs font-medium uppercase tracking-wider ${
          activeStatusFilter === 'in_progress' && !isTodayActive ? 'text-purple-100' : 'text-purple-700'
        }`}>
          {STATUS_CONFIGS.in_progress.shortLabel}
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-2xl font-semibold tracking-tight font-mono tabular-nums">
            {counts.in_progress}
          </span>
          <span className={`text-xs ${
            activeStatusFilter === 'in_progress' && !isTodayActive ? 'text-purple-100' : 'text-neutral-400'
          }`}>
            active
          </span>
        </div>
      </button>

      {/* 5. Done */}
      <button
        type="button"
        onClick={() => onSelectStatus('done')}
        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
          activeStatusFilter === 'done' && !isTodayActive
            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
            : 'bg-white hover:bg-emerald-50/50 border-neutral-200 text-neutral-800'
        }`}
      >
        <div className={`text-xs font-medium uppercase tracking-wider ${
          activeStatusFilter === 'done' && !isTodayActive ? 'text-emerald-100' : 'text-emerald-700'
        }`}>
          {STATUS_CONFIGS.done.shortLabel}
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-2xl font-semibold tracking-tight font-mono tabular-nums">
            {counts.done}
          </span>
          <span className={`text-xs ${
            activeStatusFilter === 'done' && !isTodayActive ? 'text-emerald-100' : 'text-neutral-400'
          }`}>
            finished
          </span>
        </div>
      </button>

      {/* 6. Today's Requests Shortcut */}
      <button
        type="button"
        onClick={onSelectToday}
        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
          isTodayActive
            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-neutral-900'
        }`}
      >
        <div className={`text-xs font-medium uppercase tracking-wider ${
          isTodayActive ? 'text-neutral-300' : 'text-neutral-600'
        }`}>
          Today&apos;s Jobs
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-2xl font-semibold tracking-tight font-mono tabular-nums">
            {counts.today}
          </span>
          <span className={`text-xs ${
            isTodayActive ? 'text-neutral-300' : 'text-neutral-500'
          }`}>
            due today
          </span>
        </div>
      </button>
    </div>
  );
};
