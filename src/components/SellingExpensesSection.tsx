import React, { useState } from 'react';
import { ProductInputs, CalculationResults, ExpenseType, ReturnExpenseType } from '../types/calculator';
import { formatINR } from '../utils/formatters';
import { Store, ChevronDown, ChevronUp, Truck, Percent, CreditCard, RotateCcw } from 'lucide-react';

interface SellingExpensesSectionProps {
  inputs: ProductInputs;
  setInputs: React.Dispatch<React.SetStateAction<ProductInputs>>;
  results: CalculationResults;
}

export const SellingExpensesSection: React.FC<SellingExpensesSectionProps> = ({
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
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>4. Marketplace Fees & Operating Expenses</span>
            </h2>
            <p className="text-xs text-slate-500">
              Platform commissions, gateway fees, customer delivery, ads, and return loss
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs text-slate-500 font-medium">Selling Expenses Total</div>
            <div className="text-sm font-bold text-amber-700 font-mono-numbers">
              {formatINR(results.totalSellingExpenses)}
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
            {/* Platform Commission Percentage */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Platform Commission (%)
                </label>
                <span className="text-[11px] text-slate-400 font-mono-numbers">
                  ={formatINR(results.platformCommissionTotal)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">%</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.platformCommissionPercent || ''}
                  onChange={e => update('platformCommissionPercent', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="5"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Amazon / Flipkart / Meesho fees</div>
            </div>

            {/* Payment Gateway (Percentage & Flat fee) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Payment Gateway Fee (%)
                </label>
                <span className="text-[11px] text-slate-400 font-mono-numbers">
                  ={formatINR(results.paymentGatewayTotal)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">%</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={inputs.paymentGatewayPercent || ''}
                    onChange={e => update('paymentGatewayPercent', Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="2"
                    className="w-full pl-7 pr-2 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-medium">+₹</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={inputs.paymentGatewayFixed || ''}
                    onChange={e => update('paymentGatewayFixed', Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0"
                    className="w-full pl-7 pr-2 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                  />
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Razorpay / PayU / Cashfree (2% + ₹0)</div>
            </div>

            {/* Delivery Charge (per unit or fixed) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Customer Delivery / Shipping
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('deliveryChargeType', 'per_unit')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.deliveryChargeType === 'per_unit'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    /unit
                  </button>
                  <button
                    type="button"
                    onClick={() => update('deliveryChargeType', 'fixed')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.deliveryChargeType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Total ₹
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.deliveryChargeValue || ''}
                  onChange={e => update('deliveryChargeValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="10"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Total: <span className="font-mono-numbers">{formatINR(results.deliveryCostTotal)}</span>
              </div>
            </div>

            {/* Marketing or Advertising Cost */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Marketing / Ads (CAC)
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('marketingCostType', 'per_unit')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.marketingCostType === 'per_unit'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    /unit
                  </button>
                  <button
                    type="button"
                    onClick={() => update('marketingCostType', 'fixed')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.marketingCostType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Total ₹
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.marketingCostValue || ''}
                  onChange={e => update('marketingCostValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Total: <span className="font-mono-numbers">{formatINR(results.marketingCostTotal)}</span>
              </div>
            </div>

            {/* Labour Cost */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Labour / Staff Cost
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('labourCostType', 'per_unit')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.labourCostType === 'per_unit'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    /unit
                  </button>
                  <button
                    type="button"
                    onClick={() => update('labourCostType', 'fixed')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.labourCostType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Total ₹
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.labourCostValue || ''}
                  onChange={e => update('labourCostValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Total: <span className="font-mono-numbers">{formatINR(results.labourCostTotal)}</span>
              </div>
            </div>

            {/* Storage / Warehouse Cost */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Storage / Warehouse Fee
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('storageCostType', 'per_unit')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.storageCostType === 'per_unit'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    /unit
                  </button>
                  <button
                    type="button"
                    onClick={() => update('storageCostType', 'fixed')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.storageCostType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Total ₹
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.storageCostValue || ''}
                  onChange={e => update('storageCostValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Total: <span className="font-mono-numbers">{formatINR(results.storageCostTotal)}</span>
              </div>
            </div>

            {/* Return or Damage Loss */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Return / RTO Damage Loss
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('returnLossType', 'percentage_revenue')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.returnLossType === 'percentage_revenue'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    % Rev
                  </button>
                  <button
                    type="button"
                    onClick={() => update('returnLossType', 'per_unit')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.returnLossType === 'per_unit'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    /unit
                  </button>
                  <button
                    type="button"
                    onClick={() => update('returnLossType', 'fixed')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.returnLossType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Total ₹
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">
                  {inputs.returnLossType === 'percentage_revenue' ? '%' : '₹'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.returnLossValue || ''}
                  onChange={e => update('returnLossValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Total: <span className="font-mono-numbers">{formatINR(results.returnLossTotal)}</span>
              </div>
            </div>

            {/* Other Selling Expenses */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Other Operating Expenses
                </label>
                <div className="flex items-center text-[11px] bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => update('otherSellingExpenseType', 'per_unit')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.otherSellingExpenseType === 'per_unit'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    /unit
                  </button>
                  <button
                    type="button"
                    onClick={() => update('otherSellingExpenseType', 'fixed')}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      inputs.otherSellingExpenseType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Total ₹
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.otherSellingExpenseValue || ''}
                  onChange={e => update('otherSellingExpenseValue', Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="100"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono-numbers"
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Total: <span className="font-mono-numbers">{formatINR(results.otherSellingExpensesTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
