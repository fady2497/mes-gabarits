export async function createOrderAliexpress(
  payload: any,
  cfg: { api_base?: string; api_key?: string }
) {
  return { supplier_order_id: `aliexpress-${Date.now()}` };
}
export async function fetchProductsAliexpress(
  query: string,
  cfg: { api_base?: string; api_key?: string }
) {
  return [];
}
