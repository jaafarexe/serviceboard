import React, { useRef } from 'react';
import { ViewMode } from '../types.ts';
import { 
  Plus, 
  CalendarDays, 
  Kanban, 
  ListFilter, 
  Download, 
  Upload, 
  RotateCcw, 
  Printer 
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewRequest: () => void;
  todayCount: number;
  totalCount: number;
  onExport: () => void;
  onImport: (file: File) => void;
  onResetDemo: () => void;
  onPrintSheet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onNewRequest,
  todayCount,
  onExport,
  onImport,
  onResetDemo,
  onPrintSheet,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
              SB
            </div>
            <a 
              href="/" 
              className="text-lg font-bold tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors whitespace-nowrap"
            >
              ServiceBoard
            </a>
          </div>

          {/* Zone 2: Navigation / View Switcher */}
          <nav className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onViewModeChange('board')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'board'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Pipeline Kanban Board"
            >
              <Kanban className="w-4 h-4" />
              <span>Pipeline Board</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('today')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'today'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Today's Scheduled Requests"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Today</span>
              {todayCount > 0 && (
                <span className="font-mono text-xs tabular-nums px-1.5 py-0.2 text-neutral-700 bg-neutral-200/80 rounded">
                  {todayCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'list'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="All Requests in List View"
            >
              <ListFilter className="w-4 h-4" />
              <span>List View</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick backup / menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-2.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                title="Board Data Tools & Backup"
                aria-expanded={menuOpen}
              >
                <span>Tools</span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-neutral-200 py-1.5 z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onPrintSheet();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700"
                    >
                      <Printer className="w-4 h-4 text-neutral-500" />
                      <span>Print Today / Work Slip</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onExport();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700"
                    >
                      <Download className="w-4 h-4 text-neutral-500" />
                      <span>Export Backup (JSON)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700"
                    >
                      <Upload className="w-4 h-4 text-neutral-500" />
                      <span>Import Requests</span>
                    </button>

                    <div className="h-px bg-neutral-200 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onResetDemo();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-600"
                    >
                      <RotateCcw className="w-4 h-4 text-neutral-400" />
                      <span>Reload 3 Demo Requests</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onNewRequest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Request</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
