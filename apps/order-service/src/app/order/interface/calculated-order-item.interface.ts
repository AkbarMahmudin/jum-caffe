export interface CalculatedOrderItem {
  productId: string;
  productName: string;

  quantity: number;

  basePrice: number;

  customizationTotalPrice: number;

  singleItemPrice: number;

  subTotal: number;

  customizations: {
    optionId: string;
    optionName: string;
    optionValueId: string;
    optionValueName: string;
    additionalPrice: number;
  }[];
}
