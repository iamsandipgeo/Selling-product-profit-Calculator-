import React, { useState } from 'react';
import { ProductInputs, CalculationResults } from '../types/calculator';
import { formatINR } from '../utils/formatters';
import { Tag, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface SellingPriceSectionProps {
  inputs: ProductInputs;
  setInputs: React.Dispatch<React.SetStateAction<ProductInputs>>;
  results: CalculationResults;
}

export const SellingPriceSection: React.FC<SellingPriceSectionProps> = ({
  inputs,
  setInputs,
  results,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const update = <K extends keyof ProductInputs>(field: K, value: ProductInputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>2. Selling Price & Customer Discounts</span>
            </h2>
            <p className="text-xs text-slate-500">
              List MRP, retail promo discount, wholesale tier cut, and customer shipping
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs text-slate-500 font-medium">Effective Net Price / Unit</div>
            <div className="text-sm font-bold text-emerald-700 font-mono-numbers">
              {formatINR(results.effectiveSellingPricePerUnit)}
            </div>
          </div>
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            aria-label="Toggle section"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Selling Price per Unit (List MRP) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selling Price per Unit (List / MRP ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.sellingPricePerUnit || ''}
                  onChange={e => update('sellingPricePerUnit', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="180"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono-numbers font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Customer Discount Type & Value */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Customer / Promo Discount
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('customerDiscountType', 'percentage')}
                    className={`px-2 py-0.5 rounded font-medium ${
                      inputs.customerDiscountType === 'percentage'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => update('customerDiscountType', 'fixed')}
                    className={`px-2 py-0.5 rounded font-medium ${
                      inputs.customerDiscountType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    ₹ / unit
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">
                  {inputs.customerDiscountType === 'percentage' ? '%' : '₹'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.customerDiscountValue || ''}
                  onChange={e => update('customerDiscountValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="10"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Wholesale Bulk Discount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Wholesale Bulk Extra Discount
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('wholesaleDiscountType', 'none')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.wholesaleDiscountType === 'none'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    None
                  </button>
                  <button
                    type="button"
                    onClick={() => update('wholesaleDiscountType', 'percentage')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.wholesaleDiscountType === 'percentage'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => update('wholesaleDiscountType', 'fixed')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.wholesaleDiscountType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    ₹
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">
                  {inputs.wholesaleDiscountType === 'percentage' ? '%' : '₹'}
                </span>
                <input
                  type="number"
                  disabled={inputs.wholesaleDiscountType === 'none'}
                  min="0"
                  step="any"
                  value={inputs.wholesaleDiscountType === 'none' ? 0 : inputs.wholesaleDiscountValue || ''}
                  onChange={e => update('wholesaleDiscountValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white disabled:bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono-numbers disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Extra Charges Collected per Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Extra Charge Collected per Unit (e.g. Shipping / Handling ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.extraChargesPerUnit || ''}
                  onChange={e => update('extraChargesPerUnit', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Extra Fixed Charges Collected from Customer */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Extra Fixed Charge Collected per Order (Total ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.extraChargesFixed || ''}
                  onChange={e => update('extraChargesFixed', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Effective Price Summary Box */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                <span>Final Realized Price / Unit</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xl font-extrabold text-emerald-900 font-mono-numbers">
                {formatINR(results.effectiveSellingPricePerUnit)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1 font-mono-numbers">
                List MRP: {formatINR(inputs.sellingPricePerUnit)} - Disc: {formatINR(results.totalDiscountPerUnit)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
