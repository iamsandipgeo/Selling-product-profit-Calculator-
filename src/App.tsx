import React, { useState, useMemo, useEffect } from 'react';
import { ProductInputs, CalculationResults, SavedCalculation } from './types/calculator';
import { DEFAULT_INPUTS, PROMPT_EXAMPLE_INPUTS, BLANK_INPUTS } from './data/sampleData';
import { calculateProfit } from './utils/calculations';
import { formatINR, generateCSV, generateSummaryText } from './utils/formatters';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { ProductInfoSection } from './components/ProductInfoSection';
import { SellingPriceSection } from './components/SellingPriceSection';
import { WholesaleQuantitySelector } from './components/WholesaleQuantitySelector';
import { SellingExpensesSection } from './components/SellingExpensesSection';
import { BreakdownLedger } from './components/BreakdownLedger';
import { WholesaleComparisonTable } from './components/WholesaleComparisonTable';
import { TargetProfitSection } from './components/TargetProfitSection';
import { SavedCalculationsModal } from './components/SavedCalculationsModal';
import {
  Sparkles,
  RotateCcw,
  Trash2,
  Bookmark,
  FileSpreadsheet,
  Share2,
  Check,
  CheckCircle2,
  IndianRupee,
  Layers,
  Calculator,
  Target,
  ArrowRight,
} from 'lucide-react';

const STORAGE_KEY = 'smart_profit_calculator_records_v1';

export default function App() {
  // 1. Initial State: Load with Prompt Example (Section 8) so the user immediately validates calculation accuracy
  const [inputs, setInputs] = useState<ProductInputs>(PROMPT_EXAMPLE_INPUTS);
  const [activeTab, setActiveTab] = useState<'calculator' | 'wholesale' | 'target' | 'history'>('calculator');
  const [savedList, setSavedList] = useState<SavedCalculation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Sync savedList to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedList));
    } catch {
      // ignore storage quota issues
    }
  }, [savedList]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 2. Real-Time Calculation Engine
  const results: CalculationResults = useMemo(() => {
    return calculateProfit(inputs);
  }, [inputs]);

  // Handlers
  const handleLoadPromptExample = () => {
    setInputs(PROMPT_EXAMPLE_INPUTS);
    showToast('Loaded prompt sample data (100 purchased, 50 sold @ ₹180)');
  };

  const handleLoadDefault = () => {
    setInputs(DEFAULT_INPUTS);
    showToast('Loaded T-Shirt seller template');
  };

  const handleClearAll = () => {
    setInputs(BLANK_INPUTS);
    showToast('Inputs cleared');
  };

  const handleSaveCalculation = () => {
    const newRecord: SavedCalculation = {
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: inputs.productName.trim() || `Product Order (${results.quantitySold} units)`,
      savedAt: new Date().toISOString(),
      inputs: { ...inputs },
      summary: {
        quantitySold: results.quantitySold,
        sellingPrice: inputs.sellingPricePerUnit,
        netSalesRevenue: results.netSalesRevenue,
        netProfit: results.netProfit,
        profitMarginPercent: results.profitMarginPercent,
        roiPercent: results.roiPercent,
        breakEvenPrice: results.breakEvenSellingPricePerUnit,
      },
    };

    setSavedList(prev => [newRecord, ...prev]);
    showToast(`Saved "${newRecord.name}" to browser history!`);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedList(prev => prev.filter(item => item.id !== id));
    showToast('Record deleted');
  };

  const handleDuplicateSaved = (record: SavedCalculation) => {
    const duplicated: SavedCalculation = {
      ...record,
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: `${record.name} (Copy)`,
      savedAt: new Date().toISOString(),
    };
    setSavedList(prev => [duplicated, ...prev]);
    showToast('Record duplicated');
  };

  const handleLoadSaved = (record: SavedCalculation) => {
    setInputs(record.inputs);
    showToast(`Loaded "${record.name}" into calculator`);
  };

  const handleExportCSV = () => {
    const csvData = generateCSV(inputs, results);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = `smart-profit-${(inputs.productName || 'calculation')
      .replace(/\s+/g, '-')
      .toLowerCase()}-${Date.now()}.csv`;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV report downloaded!');
  };

  const handleShareSummary = async () => {
    const text = generateSummaryText(inputs, results);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Summary copied to clipboard!');
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('Summary copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedList.length}
        onLoadExample={handleLoadPromptExample}
        onReset={handleLoadDefault}
        onClear={handleClearAll}
        onSave={handleSaveCalculation}
        onExportCSV={handleExportCSV}
        onShareSummary={handleShareSummary}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* Quick Sample Selector & Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">Quick Scenarios:</span>
            <button
              type="button"
              onClick={handleLoadPromptExample}
              className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
            >
              50 Units Sold @ ₹180 (Prompt Sample)
            </button>
            <button
              type="button"
              onClick={handleLoadDefault}
              className="px-2.5 py-1 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors"
            >
              Apparel D2C Brand (60 Units)
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={handleLoadDefault}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Hero KPI Cards Display */}
        <MetricCards results={results} />

        {/* Tab View 1: Main Order Calculator */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Input Forms */}
            <div className="lg:col-span-7 space-y-5">
              <ProductInfoSection inputs={inputs} setInputs={setInputs} results={results} />
              <SellingPriceSection inputs={inputs} setInputs={setInputs} results={results} />
              <WholesaleQuantitySelector inputs={inputs} setInputs={setInputs} results={results} />
              <SellingExpensesSection inputs={inputs} setInputs={setInputs} results={results} />
            </div>

            {/* Right Column: Live Ledger & Summary */}
            <div className="lg:col-span-5 space-y-5 sticky top-20">
              <BreakdownLedger inputs={inputs} results={results} />

              {/* Quick Jump to Wholesale Comparison */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Compare Wholesale Tiers
                  </div>
                  <div className="text-xs text-slate-500">
                    See side-by-side margins for 1, 10, 25, 50, and 100 units
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('wholesale')}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>View Tiers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Jump to Target Profit */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Target Profit Reverse Pricing
                  </div>
                  <div className="text-xs text-slate-500">
                    Calculate price needed to reach a specific ₹ profit or % margin
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('target')}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Set Target</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab View 2: Wholesale Tier Comparison Table */}
        {activeTab === 'wholesale' && (
          <div className="space-y-6">
            <WholesaleComparisonTable
              inputs={inputs}
              setInputs={setInputs}
              currentResults={results}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <WholesaleQuantitySelector inputs={inputs} setInputs={setInputs} results={results} />
              <BreakdownLedger inputs={inputs} results={results} />
            </div>
          </div>
        )}

        {/* Tab View 3: Target Profit Calculator */}
        {activeTab === 'target' && (
          <div className="space-y-6">
            <TargetProfitSection inputs={inputs} setInputs={setInputs} results={results} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <SellingPriceSection inputs={inputs} setInputs={setInputs} results={results} />
              <BreakdownLedger inputs={inputs} results={results} />
            </div>
          </div>
        )}

        {/* Tab View 4: Saved Records Direct View */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Saved Product Records</h2>
                <p className="text-xs text-slate-500">
                  Review and restore previous pricing scenarios stored in browser memory
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveCalculation}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Current Calculation</span>
              </button>
            </div>

            {savedList.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <div className="text-sm font-semibold text-slate-700">No saved calculations yet</div>
                <p className="text-xs text-slate-500 mt-1">
                  Save your product models to quickly compare pricing and wholesale strategies later.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {savedList.map(record => (
                  <div
                    key={record.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{record.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Saved on {new Date(record.savedAt).toLocaleDateString('en-IN')} · MRP:{' '}
                        {formatINR(record.summary.sellingPrice)} · Sold: {record.summary.quantitySold} units
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div
                          className={`font-mono-numbers font-bold text-sm ${
                            record.summary.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {formatINR(record.summary.netProfit)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Margin: {record.summary.profitMarginPercent.toFixed(1)}%
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            handleLoadSaved(record);
                            setActiveTab('calculator');
                          }}
                          className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSaved(record.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md border border-slate-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Saved Modal (triggered if opened via modal) */}
      <SavedCalculationsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedList={savedList}
        onLoad={handleLoadSaved}
        onDelete={handleDeleteSaved}
        onDuplicate={handleDuplicateSaved}
        onSaveCurrent={handleSaveCalculation}
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <strong className="text-slate-700">Smart Profit Calculator</strong> · Tailored for Indian E-Commerce & Wholesale Sellers
          </div>
          <div className="flex items-center gap-4">
            <span>Currency: INR (₹)</span>
            <span>·</span>
            <span>Allocated Inventory Costing</span>
            <span>·</span>
            <button
              onClick={() => setIsSavedModalOpen(true)}
              className="text-slate-700 hover:text-emerald-700 font-medium"
            >
              Saved Records ({savedList.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
