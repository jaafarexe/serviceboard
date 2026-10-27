import React from 'react';
import { FilterState, RequestStatus, DateFilterOption, STATUS_CONFIGS } from '../types.ts';
import { Search, X, Calendar, Filter } from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  serviceTypes: string[];
  totalMatches: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChange,
  onReset,
  serviceTypes,
  totalMatches,
}) => {
  const isFiltered =
    filter.status !== 'all' ||
    filter.dateFilter !== 'all' ||
    filter.serviceType !== 'all' ||
    filter.searchQuery.trim().length > 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-3 sm:p-4 space-y-3 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Search by customer name, phone, or notes..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-neutral-400 rounded-md focus:outline-hidden transition-colors"
          />
          {filter.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <select
              value={filter.dateFilter}
              onChange={(e) =>
                onChange({ dateFilter: e.target.value as DateFilterOption })
              }
              className="appearance-none pl-8 pr-7 py-2 text-xs sm:text-sm font-medium bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-neutral-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">Next 7 Days</option>
              <option value="custom">Pick Specific Date</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {filter.dateFilter === 'custom' && (
            <input
              type="date"
              value={filter.customDate || ''}
              onChange={(e) => onChange({ customDate: e.target.value })}
              className="px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-neutral-300 rounded-md focus:outline-hidden font-mono"
            />
          )}

          {/* Service Type Filter */}
          <div className="relative shrink-0">
            <select
              value={filter.serviceType}
              onChange={(e) => onChange({ serviceType: e.target.value })}
              className="appearance-none pl-8 pr-7 py-2 text-xs sm:text-sm font-medium bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-neutral-800 focus:outline-hidden cursor-pointer max-w-[180px] truncate"
            >
              <option value="all">All Service Types</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Status Segmented Buttons + Active Filter Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-neutral-500 mr-1.5 font-medium">Status:</span>
          <button
            type="button"
            onClick={() => onChange({ status: 'all' })}
            className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
              filter.status === 'all'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All
          </button>
          {(['new', 'scheduled', 'in_progress', 'done'] as RequestStatus[]).map(
            (st) => {
              const cfg = STATUS_CONFIGS[st];
              const isActive = filter.status === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onChange({ status: st })}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {cfg.shortLabel}
                </button>
              );
            }
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto text-neutral-500">
          <span className="font-mono tabular-nums">
            {totalMatches} {totalMatches === 1 ? 'match' : 'matches'}
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-neutral-700 hover:text-neutral-900 font-medium underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
