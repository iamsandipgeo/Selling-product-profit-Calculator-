import React from 'react';
import { ProductInputs, CalculationResults } from '../types/calculator';
import { calculateProfit } from '../utils/calculations';
import { formatINR, formatPercent, formatIndianNumber } from '../utils/formatters';
import { Layers, ArrowRight, Check } from 'lucide-react';

interface WholesaleComparisonTableProps {
  inputs: ProductInputs;
  setInputs: React.Dispatch<React.SetStateAction<ProductInputs>>;
  currentResults: CalculationResults;
}

export const WholesaleComparisonTable: React.FC<WholesaleComparisonTableProps> = ({
  inputs,
  setInputs,
  currentResults,
}) => {
  const tiers = [1, 10, 25, 50, 100];
  if (!tiers.includes(inputs.actualQuantitySold)) {
    tiers.push(inputs.actualQuantitySold);
    tiers.sort((a, b) => a - b);
  }

  const tierCalculations = tiers.map(qty => {
    const tierInputs: ProductInputs = {
      ...inputs,
      actualQuantitySold: qty,
    };
    return {
      quantity: qty,
      results: calculateProfit(tierInputs),
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Wholesale & Bulk Order Quantity Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate order economics, profit per unit, and break-even across volume tiers
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Landed Cost: <strong className="text-slate-800 font-mono-numbers">{formatINR(currentResults.fullyAllocatedCostPerUnit)}/unit</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-3.5 py-3">Order Tier</th>
              <th className="px-3 py-3 text-right">Net Revenue</th>
              <th className="px-3 py-3 text-right">COGS</th>
              <th className="px-3 py-3 text-right">Selling Expenses</th>
              <th className="px-3 py-3 text-right">Total Cost</th>
              <th className="px-3.5 py-3 text-right font-bold text-slate-900">Net Profit / Loss</th>
              <th className="px-3 py-3 text-right">Profit / Unit</th>
              <th className="px-3 py-3 text-right">Margin %</th>
              <th className="px-3 py-3 text-right">ROI %</th>
              <th className="px-3 py-3 text-right">Break-Even MRP</th>
              <th className="px-3.5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tierCalculations.map(({ quantity, results }) => {
              const isCurrent = inputs.actualQuantitySold === quantity;
              const isProfit = results.isProfit;

              return (
                <tr
                  key={quantity}
                  className={`transition-colors ${
                    isCurrent
                      ? 'bg-blue-50/70 font-medium text-slate-900'
                      : 'hover:bg-slate-50/70'
                  }`}
                >
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 font-mono-numbers text-xs">
                        {formatIndianNumber(quantity)} unit{quantity > 1 ? 's' : ''}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold whitespace-nowrap">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-mono-numbers">
                    {formatINR(results.netSalesRevenue)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono-numbers text-slate-600">
                    {formatINR(results.costOfGoodsSold)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono-numbers text-slate-600">
                    {formatINR(results.totalSellingExpenses)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono-numbers text-slate-700">
                    {formatINR(results.totalCost)}
                  </td>
                  <td
                    className={`px-3.5 py-3 text-right font-bold font-mono-numbers ${
                      isProfit ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatINR(results.netProfit)}
                  </td>
                  <td
                    className={`px-3 py-3 text-right font-semibold font-mono-numbers ${
                      isProfit ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {results.profitPerUnit >= 0 ? '+' : ''}
                    {formatINR(results.profitPerUnit)}
                  </td>
                  <td
                    className={`px-3 py-3 text-right font-semibold font-mono-numbers ${
                      isProfit ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatPercent(results.profitMarginPercent)}
                  </td>
                  <td
                    className={`px-3 py-3 text-right font-mono-numbers ${
                      isProfit ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatPercent(results.roiPercent)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono-numbers text-slate-700">
                    {formatINR(results.breakEvenSellingPricePerUnit)}
                  </td>
                  <td className="px-3.5 py-3 text-center">
                    {isCurrent ? (
                      <span className="inline-flex items-center text-xs text-blue-700 font-semibold gap-0.5">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setInputs(prev => ({ ...prev, actualQuantitySold: quantity }))
                        }
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-blue-700 hover:bg-white border border-slate-200 rounded transition-colors whitespace-nowrap"
                      >
                        Select Tier
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>Click any tier row or &ldquo;Select Tier&rdquo; to load that quantity into the live calculator.</span>
        <span className="font-medium text-slate-700">
          Unsold stock is dynamically adjusted for each tier.
        </span>
      </div>
    </div>
  );
};
