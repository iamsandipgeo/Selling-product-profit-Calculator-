import React from 'react';
import { IndianRupee, Bookmark, Sparkles, RotateCcw, Trash2, FileSpreadsheet, Share2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'wholesale' | 'target' | 'history';
  setActiveTab: (tab: 'calculator' | 'wholesale' | 'target' | 'history') => void;
  savedCount: number;
  onLoadExample: () => void;
  onReset: () => void;
  onClear: () => void;
  onSave: () => void;
  onExportCSV: () => void;
  onShareSummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onLoadExample,
  onReset,
  onClear,
  onSave,
  onExportCSV,
  onShareSummary,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text element wordmark with Indian Rupee symbol */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Smart Profit Calculator
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-medium">
                (India Edition · ₹)
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation views */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'calculator'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Order Calculator
            </button>
            <button
              onClick={() => setActiveTab('wholesale')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'wholesale'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Wholesale Tiers
            </button>
            <button
              onClick={() => setActiveTab('target')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'target'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Target Pricing
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Saved Records</span>
              {savedCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-mono-numbers">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary quick actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onLoadExample}
              title="Load the 50-unit sample data from the brief"
              className="px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Load Sample Data</span>
              <span className="sm:hidden">Sample</span>
            </button>

            <button
              onClick={onSave}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              onClick={onExportCSV}
              title="Download CSV report"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              aria-label="Export CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            <button
              onClick={onShareSummary}
              title="Copy Summary to Clipboard"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              aria-label="Share summary"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-1 px-2 font-medium rounded ${activeTab === 'calculator' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('wholesale')}
            className={`py-1 px-2 font-medium rounded ${activeTab === 'wholesale' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            Wholesale
          </button>
          <button
            onClick={() => setActiveTab('target')}
            className={`py-1 px-2 font-medium rounded ${activeTab === 'target' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            Target Profit
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-1 px-2 font-medium rounded flex items-center gap-1 ${activeTab === 'history' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="text-[10px] px-1 bg-emerald-100 text-emerald-800 rounded font-mono-numbers">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
