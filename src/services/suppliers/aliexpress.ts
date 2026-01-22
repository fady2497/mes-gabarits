export async function createOrderAliexpress(
  _payload: unknown,
  _cfg: { api_base?: string; api_key?: string }
) {
  return { supplier_order_id: `aliexpress-${Date.now()}` };
}
export async function fetchProductsAliexpress(
  _query: string,
  _cfg: { api_base?: string; api_key?: string }
) {
  return [];
}
