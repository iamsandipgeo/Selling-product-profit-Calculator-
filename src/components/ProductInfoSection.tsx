import React, { useState } from 'react';
import { ProductInputs, CalculationResults, DiscountType } from '../types/calculator';
import { formatINR, formatIndianNumber } from '../utils/formatters';
import { Package, ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react';

interface ProductInfoSectionProps {
  inputs: ProductInputs;
  setInputs: React.Dispatch<React.SetStateAction<ProductInputs>>;
  results: CalculationResults;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
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
      {/* Header with quick stats */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>1. Product Purchase & Inward Landed Cost</span>
            </h2>
            <p className="text-xs text-slate-500">
              Procurement price, batch size, inward shipping, packaging, and taxes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs text-slate-500 font-medium">Landed Cost / Unit</div>
            <div className="text-sm font-bold text-indigo-700 font-mono-numbers">
              {formatINR(results.fullyAllocatedCostPerUnit)}
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

      {/* Form Fields */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Product Name */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name / SKU
              </label>
              <input
                type="text"
                value={inputs.productName}
                onChange={e => update('productName', e.target.value)}
                placeholder="e.g. Cotton Printed T-Shirt"
                className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              />
            </div>

            {/* Purchase Price per Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase Price per Unit (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.purchasePricePerUnit || ''}
                  onChange={e => update('purchasePricePerUnit', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="100"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Total Quantity Purchased */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Quantity Purchased (Batch Size) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={inputs.totalQuantityPurchased || ''}
                onChange={e => update('totalQuantityPurchased', Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="100"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono-numbers"
              />
            </div>

            {/* Purchase Discount */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Purchase Discount from Supplier
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('purchaseDiscountType', 'percentage')}
                    className={`px-2 py-0.5 rounded font-medium ${
                      inputs.purchaseDiscountType === 'percentage'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => update('purchaseDiscountType', 'fixed')}
                    className={`px-2 py-0.5 rounded font-medium ${
                      inputs.purchaseDiscountType === 'fixed'
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
                  {inputs.purchaseDiscountType === 'percentage' ? '%' : '₹'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.purchaseDiscountValue || ''}
                  onChange={e => update('purchaseDiscountValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Supplier Shipping Cost */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supplier Shipping / Freight Cost (Total ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.supplierShippingCost || ''}
                  onChange={e => update('supplierShippingCost', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="200"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Packaging Cost per Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Packaging Cost per Unit (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.packagingCostPerUnit || ''}
                  onChange={e => update('packagingCostPerUnit', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="5"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Loading & Unloading */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loading & Unloading Charges (Total ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.loadingUnloadingCost || ''}
                  onChange={e => update('loadingUnloadingCost', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Transportation Cost */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inward Transportation / Cartage (Total ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.transportationCost || ''}
                  onChange={e => update('transportationCost', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono-numbers"
                />
              </div>
            </div>

            {/* Other Purchase Expenses */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Other Inward Expenses (Total ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.otherPurchaseExpenses || ''}
                  onChange={e => update('otherPurchaseExpenses', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono-numbers"
                />
              </div>
            </div>
          </div>

          {/* GST on Purchase (Optional & Expandable) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="applyPurchaseGST"
                  checked={inputs.applyPurchaseGST}
                  onChange={e => update('applyPurchaseGST', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="applyPurchaseGST" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Include GST or Taxes on Purchase
                </label>
              </div>

              {inputs.applyPurchaseGST && (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-600 font-medium">GST Rate:</span>
                    <select
                      value={inputs.purchaseGSTRate}
                      onChange={e => update('purchaseGSTRate', parseFloat(e.target.value) || 0)}
                      className="px-2 py-1 text-xs bg-white border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="0">0% (Exempt)</option>
                      <option value="5">5% (Apparel &lt; ₹1k, Essentials)</option>
                      <option value="12">12% (Apparel &gt; ₹1k, Footwear)</option>
                      <option value="18">18% (Electronics, Most Goods)</option>
                      <option value="28">28% (Luxury, Automotive)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="gstInputCreditEligible"
                      checked={inputs.gstInputCreditEligible}
                      onChange={e => update('gstInputCreditEligible', e.target.checked)}
                      className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300"
                    />
                    <label htmlFor="gstInputCreditEligible" className="text-[11px] text-slate-600 cursor-pointer">
                      Input Tax Credit (ITC) claimable
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Landed Cost Summary Callout */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Total Landed Inventory Cost for {formatIndianNumber(inputs.totalQuantityPurchased)} units:
                <strong className="ml-1 font-mono-numbers">{formatINR(results.totalLandedPurchaseInvestment)}</strong>
              </span>
            </div>
            <div className="text-right sm:text-left font-medium">
              Allocated Cost: <strong className="text-indigo-700 font-mono-numbers">{formatINR(results.fullyAllocatedCostPerUnit)} / unit</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
