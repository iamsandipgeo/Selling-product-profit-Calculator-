import { ProductInputs } from '../types/calculator';

/**
 * Default initial state
 */
export const DEFAULT_INPUTS: ProductInputs = {
  productName: 'Cotton Printed T-Shirt',
  purchasePricePerUnit: 150,
  totalQuantityPurchased: 100,
  purchaseDiscountType: 'percentage',
  purchaseDiscountValue: 0,
  supplierShippingCost: 500,
  loadingUnloadingCost: 150,
  packagingCostPerUnit: 12,
  transportationCost: 350,
  otherPurchaseExpenses: 200,
  applyPurchaseGST: true,
  purchaseGSTRate: 5,
  gstInputCreditEligible: false, // directly adds to landed cost if unregistered/composite

  sellingPricePerUnit: 399,
  customerDiscountType: 'percentage',
  customerDiscountValue: 10,
  wholesaleDiscountType: 'none',
  wholesaleDiscountValue: 0,
  extraChargesPerUnit: 0,
  extraChargesFixed: 0,

  actualQuantitySold: 60,

  platformCommissionPercent: 12, // e.g. Flipkart / Amazon apparel fee
  paymentGatewayPercent: 2, // e.g. Razorpay
  paymentGatewayFixed: 3,
  deliveryChargeType: 'per_unit',
  deliveryChargeValue: 45,
  marketingCostType: 'per_unit',
  marketingCostValue: 35,
  labourCostType: 'fixed',
  labourCostValue: 500,
  storageCostType: 'fixed',
  storageCostValue: 300,
  returnLossType: 'percentage_revenue',
  returnLossValue: 3, // 3% return loss allowance
  otherSellingExpenseType: 'fixed',
  otherSellingExpenseValue: 200,

  targetProfitType: 'margin',
  targetProfitValue: 25, // 25% target profit margin
};

/**
 * Exact Example from Prompt (Section 8):
 * - Product Purchase Price: ₹100 per unit
 * - Quantity Purchased: 100
 * - Supplier Shipping Cost: ₹200
 * - Packaging Cost: ₹5 per unit
 * - Selling Price: ₹180 per unit
 * - Quantity Sold: 50
 * - Customer Discount: 10%
 * - Platform Commission: 5%
 * - Delivery Cost: ₹10 per unit
 * - Other Expenses: ₹100
 */
export const PROMPT_EXAMPLE_INPUTS: ProductInputs = {
  productName: 'Sample Product (Prompt Example)',
  purchasePricePerUnit: 100,
  totalQuantityPurchased: 100,
  purchaseDiscountType: 'percentage',
  purchaseDiscountValue: 0,
  supplierShippingCost: 200,
  loadingUnloadingCost: 0,
  packagingCostPerUnit: 5,
  transportationCost: 0,
  otherPurchaseExpenses: 0,
  applyPurchaseGST: false,
  purchaseGSTRate: 0,
  gstInputCreditEligible: false,

  sellingPricePerUnit: 180,
  customerDiscountType: 'percentage',
  customerDiscountValue: 10,
  wholesaleDiscountType: 'none',
  wholesaleDiscountValue: 0,
  extraChargesPerUnit: 0,
  extraChargesFixed: 0,

  actualQuantitySold: 50,

  platformCommissionPercent: 5,
  paymentGatewayPercent: 0,
  paymentGatewayFixed: 0,
  deliveryChargeType: 'per_unit',
  deliveryChargeValue: 10,
  marketingCostType: 'fixed',
  marketingCostValue: 0,
  labourCostType: 'fixed',
  labourCostValue: 0,
  storageCostType: 'fixed',
  storageCostValue: 0,
  returnLossType: 'fixed',
  returnLossValue: 0,
  otherSellingExpenseType: 'fixed',
  otherSellingExpenseValue: 100,

  targetProfitType: 'margin',
  targetProfitValue: 20,
};

/**
 * Empty/Blank state for "Clear All"
 */
export const BLANK_INPUTS: ProductInputs = {
  productName: '',
  purchasePricePerUnit: 0,
  totalQuantityPurchased: 1,
  purchaseDiscountType: 'percentage',
  purchaseDiscountValue: 0,
  supplierShippingCost: 0,
  loadingUnloadingCost: 0,
  packagingCostPerUnit: 0,
  transportationCost: 0,
  otherPurchaseExpenses: 0,
  applyPurchaseGST: false,
  purchaseGSTRate: 18,
  gstInputCreditEligible: false,

  sellingPricePerUnit: 0,
  customerDiscountType: 'percentage',
  customerDiscountValue: 0,
  wholesaleDiscountType: 'none',
  wholesaleDiscountValue: 0,
  extraChargesPerUnit: 0,
  extraChargesFixed: 0,

  actualQuantitySold: 1,

  platformCommissionPercent: 0,
  paymentGatewayPercent: 0,
  paymentGatewayFixed: 0,
  deliveryChargeType: 'per_unit',
  deliveryChargeValue: 0,
  marketingCostType: 'per_unit',
  marketingCostValue: 0,
  labourCostType: 'fixed',
  labourCostValue: 0,
  storageCostType: 'fixed',
  storageCostValue: 0,
  returnLossType: 'percentage_revenue',
  returnLossValue: 0,
  otherSellingExpenseType: 'fixed',
  otherSellingExpenseValue: 0,

  targetProfitType: 'margin',
  targetProfitValue: 20,
};
