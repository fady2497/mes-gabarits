export async function createOrderShein(_payload: unknown, _cfg: { api_base?: string; api_key?: string }) {
  return { supplier_order_id: `shein-${Date.now()}` };
}
export async function fetchProductsShein(
  _query: string,
  _cfg: { api_base?: string; api_key?: string }
) {
  return [];
}
