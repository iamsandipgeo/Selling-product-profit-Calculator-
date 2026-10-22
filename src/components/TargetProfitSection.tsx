import React from 'react';
import { ProductInputs, CalculationResults } from '../types/calculator';
import { formatINR, formatPercent, formatIndianNumber } from '../utils/formatters';
import { Target, ArrowRight, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface TargetProfitSectionProps {
  inputs: ProductInputs;
  setInputs: React.Dispatch<React.SetStateAction<ProductInputs>>;
  results: CalculationResults;
}

export const TargetProfitSection: React.FC<TargetProfitSectionProps> = ({
  inputs,
  setInputs,
  results,
}) => {
  const update = <K extends keyof ProductInputs>(field: K, value: ProductInputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const applyTargetPrice = () => {
    if (results.recommendedTargetSellingPrice > 0) {
      setInputs(prev => ({
        ...prev,
        sellingPricePerUnit: Math.round(results.recommendedTargetSellingPrice * 100) / 100,
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              5. Target Profit & Reverse Pricing Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Calculate exact selling price needed to hit your target profit amount or margin
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => update('targetProfitType', 'margin')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              inputs.targetProfitType === 'margin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target Margin (%)
          </button>
          <button
            type="button"
            onClick={() => update('targetProfitType', 'amount')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              inputs.targetProfitType === 'amount'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target Profit (₹)
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Target Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {inputs.targetProfitType === 'margin'
                  ? 'Desired Net Profit Margin (%)'
                  : `Desired Total Net Profit Amount for ${formatIndianNumber(results.quantitySold)} units (₹)`}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">
                  {inputs.targetProfitType === 'margin' ? '%' : '₹'}
                </span>
                <input
                  type="number"
                  min="0"
                  max={inputs.targetProfitType === 'margin' ? 95 : undefined}
                  step="any"
                  value={inputs.targetProfitValue || ''}
                  onChange={e => update('targetProfitValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder={inputs.targetProfitType === 'margin' ? '25' : '5000'}
                  className="w-full pl-8 pr-4 py-2.5 text-base font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono-numbers"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Current order profit is{' '}
                <strong className="text-slate-800 font-mono-numbers">{formatINR(results.netProfit)}</strong> (
                {formatPercent(results.profitMarginPercent)} margin).
              </p>
            </div>

            {/* Quick target suggestions */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Presets:</span>
              {inputs.targetProfitType === 'margin' ? (
                <>
                  {[15, 20, 25, 30, 40].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => update('targetProfitValue', m)}
                      className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
                        inputs.targetProfitValue === m
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {m}%
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {[1000, 2500, 5000, 10000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => update('targetProfitValue', amt)}
                      className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
                        inputs.targetProfitValue === amt
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {formatINR(amt, false)}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Recommended Price Output Card */}
          <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <span>Required Selling Price</span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px]">
                Solved
              </span>
            </div>

            <div className="mt-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-mono-numbers">
                {formatINR(results.recommendedTargetSellingPrice)}
              </div>
              <div className="text-xs text-emerald-800 mt-1 font-medium font-mono-numbers">
                Effective Realized Price: {formatINR(results.recommendedTargetEffectivePrice)} / unit
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-emerald-900">
                Current Price: <strong className="font-mono-numbers">{formatINR(inputs.sellingPricePerUnit)}</strong>
                <span className="mx-1.5 text-slate-400">·</span>
                Difference: <strong className="font-mono-numbers">
                  {results.recommendedTargetSellingPrice >= inputs.sellingPricePerUnit ? '+' : ''}
                  {formatINR(results.recommendedTargetSellingPrice - inputs.sellingPricePerUnit)}
                </strong>
              </div>

              <button
                type="button"
                onClick={applyTargetPrice}
                disabled={results.recommendedTargetSellingPrice <= 0}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs"
              >
                <span>Apply to Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Explanatory note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            The reverse solver factors in your variable commission fees (
            <strong className="text-slate-800">{inputs.platformCommissionPercent}%</strong> marketplace +{' '}
            <strong className="text-slate-800">{inputs.paymentGatewayPercent}%</strong> gateway), existing discount deductions, per-unit logistics, and the allocated product cost to guarantee you net your target figure.
          </p>
        </div>
      </div>
    </div>
  );
};
