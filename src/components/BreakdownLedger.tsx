import React from 'react';
import { CalculationResults, ProductInputs } from '../types/calculator';
import { formatINR, formatIndianNumber, formatPercent } from '../utils/formatters';
import { FileText, ArrowDownRight, ArrowUpRight, CheckCircle, Package } from 'lucide-react';

interface BreakdownLedgerProps {
  inputs: ProductInputs;
  results: CalculationResults;
}

export const BreakdownLedger: React.FC<BreakdownLedgerProps> = ({ inputs, results }) => {
  const isProfit = results.isProfit;

  // Percentage of Net Revenue for each component
  const getRevPct = (amount: number) => {
    if (results.netSalesRevenue <= 0) return '0.0%';
    return `${((amount / results.netSalesRevenue) * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Transaction Breakdown & Financial Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Audited step-by-step accounting for {formatIndianNumber(results.quantitySold)} sold unit{results.quantitySold > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
          Batch: {formatIndianNumber(inputs.totalQuantityPurchased)} units · Sold: {formatIndianNumber(results.quantitySold)} units
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        {/* Visual Revenue Split Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Where Every ₹100 of Net Revenue Goes</span>
            <span className="text-slate-500 font-mono-numbers">
              {isProfit ? `Profit: ${formatPercent(results.profitMarginPercent)}` : 'Incurring Loss'}
            </span>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${Math.min(100, Math.max(0, results.distribution.cogsPercent))}%` }}
              className="bg-indigo-600 transition-all duration-300"
              title={`COGS: ${results.distribution.cogsPercent.toFixed(1)}%`}
            />
            <div
              style={{ width: `${Math.min(100, Math.max(0, results.distribution.platformFeesPercent))}%` }}
              className="bg-amber-500 transition-all duration-300"
              title={`Platform Fees: ${results.distribution.platformFeesPercent.toFixed(1)}%`}
            />
            <div
              style={{ width: `${Math.min(100, Math.max(0, results.distribution.logisticsPercent))}%` }}
              className="bg-orange-500 transition-all duration-300"
              title={`Logistics & Shipping: ${results.distribution.logisticsPercent.toFixed(1)}%`}
            />
            <div
              style={{ width: `${Math.min(100, Math.max(0, results.distribution.operationalPercent))}%` }}
              className="bg-cyan-600 transition-all duration-300"
              title={`Operations & Ads: ${results.distribution.operationalPercent.toFixed(1)}%`}
            />
            {isProfit && (
              <div
                style={{ width: `${Math.min(100, Math.max(0, results.distribution.profitPercent))}%` }}
                className="bg-emerald-500 transition-all duration-300"
                title={`Net Profit: ${results.distribution.profitPercent.toFixed(1)}%`}
              />
            )}
          </div>

          {/* Bar Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
              <span>COGS ({results.distribution.cogsPercent.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
              <span>Marketplace ({results.distribution.platformFeesPercent.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-orange-500" />
              <span>Delivery & Returns ({results.distribution.logisticsPercent.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-cyan-600" />
              <span>Ads & Ops ({results.distribution.operationalPercent.toFixed(1)}%)</span>
            </div>
            {isProfit && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 font-semibold text-emerald-800" />
                <span className="font-semibold text-emerald-800">
                  Net Profit ({results.distribution.profitPercent.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-slate-200 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-2.5">Line Item Accounting</th>
                <th className="px-4 py-2.5 text-right">Per Unit</th>
                <th className="px-4 py-2.5 text-right">Total Order (₹)</th>
                <th className="px-4 py-2.5 text-right">% of Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Gross Sales */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2 font-medium text-slate-900">
                  Gross Sales Revenue (Before Discounts)
                </td>
                <td className="px-4 py-2 text-right font-mono-numbers">
                  {formatINR(inputs.sellingPricePerUnit)}
                </td>
                <td className="px-4 py-2 text-right font-semibold text-slate-900 font-mono-numbers">
                  {formatINR(results.totalSalesRevenueBeforeDiscount)}
                </td>
                <td className="px-4 py-2 text-right text-slate-400 font-mono-numbers">-</td>
              </tr>

              {/* Discounts */}
              <tr className="hover:bg-slate-50/50 text-slate-600">
                <td className="px-4 py-2 pl-6 text-rose-600 flex items-center gap-1">
                  <span>- Customer & Wholesale Discounts</span>
                </td>
                <td className="px-4 py-2 text-right text-rose-600 font-mono-numbers">
                  -{formatINR(results.totalDiscountPerUnit)}
                </td>
                <td className="px-4 py-2 text-right text-rose-600 font-mono-numbers font-medium">
                  -{formatINR(results.totalCustomerDiscount)}
                </td>
                <td className="px-4 py-2 text-right text-rose-600 font-mono-numbers">
                  {getRevPct(results.totalCustomerDiscount)}
                </td>
              </tr>

              {/* Extra Charges */}
              {results.totalExtraChargesCollected > 0 && (
                <tr className="hover:bg-slate-50/50 text-slate-600">
                  <td className="px-4 py-2 pl-6 text-emerald-700 flex items-center gap-1">
                    <span>+ Extra Customer Charges Collected</span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-emerald-700">
                    +{formatINR(results.totalExtraChargesCollected / results.quantitySold)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-emerald-700 font-medium">
                    +{formatINR(results.totalExtraChargesCollected)}
                  </td>
                  <td className="px-4 py-2 text-right text-emerald-700 font-mono-numbers">
                    +{getRevPct(results.totalExtraChargesCollected)}
                  </td>
                </tr>
              )}

              {/* Net Sales Revenue Row */}
              <tr className="bg-slate-50/80 font-bold border-y border-slate-200">
                <td className="px-4 py-2.5 text-slate-900">
                  = NET SALES REVENUE
                </td>
                <td className="px-4 py-2.5 text-right font-mono-numbers text-slate-900">
                  {formatINR(results.effectiveSellingPricePerUnit)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono-numbers text-slate-900 text-sm">
                  {formatINR(results.netSalesRevenue)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono-numbers text-slate-500">
                  100.0%
                </td>
              </tr>

              {/* Cost of Goods Sold (COGS) */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2 pl-6 font-medium text-indigo-900">
                  - Cost of Goods Sold (COGS)
                  <span className="block text-[10px] text-slate-400 font-normal">
                    {formatIndianNumber(results.quantitySold)} units × {formatINR(results.fullyAllocatedCostPerUnit)} allocated landed cost
                  </span>
                </td>
                <td className="px-4 py-2 text-right font-mono-numbers text-indigo-900">
                  {formatINR(results.fullyAllocatedCostPerUnit)}
                </td>
                <td className="px-4 py-2 text-right font-mono-numbers font-semibold text-indigo-950">
                  -{formatINR(results.costOfGoodsSold)}
                </td>
                <td className="px-4 py-2 text-right font-mono-numbers text-indigo-700">
                  {getRevPct(results.costOfGoodsSold)}
                </td>
              </tr>

              {/* Platform Commission */}
              {results.platformCommissionTotal > 0 && (
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 pl-6 text-slate-600">
                    - Platform Commission ({inputs.platformCommissionPercent}%)
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {formatINR(results.platformCommissionTotal / results.quantitySold)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-700">
                    -{formatINR(results.platformCommissionTotal)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {getRevPct(results.platformCommissionTotal)}
                  </td>
                </tr>
              )}

              {/* Gateway Fees */}
              {results.paymentGatewayTotal > 0 && (
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 pl-6 text-slate-600">
                    - Payment Gateway Fees ({inputs.paymentGatewayPercent}% + ₹{inputs.paymentGatewayFixed})
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {formatINR(results.paymentGatewayTotal / results.quantitySold)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-700">
                    -{formatINR(results.paymentGatewayTotal)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {getRevPct(results.paymentGatewayTotal)}
                  </td>
                </tr>
              )}

              {/* Delivery Cost */}
              {results.deliveryCostTotal > 0 && (
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 pl-6 text-slate-600">
                    - Customer Delivery / Logistics
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {formatINR(results.deliveryCostTotal / results.quantitySold)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-700">
                    -{formatINR(results.deliveryCostTotal)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {getRevPct(results.deliveryCostTotal)}
                  </td>
                </tr>
              )}

              {/* Marketing Cost */}
              {results.marketingCostTotal > 0 && (
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 pl-6 text-slate-600">
                    - Marketing & Advertising (Ad spend)
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {formatINR(results.marketingCostTotal / results.quantitySold)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-700">
                    -{formatINR(results.marketingCostTotal)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {getRevPct(results.marketingCostTotal)}
                  </td>
                </tr>
              )}

              {/* Labour, Storage, Returns & Other Expenses */}
              {(results.labourCostTotal > 0 ||
                results.storageCostTotal > 0 ||
                results.returnLossTotal > 0 ||
                results.otherSellingExpensesTotal > 0) && (
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 py-2 pl-6 text-slate-600">
                    - Labour, Warehousing, RTO Returns & Other Selling Ops
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {formatINR(
                      (results.labourCostTotal +
                        results.storageCostTotal +
                        results.returnLossTotal +
                        results.otherSellingExpensesTotal) /
                        results.quantitySold
                    )}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-700">
                    -{formatINR(
                      results.labourCostTotal +
                        results.storageCostTotal +
                        results.returnLossTotal +
                        results.otherSellingExpensesTotal
                    )}
                  </td>
                  <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                    {getRevPct(
                      results.labourCostTotal +
                        results.storageCostTotal +
                        results.returnLossTotal +
                        results.otherSellingExpensesTotal
                    )}
                  </td>
                </tr>
              )}

              {/* Total Expenses Row */}
              <tr className="bg-slate-50/60 font-semibold border-t border-slate-200">
                <td className="px-4 py-2 text-slate-800">
                  Total Order Expenses & COGS
                </td>
                <td className="px-4 py-2 text-right font-mono-numbers text-slate-800">
                  {formatINR(results.totalCost / results.quantitySold)}
                </td>
                <td className="px-4 py-2 text-right font-mono-numbers text-slate-800 font-bold">
                  {formatINR(results.totalCost)}
                </td>
                <td className="px-4 py-2 text-right font-mono-numbers text-slate-500">
                  {getRevPct(results.totalCost)}
                </td>
              </tr>

              {/* Net Profit / Loss Final Row */}
              <tr
                className={`font-extrabold text-sm border-t-2 ${
                  isProfit
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                    : 'bg-rose-50 text-rose-950 border-rose-300'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {isProfit ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-600" />
                    )}
                    <span>= {isProfit ? 'NET PROFIT' : 'NET LOSS'}</span>
                  </div>
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono-numbers ${
                    isProfit ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {formatINR(results.profitPerUnit)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono-numbers text-base ${
                    isProfit ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {formatINR(results.netProfit)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono-numbers ${
                    isProfit ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {formatPercent(results.profitMarginPercent)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Unsold Inventory Segregation (Explicitly Required by Prompt) */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Package className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-slate-800">
                Inventory Cost Isolation (Unsold Stock Accounting)
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                The current order does not absorb the inventory purchase cost of unsold units.
                The remaining {formatIndianNumber(results.unsoldQuantity)} units remain as an asset on your balance sheet.
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-slate-500">Unsold Inventory Asset Value</div>
            <div className="text-sm font-bold text-slate-800 font-mono-numbers">
              {formatINR(results.unsoldStockValue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
