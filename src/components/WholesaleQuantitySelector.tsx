import React from 'react';
import { ProductInputs, CalculationResults } from '../types/calculator';
import { formatIndianNumber, formatINR } from '../utils/formatters';
import { Layers, Package, AlertCircle, CheckCircle } from 'lucide-react';

interface WholesaleQuantitySelectorProps {
  inputs: ProductInputs;
  setInputs: React.Dispatch<React.SetStateAction<ProductInputs>>;
  results: CalculationResults;
}

export const WholesaleQuantitySelector: React.FC<WholesaleQuantitySelectorProps> = ({
  inputs,
  setInputs,
  results,
}) => {
  const presets = [1, 10, 25, 50, 100];
  const isAllPurchased = inputs.actualQuantitySold === inputs.totalQuantityPurchased;

  const setQuantity = (qty: number) => {
    setInputs(prev => ({
      ...prev,
      actualQuantitySold: Math.max(1, qty),
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              3. Order Quantity Sold (Wholesale / Retail)
            </h3>
            <p className="text-xs text-slate-500">
              Select or type the actual units sold for this transaction
            </p>
          </div>
        </div>

        {/* Stock status indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Batch Inventory:</span>
          <span className="font-semibold text-slate-800 font-mono-numbers">
            {formatIndianNumber(inputs.totalQuantityPurchased)} units
          </span>
        </div>
      </div>

      {/* Preset Pills / Buttons */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {presets.map(qty => (
            <button
              key={qty}
              type="button"
              onClick={() => setQuantity(qty)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                inputs.actualQuantitySold === qty
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {qty} Unit{qty > 1 ? 's' : ''}
            </button>
          ))}

          {/* All Purchased button */}
          <button
            type="button"
            onClick={() => setQuantity(inputs.totalQuantityPurchased)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap shrink-0 ${
              isAllPurchased
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            All Purchased ({formatIndianNumber(inputs.totalQuantityPurchased)})
          </button>
        </div>

        {/* Custom Input & Stock Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Quantity Sold
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={inputs.actualQuantitySold || ''}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                placeholder="50"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono-numbers font-semibold text-slate-900"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">units</span>
            </div>
          </div>

          {/* Remaining Stock Feedback */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                Unsold Inventory Remaining
              </div>
              <div className="text-base font-bold text-slate-800 font-mono-numbers mt-0.5">
                {formatIndianNumber(results.unsoldQuantity)} units
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-medium">Unsold Asset Value</div>
              <div className="text-sm font-semibold text-indigo-700 font-mono-numbers">
                {formatINR(results.unsoldStockValue)}
              </div>
            </div>
          </div>
        </div>

        {inputs.actualQuantitySold > inputs.totalQuantityPurchased && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Note:</strong> Units sold ({formatIndianNumber(inputs.actualQuantitySold)}) exceeds current batch inventory ({formatIndianNumber(inputs.totalQuantityPurchased)}). Landed cost per unit is projected based on this batch.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
