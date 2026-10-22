import React from 'react';
import { CalculationResults } from '../types/calculator';
import { formatINR, formatIndianNumber, formatPercent } from '../utils/formatters';
import { TrendingUp, TrendingDown, IndianRupee, Layers, Target, ShieldCheck, ShoppingBag, Package } from 'lucide-react';

interface MetricCardsProps {
  results: CalculationResults;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ results }) => {
  const isProfit = results.isProfit;

  return (
    <div className="space-y-4">
      {/* Primary Hero Net Profit Banner */}
      <div
        className={`p-5 rounded-xl border transition-all ${
          isProfit
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-rose-50/70 border-rose-200 text-rose-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isProfit ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isProfit ? 'Net Profit' : 'Net Loss'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                For {formatIndianNumber(results.quantitySold)} unit{results.quantitySold > 1 ? 's' : ''} sold
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono-numbers ${
                  isProfit ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {formatINR(results.netProfit)}
              </span>
              <span className="text-sm font-semibold text-slate-600 font-mono-numbers">
                ({results.profitPerUnit >= 0 ? '+' : ''}{formatINR(results.profitPerUnit)} / unit)
              </span>
            </div>
          </div>

          {/* Quick Margins Snapshot */}
          <div className="flex items-center gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
            <div>
              <div className="text-xs text-slate-500 font-medium">Profit Margin</div>
              <div
                className={`text-xl font-bold font-mono-numbers ${
                  isProfit ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatPercent(results.profitMarginPercent)}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Return on Investment (ROI)</div>
              <div
                className={`text-xl font-bold font-mono-numbers ${
                  isProfit ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatPercent(results.roiPercent)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Financial Figures */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Sales Revenue</span>
            <IndianRupee className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono-numbers">
            {formatINR(results.netSalesRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono-numbers">
            {formatINR(results.effectiveSellingPricePerUnit)}/unit effective
          </div>
        </div>

        {/* Total Cost for Sold Units */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Order Cost</span>
            <ShoppingBag className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono-numbers">
            {formatINR(results.totalCost)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono-numbers">
            COGS {formatINR(results.costOfGoodsSold)} + Ops {formatINR(results.totalSellingExpenses)}
          </div>
        </div>

        {/* Break-Even Price */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Break-Even Price</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono-numbers">
            {formatINR(results.breakEvenSellingPricePerUnit)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Minimum List MRP to avoid loss
          </div>
        </div>

        {/* Unsold Stock Value */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">Unsold Stock</span>
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono-numbers">
            {formatIndianNumber(results.unsoldQuantity)} units
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1 font-mono-numbers">
            Valued at {formatINR(results.unsoldStockValue)}
          </div>
        </div>
      </div>
    </div>
  );
};
