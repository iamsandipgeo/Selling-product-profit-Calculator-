export type DiscountType = 'percentage' | 'fixed';
export type ExpenseType = 'per_unit' | 'fixed';
export type ReturnExpenseType = 'percentage_revenue' | 'per_unit' | 'fixed';

export interface ProductInputs {
  // 1. Product Information
  productName: string;
  purchasePricePerUnit: number;
  totalQuantityPurchased: number;
  purchaseDiscountType: DiscountType;
  purchaseDiscountValue: number;
  supplierShippingCost: number; // total fixed
  loadingUnloadingCost: number; // total fixed
  packagingCostPerUnit: number; // per unit
  transportationCost: number; // total fixed
  otherPurchaseExpenses: number; // total fixed
  applyPurchaseGST: boolean;
  purchaseGSTRate: number; // percentage (e.g. 0, 5, 12, 18, 28)
  gstInputCreditEligible: boolean; // if true, GST is recoverable ITC, not added to product cost

  // 2. Selling Price & Discounts
  sellingPricePerUnit: number;
  customerDiscountType: DiscountType;
  customerDiscountValue: number;
  wholesaleDiscountType: 'none' | 'percentage' | 'fixed';
  wholesaleDiscountValue: number;
  extraChargesPerUnit: number;
  extraChargesFixed: number;

  // 3. Wholesale & Quantity Sold
  actualQuantitySold: number;

  // 4. Selling & Operating Expenses
  platformCommissionPercent: number; // % of revenue
  paymentGatewayPercent: number; // % of revenue
  paymentGatewayFixed: number; // flat ₹ per order/transaction
  deliveryChargeType: ExpenseType;
  deliveryChargeValue: number;
  marketingCostType: ExpenseType;
  marketingCostValue: number;
  labourCostType: ExpenseType;
  labourCostValue: number;
  storageCostType: ExpenseType;
  storageCostValue: number;
  returnLossType: ReturnExpenseType;
  returnLossValue: number;
  otherSellingExpenseType: ExpenseType;
  otherSellingExpenseValue: number;

  // 5. Target Profit Parameters
  targetProfitType: 'amount' | 'margin';
  targetProfitValue: number; // ₹ amount or % margin
}

export interface CalculationResults {
  // Landed Cost & Inventory
  netPurchasePricePerUnit: number;
  purchaseGSTTotal: number;
  purchaseGSTRate: number;
  purchaseGSTAddedToCost: number;
  totalPurchaseCost: number;
  totalPurchaseFixedExpenses: number;
  totalPackagingCost: number;
  totalLandedPurchaseInvestment: number;
  fullyAllocatedCostPerUnit: number;

  // Order Volume & Stock
  quantityPurchased: number;
  quantitySold: number;
  unsoldQuantity: number;
  unsoldStockValue: number;

  // Sales Revenue
  customerDiscountPerUnit: number;
  wholesaleDiscountPerUnit: number;
  totalDiscountPerUnit: number;
  effectiveSellingPricePerUnit: number;
  totalSalesRevenueBeforeDiscount: number;
  totalCustomerDiscount: number;
  totalExtraChargesCollected: number;
  netSalesRevenue: number;

  // Cost of Goods Sold (COGS)
  costOfGoodsSold: number; // actualQuantitySold * fullyAllocatedCostPerUnit

  // Selling & Operating Expenses Breakdown
  platformCommissionTotal: number;
  paymentGatewayTotal: number;
  deliveryCostTotal: number;
  marketingCostTotal: number;
  labourCostTotal: number;
  storageCostTotal: number;
  returnLossTotal: number;
  otherSellingExpensesTotal: number;
  totalSellingExpenses: number;

  // Total Expenses & Net Profit
  totalOrderExpenses: number; // Selling expenses for this batch
  totalCost: number; // COGS + totalSellingExpenses
  netProfit: number;
  isProfit: boolean;
  profitPerUnit: number;
  profitMarginPercent: number;
  roiPercent: number; // (Net Profit / Total Cost) * 100
  roiOnCOGSPercent: number; // (Net Profit / COGS) * 100

  // Pricing Benchmarks
  breakEvenSellingPricePerUnit: number; // Base selling price to reach 0 profit
  breakEvenEffectivePricePerUnit: number; // Effective price after discounts
  recommendedTargetSellingPrice: number; // Base selling price for target profit
  recommendedTargetEffectivePrice: number;
  targetProfitAmountEstimated: number;

  // Expense distribution percentages (for visual ledger)
  distribution: {
    cogsPercent: number;
    platformFeesPercent: number;
    logisticsPercent: number;
    operationalPercent: number;
    profitPercent: number;
  };
}

export interface SavedCalculation {
  id: string;
  name: string;
  savedAt: string;
  inputs: ProductInputs;
  summary: {
    quantitySold: number;
    sellingPrice: number;
    netSalesRevenue: number;
    netProfit: number;
    profitMarginPercent: number;
    roiPercent: number;
    breakEvenPrice: number;
  };
}
