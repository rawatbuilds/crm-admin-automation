export const CreateProductTestData = {
  baseProduct: {
    description: 'Test product description',
    price: '600',
    comparePrice: '500',
    cost: '400',
    weight: '0.50',
  }
};

export function generateUniqueCreateProductData() {
  const timestamp = Date.now();

  return {
    name: `Test_Product_${timestamp}`,
    sku: `SKU_${timestamp}`,
    barcode: `BAR_${timestamp}`,
  };
}