import React, { useState } from 'react';
import { SavedCalculation, ProductInputs } from '../types/calculator';
import { formatINR, formatPercent, formatIndianNumber } from '../utils/formatters';
import { calculateProfit } from '../utils/calculations';
import { generateCSV } from '../utils/formatters';
import { Bookmark, Trash2, Copy, ArrowUpRight, Search, Download, Check, X, FileSpreadsheet } from 'lucide-react';

interface SavedCalculationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedCalculation[];
  onLoad: (record: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onDuplicate: (record: SavedCalculation) => void;
  onSaveCurrent: () => void;
}

export const SavedCalculationsModal: React.FC<SavedCalculationsModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onLoad,
  onDelete,
  onDuplicate,
  onSaveCurrent,
}) => {
  const [search, setSearch] = useState('');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = savedList.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportSingle = (item: SavedCalculation) => {
    const res = calculateProfit(item.inputs);
    const csvContent = generateCSV(item.inputs, res);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-profit-${item.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadedId(item.id);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Saved Product Calculations
              </h3>
              <p className="text-xs text-slate-500">
                Stored locally in browser ({savedList.length} calculation{savedList.length !== 1 ? 's' : ''})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveCurrent}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Current Model</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {savedList.length > 0 && (
          <div className="px-4 py-3 border-b border-slate-100 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search saved products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* List Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bookmark className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <div className="text-sm font-semibold text-slate-800">
                {savedList.length === 0 ? 'No Saved Calculations Yet' : 'No Matching Calculations'}
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {savedList.length === 0
                  ? 'Click "Save Current Model" or the Save button in the top bar to store your product pricing scenarios for future reference.'
                  : 'Try searching with a different product name.'}
              </p>
            </div>
          ) : (
            filtered.map(item => {
              const isProfit = item.summary.netProfit >= 0;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {item.name || 'Unnamed Product'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        · {new Date(item.savedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-mono-numbers">
                      <span>Sold: {formatIndianNumber(item.summary.quantitySold)} units</span>
                      <span>MRP: {formatINR(item.summary.sellingPrice)}</span>
                      <span>Revenue: {formatINR(item.summary.netSalesRevenue)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <div
                        className={`text-sm sm:text-base font-extrabold font-mono-numbers ${
                          isProfit ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {formatINR(item.summary.netProfit)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-numbers">
                        Margin: {formatPercent(item.summary.profitMarginPercent)} · ROI: {formatPercent(item.summary.roiPercent)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onLoad(item);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Load
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportSingle(item)}
                        title="Download CSV"
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200"
                      >
                        {downloadedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicate(item)}
                        title="Duplicate record"
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        title="Delete calculation"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>All calculation histories remain safely stored on this device.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
