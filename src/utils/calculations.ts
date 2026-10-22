import { CalculationResults, ProductInputs } from '../types/calculator';

/**
 * Pure calculation engine for Smart Profit Calculator.
 * Accurately allocates landed costs across purchased inventory
 * and evaluates order-level selling performance for sold quantity.
 */
export function calculateProfit(inputs: ProductInputs): CalculationResults {
  const qtyPurchased = Math.max(1, Number(inputs.totalQuantityPurchased) || 1);
  const qtySold = Math.max(1, Number(inputs.actualQuantitySold) || 1);

  // 1. Landed Cost Calculation
  const rawPurchasePrice = Math.max(0, Number(inputs.purchasePricePerUnit) || 0);

  let purchaseDiscountAmount = 0;
  if (inputs.purchaseDiscountType === 'percentage') {
    const pct = Math.max(0, Math.min(100, Number(inputs.purchaseDiscountValue) || 0));
    purchaseDiscountAmount = (rawPurchasePrice * pct) / 100;
  } else {
    purchaseDiscountAmount = Math.max(0, Number(inputs.purchaseDiscountValue) || 0);
  }
  purchaseDiscountAmount = Math.min(rawPurchasePrice, purchaseDiscountAmount);
  const netPurchasePricePerUnit = Math.max(0, rawPurchasePrice - purchaseDiscountAmount);

  const totalNetProductPurchase = netPurchasePricePerUnit * qtyPurchased;

  // Purchase GST / Taxes
  const gstRate = Math.max(0, Number(inputs.purchaseGSTRate) || 0);
  const purchaseGSTTotal = inputs.applyPurchaseGST ? (totalNetProductPurchase * gstRate) / 100 : 0;
  // If input credit eligible (ITC), GST is refundable/offset, so it's not a net cost to the business.
  // Otherwise, it gets added directly to the landed inventory cost.
  const purchaseGSTAddedToCost = inputs.applyPurchaseGST && !inputs.gstInputCreditEligible ? purchaseGSTTotal : 0;

  // Fixed purchase overheads (allocated across all units purchased)
  const supplierShipping = Math.max(0, Number(inputs.supplierShippingCost) || 0);
  const loadingUnloading = Math.max(0, Number(inputs.loadingUnloadingCost) || 0);
  const transportation = Math.max(0, Number(inputs.transportationCost) || 0);
  const otherPurchase = Math.max(0, Number(inputs.otherPurchaseExpenses) || 0);
  const totalPurchaseFixedExpenses = supplierShipping + loadingUnloading + transportation + otherPurchase;

  // Packaging cost
  const packagingPerUnit = Math.max(0, Number(inputs.packagingCostPerUnit) || 0);
  const totalPackagingCost = packagingPerUnit * qtyPurchased;

  // Total Landed Inventory Investment
  const totalLandedPurchaseInvestment =
    totalNetProductPurchase + purchaseGSTAddedToCost + totalPurchaseFixedExpenses + totalPackagingCost;

  // Fully allocated landed cost per unit
  const fullyAllocatedCostPerUnit = qtyPurchased > 0 ? totalLandedPurchaseInvestment / qtyPurchased : 0;

  // 2. Unsold Inventory
  const unsoldQuantity = Math.max(0, qtyPurchased - qtySold);
  const unsoldStockValue = unsoldQuantity * fullyAllocatedCostPerUnit;

  // 3. Cost of Goods Sold (COGS) for Actual Quantity Sold
  const costOfGoodsSold = qtySold * fullyAllocatedCostPerUnit;

  // 4. Selling Price, Discounts, and Net Sales Revenue
  const baseSellingPrice = Math.max(0, Number(inputs.sellingPricePerUnit) || 0);

  // Customer discount
  let customerDiscountPerUnit = 0;
  if (inputs.customerDiscountType === 'percentage') {
    const custDiscountPct = Math.max(0, Math.min(100, Number(inputs.customerDiscountValue) || 0));
    customerDiscountPerUnit = (baseSellingPrice * custDiscountPct) / 100;
  } else {
    customerDiscountPerUnit = Math.max(0, Number(inputs.customerDiscountValue) || 0);
  }

  // Wholesale discount
  let wholesaleDiscountPerUnit = 0;
  if (inputs.wholesaleDiscountType === 'percentage') {
    const wsPct = Math.max(0, Math.min(100, Number(inputs.wholesaleDiscountValue) || 0));
    wholesaleDiscountPerUnit = (baseSellingPrice * wsPct) / 100;
  } else if (inputs.wholesaleDiscountType === 'fixed') {
    wholesaleDiscountPerUnit = Math.max(0, Number(inputs.wholesaleDiscountValue) || 0);
  }

  const rawTotalDiscount = customerDiscountPerUnit + wholesaleDiscountPerUnit;
  const totalDiscountPerUnit = Math.min(baseSellingPrice, Math.max(0, rawTotalDiscount));
  const effectiveSellingPricePerUnit = Math.max(0, baseSellingPrice - totalDiscountPerUnit);

  const totalSalesRevenueBeforeDiscount = qtySold * baseSellingPrice;
  const totalCustomerDiscount = qtySold * totalDiscountPerUnit;

  const extraChargesPerUnit = Math.max(0, Number(inputs.extraChargesPerUnit) || 0);
  const extraChargesFixed = Math.max(0, Number(inputs.extraChargesFixed) || 0);
  const totalExtraChargesCollected = qtySold * extraChargesPerUnit + extraChargesFixed;

  // Net Sales Revenue
  const netSalesRevenue = totalSalesRevenueBeforeDiscount - totalCustomerDiscount + totalExtraChargesCollected;

  // 5. Selling & Operating Expenses
  const platformCommPct = Math.max(0, Number(inputs.platformCommissionPercent) || 0);
  const platformCommissionTotal = (netSalesRevenue * platformCommPct) / 100;

  const pgPct = Math.max(0, Number(inputs.paymentGatewayPercent) || 0);
  const pgFixed = Math.max(0, Number(inputs.paymentGatewayFixed) || 0);
  const paymentGatewayTotal = (netSalesRevenue * pgPct) / 100 + pgFixed;

  const deliveryVal = Math.max(0, Number(inputs.deliveryChargeValue) || 0);
  const deliveryCostTotal = inputs.deliveryChargeType === 'per_unit' ? deliveryVal * qtySold : deliveryVal;

  const mktVal = Math.max(0, Number(inputs.marketingCostValue) || 0);
  const marketingCostTotal = inputs.marketingCostType === 'per_unit' ? mktVal * qtySold : mktVal;

  const labourVal = Math.max(0, Number(inputs.labourCostValue) || 0);
  const labourCostTotal = inputs.labourCostType === 'per_unit' ? labourVal * qtySold : labourVal;

  const storageVal = Math.max(0, Number(inputs.storageCostValue) || 0);
  const storageCostTotal = inputs.storageCostType === 'per_unit' ? storageVal * qtySold : storageVal;

  const returnVal = Math.max(0, Number(inputs.returnLossValue) || 0);
  let returnLossTotal = 0;
  if (inputs.returnLossType === 'percentage_revenue') {
    returnLossTotal = (netSalesRevenue * Math.min(100, returnVal)) / 100;
  } else if (inputs.returnLossType === 'per_unit') {
    returnLossTotal = returnVal * qtySold;
  } else {
    returnLossTotal = returnVal;
  }

  const otherSellingVal = Math.max(0, Number(inputs.otherSellingExpenseValue) || 0);
  const otherSellingExpensesTotal =
    inputs.otherSellingExpenseType === 'per_unit' ? otherSellingVal * qtySold : otherSellingVal;

  const totalSellingExpenses =
    platformCommissionTotal +
    paymentGatewayTotal +
    deliveryCostTotal +
    marketingCostTotal +
    labourCostTotal +
    storageCostTotal +
    returnLossTotal +
    otherSellingExpensesTotal;

  // 6. Total Order Cost & Profit
  const totalCost = costOfGoodsSold + totalSellingExpenses;
  const netProfit = netSalesRevenue - totalCost;
  const isProfit = netProfit >= 0;
  const profitPerUnit = qtySold > 0 ? netProfit / qtySold : 0;
  const profitMarginPercent = netSalesRevenue > 0 ? (netProfit / netSalesRevenue) * 100 : 0;
  const roiPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const roiOnCOGSPercent = costOfGoodsSold > 0 ? (netProfit / costOfGoodsSold) * 100 : 0;

  // 7. Break-Even Calculations
  // Variable fee rate on net sales revenue
  const returnPctRate = inputs.returnLossType === 'percentage_revenue' ? Math.min(100, returnVal) : 0;
  const variableFeeFraction = (platformCommPct + pgPct + returnPctRate) / 100;

  const fixedNonRevenueSellingExpenses =
    pgFixed +
    deliveryCostTotal +
    marketingCostTotal +
    labourCostTotal +
    storageCostTotal +
    (inputs.returnLossType !== 'percentage_revenue' ? returnLossTotal : 0) +
    otherSellingExpensesTotal;

  // Revenue required to break even:
  // NetRevenue * (1 - variableFeeFraction) = COGS + fixedNonRevenueSellingExpenses
  let breakEvenRevenue = 0;
  let breakEvenEffectivePricePerUnit = 0;
  let breakEvenSellingPricePerUnit = 0;

  if (variableFeeFraction < 1) {
    breakEvenRevenue = (costOfGoodsSold + fixedNonRevenueSellingExpenses) / (1 - variableFeeFraction);
    // Effective price per unit from revenue
    const netFromSelling = Math.max(0, breakEvenRevenue - totalExtraChargesCollected);
    breakEvenEffectivePricePerUnit = qtySold > 0 ? netFromSelling / qtySold : 0;

    // Convert effective price back to list/base selling price based on current discount configuration
    // Effective = Base - Discount. If discount is %: Effective = Base * (1 - dPct/100).
    const discountFraction =
      (inputs.customerDiscountType === 'percentage' ? (Number(inputs.customerDiscountValue) || 0) : 0) / 100 +
      (inputs.wholesaleDiscountType === 'percentage' ? (Number(inputs.wholesaleDiscountValue) || 0) : 0) / 100;
    const fixedDiscountUnit =
      (inputs.customerDiscountType === 'fixed' ? (Number(inputs.customerDiscountValue) || 0) : 0) +
      (inputs.wholesaleDiscountType === 'fixed' ? (Number(inputs.wholesaleDiscountValue) || 0) : 0);

    if (discountFraction < 1) {
      breakEvenSellingPricePerUnit = (breakEvenEffectivePricePerUnit + fixedDiscountUnit) / (1 - discountFraction);
    } else {
      breakEvenSellingPricePerUnit = breakEvenEffectivePricePerUnit + fixedDiscountUnit;
    }
  }

  // 8. Target Profit Calculator
  let targetRevenue = 0;
  let targetProfitAmountEstimated = 0;
  const targetVal = Number(inputs.targetProfitValue) || 0;

  if (inputs.targetProfitType === 'amount') {
    targetProfitAmountEstimated = Math.max(0, targetVal);
    if (variableFeeFraction < 1) {
      targetRevenue =
        (costOfGoodsSold + fixedNonRevenueSellingExpenses + targetProfitAmountEstimated) / (1 - variableFeeFraction);
    }
  } else {
    // Target Profit Margin %
    const targetMarginFraction = Math.max(0, Math.min(99, targetVal)) / 100;
    const denominator = 1 - variableFeeFraction - targetMarginFraction;
    if (denominator > 0) {
      targetRevenue = (costOfGoodsSold + fixedNonRevenueSellingExpenses) / denominator;
      targetProfitAmountEstimated = targetRevenue * targetMarginFraction;
    } else {
      targetRevenue = 0;
      targetProfitAmountEstimated = 0;
    }
  }

  let recommendedTargetEffectivePrice = 0;
  let recommendedTargetSellingPrice = 0;
  if (targetRevenue > 0 && qtySold > 0) {
    const targetNetFromSelling = Math.max(0, targetRevenue - totalExtraChargesCollected);
    recommendedTargetEffectivePrice = targetNetFromSelling / qtySold;

    const discountFraction =
      (inputs.customerDiscountType === 'percentage' ? (Number(inputs.customerDiscountValue) || 0) : 0) / 100 +
      (inputs.wholesaleDiscountType === 'percentage' ? (Number(inputs.wholesaleDiscountValue) || 0) : 0) / 100;
    const fixedDiscountUnit =
      (inputs.customerDiscountType === 'fixed' ? (Number(inputs.customerDiscountValue) || 0) : 0) +
      (inputs.wholesaleDiscountType === 'fixed' ? (Number(inputs.wholesaleDiscountValue) || 0) : 0);

    if (discountFraction < 1) {
      recommendedTargetSellingPrice = (recommendedTargetEffectivePrice + fixedDiscountUnit) / (1 - discountFraction);
    } else {
      recommendedTargetSellingPrice = recommendedTargetEffectivePrice + fixedDiscountUnit;
    }
  }

  // 9. Visual Expense Distribution Percentages
  const positiveRevenue = Math.max(1, netSalesRevenue);
  const platformFeesTotal = platformCommissionTotal + paymentGatewayTotal;
  const logisticsTotal = deliveryCostTotal + returnLossTotal;
  const operationalTotal = marketingCostTotal + labourCostTotal + storageCostTotal + otherSellingExpensesTotal;

  const distribution = {
    cogsPercent: Math.min(100, Math.max(0, (costOfGoodsSold / positiveRevenue) * 100)),
    platformFeesPercent: Math.min(100, Math.max(0, (platformFeesTotal / positiveRevenue) * 100)),
    logisticsPercent: Math.min(100, Math.max(0, (logisticsTotal / positiveRevenue) * 100)),
    operationalPercent: Math.min(100, Math.max(0, (operationalTotal / positiveRevenue) * 100)),
    profitPercent: isProfit ? Math.min(100, Math.max(0, (netProfit / positiveRevenue) * 100)) : 0,
  };

  return {
    netPurchasePricePerUnit,
    purchaseGSTTotal,
    purchaseGSTRate: gstRate,
    purchaseGSTAddedToCost,
    totalPurchaseCost: totalNetProductPurchase,
    totalPurchaseFixedExpenses,
    totalPackagingCost,
    totalLandedPurchaseInvestment,
    fullyAllocatedCostPerUnit,

    quantityPurchased: qtyPurchased,
    quantitySold: qtySold,
    unsoldQuantity,
    unsoldStockValue,

    customerDiscountPerUnit,
    wholesaleDiscountPerUnit,
    totalDiscountPerUnit,
    effectiveSellingPricePerUnit,
    totalSalesRevenueBeforeDiscount,
    totalCustomerDiscount,
    totalExtraChargesCollected,
    netSalesRevenue,

    costOfGoodsSold,

    platformCommissionTotal,
    paymentGatewayTotal,
    deliveryCostTotal,
    marketingCostTotal,
    labourCostTotal,
    storageCostTotal,
    returnLossTotal,
    otherSellingExpensesTotal,
    totalSellingExpenses,

    totalOrderExpenses: totalSellingExpenses,
    totalCost,
    netProfit,
    isProfit,
    profitPerUnit,
    profitMarginPercent,
    roiPercent,
    roiOnCOGSPercent,

    breakEvenSellingPricePerUnit,
    breakEvenEffectivePricePerUnit,
    recommendedTargetSellingPrice,
    recommendedTargetEffectivePrice,
    targetProfitAmountEstimated,

    distribution,
  };
}
