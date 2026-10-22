import { CalculationResults, ProductInputs } from '../types/calculator';

/**
 * Format a number into Indian Rupee format (e.g. ₹1,25,000 or -₹4,500.50).
 */
export function formatINR(amount: number, showDecimals: boolean = true): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? (absAmount % 1 !== 0 ? 2 : 0) : 0,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format integer or decimal numbers with Indian comma grouping.
 */
export function formatIndianNumber(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(val);
}

/**
 * Format percentage.
 */
export function formatPercent(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0.00%';
  return `${val >= 0 ? '+' : ''}${val.toFixed(decimals)}%`;
}

/**
 * Generate CSV text for download.
 */
export function generateCSV(inputs: ProductInputs, results: CalculationResults): string {
  const rows: [string, string | number][] = [
    ['--- SMART PROFIT CALCULATOR REPORT ---', ''],
    ['Generated On', new Date().toLocaleString('en-IN')],
    ['Product Name', inputs.productName || 'Unnamed Product'],
    ['', ''],
    ['[1] INVENTORY & LANDED COST', ''],
    ['Quantity Purchased (Batch)', inputs.totalQuantityPurchased],
    ['Purchase Price per Unit', inputs.purchasePricePerUnit],
    ['Purchase Discount', `${inputs.purchaseDiscountValue} (${inputs.purchaseDiscountType})`],
    ['Net Purchase Price per Unit', results.netPurchasePricePerUnit.toFixed(2)],
    ['Supplier Shipping Cost', inputs.supplierShippingCost],
    ['Packaging Cost per Unit', inputs.packagingCostPerUnit],
    ['Loading & Unloading Charges', inputs.loadingUnloadingCost],
    ['Transportation Cost', inputs.transportationCost],
    ['Other Purchase Overhead', inputs.otherPurchaseExpenses],
    ['Purchase GST Rate (%)', inputs.applyPurchaseGST ? `${inputs.purchaseGSTRate}%` : 'Not Applied'],
    ['Purchase GST Total', results.purchaseGSTTotal.toFixed(2)],
    ['Total Landed Inventory Cost', results.totalLandedPurchaseInvestment.toFixed(2)],
    ['Fully Allocated Cost Per Unit', results.fullyAllocatedCostPerUnit.toFixed(2)],
    ['', ''],
    ['[2] SALES ORDER & REVENUE', ''],
    ['Actual Quantity Sold', results.quantitySold],
    ['Unsold Quantity Remaining', results.unsoldQuantity],
    ['Unsold Inventory Value', results.unsoldStockValue.toFixed(2)],
    ['Base Selling Price per Unit', inputs.sellingPricePerUnit],
    ['Customer Discount per Unit', results.customerDiscountPerUnit.toFixed(2)],
    ['Wholesale Discount per Unit', results.wholesaleDiscountPerUnit.toFixed(2)],
    ['Effective Selling Price per Unit', results.effectiveSellingPricePerUnit.toFixed(2)],
    ['Total Sales Revenue Before Discount', results.totalSalesRevenueBeforeDiscount.toFixed(2)],
    ['Total Discounts Given', results.totalCustomerDiscount.toFixed(2)],
    ['Total Extra Charges Collected', results.totalExtraChargesCollected.toFixed(2)],
    ['Net Sales Revenue', results.netSalesRevenue.toFixed(2)],
    ['', ''],
    ['[3] DEDUCTIONS & EXPENSES (SOLD UNITS)', ''],
    ['Cost of Goods Sold (COGS)', results.costOfGoodsSold.toFixed(2)],
    ['Platform Commission Total', results.platformCommissionTotal.toFixed(2)],
    ['Payment Gateway Fees', results.paymentGatewayTotal.toFixed(2)],
    ['Delivery / Shipping Total', results.deliveryCostTotal.toFixed(2)],
    ['Marketing / Ad Cost', results.marketingCostTotal.toFixed(2)],
    ['Labour Cost', results.labourCostTotal.toFixed(2)],
    ['Storage / Warehousing', results.storageCostTotal.toFixed(2)],
    ['Returns & Damage Loss', results.returnLossTotal.toFixed(2)],
    ['Other Selling Expenses', results.otherSellingExpensesTotal.toFixed(2)],
    ['Total Selling Expenses', results.totalSellingExpenses.toFixed(2)],
    ['Total Order Cost (COGS + Selling Expenses)', results.totalCost.toFixed(2)],
    ['', ''],
    ['[4] NET PROFIT & MARGIN ANALYSIS', ''],
    ['Net Profit / Loss', results.netProfit.toFixed(2)],
    ['Net Profit per Unit Sold', results.profitPerUnit.toFixed(2)],
    ['Profit Margin (%)', `${results.profitMarginPercent.toFixed(2)}%`],
    ['ROI on Total Cost (%)', `${results.roiPercent.toFixed(2)}%`],
    ['ROI on COGS (%)', `${results.roiOnCOGSPercent.toFixed(2)}%`],
    ['Break-Even Effective Selling Price', results.breakEvenEffectivePricePerUnit.toFixed(2)],
    ['Break-Even Base Selling Price (List/MRP)', results.breakEvenSellingPricePerUnit.toFixed(2)],
    ['Recommended Target Selling Price', results.recommendedTargetSellingPrice.toFixed(2)],
  ];

  return rows.map(r => `"${r[0]}","${r[1]}"`).join('\n');
}

/**
 * Generate shareable text summary (suitable for WhatsApp or Telegram message).
 */
export function generateSummaryText(inputs: ProductInputs, results: CalculationResults): string {
  const statusEmoji = results.isProfit ? '✅ PROFITABLE' : '⚠️ LOSS';

  return `📊 *Smart Profit Calculator Summary*
📦 *Product:* ${inputs.productName || 'Product'}
${statusEmoji}

*Order Performance:*
• Sold: ${results.quantitySold} units (Batch: ${results.quantityPurchased} units)
• Net Sales Revenue: ${formatINR(results.netSalesRevenue)}
• Cost of Goods Sold (COGS): ${formatINR(results.costOfGoodsSold)}
• Total Selling Expenses: ${formatINR(results.totalSellingExpenses)}
• Total Order Cost: ${formatINR(results.totalCost)}

*Bottom Line:*
💰 *Net Profit: ${formatINR(results.netProfit)}* (${results.profitPerUnit >= 0 ? '+' : ''}${formatINR(results.profitPerUnit)}/unit)
📈 *Profit Margin:* ${results.profitMarginPercent.toFixed(2)}%
🎯 *ROI:* ${results.roiPercent.toFixed(2)}%

*Inventory & Break-Even:*
• Fully Allocated Landed Cost: ${formatINR(results.fullyAllocatedCostPerUnit)}/unit
• Break-Even List Price: ${formatINR(results.breakEvenSellingPricePerUnit)}/unit
• Unsold Stock: ${results.unsoldQuantity} units (${formatINR(results.unsoldStockValue)})

_Calculated via Smart Profit Calculator_`;
}
